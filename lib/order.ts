// lib/order.ts
import { prisma } from './prisma';

export async function getSingleOrder(id: number) {
  return prisma.order.findUnique({
    where: { id: id },
    include: {
      items: {
        include: {
          product: {
            include: {
              metal: true,
              category: true,
            },
          },
        },
      },
    },
  });
}
