// src/store/useWishlistStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/src/types/product';

interface WishlistStore {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],

      addToWishlist: (product) => {
        const { wishlist } = get();

        if (wishlist.some((item) => item.id === product.id)) {
          return;
        }

        set({ wishlist: [...wishlist, product] });
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== productId),
        }));
      },

      clearWishlist: () => {
        set({ wishlist: [] });
      },

      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.id === productId);
      },
    }),
    {
      name: 'jewelry-wishlist-storage',
    }
  )
);
