// components/WishlistButton.tsx
'use client';

import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/src/store/useWishListStore';
import Link from 'next/link';

export function WishlistButton() {
  const wishlist = useWishlistStore((state) => state.wishlist);

  return (
    <Link
      href="/wishlist"
      className="relative flex items-center justify-center rounded-full p-2 hover:bg-gray-100"
      aria-label="Wishlist"
    >
      <Heart className="h-5 w-5 text-gray-700" />

      {wishlist.length > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-medium text-white">
          {wishlist.length}
        </span>
      )}
    </Link>
  );
}

// Add this to your navigation/header component:
// <WishlistButton />
