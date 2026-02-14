'use client';

import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/src/types/product';
import { useCartStore } from '@/src/store/useCartStore';
import { useWishlistStore } from '@/src/store/useWishListStore';
import Image from 'next/image';
import Link from 'next/link';

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('mn-MN').format(price) + '₮';

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const currentCartItem = useCartStore
      .getState()
      .cartItemsLocal.find((i) => i.productId === product.id);
    const currentCartQuantity = currentCartItem?.quantity || 0;
    const maxStock = product.stock || 0;

    if (maxStock === 0) return alert('Уучлаарай, энэ бараа дууссан байна.');
    if (currentCartQuantity + 1 > maxStock) {
      return alert(
        `Нөөцөд зөвхөн ${maxStock} ширхэг байна. Сагсанд ${currentCartQuantity} байна.`
      );
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url,
    });
    setIsCartOpen(true);
  };

  return (
    <Link href={`/product/${product.id}`} className="flex w-full">
      <div className="group relative flex w-full flex-col overflow-hidden rounded-sm border border-neutral-100 bg-white transition-all duration-300 hover:shadow-xl">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          {product.images[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-xs text-gray-400">Зураг байхгүй</span>
            </div>
          )}

          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all hover:scale-110 active:scale-90"
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`}
            />
          </button>

          {typeof product.originalPrice === 'number' &&
            product.originalPrice > product.price && (
              <div className="absolute top-3 left-3">
                <span className="rounded-lg bg-rose-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
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

        <div className="flex flex-1 flex-col p-4">
          <div className="flex-1">
            <h3 className="pb-2 font-serif text-[18px] leading-tight tracking-[0.04em] text-neutral-900 italic transition-colors duration-500 group-hover:text-neutral-500">
              {product.name}
            </h3>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <p className="text-[16px] font-medium tracking-[0.1em] text-black">
                {formatPrice(product.price)}
              </p>
              {typeof product.originalPrice === 'number' &&
                product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
            </div>
          </div>

          <div className="mt-auto">
            <button
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-gray-900 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800 active:scale-95"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Сагслах</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
