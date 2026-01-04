import { prisma } from '@/lib/prisma';

type CartItem = {
  id: number;
  price: number;
  quantity: number;
};

type OrderForm = {
  customerName: string;
  phone: string;
  address: string;
};

export async function POST(req: Request) {
  // Explicitly type the JSON body
  const body: { form: OrderForm; items: CartItem[] } = await req.json();

  const { form, items } = body;

  // Calculate total
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = await prisma.order.create({
    data: {
      customerName: form.customerName,
      phone: form.phone,
      address: form.address,
      total,
      items: {
        create: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  return new Response(JSON.stringify(order), { status: 201 });
}
