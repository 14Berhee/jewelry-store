'use client';

import Image from 'next/image';
import { useCartStore } from '@/src/store/useCartStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface ProductStock {
  [productId: number]: number;
}

export function CartPanel() {
  const items = useCartStore((s) => s.cartItemsLocal);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const isOpen = useCartStore((s) => s.isCartOpen);
  const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);
  const router = useRouter();
  const [productStocks, setProductStocks] = useState<ProductStock>({});

  const onClose = () => setIsCartOpen(false);

  useEffect(() => {
    const fetchStocks = async () => {
      if (items.length === 0) return;

      const productIds = items.map((item) => item.productId);
      try {
        const res = await fetch('/api/products/stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds }),
        });

        if (res.ok) {
          const stocks = await res.json();
          setProductStocks(stocks);
        }
      } catch (error) {
        console.error('Failed to fetch stock:', error);
      }
    };

    fetchStocks();
  }, [items]);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('mn-MN').format(price) + '₮';

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    const maxStock = productStocks[productId] || 99;

    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > maxStock) {
      alert(`Нөөцөд зөвхөн ${maxStock} ширхэг байна`);
      return;
    }

    updateQuantity(productId, newQuantity);
  };

  return (
    <>
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 z-40 bg-black/50" />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full transform bg-white shadow-lg transition-transform duration-300 sm:w-96 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold">Сагс</h2>
          <button onClick={onClose} className="font-bold text-gray-700">
            ✕
          </button>
        </div>

        <div className="flex max-h-[calc(100vh-160px)] flex-col space-y-3 overflow-y-auto p-3 sm:p-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500">Сагс хоосон</p>
          ) : (
            items.map((item, index) => {
              const maxStock = productStocks[item.productId] || 99;
              const isOutOfStock = maxStock === 0;
              const exceedsStock = item.quantity > maxStock;

              return (
                <div
                  key={`${item.productId}-${index}`}
                  className={`flex items-start gap-3 rounded-lg border p-2 sm:p-3 ${
                    isOutOfStock || exceedsStock ? 'bg-red-50' : ''
                  }`}
                >
                  {item.image && (
                    <Image
                      src={item.image ?? '/placeholder.png'}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="h-14 w-14 rounded object-cover sm:h-16 sm:w-16"
                    />
                  )}
                  <div className="flex flex-1 flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm text-gray-500">
                      {formatPrice(item.price)}
                    </span>
                    {item.size && (
                      <span className="text-xs text-gray-400">
                        Хэмжээ: {item.size}
                      </span>
                    )}

                    {exceedsStock && (
                      <span className="text-xs text-red-600">
                        Нөөцөд зөвхөн {maxStock} ширхэг
                      </span>
                    )}

                    {isOutOfStock && (
                      <span className="text-xs text-red-600">Дууссан</span>
                    )}

                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                        disabled={isOutOfStock || item.quantity <= 1}
                        className="rounded bg-gray-200 px-2 hover:bg-gray-300 disabled:opacity-50"
                      >
                        –
                      </button>
                      <span className="min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                        disabled={isOutOfStock || item.quantity >= maxStock}
                        className="rounded bg-gray-200 px-2 hover:bg-gray-300 disabled:opacity-50"
                      >
                        +
                      </button>
                      <span className="text-xs text-gray-400">
                        / {maxStock}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="font-bold text-red-500 hover:text-red-700"
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
            <button
              className="mt-4 w-full rounded bg-amber-700 py-2 text-white hover:bg-amber-800"
              onClick={() => {
                onClose();
                router.push('/checkout');
              }}
            >
              Худалдаж авах
            </button>
          </div>
        )}
      </div>
    </>
  );
}
