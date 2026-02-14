import { prisma } from '@/lib/prisma';
import { encodeOrderId } from '@/lib/orderHash';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { message: 'Утасны дугаар оруулна уу.' },
        { status: 400 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { phone: phone },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
    });

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { message: 'Энэ дугаар дээр захиалга олдсонгүй.' },
        { status: 404 }
      );
    }

    const ordersWithHash = orders.map((order) => ({
      ...order,
      hashedId: encodeOrderId(order.id),
    }));

    return NextResponse.json({
      orders: ordersWithHash,
    });
  } catch (err) {
    console.error('Tracking Error:', err);
    return NextResponse.json({ message: 'Алдаа гарлаа' }, { status: 500 });
  }
}
