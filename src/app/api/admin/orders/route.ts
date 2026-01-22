// app/api/admin/orders/route.ts
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/adminAuth';

export async function GET() {
  const auth = await verifyAdminAuth();
  if ('error' in auth) {
    return Response.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return Response.json({ orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return Response.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
