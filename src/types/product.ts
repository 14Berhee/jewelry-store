// types/product.ts
export type Product = {
  id: number;
  name: string;
  price: number;
  images: { url: string }[];
  category: string;
};
