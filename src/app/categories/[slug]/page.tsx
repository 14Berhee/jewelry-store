import { getProductsByCategory } from '@/lib/products';
import { ProductCard } from '@/src/components/productCards/ProductCard';

export default async function CategoriesPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ metal?: string }>;
}) {
  const { slug } = await params;
  const { metal } = await searchParams;

  const products = await getProductsByCategory(slug, metal);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="mb-8 text-xl font-bold capitalize sm:text-2xl lg:text-3xl">
        {slug} {metal ? `(${metal})` : ''}
      </h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {products.length > 0 ? (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p className="col-span-full py-10 text-center text-gray-500">
            No products found for this filter.
          </p>
        )}
      </div>
    </section>
  );
}
