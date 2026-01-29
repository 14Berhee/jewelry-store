import { prisma } from '@/lib/prisma';
import { encodeOrderId } from '@/lib/orderHash';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

type CartItem = {
  id: number;
  price: number;
  quantity: number;
  productId: number;
};

type OrderForm = {
  customerName: string;
  phone: string;
  address: string;
  products: string;
  email: string;
  lastName: string;
  district: string;
  city: string;
};

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return new Response(JSON.stringify({ message: 'Та нэвтэрч орно уу!' }), {
        status: 401,
      });
    }

    let userId;
    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as {
        userId: number;
      };
      userId = decoded.userId;
    } catch {
      return new Response(JSON.stringify({ message: 'Токен хүчингүй байна' }), {
        status: 401,
      });
    }
    const body: { form: OrderForm; items: CartItem[] } = await req.json();
    const { form, items } = body;

    if (!items?.length) {
      return new Response(JSON.stringify({ message: 'Сагс хоосон байна' }), {
        status: 400,
      });
    }

    if (
      !form.customerName?.trim() ||
      !form.lastName?.trim() ||
      !form.phone?.trim() ||
      !form.address?.trim() ||
      !form.email?.trim() ||
      !form.district?.trim() ||
      !form.city?.trim()
    ) {
      return new Response(
        JSON.stringify({ message: 'Бүх талбарыг бөглөнө үү' }),
        { status: 400 }
      );
    }

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
        userId,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    const hashedId = encodeOrderId(order.id);

    return new Response(JSON.stringify({ orderId: hashedId }), { status: 201 });
  } catch (err) {
    console.error('Order creation error:', err);
    return new Response(
      JSON.stringify({ message: 'Захиалга үүсгэхэд алдаа гарлаа' }),
      { status: 500 }
    );
  }
}
