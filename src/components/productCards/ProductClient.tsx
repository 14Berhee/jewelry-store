'use client';

import { useState } from 'react';
import { Package, Shield, Truck } from 'lucide-react';
import { useCartStore } from '@/src/store/useCartStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product, Metal } from '@prisma/client';

interface ProductWithRelations extends Product {
  images?: Array<{ url: string; order?: number }>;
  metal?: Metal | null;
}

export function ProductClient({ product }: { product: ProductWithRelations }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product.availableSizes?.[0] || ''
  );
  const [quantity, setQuantity] = useState(1);

  const addToCart = useCartStore((s) => s.addToCart);
  const router = useRouter();

  const sortedImages = [...(product.images || [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: sortedImages[0]?.url,
      size: selectedSize,
      stock: quantity,
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl bg-neutral-50">
            <Image
              className="aspect-square w-full object-cover transition duration-500 hover:scale-105"
              src={sortedImages[selectedImage]?.url || sortedImages[0]?.url}
              alt={product.name}
              width={600}
              height={600}
              priority
            />
          </div>

          {sortedImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {sortedImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-lg transition ${
                    selectedImage === index
                      ? 'ring-2 ring-neutral-900 ring-offset-2'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    width={150}
                    height={150}
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-start space-y-6">
          <div className="space-y-3">
            <h1 className="font-serif text-2xl font-medium tracking-wide text-gray-900 sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>
            <p className="text-xl font-light tracking-wide text-gray-700 sm:text-2xl lg:text-3xl">
              {new Intl.NumberFormat('mn-MN').format(product.price)}₮
            </p>
            {product.title && (
              <p className="pt-2 text-sm leading-relaxed text-gray-600 sm:text-base lg:leading-loose">
                {product.title}
              </p>
            )}
          </div>

          {product.metal && (
            <div className="space-y-3 border-t border-neutral-200 pt-6">
              <label className="block text-sm font-medium text-gray-900">
                Материал
              </label>
              <div className="rounded-lg border-2 border-neutral-300 bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-900">
                {product.metal.name}
              </div>
            </div>
          )}

          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="space-y-3 border-t border-neutral-200 pt-6">
              <label className="block text-sm font-medium text-gray-900">
                Хэмжээ сонгох
              </label>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] rounded-lg border-2 px-4 py-2 text-sm font-medium transition sm:min-w-[3.5rem] sm:px-5 sm:py-2.5 ${
                      selectedSize === size
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3 border-t border-neutral-200 pt-6">
            <label className="block text-sm font-medium text-gray-900">
              Тоо ширхэг
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded-lg border-2 border-neutral-300 px-4 py-2 hover:border-neutral-900"
              >
                -
              </button>
              <span className="min-w-[3rem] text-center text-lg font-medium">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock || 99, quantity + 1))
                }
                className="rounded-lg border-2 border-neutral-300 px-4 py-2 hover:border-neutral-900"
              >
                +
              </button>
              <span className="text-sm text-gray-500">
                (Нөөцөд: {product.stock || 0})
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.stock || product.stock === 0}
              className="w-full rounded-full bg-neutral-900 py-3 text-sm font-medium text-white transition hover:bg-amber-700 active:scale-98 disabled:opacity-50 sm:py-4 sm:text-base"
            >
              {product.stock && product.stock > 0 ? 'Сагслах' : 'Дууссан'}
            </button>
          </div>

          <div className="space-y-3 border-t border-neutral-200 pt-6">
            <div className="flex items-start gap-3 text-xs text-neutral-600 sm:items-center sm:text-sm">
              <Truck className="mt-0.5 h-5 w-5 flex-shrink-0 sm:mt-0" />
              <span>Үнэгүй хүргэлт 50,000₮-с дээш захиалгад</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-neutral-600 sm:items-center sm:text-sm">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 sm:mt-0" />
              <span>30 хоногийн буцаалтын баталгаа</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-neutral-600 sm:items-center sm:text-sm">
              <Package className="mt-0.5 h-5 w-5 flex-shrink-0 sm:mt-0" />
              <span>Бэлэн байгаа, 2-3 хоногт хүргэнэ</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
