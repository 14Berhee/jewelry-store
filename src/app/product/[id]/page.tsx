import { getSingleProduct } from '@/lib/products';
import { ProductClient } from '@/src/components/productCards/ProductClient';

export const dynamic = 'force-dynamic';
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const product = await getSingleProduct((await params).id);
  if (!product) {
    return <div>Product not found</div>;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold">Product not found</h2>
      </div>
    );
  }

  return <ProductClient product={product} />;
}
