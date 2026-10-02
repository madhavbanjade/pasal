import Hero from "../components/layouts/Hero";
import ProductCard from "../components/layouts/ProductCard";
import ProductFilters from "../components/products/ProductFilters";
import { fetchAPI } from "../services/api.service";
import { ProductCardUi } from "../types";
import { Suspense } from "react";
import Link from "next/link";
import { CATEGORY_LABELS } from "../lib/categories";
import { filterAndSortProducts } from "../lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop clothing, jewellery and electronics | Mero Pasal",
  description: "Everyday clothes for men and women, a little jewellery, and the drives and monitors that keep your desk running.",
};

const HOME_PRODUCTS_LIMIT = 8;



async function fetchProducts(): Promise<{ products: ProductCardUi[]; error: string | null }> {
  const res = await fetchAPI<ProductCardUi[]>({ endPoint: "products" });
  if (!res.success) return { products: [], error: res.error };
  return { products: res.data, error: null };
}

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const search = await searchParams;
  const category = Array.isArray(search.category) ? search.category[0] : search.category;
  const q = Array.isArray(search.q) ? search.q[0] : search.q;
  const sort = Array.isArray(search.sort) ? search.sort[0] : search.sort;

  const [{ products: all, error: productsError }, categoryRes] = await Promise.all([
    fetchProducts(),
    category ? fetchAPI<ProductCardUi[]>({ endPoint: `products/category/${category}` }) : Promise.resolve(null),
  ]);

  const categoryError = categoryRes && !categoryRes.success ? categoryRes.error : null;
  const error = productsError ?? categoryError;

  const product = all.slice(0, 4);

  const categoryProducts: ProductCardUi[] = category ? (categoryRes?.success ? categoryRes.data : []) : all;
  const displayProducts = filterAndSortProducts(categoryProducts, { q, sort });

  const visibleProducts = displayProducts.slice(0, HOME_PRODUCTS_LIMIT);

return(
  <div className="container">
   <Hero products={product} />
   {/* <Categories /> */}

   <hr className="my-10 border-t border-[#DCDCD7]" />

   <Suspense>
     <ProductFilters
       title={category ? CATEGORY_LABELS[category] ?? category : "Everything"}
       count={displayProducts.length}
     />
   </Suspense>

   {error && <p className="field__error mb-4">{error}</p>}

   <div className="product-grid">
   {visibleProducts.map((product) => (
        <ProductCard key={product.id} product={product}  />
      ))}
   </div>

   <div className="flex justify-center mt-8 mb-4">
     <Link href="/products" className="border border-gray-200 hover:border hover:border-black p-2 rounded-lg">View all products</Link>
   </div>

  </div>
)
}
