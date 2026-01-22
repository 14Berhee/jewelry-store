// app/api/admin/products/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/adminAuth';

// GET - Fetch single product
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
        images: true,
        category: true,
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

// PUT - Update product
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
    const { name, title, price, stock, categoryId, images } = body;

    // Delete existing images and create new ones
    await prisma.productImage.deleteMany({
      where: { productId },
    });

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        title,
        price,
        stock,
        categoryId: categoryId || null,
        images: {
          create: images?.map((url: string) => ({ url })) || [],
        },
      },
      include: {
        images: true,
        category: true,
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

// DELETE - Delete product
export async function DELETE(
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

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return Response.json({ message: 'Product not found' }, { status: 404 });
    }

    // Delete product (images will be deleted automatically with cascade)
    await prisma.product.delete({
      where: { id: productId },
    });

    return Response.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return Response.json(
      { message: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
