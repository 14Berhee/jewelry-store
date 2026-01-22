// app/api/admin/products/route.ts
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/adminAuth';

// GET - Fetch all products
export async function GET() {
  const auth = await verifyAdminAuth();
  if ('error' in auth) {
    return Response.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return Response.json({ products });
  } catch (error) {
    console.error('Fetch products error:', error);
    return Response.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: Request) {
  const auth = await verifyAdminAuth();
  if ('error' in auth) {
    return Response.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { name, title, price, stock, categoryId, images } = body;

    // Validate required fields
    if (!name || !title || price === undefined || stock === undefined) {
      return Response.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create product with images
    const product = await prisma.product.create({
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

    return Response.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return Response.json(
      { message: 'Failed to create product' },
      { status: 500 }
    );
  }
}
