import { Key } from 'react';
export type CartProductItem = {
  [x: string]: Key | null | undefined;
  productId: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};
