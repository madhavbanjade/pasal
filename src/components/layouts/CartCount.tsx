"use client";

import { useCartStore } from "@/src/store/cartStore";

export default function CartCount() {
  const count = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  if (!count) return null;

  return <span className="cart-count">{count}</span>;
}
