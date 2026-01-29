import { prisma } from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminAuth();
  if ('error' in auth) {
    return Response.json({ message: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const productId = parseInt(id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        category: true,
        metal: true,
      },
    });

    if (!product) {
      return Response.json({ message: 'Product not found' }, { status: 404 });
    }

    return Response.json({ product });
  } catch (error) {
    console.error('Fetch product error:', error);
    return Response.json(
      { message: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminAuth();
  if ('error' in auth) {
    return Response.json({ message: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const productId = parseInt(id);
    const body = await request.json();
    const {
      name,
      title,
      price,
      stock,
      categoryId,
      images,
      metalId,
      availableSizes,
    } = body;

    await prisma.productImage.deleteMany({
      where: { productId },
    });

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        title,
        price,
        metalId: metalId || null,
        stock,
        availableSizes,
        categoryId: categoryId || null,
        images: {
          create:
            images?.map((url: string, index: number) => ({
              url,
              order: index,
            })) || [],
        },
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        category: true,
        metal: true,
      },
    });

    return Response.json({ product });
  } catch (error) {
    console.error('Update product error:', error);
    return Response.json(
      { message: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminAuth();
  if ('error' in auth) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const productId = parseInt(id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.deletedAt) {
      return NextResponse.json(
        { message: 'Product already deleted' },
        { status: 400 }
      );
    }

    await prisma.product.update({
      where: { id: productId },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
