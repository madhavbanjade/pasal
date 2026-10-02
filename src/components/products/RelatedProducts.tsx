import ProductCard from "@/src/components/layouts/ProductCard";
import { ProductCardUi } from "@/src/types";

export default function RelatedProducts({ products, category }: { products: ProductCardUi[]; category?: string }) {
  if (!products.length) return null;
  return (
    <section className="mt-16 border-t border-[#DCDCD7] pt-10 lg:mt-24" aria-labelledby="related-title">
      <h2 id="related-title" className="mb-6 text-2xl font-semibold tracking-[-0.02em]">
        More {category ? <span className="capitalize">{category}</span> : "you might like"}
      </h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}