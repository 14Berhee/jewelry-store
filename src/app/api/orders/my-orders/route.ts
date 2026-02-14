import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return Response.json({ message: 'Та нэвтэрч орно уу!' }, { status: 401 });
    }

    let userId: number;
    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as {
        userId: number;
      };
      userId = decoded.userId;
    } catch (err) {
      console.error('Token verification error:', err);
      return Response.json(
        { message: 'Токен хүчингүй байна' },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return Response.json({ orders });
  } catch {
    return Response.json({ message: 'Токен хүчингүй байна' }, { status: 401 });
  }
}
