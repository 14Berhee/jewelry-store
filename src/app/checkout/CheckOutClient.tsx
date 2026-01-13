'use client';

import { useCartStore } from '@/src/store/useCartStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface FormData {
  customerName: string;
  phone: string;
  address: string;
  email: string;
}

interface OrderResponse {
  orderId?: number;
  message?: string;
}

export default function CheckoutClient() {
  const cartItems = useCartStore((s) => s.cartItemsLocal);
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    customerName: '',
    phone: '',
    address: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function submitOrder() {
    if (!cartItems.length) {
      alert('Сагс хоосон байна!');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ form, items: cartItems }),
      });

      const data = (await res.json()) as OrderResponse;

      if (res.ok && data.orderId) {
        clearCart();
        router.push('/order-invoice/' + data.orderId);
      } else {
        console.error('Order creation failed', data);
        alert(data.message || 'Захиалга үүсгэхэд алдаа гарлаа');
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Сүлжээний алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl py-12">
      <h1 className="mb-6 text-3xl font-bold">Захиалга хийх</h1>

      <div className="space-y-4">
        <input
          placeholder="Нэр"
          className="w-full rounded border p-3"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
        />
        <input
          placeholder="Утас"
          className="w-full rounded border p-3"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <textarea
          placeholder="Хаяг"
          className="w-full rounded border p-3"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          placeholder="Имэйл"
          className="w-full rounded border p-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="mt-8 space-y-2">
        {cartItems.map((item) => (
          <div key={item.productId} className="flex justify-between">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>
              {new Intl.NumberFormat('mn-MN').format(
                item.price * item.quantity
              )}
              ₮
            </span>
          </div>
        ))}
        <hr />
        <div className="flex justify-between font-bold">
          <span>Нийт</span>
          <span>{new Intl.NumberFormat('mn-MN').format(total)}₮</span>
        </div>
      </div>

      <button
        onClick={submitOrder}
        disabled={loading}
        className={`mt-6 w-full rounded-full py-4 text-white ${
          loading ? 'cursor-not-allowed bg-gray-500' : 'bg-neutral-900'
        }`}
      >
        {loading ? 'Түр хүлээнэ үү...' : 'Захиалах'}
      </button>
    </section>
  );
}
