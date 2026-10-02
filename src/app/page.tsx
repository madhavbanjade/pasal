import Categories from "../components/layouts/Categories";
import Hero from "../components/layouts/Hero";
import ProductCard from "../components/layouts/ProductCard";
import ProductFilters from "../components/products/ProductFilters";
import { fetchAPI } from "../services/api.service";
import { Product } from "../types";
import { Suspense } from "react";
import Link from "next/link";
import { CATEGORY_LABELS } from "../lib/categories";

const HOME_PRODUCTS_LIMIT = 8;



const PICKS = [16, 14, 2, 7];
async function fetchProducts(): Promise<Product[]>{
  const res = await fetchAPI({ endPoint: "products"});
  const data =  res?.data ?? [];
 console.log(data);
 return data;


}

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const search = await searchParams;
  const category = Array.isArray(search.category) ? search.category[0] : search.category;
  const q = Array.isArray(search.q) ? search.q[0] : search.q;
  const sort = Array.isArray(search.sort) ? search.sort[0] : search.sort;

  const all = await fetchProducts();
   const product = PICKS.map((id) => all.find((p) => p.id === id)).filter(
    (p): p is Product => Boolean(p)
  );

  const categoryRes = category ? await fetchAPI({ endPoint: `products/category/${category}` }) : null;
  let displayProducts: any[] = category ? (categoryRes?.data ?? []) : all;

  if (q) {
    displayProducts = displayProducts.filter((p: any) => p.title.toLowerCase().includes(q.toLowerCase()));
  }

  if (sort === "price-asc") displayProducts = [...displayProducts].sort((a: any, b: any) => a.price - b.price);
  else if (sort === "price-desc") displayProducts = [...displayProducts].sort((a: any, b: any) => b.price - a.price);
  else if (sort === "rating") displayProducts = [...displayProducts].sort((a: any, b: any) => b.rating.rate - a.rating.rate);

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

   <div className="product-grid">
   {visibleProducts.map((product: any) => (
        <ProductCard key={product.id} product={product}  />
      ))}
   </div>

   <div className="flex justify-end mt-2 mb-4">
     <Link href="/products" className="btn--secondary">View all products</Link>
   </div>

  </div>
)
}
