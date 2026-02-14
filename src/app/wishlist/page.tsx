'use client';

import { useWishlistStore } from '@/src/store/useWishListStore';
import { useCartStore } from '@/src/store/useCartStore';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface WishlistProduct {
  id: number;
  name: string;
  price: number;
  stock?: number;
  images: {
    url: string;
  }[];
}

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addToCart);
  const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('mn-MN').format(price) + '₮';

  const handleAddToCart = (e: React.MouseEvent, product: WishlistProduct) => {
    e.preventDefault();
    e.stopPropagation();

    const currentCartItem = useCartStore
      .getState()
      .cartItemsLocal.find((i) => i.productId === product.id);
    const currentCartQuantity = currentCartItem?.quantity || 0;
    const maxStock = product.stock || 99;

    if (maxStock === 0) {
      alert('Уучлаарай, энэ бараа дууссан байна.');
      return;
    }

    if (currentCartQuantity >= maxStock) {
      alert(
        `Уучлаарай нөөцөд зөвхөн ${maxStock} ширхэг байна.  Сагсанд аль хэдийн ${currentCartQuantity} ширхэг байна.`
      );
      return;
    }

    addToCart(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url,
      },
      1
    );

    setIsCartOpen(true);
  };

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <Heart className="mx-auto h-16 w-16 text-gray-300" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Хүслийн жагсаалт хоосон байна
          </h2>
          <p className="mt-2 text-gray-600">
            Таны хүслийн жагсаалтад бүтээгдэхүүн байхгүй байна
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            Нүүр хуудас руу буцах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Хүслийн жагсаалт</h1>
          <p className="mt-2 text-sm text-gray-600">
            {wishlist.length} бүтээгдэхүүн
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={clearWishlist}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Trash2 className="h-4 w-4" />
            Бүгдийг устгах
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
          >
            <Link href={`/product/${product.id}`} className="block">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                {product.images[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-sm text-gray-400">Зураг байхгүй</span>
                  </div>
                )}
              </div>
            </Link>

            <button
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
              aria-label="Хүслийн жагсаалтаас хасах"
            >
              <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
            </button>

            <div className="p-4">
              <Link href={`/product/${product.id}`}>
                <h3 className="mb-2 line-clamp-2 text-base font-medium text-gray-900 hover:text-gray-600">
                  {product.name}
                </h3>
              </Link>

              <p className="mb-4 text-lg font-semibold text-gray-900">
                {formatPrice(product.price)}
              </p>

              <button
                onClick={(e) => handleAddToCart(e, product)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                <ShoppingBag className="h-4 w-4" />
                Сагслах
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
