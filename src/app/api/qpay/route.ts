export async function GET() {
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
  return Response.json(data);
}
