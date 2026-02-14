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

    const result = await prisma.$transaction(async (tx) => {
      const currentOrder = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!currentOrder) throw new Error('Order not found');

      if (status === 'PAID' && currentOrder.status !== 'PAID') {
        for (const item of currentOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      return updatedOrder;
    });

    return Response.json({
      order: result,
      message: 'Захиалгын төлөв шинэчлэгдэж, нөөцөөс хасагдлаа',
    });
  } catch (error: unknown) {
    console.error('Update order status error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update order status';
    return Response.json({ message: errorMessage }, { status: 500 });
  }
}
