import type { ProductCardUi } from "@/src/types";

export function filterAndSortProducts(
  products: ProductCardUi[],
  { q, sort }: { q?: string; sort?: string },
): ProductCardUi[] {
  let result = products;

  if (q) {
    result = result.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));
  }

  if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
  else if (sort === "rating") result = [...result].sort((a, b) => b.rating.rate - a.rating.rate);

  return result;
}
