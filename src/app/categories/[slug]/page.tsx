import { getProductsByCategory } from '@/lib/products';

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const products = await getProductsByCategory((await params).slug);

  return (
    <div>
      <h1 className="text-2xl font-bold capitalize">{(await params).slug}</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((product) => (
          <div key={product.id}>
            <p>{product.name}</p>
            {product.images[0] && (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
