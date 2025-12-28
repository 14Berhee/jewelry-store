import { Category, Metal, ProductImage } from '@prisma/client';

export interface Product {
  id: number;
  name: string;
  price: number;
  images: ProductImage[];
  category: Category | null;
  metal: Metal | null;
}
