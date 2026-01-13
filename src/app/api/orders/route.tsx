import { prisma } from '@/lib/prisma';
import { encodeOrderId } from '@/lib/orderHash';

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
};

export async function POST(req: Request) {
  try {
    const body: { form: OrderForm; items: CartItem[] } = await req.json();
    const { form, items } = body;

    if (!items?.length) {
      return new Response(JSON.stringify({ message: 'Сагс хоосон байна' }), {
        status: 400,
      });
    }

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await prisma.order.create({
      data: {
        customerName: form.customerName,
        phone: form.phone,
        address: form.address,
        email: form.email,
        total,
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

    // ✅ Return hashed order ID instead of raw number
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
