export interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  productId?: number;
  order?: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  categoryId?: number | null;

  category?: {
    id: number;
    name: string;
    imageUrl?: string;
    slug?: string;
  } | null;
  images: ProductImage[];
  stock?: number;
  sku?: string;
  weight?: number;
  material?: string;
  createdAt?: Date;
  metalId?: number | null;

  metal?: {
    id: number;
    name: string;
    categoryId?: number;
    slug?: string;
  } | null;
  availableSizes?: string[];
  updatedAt?: Date;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export type WishlistItem = Product;
