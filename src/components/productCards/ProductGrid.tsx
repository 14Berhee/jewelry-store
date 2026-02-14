import type { Product } from '@/src/types/product';
import { ProductCard } from './ProductCard';

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div key={p.id} className="flex">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
