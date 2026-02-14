import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { revalidatePath } from 'next/cache';

interface ImageInput {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  originalFilename?: string;
  isPrimary: boolean;
  order: number;
}

interface ProductInput {
  name: string;
  title: string;
  price: number | string;
  stock: number | string;
  categoryId?: number | string | null;
  metalId?: number | string | null;
  availableSizes: string[];
  images: ImageInput[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isNew = searchParams.get('new') === 'true';
    const auth = await verifyAdminAuth();

    if ('error' in auth) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const whereConditions = {
      deletedAt: null,
      ...(isNew
        ? {
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          }
        : {}),
    };

    const products = await prisma.product.findMany({
      where: whereConditions,
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
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const rawData: unknown = await request.json();

    if (!rawData || typeof rawData !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const body = rawData as ProductInput;

    if (!body.name || !body.title || body.price == null || body.stock == null) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.availableSizes) || !Array.isArray(body.images)) {
      return NextResponse.json({ error: 'Invalid arrays' }, { status: 400 });
    }

    if (body.images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

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
          create: body.images.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            width: img.width,
            height: img.height,
            format: img.format,
            bytes: img.bytes,
            originalFilename: img.originalFilename,
            isPrimary: img.isPrimary,
            order: img.order,
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
  } catch (err) {
    console.error('Error creating product:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await verifyAdminAuth();
    if ('error' in auth) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const rawData: unknown = await request.json();
    const body = rawData as ProductInput & { id: number };

    if (!body.id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id: Number(body.id) },
        data: {
          name: body.name,
          title: body.title,
          price: Number(body.price),
          stock: Number(body.stock),
          categoryId: body.categoryId ? Number(body.categoryId) : null,
          metalId: body.metalId ? Number(body.metalId) : null,
          availableSizes: body.availableSizes,
        },
      });

      if (body.images && Array.isArray(body.images)) {
        const oldImages = await tx.productImage.findMany({
          where: { productId: updated.id },
        });

        await tx.productImage.deleteMany({
          where: { productId: updated.id },
        });

        if (oldImages.length > 0) {
          console.log(
            'Images queued for manual Cloudinary cleanup:',
            oldImages.map((img) => img.publicId)
          );
        }

        await tx.productImage.createMany({
          data: body.images.map((img) => ({
            productId: updated.id,
            url: img.url,
            publicId: img.publicId,
            width: img.width,
            height: img.height,
            format: img.format,
            bytes: img.bytes,
            originalFilename: img.originalFilename,
            isPrimary: img.isPrimary,
            order: img.order,
          })),
        });
      }

      return await tx.product.findUnique({
        where: { id: updated.id },
        include: {
          images: { orderBy: { order: 'asc' } },
          metal: true,
          category: true,
        },
      });
    });

    return NextResponse.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAdminAuth();
    if ('error' in auth) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const id = request.nextUrl.searchParams.get('id');
    if (!id)
      return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const images = await prisma.productImage.findMany({
      where: { productId: Number(id) },
    });

    await prisma.product.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath(`/products/${id}`);
    revalidatePath('/categories/[slug]', 'page');

    if (images.length > 0) {
      try {
        const cloudinary = await import('cloudinary').then((m) => m.v2);
        cloudinary.config({
          cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        await Promise.allSettled(
          images.map((img) => {
            if (img.publicId) {
              return cloudinary.uploader.destroy(img.publicId);
            }
            return Promise.resolve();
          })
        );
      } catch (cloudinaryError) {
        console.error('Cloudinary cleanup failed:', cloudinaryError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Product moved to trash',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
