import { APIResponse } from "../types";

const API_BASE =
 "https://fakestoreapi.com";

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
      ? { next: { revalidate: revalidateSeconds ?? 60 } }
      : { cache: "no-store" as const };

  //send fetch request with following fileds
  try {
    const response = await fetch(url, {
      method,
      headers: { Accept: "application/json", ...headers },
      credentials: "include", //(sends cookies)
      body: //(JSON or FormData)
        method !== "GET" && finalData
          ? finalData instanceof FormData
            ? finalData
            : JSON.stringify(finalData)
          : undefined,
      ...cacheOptions,
    });


    const text = await response.text();
    let json: TResponse | null = null;

    if (text.trim()) {
      try {
        json = JSON.parse(text) as TResponse;
      } catch {
        // Some upstreams return an HTML challenge page with HTTP 200. Never
        // surface that page (or its markup) as an error in the storefront.
        const errorMessage = response.ok
          ? "The product service returned an invalid response. Please try again later."
          : `The product service is unavailable (HTTP ${response.status}). Please try again later.`;
        if (setError) setError(errorMessage);
        return { success: false, error: errorMessage, data: null };
      }
    }

    if (!response.ok) {
      const apiError =
        json && typeof json === "object"
          ? (json as { message?: unknown; error?: unknown }).message ??
            (json as { error?: unknown }).error
          : undefined;
      const errorMessage =
        typeof apiError === "string" && apiError.trim()
          ? apiError
          : `The product service is unavailable (HTTP ${response.status}). Please try again later.`;
      if (setError) setError(errorMessage);
      return { success: false, error: errorMessage, data: null };
    }

    // Treat an empty successful response as null, as some endpoints return an
    // empty body for a missing item.
    return { success: true, data: json as TResponse, error: null };
    //Catch Network Errors
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to connect to the server.";
    if (setError) setError(errorMessage);
    return { success: false, error: errorMessage, data: null };
  }
};

export type {APIResponse}

 
