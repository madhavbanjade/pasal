import ProductCard from "@/src/components/layouts/ProductCard";
import ProductFilters from "@/src/components/products/ProductFilters";
import { fetchAPI } from "@/src/services/api.service";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CATEGORY_LABELS } from "@/src/lib/categories";

const pageMap: Record<
  string,
  {
    endpoint: string;
    title: string;
    Component: React.ComponentType<any> | null;
  }
> = {
  products: { endpoint: "products", title: "Everything", Component: null },
};

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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

  const [basePath, baseQuery] = page.endpoint.split("?");
  const endpointBase = category ? `products/category/${category}` : basePath;

  const queryParams = new URLSearchParams(baseQuery ?? "");

  queryParams.set("limit", "");
  queryParams.set("page", String(currentPage));

  const endpoint = queryParams.toString()
    ? `${endpointBase}?${queryParams.toString()}`
    : endpointBase;

  const res = await fetchAPI({ endPoint: endpoint });
  let products = res?.data ?? [];

  if (q) {
    products = products.filter((p: any) => p.title.toLowerCase().includes(q.toLowerCase()));
  }

  if (sort === "price-asc") products = [...products].sort((a: any, b: any) => a.price - b.price);
  else if (sort === "price-desc") products = [...products].sort((a: any, b: any) => b.price - a.price);
  else if (sort === "rating") products = [...products].sort((a: any, b: any) => b.rating.rate - a.rating.rate);

  return (
    <div className="space-y-4 container" id="products">

      <Suspense>
        <ProductFilters
          title={category ? CATEGORY_LABELS[category] ?? category : page.title}
          count={products.length}
        />
      </Suspense>

 <div className="product-grid">
     {products.length > 0 ? (
            <>
{products.map((product: any) => (
    <ProductCard key={product.id} product={product} />
))}
            </>
        ):(
<p className="text-center text-gray-500">No products found</p>
        )
      }
 </div>

    </div>
  );
}
