import { prisma } from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/adminAuth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminAuth();
  if ('error' in auth) {
    return Response.json({ message: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  const orderId = Number(id);

  try {
    const { status } = await request.json();

    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'CANCELLED'] as const;
    if (!validStatuses.includes(status)) {
      return Response.json(
        { message: 'Invalid order status' },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return Response.json({ order, message: 'Order status updated' });
  } catch (error) {
    console.error('Update order status error:', error);
    return Response.json(
      { message: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
