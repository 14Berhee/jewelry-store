'use client';

import Image from 'next/image';
import { useCartStore } from '@/src/store/useCartStore';

interface ProductImage {
  url: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  images: ProductImage[];
}

interface CartPanelProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
}

export function CartPanel({ products, isOpen, onClose }: CartPanelProps) {
  const items = useCartStore((s) => s.items);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const totalPrice = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === Number(item.productId));
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('mn-MN').format(price) + '₮';

  return (
    <>
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 z-40 bg-black/50" />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 transform bg-white shadow-lg transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold">Сагс</h2>
          <button onClick={onClose} className="font-bold text-gray-700">
            ✕
          </button>
        </div>

        <div className="flex max-h-[75vh] flex-col space-y-2 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p>Сагс хоосон</p>
          ) : (
            items.map((item) => {
              const product = products.find(
                (p) => p.id === Number(item.productId)
              );
              if (!product) return null;
              return (
                <div key={item.productId} className="flex items-center gap-3">
                  <Image
                    src={product.images[0]?.url ?? '/placeholder.png'}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="rounded object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-gray-500">
                      {formatPrice(product.price)}
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="rounded bg-gray-200 px-2"
                      >
                        –
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="rounded bg-gray-200 px-2"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="font-bold text-red-500"
                  >
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Нийт:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <button className="mt-4 w-full rounded bg-amber-700 py-2 text-white hover:bg-amber-800">
              Худалдаж авах
            </button>
          </div>
        )}
      </div>
    </>
  );
}
