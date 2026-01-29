// lib/adminAuth.ts
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function verifyAdminAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { error: 'Unauthorized', status: 401 };
    }

    let userId: number;
    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as {
        userId: number;
      };
      userId = decoded.userId;
    } catch {
      return { error: 'Invalid token', status: 401 };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user || user.role !== 'ADMIN') {
      return { error: 'Access denied - Admin only', status: 403 };
    }

    return { user };
  } catch (error) {
    console.error('Admin auth error:', error);
    return { error: 'Authentication failed', status: 500 };
  }
}
