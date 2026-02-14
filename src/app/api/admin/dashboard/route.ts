import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Та нэвтэрч орно уу!' },
        { status: 401 }
      );
    }

    let userId: number;
    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as {
        userId: number;
      };
      userId = decoded.userId;
    } catch {
      return NextResponse.json(
        { message: 'Токен хүчингүй байна' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Та админ эрхгүй байна' },
        { status: 403 }
      );
    }

    const [totalProducts, totalOrders, totalUsers, orders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.findMany({
        where: { status: 'PAID' },
        select: { total: true },
      }),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        customerName: true,
        email: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    const topProducts = await prisma.product.findMany({
      take: 5,
      orderBy: {
        orderItems: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        _count: { select: { orderItems: true } },
      },
    });

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders,
      topProducts,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ message: 'Алдаа гарлаа' }, { status: 500 });
  }
}
