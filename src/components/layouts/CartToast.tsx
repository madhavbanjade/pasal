"use client";

import { useCartStore } from "@/src/store/cartStore";

export default function CartToast() {
  const toastMessage = useCartStore((state) => state.toastMessage);

  if (!toastMessage) return null;

  return (
    <div className="toast" role="status">
      {toastMessage}
    </div>
  );
}
