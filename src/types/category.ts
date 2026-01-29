import { Product } from './product';

export interface Category {
  id: number;
  name: string;
  slug: string;
  products: Product[];
  metals: {
    id: number;
    name: string;
    slug: string;
  }[];
  imageUrl: string;
}
