// CheckoutClient.tsx
'use client';

import { useCartStore } from '@/src/store/useCartStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutClient() {
  const cartItems = useCartStore((s) => s.cartItemsLocal);
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    address: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  // Load saved form data when component mounts
  useEffect(() => {
    const savedForm = localStorage.getItem('checkout_form_data');
    if (savedForm) {
      try {
        setForm(JSON.parse(savedForm));
      } catch (err) {
        console.error('Failed to load saved form data:', err);
      }
    }
  }, []);

  // Save form data whenever it changes
  useEffect(() => {
    if (form.customerName || form.phone || form.address || form.email) {
      localStorage.setItem('checkout_form_data', JSON.stringify(form));
    }
  }, [form]);

  async function submitOrder() {
    if (!cartItems.length) {
      alert('Сагс хоосон байна!');
      return;
    }

    if (
      !form.customerName.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.email.trim()
    ) {
      alert('Бүх талбарыг бөглөнө үү!');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert('Имэйл хаяг буруу байна!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ form, items: cartItems }),
      });

      const data = await res.json();

      if (res.ok && data.orderId) {
        localStorage.removeItem('checkout_form_data');
        clearCart();
        router.push('/order-invoice/' + data.orderId);
      } else if (res.status === 401) {
        alert('Захиалга хийхийн тулд нэвтэрнэ үү');
        router.push('/signin?redirect=/checkout');
      } else {
        alert(data.message || 'Захиалга үүсгэхэд алдаа гарлаа');
      }
    } catch (err) {
      console.error(err);
      alert('Сүлжээний алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
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
          rows={3}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          placeholder="Имэйл"
          type="email"
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
        <div className="flex justify-between text-lg font-bold">
          <span>Нийт</span>
          <span>{new Intl.NumberFormat('mn-MN').format(total)}₮</span>
        </div>
      </div>

      <button
        onClick={submitOrder}
        disabled={loading}
        className={`mt-6 w-full rounded-full py-4 font-semibold text-white ${
          loading
            ? 'cursor-not-allowed bg-gray-500'
            : 'bg-neutral-900 hover:bg-neutral-800'
        }`}
      >
        {loading ? 'Түр хүлээнэ үү...' : 'Захиалах'}
      </button>
    </section>
  );
}
