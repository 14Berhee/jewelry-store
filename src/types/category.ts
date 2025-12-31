import { Product } from './product';

export interface Category {
  id: number;
  name: string;
  slug: string;
  products: Product[];
  imageURL: string;
}
