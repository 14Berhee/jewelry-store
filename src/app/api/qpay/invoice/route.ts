import { prisma } from '@/lib/prisma';

async function getQpayToken() {
  const auth = Buffer.from(
    `${process.env.QPAY_CLIENT_ID}:${process.env.QPAY_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch(`${process.env.QPAY_BASE_URL}/v2/auth/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const data = await res.json();
  return data.access_token;
}

export async function POST(req: Request) {
  const { orderId } = await req.json();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return new Response('Order not found', { status: 404 });
  }

  const token = await getQpayToken();

  const invoiceRes = await fetch(`${process.env.QPAY_BASE_URL}/v2/invoice`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      invoice_code: process.env.QPAY_INVOICE_CODE,
      sender_invoice_no: `ORDER_${order.id}`,
      invoice_receiver_code: order.phone,
      invoice_description: `Захиалга #${order.id}`,
      amount: order.total,
      callback_url: process.env.QPAY_CALLBACK_URL,
    }),
  });

  const invoice = await invoiceRes.json();

  await prisma.order.update({
    where: { id: order.id },
    data: {
      qpayInvoiceId: invoice.invoice_id,
      qpayQr: invoice.qr_text,
    },
  });

  return Response.json(invoice);
}
