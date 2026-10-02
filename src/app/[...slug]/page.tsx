import ProductCard from "@/src/components/layouts/ProductCard";
import ProductFilters from "@/src/components/products/ProductFilters";
import Pagination from "@/src/components/products/Pagination";
import { fetchAPI } from "@/src/services/api.service";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { CATEGORY_LABELS } from "@/src/lib/categories";
import { filterAndSortProducts } from "@/src/lib/products";
import type { ProductCardUi } from "@/src/types";
import type { Metadata } from "next";

const PAGE_SIZE = 8;

const pageMap: Record<string, { endpoint: string; title: string }> = {
  products: { endpoint: "products", title: "Everything" },
};

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const search = await searchParams;
  const category = Array.isArray(search.category) ? search.category[0] : search.category;
  const title = category ? CATEGORY_LABELS[category] ?? category : "All products";

  return {
    title,
    description: `Browse ${title.toLowerCase()} at Mero Pasal.`,
  };
}

export default async function SlugPage({ params, searchParams }: PageProps) {
  const [resolvedParams, search] = await Promise.all([params, searchParams]);
  const slug = resolvedParams.slug ?? [];
  const pageKey = slug.join("/");
  const page = pageMap[pageKey];

   if (!page) notFound();

   const rawPage = Array.isArray(search.page) ? search.page[0] : search.page;
  const currentPage = Math.max(1, Number(rawPage) || 1);

  const category = Array.isArray(search.category) ? search.category[0] : search.category;
  const q = Array.isArray(search.q) ? search.q[0] : search.q;
  const sort = Array.isArray(search.sort) ? search.sort[0] : search.sort;

  const [basePath] = page.endpoint.split("?");
  const endpointBase = category ? `products/category/${category}` : basePath;

  const res = await fetchAPI<ProductCardUi[]>({ endPoint: endpointBase });
  const error = res.success ? null : res.error;
  const products = filterAndSortProducts(res.success ? res.data : [], { q, sort });

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const page_ = Math.min(currentPage, totalPages);
  const pagedProducts = products.slice((page_ - 1) * PAGE_SIZE, page_ * PAGE_SIZE);

  return (
    <div className="space-y-4 container" id="products">

      <Suspense>
        <ProductFilters
          title={category ? CATEGORY_LABELS[category] ?? category : page.title}
          count={products.length}
        />
      </Suspense>

      {error && <p className="field__error">{error}</p>}

      <ViewTransition key={`${category ?? ""}-${q ?? ""}-${sort ?? ""}-${page_}`} name="product-grid" share="auto" enter="auto" default="none">
        <div className="product-grid">
          {pagedProducts.length > 0 ? (
            <>
              {pagedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </>
          ) : (
            <p className="text-center text-gray-500">No products found</p>
          )}
        </div>
      </ViewTransition>

      <Pagination
        basePath={`/${pageKey}`}
        currentPage={page_}
        totalPages={totalPages}
        searchParams={{ category, q, sort }}
      />

    </div>
  );
}
