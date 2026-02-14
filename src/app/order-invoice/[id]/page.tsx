import { getSingleOrder } from '@/lib/order';
import { decodeOrderId } from '@/lib/orderHash';
import BackButton from '@/src/components/BackButton';
import BankDetails from '@/src/components/BankDetails';
import GuestLinkNotice from '@/src/components/GuestLinkNotice';
import {
  Package,
  Calendar,
  User,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;
  const orderId = decodeOrderId(id);

  if (!orderId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-500">Захиалга олдсонгүй</p>
      </div>
    );
  }

  const order = await getSingleOrder(orderId);

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-500">Захиалга олдсонгүй</p>
      </div>
    );
  }

  if (order.guestToken && order.guestToken !== token) {
    return (
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="rounded-full bg-amber-50 p-4 text-amber-600">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Хандах эрхгүй байна</h2>
        <p className="max-w-sm text-gray-500">
          Та энэ захиалгыг харах эрхгүй байна. Хэрэв та зочноор захиалга өгсөн
          бол имэйлээр ирсэн линкээр орно уу.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      {order.guestToken && <GuestLinkNotice />}

      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl font-black text-gray-900">
          Захиалга баталгаажлаа!
        </h1>
        <p className="mt-2 text-gray-500">
          Та доорх данс руу төлбөрөө шилжүүлснээр таны захиалга хүргэлтэнд
          гарна.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <BankDetails orderId={order.id.toString()} />

          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Package size={18} className="text-rose-600" />
                <span>Захиалгын дэлгэрэнгүй</span>
              </div>
              <span className="text-sm font-medium text-gray-500">
                #{order.id}
              </span>
            </div>

            <div className="divide-y divide-gray-100 px-6">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col py-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-gray-900">
                      {item.product?.name}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>Тоо: {item.quantity}</span>
                      {item.product?.availableSizes && (
                        <span>Размер: {item.product.availableSizes}</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 font-black text-gray-900 sm:mt-0">
                    {new Intl.NumberFormat('mn-MN').format(
                      item.price * item.quantity
                    )}
                    ₮
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-6">
              <div className="flex items-center justify-between text-lg font-black text-gray-900">
                <span>Нийт төлөх дүн</span>
                <span className="text-2xl text-rose-600">
                  {new Intl.NumberFormat('mn-MN').format(order.total)}₮
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-gray-900 uppercase">
              <User size={16} className="text-rose-600" />
              Хүлээн авагч
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <User size={16} className="shrink-0 text-gray-400" />
                <p className="font-medium text-gray-700">
                  {order.customerName}
                </p>
              </div>
              <div className="flex gap-3">
                <Phone size={16} className="shrink-0 text-gray-400" />
                <p className="font-medium text-gray-700">{order.phone}</p>
              </div>
              <div className="flex gap-3 border-t border-gray-50 pt-2">
                <MapPin size={16} className="shrink-0 text-gray-400" />
                <p className="leading-relaxed font-medium text-gray-700">
                  {order.address}
                </p>
              </div>
              <div className="flex gap-3 border-t border-gray-50 pt-2">
                <Calendar size={16} className="shrink-0 text-gray-400" />
                <p className="font-medium text-gray-700">
                  {new Date(order.createdAt).toLocaleDateString('mn-MN')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <BackButton />
          </div>
        </div>
      </div>
    </div>
  );
}
