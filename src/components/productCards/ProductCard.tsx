'use client';

import { Heart, Eye } from 'lucide-react';
import { Product } from '@/src/types/product';
import { useCartStore } from '@/src/store/useCartStore';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const [favorites, setFavorites] = useState(new Set<number>());

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('mn-MN').format(price) + '₮';

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFav = new Set(prev);
      if (newFav.has(id)) {
        newFav.delete(id);
      } else {
        newFav.add(id);
      }
      return newFav;
    });
  };

  return (
    <div className="group relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg">
      <div className="relative aspect-square w-full overflow-hidden">
        <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
          {product.images[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              className="h-full w-full object-cover transition group-hover:scale-105"
              width={500}
              height={500}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </Link>
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/0 opacity-0 transition-colors duration-300 group-hover:bg-black/20 group-hover:opacity-100">
          <button
            onClick={() => toggleFavorite(product.id)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow hover:scale-110"
          >
            <Heart
              className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-rose-500 text-rose-500' : 'text-neutral-700'}`}
            />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow hover:scale-110">
            <Eye className="h-4 w-4 text-neutral-700" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-md font-medium">{product.name}</h3>
        <p className="mb-3 text-xl">{formatPrice(product.price)}</p>

        <button
          onClick={() =>
            addToCart({
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0]?.url,
            })
          }
          className="w-full rounded-full bg-neutral-900 py-3 text-white hover:bg-amber-700"
        >
          Сагслах
        </button>
      </div>
    </div>
  );
}
