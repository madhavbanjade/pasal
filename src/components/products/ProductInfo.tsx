import type { ProductCardUi } from "@/src/types";
import Rating from "@/src/components/ui/Rating";
import Price from "@/src/components/ui/Price";
import QuantityAdd from "@/src/components/layouts/QuantityAdd";
import AddToCartButton from "@/src/components/layouts/AddToCartButton";

export default function ProductInfo({ product }: { product: ProductCardUi }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {product.category && <span className="text-sm capitalize text-[#676764]">{product.category}</span>}
        <h1 className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em] sm:text-4xl">{product.title}</h1>
        {product.rating && <Rating rate={product.rating.rate} count={product.rating.count} suffix=" reviews" className="text-sm" />}
      </div>

      <Price price={product.price} compareAtPrice={product.price} size="lg" />

      {product.description && (
        <p className="line-clamp-4 max-w-[56ch] leading-relaxed text-[#676764]">{product.description}</p>
      )}

      <div className="flex items-stretch gap-3">
        <QuantityAdd />
        <AddToCartButton className="flex-1" label="Add to bag" product={product} />
      </div>

      <ul className="grid gap-2 text-sm text-[#676764] sm:grid-cols-3 sm:gap-3">
        <li className="rounded bg-tile px-3 py-2.5"><b className="block font-medium text-[#232323]">Free delivery</b>On orders over $50</li>
        <li className="rounded bg-tile px-3 py-2.5"><b className="block font-medium text-[#232323]">30-day returns</b>Unworn, we collect</li>
        <li className="rounded bg-tile px-3 py-2.5"><b className="block font-medium text-[#232323]">Pay your way</b>Card, PayPal or cash</li>
      </ul>

    
    </div>
  );
}