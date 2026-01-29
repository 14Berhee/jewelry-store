'use client';

import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/src/types/product';
import { useCartStore } from '@/src/store/useCartStore';
import { useWishlistStore } from '@/src/store/useWishListStore';
import Image from 'next/image';
import Link from 'next/link';

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('mn-MN').format(price) + '₮';

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url,
    });
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group relative overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:shadow-2xl">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          {product.images[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm text-gray-400">Зураг байхгүй</span>
            </div>
          )}

          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
            aria-label={
              isWishlisted
                ? 'Хүслийн жагсаалтаас хасах'
                : 'Хүслийн жагсаалтад нэмэх'
            }
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-600'
              }`}
            />
          </button>
        </div>

        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 text-base font-medium text-gray-900 transition-colors group-hover:text-gray-600">
            {product.name}
          </h3>

          <div className="flex items-baseline justify-between">
            <p className="text-lg font-semibold text-gray-900">
              {formatPrice(product.price)}
            </p>

            {typeof product.originalPrice === 'number' &&
              product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
          </div>
          <div className="py-4">
            {' '}
            <button
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              <ShoppingBag className="h-4 w-4" />
              Сагслах
            </button>
          </div>

          {typeof product.originalPrice === 'number' &&
            product.originalPrice > product.price && (
              <div className="mt-2">
                <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700">
                  -
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )}
                  %
                </span>
              </div>
            )}
        </div>
      </div>
    </Link>
  );
}
