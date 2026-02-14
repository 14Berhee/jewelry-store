import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartProductItem } from '@/src/types/cart';

type CartState = {
  cartItemsLocal: CartProductItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartProductItem, 'quantity'>, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItemsLocal: [],
      isCartOpen: false,

      setIsCartOpen: (open: boolean) => set({ isCartOpen: open }),

      addToCart: (item, qty = 1) => {
        const items = get().cartItemsLocal;
        const existing = items.find((i) => i.productId === item.productId);

        if (existing) {
          set({
            cartItemsLocal: items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + qty }
                : i
            ),
          });
        } else {
          set({
            cartItemsLocal: [
              ...items,
              { ...item, quantity: qty } as CartProductItem,
            ],
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
