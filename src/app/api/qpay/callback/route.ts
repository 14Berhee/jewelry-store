import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.invoice_id || !body.payment_status) {
      return new Response('Invalid payload', { status: 400 });
    }

    if (body.payment_status === 'PAID') {
      const order = await prisma.order.findFirst({
        where: { qpayInvoiceId: body.invoice_id },
      });

      if (!order) {
        return new Response('Order not found', { status: 404 });
      }

      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID' },
      });
    }

    return new Response('OK');
  } catch (error) {
    console.error('QPay callback error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
