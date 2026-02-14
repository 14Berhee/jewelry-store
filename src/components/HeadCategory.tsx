'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export type ProductCategory = {
  id: number | string;
  name: string;
  slug: string;
  imageUrl: string;
};

interface HeadCategoryProps {
  categories?: ProductCategory[];
}

export default function HeadCategory({ categories = [] }: HeadCategoryProps) {
  if (!categories || categories.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <div className="rounded-3xl border-2 border-dashed border-neutral-200 py-12">
          <p className="font-medium text-neutral-500">
            No categories available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      className="mx-auto max-w-6xl px-6 py-16 md:py-24"
      aria-labelledby="category-heading"
    >
      <div className="mb-12 flex items-end justify-between">
        <div className="space-y-2">
          <h2
            id="category-heading"
            className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl"
          >
            Shop by categories
          </h2>
          <p className="text-lg text-neutral-500">
            Everything you need, organized by what you love.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={`/categories/${cat.slug}`}
              className="group relative flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-neutral-100 shadow-sm ring-1 ring-neutral-200/50">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                  priority={index < 4}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              <div className="mt-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-800 transition-colors group-hover:text-black">
                  {cat.name}
                </h3>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-50 transition-colors group-hover:bg-black group-hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
