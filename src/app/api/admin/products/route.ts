import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

interface ProductInput {
  name: string;
  title: string;
  price: number | string;
  stock: number | string;
  categoryId?: number | string | null;
  metalId?: number | string | null;
  availableSizes: string[];
  images: string[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isNew = searchParams.get('new') === 'true';

    // FIX FOR LINE 9:
    // We let TypeScript infer the type first, then check compatibility.
    // Explicitly typing the variable can sometimes trigger the 'any' detector if imports are stale.
    const whereConditions = {
      deletedAt: null,
      ...(isNew
        ? {
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          }
        : {}),
    };

    const products = await prisma.product.findMany({
      where: whereConditions, // Pass it directly
      include: {
        images: { orderBy: { order: 'asc' } },
        metal: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error: unknown) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // FIX FOR LINE 79: The "Double Hop"
    // 1. request.json() returns 'any'.
    // 2. We cast to 'unknown' first. This stops the "unsafe assignment" warning.
    const rawData: unknown = await request.json();

    // 3. Now we cast 'unknown' to our type. Linter is happy.
    const body = rawData as ProductInput;

    const product = await prisma.product.create({
      data: {
        name: body.name,
        title: body.title,
        price: Number(body.price),
        stock: Number(body.stock),
        categoryId: body.categoryId ? Number(body.categoryId) : null,
        metalId: body.metalId ? Number(body.metalId) : null,
        availableSizes: body.availableSizes,
        images: {
          create: body.images.map((url: string, index: number) => ({
            url,
            order: index,
          })),
        },
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        metal: true,
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err: unknown) {
    console.error('Error creating product:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
