import { getSingleOrder } from '@/lib/order';
import { decodeOrderId } from '@/lib/orderHash';
import BackButton from '@/src/components/BackButton';

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const orderId = decodeOrderId((await params).id);

  if (!orderId) return <p>Захиалга олдсонгүй</p>;

  const order = await getSingleOrder(orderId);

  if (!order) return <p>Захиалга олдсонгүй</p>;
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
        <h1 className="mb-2 text-3xl font-bold">Захиалга #{order.id}</h1>
        <p className="text-gray-600">
          Огноо: {new Date(order.createdAt).toLocaleDateString('mn-MN')}
        </p>
      </div>

      <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">Барааны дэлгэрэнгүй</h2>
        <div className="divide-y divide-gray-200">
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between py-3">
              <div>
                <p className="font-medium">{item.product?.name}</p>
                <p className="text-sm text-gray-500">
                  Тоо ширхэг: {item.quantity}
                </p>
              </div>
              <div className="font-semibold">
                {new Intl.NumberFormat('mn-MN').format(
                  item.price * item.quantity
                )}
                ₮
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">Нийт дүн</h2>
        <div className="flex justify-between text-lg font-bold">
          <span>Нийт:</span>
          <span>{new Intl.NumberFormat('mn-MN').format(order.total)}₮</span>
        </div>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">
          Хэрэглэгчийн мэдээлэл
        </h2>
        <div className="space-y-1 text-gray-700">
          <p>
            <span className="font-medium">Нэр:</span> {order.customerName}
          </p>
          <p>
            <span className="font-medium">Утас:</span> {order.phone}
          </p>
          <p>
            <span className="font-medium">Имэйл:</span> {order.email}
          </p>
          <p>
            <span className="font-medium">Хаяг:</span> {order.address}
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="mt-8 text-center">
          <BackButton />
        </div>
      </div>
    </div>
  );
}
