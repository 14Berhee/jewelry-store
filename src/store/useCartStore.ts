import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartProductItem } from '@/src/types/cart';

type CartState = {
  cartItemsLocal: CartProductItem[];
  addToCart: (item: Omit<CartProductItem, 'quantity'>) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItemsLocal: [],

      addToCart: (item) => {
        const items = get().cartItemsLocal;
        const existing = items.find((i) => i.productId === item.productId);

        if (existing) {
          set({
            cartItemsLocal: items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({
            cartItemsLocal: [...items, { ...item, quantity: 1 } as CartProductItem],
          });
        }
      },

      removeFromCart: (productId) =>
        set({
          cartItemsLocal: get().cartItemsLocal.filter(
            (i) => i.productId !== productId
          ),
        }),

      updateQuantity: (productId, qty) => {
        if (qty < 1) {
          get().removeFromCart(productId);
        } else {
          set({
            cartItemsLocal: get().cartItemsLocal.map((i) =>
              i.productId === productId ? { ...i, quantity: qty } : i
            ),
          });
        }
      },

      clearCart: () => set({ cartItemsLocal: [] }),
    }),
    { name: 'cartItemsLocal' }
  )
);
