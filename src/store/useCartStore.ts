import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
  productId: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (productId) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === productId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { productId, quantity: 1 }] });
        }
      },
      removeFromCart: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      updateQuantity: (productId, qty) => {
        if (qty < 1) {
          get().removeFromCart(productId);
        } else {
          set({
            items: get().items.map((i) =>
              i.productId === productId ? { ...i, quantity: qty } : i
            ),
          });
        }
      },
    }),
    { name: 'cartItemsLocal' }
  )
);
