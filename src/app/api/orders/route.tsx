import { prisma } from '@/lib/prisma';
import { encodeOrderId } from '@/lib/orderHash';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { randomUUID } from 'crypto';

type CartItem = {
  productId: number;
  quantity: number;
  price: number;
};

type OrderForm = {
  customerName: string;
  phone: string;
  address: string;
  email: string;
  lastName: string;
  district: string;
  city: string;
};

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    let userId: number | null = null;
    let guestToken: string | null = null;

    if (token) {
      try {
        const decoded = verify(token, process.env.JWT_SECRET!) as {
          userId: number;
        };
        userId = decoded.userId;
      } catch {
        userId = null;
      }
    }

    if (!userId) {
      guestToken = randomUUID();
    }

    const body: { form: OrderForm; items: CartItem[] } = await req.json();
    const { form, items } = body;

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await prisma.order.create({
      data: {
        customerName: form.customerName,
        phone: form.phone,
        address: form.address,
        email: form.email,
        lastName: form.lastName,
        district: form.district,
        city: form.city,
        total,
        userId: userId,
        guestToken: guestToken,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
    });

    const hashedId = encodeOrderId(order.id);

    return new Response(
      JSON.stringify({
        orderId: hashedId,
        guestToken: guestToken,
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error('Order creation error:', err);
    return new Response(
      JSON.stringify({ message: 'Захиалга үүсгэхэд алдаа гарлаа' }),
      { status: 500 }
    );
  }
}
