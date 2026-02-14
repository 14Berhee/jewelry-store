'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Phone,
  Package,
  MapPin,
  User,
  ChevronRight,
} from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    images?: Array<{ url: string }>;
  };
}

interface Order {
  id: string;
  hashedId: string;
  guestToken: string;
  createdAt: string;
  status: string;
  customerName: string;
  address: string;
  total: number;
  items: OrderItem[];
}

export default function TrackOrderPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    SHIPPED: 'bg-blue-100 text-blue-800',
    DELIVERED: 'bg-purple-100 text-purple-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'Хүлээгдэж буй',
    PAID: 'Төлбөр төлөгдсөн',
    SHIPPED: 'Хүргэгдэж байна',
    DELIVERED: 'Хүргэгдсэн',
    CANCELLED: 'Цуцлагдсан',
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrders([]);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders);
      } else {
        setError(data.message || 'Захиалга олдсонгүй');
      }
    } catch {
      setError('Сүлжээний алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-20">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-gray-900">Захиалга хянах</h1>
        <p className="mt-2 text-gray-500">
          Бүртгэлтэй утасны дугаараа оруулж захиалгын түүхээ харна уу.
        </p>
      </div>

      <form
        onSubmit={handleTrack}
        className="mx-auto mb-12 flex max-w-md gap-2"
      >
        <div className="relative flex-1">
          <Phone
            className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="tel"
            placeholder="Утасны дугаар"
            className="w-full rounded-2xl border border-gray-200 p-4 pl-12 transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <button
          disabled={loading}
          className="flex aspect-square h-[58px] items-center justify-center rounded-2xl bg-gray-900 text-white shadow-lg shadow-gray-200 transition-colors hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Search size={22} />
          )}
        </button>
      </form>

      {error && (
        <div className="animate-in fade-in zoom-in mb-8 rounded-2xl border border-red-100 bg-red-50 p-4 text-center text-sm font-medium text-red-600 duration-200">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {orders.length > 0 && (
          <p className="ml-2 text-xs font-black tracking-widest text-gray-400 uppercase">
            Олдсон захиалгууд ({orders.length})
          </p>
        )}

        {orders.map((order) => (
          <div
            key={order.id}
            className="animate-in slide-in-from-bottom-4 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5 transition-all duration-500 hover:shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white p-2 shadow-sm">
                  <Package size={18} className="text-rose-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Захиалга #{order.id}
                  </p>
                  <p className="text-[10px] font-medium tracking-tight text-gray-500 uppercase">
                    {new Date(order.createdAt).toLocaleDateString('mn-MN')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${
                    statusColors[order.status]
                  }`}
                >
                  {statusLabels[order.status]}
                </span>
                <Link
                  href={`/order-invoice/${order.hashedId}?token=${order.guestToken}`}
                  className="flex items-center gap-1 text-xs font-black text-rose-600 hover:text-rose-700"
                >
                  ДЭЛГЭРЭНГҮЙ <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            <div className="divide-y divide-gray-50 px-6">
              {order.items.map((item: OrderItem) => (
                <div key={item.id} className="flex items-center gap-4 py-4">
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                    <Image
                      src={item.product?.images?.[0]?.url || '/placeholder.png'}
                      alt={item.product?.name || 'Product'}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {item.product?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} ш ×{' '}
                      {new Intl.NumberFormat('mn-MN').format(item.price)}₮
                    </p>
                  </div>
                  <p className="text-sm font-black text-gray-900">
                    {new Intl.NumberFormat('mn-MN').format(
                      item.price * item.quantity
                    )}
                    ₮
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/30 px-6 py-4">
              <div className="flex items-center gap-4 text-[11px] font-medium text-gray-500">
                <div className="flex items-center gap-1">
                  <User size={12} /> {order.customerName}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={12} /> {order.address.split(',')[0]}...
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Нийт төлбөр
                </p>
                <p className="text-lg font-black text-gray-900">
                  {new Intl.NumberFormat('mn-MN').format(order.total)}₮
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && !loading && (
        <div className="mt-16 rounded-3xl border border-dashed border-gray-200 p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
            <Search size={28} />
          </div>
          <h3 className="text-sm font-bold tracking-widest text-gray-900 uppercase">
            Захиалгаа олж чадахгүй байна уу?
          </h3>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-500">
            Таны оруулсан утасны дугаар захиалга дээрх дугаартай таарч байгаа
            эсэхийг шалгана уу.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="mb-1 text-[10px] font-bold text-gray-400 uppercase">
                Тусламж
              </p>
              <Link
                href="/contact"
                className="text-sm font-black text-rose-600 underline decoration-2 underline-offset-4 hover:text-rose-700"
              >
                Бидэнтэй холбогдох
              </Link>
            </div>
            <div className="hidden h-8 w-px bg-gray-200 sm:block" />
            <div className="text-center sm:text-left">
              <p className="mb-1 text-[10px] font-bold text-gray-400 uppercase">
                Утас
              </p>
              <p className="text-sm font-black text-gray-900">9402-9797</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
