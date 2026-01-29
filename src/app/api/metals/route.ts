import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const metals = await prisma.metal.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({ metals });
  } catch (error) {
    console.error('Error fetching metals:', error);
    return NextResponse.json({ metals: [] }, { status: 500 });
  }
}
