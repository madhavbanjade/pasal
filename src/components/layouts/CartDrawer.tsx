"use client";

import Image from "next/image";
import { useCartStore } from "@/src/store/cartStore";

export default function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const removeItem = useCartStore((state) => state.removeItem);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "cart-overlay--open" : ""}`}
        onClick={closeCart}
      />

      <aside className={`cart-drawer ${isOpen ? "cart-drawer--open" : ""}`}>
        <div className="cart-drawer__header">
          <h5>Your bag</h5>
          <button
            type="button"
            className="cart-drawer__close"
            onClick={closeCart}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <p className="cart-drawer__empty">Your bag is empty.</p>
        ) : (
          <div className="cart-drawer__items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item__image">
                  <Image src={item.image} alt={item.title} width={64} height={64} />
                </div>

                <div className="cart-item__info">
                  <p className="cart-item__title">{item.title}</p>
                  <span className="cart-item__qty">Qty {item.quantity}</span>
                </div>

                <div className="cart-item__side">
                  <span className="cart-item__price">${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    type="button"
                    className="cart-item__remove"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        )}
      </aside>
    </>
  );
}
