"use client";

import { useCartStore } from "@/src/store/cartStore";
import type { ProductCardUi } from "@/src/types";

type Props = {
  product: ProductCardUi;
  className?: string;
  label?: string;
};

export default function AddToCartButton({ product, className = "", label = "Add" }: Props) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <button
      type="button"
      className={`btn ${className}`}
      onClick={(e) => {
        e.preventDefault(); // in case the button ends up inside a link
        e.stopPropagation();
        addItem({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
        });
      }}
      aria-live="polite"
    >
      {label}
    </button>
  );
}
