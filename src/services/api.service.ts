import { APIResponse } from "../types";

const API_BASE =
 "https://fakestoreapi.com";
const PRODUCT_LOAD_ERROR = "We couldn’t load the products right now. Please try again in a moment.";

// fakestoreapi.com is a shared demo API that rate-limits/blocks by IP. Hosting
// platforms share outbound IPs across many projects hitting the same API, so
// GET requests get retried with backoff on 403/429/5xx before giving up, and
// cached much longer than the data actually changes to cut request volume.
const RETRYABLE_STATUS = new Set([403, 408, 425, 429, 500, 502, 503, 504]);
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 400;
const DEFAULT_REVALIDATE_SECONDS = 60 * 60; // 1 hour; this catalog never changes

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

//Defines the options you can pass to the fetchAPI.
interface FetchAPIOptions<T = unknown> {
  endPoint: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  data?: T | FormData;
  id?: string | number;
  slug?: string;
  revalidateSeconds?: number;
  setError?: (msg: string) => void;
  headers?: Record<string, string>;
}

//heplers -> it checks if the data contains any files or not.
const hasFiles = (data: any): boolean => {
  if (data instanceof File) return true;
  if (Array.isArray(data)) return data.some((item) => hasFiles(item));
  if (data && typeof data === "object")
    return Object.values(data).some((value) => hasFiles(value));
  return false;
};

//coverts json obj into formdata
const toFormData = (
  data: any,
  formData = new FormData(),
  key = "",
): FormData => {
  Object.entries(data).forEach(([k, v]) => {
    const formKey = key ? `${key}[${k}]` : k;
    if (v instanceof File) {
      formData.append(formKey, v);
    } else if (Array.isArray(v)) {
      const hasFile = v.some((i) => i instanceof File);
      if (hasFile) {
        v.forEach((item, index) => {
          if (item instanceof File) {
            formData.append(formKey, item);
          }
        });
      } else {
        const cleaned = v.filter((i) => i !== null && i !== undefined);
        if (cleaned.length > 0) {
          formData.append(formKey, JSON.stringify(cleaned));
        }
      }
    } else if (v && typeof v === "object") {
      const nestedFiles: Record<string, File[]> = {};
      const extractNestedFiles = (obj: any, path: string[] = []): any => {
        if (obj instanceof File) {
          const fullPath = [...path].join(".");
          if (!nestedFiles[fullPath]) nestedFiles[fullPath] = [];
          nestedFiles[fullPath].push(obj);
          return undefined;
        }
        if (Array.isArray(obj)) {
          return obj
            .map((item, idx) =>
              extractNestedFiles(item, [...path, String(idx)]),
            )
            .filter((i) => i !== undefined);
        }
        if (typeof obj === "object" && obj !== null) {
          const cleaned: any = {};
          Object.entries(obj).forEach(([key, val]) => {
            const result = extractNestedFiles(val, [...path, key]);
            if (result !== undefined) cleaned[key] = result;
          });
          return Object.keys(cleaned).length > 0 ? cleaned : undefined;
        }
        return obj;
      };

      const cleanedObj = extractNestedFiles(v, [k]);

      Object.entries(nestedFiles).forEach(([fullPath, files]) => {
        files.forEach((file) => formData.append(fullPath, file));
      });
      if (cleanedObj && Object.keys(cleanedObj).length > 0) {
        formData.append(formKey, JSON.stringify(cleanedObj));
      } else if (v !== null && v !== undefined) {
        formData.append(formKey, String(v));
      }
    }
  });
  return formData;
};


export const fetchAPI = async <TResponse = any, TData = unknown>({
  endPoint = "", method = "GET", data, id, slug, setError, headers: customHeaders = {}, revalidateSeconds,
}: FetchAPIOptions<TData>): Promise<APIResponse<TResponse>> => {
    //Combines API_BASE + endpoint + id/slug to form the request URL.
  const urlParts = [API_BASE, endPoint];
  if (slug) urlParts.push(slug);
  else if (id) urlParts.push(String(id));
  const url = urlParts.join("/");

  //Checks if data contains files. If yes, it converts to FormData.
//If no files, sets Content-Type to application/json.
  const headers: Record<string, string> = { ...customHeaders };

  let finalData: any = data;

  if (data && !(data instanceof FormData)) {
    if (hasFiles(data)) {
      finalData = toFormData(data);
    } else {
      headers["Content-Type"] = "application/json";
    }
  }

  // GETs are cached and revalidated in the background so pages don't block
  // on fakestoreapi for every single request. Writes always go through fresh.
  const cacheOptions =
    method === "GET"
      ? { next: { revalidate: revalidateSeconds ?? DEFAULT_REVALIDATE_SECONDS } }
      : { cache: "no-store" as const };

  const body =
    method !== "GET" && finalData
      ? finalData instanceof FormData
        ? finalData
        : JSON.stringify(finalData)
      : undefined;

  //send fetch request, retrying with backoff on rate-limit/transient upstream errors
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        method,
        headers: { Accept: "application/json", ...headers },
        body,
        ...cacheOptions,
      });

      if (!response.ok) {
        if (RETRYABLE_STATUS.has(response.status) && attempt < MAX_RETRIES) {
          await sleep(RETRY_BASE_DELAY_MS * 2 ** attempt);
          continue;
        }
        if (setError) setError(PRODUCT_LOAD_ERROR);
        return { success: false, error: PRODUCT_LOAD_ERROR, data: null };
      }

      const text = await response.text();
      let json: TResponse | null = null;

      if (text.trim()) {
        try {
          json = JSON.parse(text) as TResponse;
        } catch {
          // Some upstreams return an HTML challenge page with HTTP 200. Never
          // surface that page (or its markup) as an error in the storefront.
          if (setError) setError(PRODUCT_LOAD_ERROR);
          return { success: false, error: PRODUCT_LOAD_ERROR, data: null };
        }
      }

      // Treat an empty successful response as null, as some endpoints return an
      // empty body for a missing item.
      return { success: true, data: json as TResponse, error: null };
      //Catch Network Errors
    } catch {
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_BASE_DELAY_MS * 2 ** attempt);
        continue;
      }
      if (setError) setError(PRODUCT_LOAD_ERROR);
      return { success: false, error: PRODUCT_LOAD_ERROR, data: null };
    }
  }

  // Unreachable, but keeps TypeScript happy about always returning.
  if (setError) setError(PRODUCT_LOAD_ERROR);
  return { success: false, error: PRODUCT_LOAD_ERROR, data: null };
};

export type {APIResponse}

 
