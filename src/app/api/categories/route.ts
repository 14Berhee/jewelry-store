import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    return new Response(JSON.stringify({ categories }), { status: 200 });
  } catch (error) {
    console.error('Fetch categories error:', error);
    return new Response(JSON.stringify({ categories: [] }), { status: 500 });
  }
}
