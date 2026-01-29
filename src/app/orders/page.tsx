import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { encodeOrderId } from '@/lib/orderHash';
import Image from 'next/image';

async function getOrders(userId: number) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              metal: true,
              category: true,
              images: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/signin?redirect=/orders');
  }

  let userId: number;
  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    userId = decoded.userId;
  } catch {
    redirect('/signin?redirect=/orders');
  }

  const orders = await getOrders(userId);

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Миний захиалга</h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="mb-4 text-gray-600">
            Та одоогоор захиалга хийгээгүй байна
          </p>
          <Link
            href="/products"
            className="inline-block rounded-lg bg-neutral-900 px-6 py-3 text-white hover:bg-neutral-800"
          >
            Бүтээгдэхүүн үзэх
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const hashedId = encodeOrderId(order.id);
            return (
              <div
                key={order.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Захиалгын дугаар: #{hashedId}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('mn-MN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        statusColors[order.status] ||
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                    <Link
                      href={`/order-invoice/${hashedId}`}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Дэлгэрэнгүй →
                    </Link>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      {item.product.images[0]?.url ? (
                        <Image
                          src={
                            item.product.images[0]?.url || '/placeholder.png'
                          }
                          alt={item.product.name}
                          width={74}
                          height={74}
                          className="h-18 w-18 flex-shrink-0 rounded bg-gray-100 object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Тоо ширхэг: {item.quantity} ×{' '}
                          {new Intl.NumberFormat('mn-MN').format(item.price)}₮
                        </p>
                        <p className="text-sm text-gray-500">
                          Размер : {item.product.availableSizes}
                        </p>
                        <p className="text-sm text-gray-500">
                          Материал : {item.product.metal?.name}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">
                        {new Intl.NumberFormat('mn-MN').format(
                          item.price * item.quantity
                        )}
                        ₮
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between border-t pt-4">
                  <p className="font-semibold text-gray-900">Нийт дүн:</p>
                  <p className="text-xl font-bold text-gray-900">
                    {new Intl.NumberFormat('mn-MN').format(order.total)}₮
                  </p>
                </div>

                <div className="mt-4 rounded bg-gray-50 p-4 text-sm">
                  <p className="mb-1">
                    <span className="font-medium">Хүлээн авагч:</span>{' '}
                    {order.customerName}
                  </p>
                  <p className="mb-1">
                    <span className="font-medium">Утас:</span> {order.phone}
                  </p>
                  <p>
                    <span className="font-medium">Хаяг:</span> {order.address}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
