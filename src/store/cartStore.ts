import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  toastMessage: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
}

let toastTimer: ReturnType<typeof setTimeout>;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      toastMessage: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }

        clearTimeout(toastTimer);
        set({ toastMessage: `${item.title} added to your bag` });
        toastTimer = setTimeout(() => set({ toastMessage: null }), 2500);
      },

      removeItem: (id) => {
        const item = get().items.find((i) => i.id === id);
        set({ items: get().items.filter((i) => i.id !== id) });

        if (item) {
          clearTimeout(toastTimer);
          set({ toastMessage: `${item.title} removed from your bag` });
          toastTimer = setTimeout(() => set({ toastMessage: null }), 2500);
        }
      },
    }),
    { name: "pasal-cart", partialize: (state) => ({ items: state.items }) },
  ),
);
