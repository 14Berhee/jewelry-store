import { getSingleProduct } from '@/lib/products';
import ProductClient from '../../../components/productCards/ProductClient';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const product = await getSingleProduct((await params).id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductClient product={product} />;
}
