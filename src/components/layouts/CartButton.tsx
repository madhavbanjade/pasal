"use client";

import { useCartStore } from "@/src/store/cartStore";
import CartCount from "./CartCount";

export default function CartButton() {
  const openCart = useCartStore((state) => state.openCart);

  return (
    <button type="button" className="btn cart-btn" onClick={openCart} aria-label="Open cart">
      Bag
      <CartCount />
    </button>
  );
}
