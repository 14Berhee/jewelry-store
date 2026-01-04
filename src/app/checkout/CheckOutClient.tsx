'use client';

import { useCartStore } from '@/src/store/useCartStore';
import { useState } from 'react';

export default function CheckoutClient() {
  const cartItems = useCartStore((s) => s.cartItemsLocal);
  const clearCart = useCartStore((s) => s.clearCart);

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    address: '',
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function submitOrder() {
    const res = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ form, items: cartItems }),
    });

    if (res.ok) {
      clearCart();
      window.location.href = '/success';
    }
  }

  return (
    <section className="mx-auto max-w-3xl py-12">
      <h1 className="mb-6 text-3xl font-bold">Захиалга хийх</h1>

      <div className="space-y-4">
        <input
          placeholder="Нэр"
          className="w-full rounded border p-3"
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
        />
        <input
          placeholder="Утас"
          className="w-full rounded border p-3"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <textarea
          placeholder="Хаяг"
          className="w-full rounded border p-3"
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </div>

      <div className="mt-8 space-y-2">
        {cartItems.map((item, index) => (
          <div
            key={`${item.productId}-${index}`}
            className="flex justify-between"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
          </div>
        ))}
        <hr />
        <div className="flex justify-between font-bold">
          <span>Нийт</span>
          <span>{total}₮</span>
        </div>
      </div>

      <button
        onClick={submitOrder}
        className="mt-6 w-full rounded-full bg-neutral-900 py-4 text-white"
      >
        Захиалах
      </button>
    </section>
  );
}
