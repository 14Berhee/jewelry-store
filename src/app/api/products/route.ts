import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { title } from 'process';

export async function POST(req: Request) {
  const body = await req.json();

  const { name, price, categoryId, metalId } = body;

  if (!name || !price) {
    return NextResponse.json(
      { error: 'Name and price are required' },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      price,
      title: title,
      categoryId,
      metalId,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
