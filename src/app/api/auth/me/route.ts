import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return Response.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    return Response.json(user);
  } catch (err) {
    console.error('Auth check error:', err);
    return Response.json({ message: 'Invalid token' }, { status: 401 });
  }
}
