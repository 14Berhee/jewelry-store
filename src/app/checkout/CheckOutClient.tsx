'use client';

import { useCartStore } from '@/src/store/useCartStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Truck,
  User,
  Mail,
  Phone,
  CreditCard,
} from 'lucide-react';

export default function CheckoutClient() {
  const cartItems = useCartStore((s) => s.cartItemsLocal);
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: '',
    lastName: '',
    phone: '',
    address: '',
    email: '',
    district: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedForm = localStorage.getItem('checkout_form_data');
    if (savedForm) {
      try {
        setForm(JSON.parse(savedForm));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

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

    const isFormValid = Object.values(form).every((val) => val.trim() !== '');
    if (!isFormValid) {
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

        const redirectPath = data.guestToken
          ? `/order-invoice/${data.orderId}?token=${data.guestToken}`
          : `/order-invoice/${data.orderId}`;

        router.push(redirectPath);
      } else {
        alert(data.message || 'Захиалга үүсгэхэд алдаа гарлаа');
      }
    } catch {
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
    <section className="mx-auto max-w-6xl px-4 py-8 md:py-16">
      <div className="mb-10 flex items-center gap-4 border-b border-gray-100 pb-6">
        <div className="rounded-full bg-rose-50 p-3 text-rose-600">
          <ShoppingBag size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 md:text-3xl">
            Худалдан авалт
          </h1>
          <p className="text-sm text-gray-500">
            Мэдээллээ бөглөөд захиалгаа баталгаажуулна уу.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="mb-8 flex items-center gap-2 text-gray-900">
            <User size={20} className="text-rose-600" />
            <h2 className="text-lg font-bold">Хувийн мэдээлэл</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                Овог
              </label>
              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 text-sm focus:border-rose-500 focus:bg-white focus:outline-none"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                Нэр
              </label>
              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 text-sm focus:border-rose-500 focus:bg-white focus:outline-none"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                Утас
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
                />
                <input
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 pl-10 text-sm focus:border-rose-500 focus:bg-white focus:outline-none"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                Имэйл
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 pl-10 text-sm focus:border-rose-500 focus:bg-white focus:outline-none"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="mt-12 mb-8 flex items-center gap-2 text-gray-900">
            <Truck size={20} className="text-rose-600" />
            <h2 className="text-lg font-bold">Хүргэлтийн хаяг</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                Хот / Аймаг
              </label>
              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 text-sm focus:border-rose-500 focus:bg-white focus:outline-none"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                Дүүрэг / Сум
              </label>
              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 text-sm focus:border-rose-500 focus:bg-white focus:outline-none"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              />
            </div>
            <div className="col-span-full space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                Дэлгэрэнгүй хаяг
              </label>
              <textarea
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 text-sm focus:border-rose-500 focus:bg-white focus:outline-none"
                rows={3}
                placeholder="Байр, тоот..."
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl border border-gray-100 bg-gray-50/50 p-6 shadow-sm ring-1 ring-black/5">
            <h3 className="mb-6 flex items-center gap-2 font-bold text-gray-900">
              <CreditCard size={18} className="text-rose-600" />
              Таны захиалга
            </h3>

            <div className="max-h-[300px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      Тоо: {item.quantity}
                    </span>
                  </div>
                  <span className="text-sm font-black text-gray-900">
                    {new Intl.NumberFormat('mn-MN').format(
                      item.price * item.quantity
                    )}
                    ₮
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Захиалгын дүн</span>
                <span>{new Intl.NumberFormat('mn-MN').format(total)}₮</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Хүргэлт</span>
                <span className="text-green-600">Үнэгүй</span>
              </div>
              <div className="my-2 border-t border-dashed border-gray-200 pt-3">
                <div className="flex justify-between text-xl font-black text-gray-900">
                  <span>Нийт дүн</span>
                  <span className="text-rose-600">
                    {new Intl.NumberFormat('mn-MN').format(total)}₮
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={submitOrder}
              disabled={loading}
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4.5 font-black tracking-widest text-white uppercase transition-all active:scale-[0.98] ${
                loading
                  ? 'cursor-not-allowed bg-gray-300'
                  : 'bg-neutral-900 hover:bg-neutral-800'
              }`}
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                'Захиалга баталгаажуулах'
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
