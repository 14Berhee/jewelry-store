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

  const [qr, setQr] = useState<string | null>(null);
  const [links, setLinks] = useState<{ name: string; link: string }[]>([]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!form.customerName || !form.phone || !form.address) {
      alert('Бүх талбарыг бөглөнө үү');
      return;
    }

    if (cartItems.length === 0) {
      alert('Сагс хоосон байна');
      return;
    }

    try {
      // 1️⃣ create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({ form, items: cartItems }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!orderRes.ok) throw new Error('Order creation failed');
      const order = await orderRes.json();

      // 2️⃣ fetch QPay invoice
      const payRes = await fetch('/api/qpay/invoice', {
        method: 'POST',
        body: JSON.stringify({ orderId: order.id }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!payRes.ok) throw new Error('QPay invoice failed');
      const data = await payRes.json();

      // 3️⃣ save QR and bank links to state
      setLinks(data.urls || []);
      setQr(data.qr_text || null);

      // Optional: clear cart AFTER payment display
      clearCart();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

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
            <span>{item.price * item.quantity}₮</span>
          </div>
        ))}
        <hr />
        <div className="flex justify-between font-bold">
          <span>Нийт</span>
          <span>{total}₮</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        className="mt-6 w-full rounded-full bg-neutral-900 py-4 text-white"
      >
        Захиалах & Төлөх
      </button>

      {qr && (
        <div className="mt-6">
          <h2 className="mb-2 text-xl font-semibold">QR кодыг сканнердах:</h2>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${qr}`}
            alt="QPay QR"
            className="mx-auto"
          />
        </div>
      )}

      {links.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-2 text-xl font-semibold">Банк аппуудаар төлөх:</h2>
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.name}>
                <a
                  href={l.link}
                  target="_blank"
                  className="text-blue-700 underline"
                >
                  {l.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
