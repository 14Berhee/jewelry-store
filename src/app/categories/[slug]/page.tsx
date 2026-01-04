import { getProductsByCategory } from '@/lib/products';
import { ProductCard } from '@/src/components/productCards/ProductCard';

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const products = await getProductsByCategory((await params).slug);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="py-14 text-2xl font-bold capitalize">
        {(await params).slug}
      </h1>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
