'use client';

import { Package, Shield, Truck } from 'lucide-react';
import { useCartStore } from '@/src/store/useCartStore';
import Image from 'next/image';
import { Product } from '@/src/types/product';
import { useRouter } from 'next/navigation';

export default function ProductClient({ product }: { product: Product }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const router = useRouter();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl bg-neutral-50">
            <Image
              className="aspect-square w-full object-cover transition duration-500 hover:scale-105"
              src={product?.images[0]?.url}
              alt={product?.name}
              width={500}
              height={500}
            />
          </div>
        </div>

        <div className="flex flex-col justify-start space-y-6">
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-medium tracking-wide text-gray-900 md:text-2xl">
              {product?.name}
            </h3>
            <p className="text-lg font-light tracking-wide text-gray-700 md:text-xl">
              {new Intl.NumberFormat('mn-MN').format(product?.price || 0)}₮
            </p>
            <p className="py-6 text-base leading-loose text-gray-700">
              {product?.title}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
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
            <div>
              <button
                className="w-full rounded-full border-2 border-neutral-900 px-8 py-4 text-base font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white active:scale-95"
                onClick={() => router.push('/checkout')}
              >
                Шууд худалдан авах
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <div className="flex items-center gap-3 text-sm text-neutral-600">
              <Truck className="h-5 w-5" />
              <span>Үнэгүй хүргэлт 50,000₮-с дээш захиалгад</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-600">
              <Shield className="h-5 w-5" />
              <span>30 хоногийн буцаалтын баталгаа</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-600">
              <Package className="h-5 w-5" />
              <span>Бэлэн байгаа, 2-3 хоногт хүргэнэ</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
