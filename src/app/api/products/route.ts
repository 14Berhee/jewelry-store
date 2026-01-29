import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isNew = searchParams.get('new') === 'true';
    const whereClause: Prisma.ProductWhereInput = { deletedAt: null };
    if (isNew) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      whereClause.createdAt = { gte: thirtyDaysAgo };
    }
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        images: { orderBy: { order: 'asc' } },
        metal: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body.name as string;
    const title = body.title as string;
    const price = Number(body.price);
    const stock = Number(body.stock);
    const categoryId = body.categoryId ? Number(body.categoryId) : null;
    const metalId = body.metalId ? Number(body.metalId) : null;
    const availableSizes = body.availableSizes as string[];
    const images = body.images as string[];
    const product = await prisma.product.create({
      data: {
        name,
        title,
        price,
        stock,
        categoryId,
        metalId,
        availableSizes,
        images: { create: images.map((url, index) => ({ url, order: index })) },
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        metal: true,
        category: true,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error('Error creating product:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create product', message },
      { status: 500 }
    );
  }
}
