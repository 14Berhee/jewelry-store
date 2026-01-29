// app/blog/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';

export const metadata = {
  title: 'Jewelry Blog | Latest Articles & Guides',
  description:
    'Explore our collection of jewelry articles, styling guides, and industry insights.',
};

export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Jewelry Blog
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Discover the latest trends, care tips, and stories behind exquisite
          jewelry pieces
        </p>
      </div>

      {/* Blog Grid */}
      {blogs.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-gray-500">
            No blog posts available yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`} className="group">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="mb-3 line-clamp-2 text-xl font-semibold text-gray-900 group-hover:text-gray-700">
                    {blog.title}
                  </h2>

                  <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-600">
                    {blog.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <time
                      className="text-xs text-gray-500"
                      dateTime={blog.createdAt.toISOString()}
                    >
                      {formatDistanceToNow(blog.createdAt, { addSuffix: true })}
                    </time>
                    <span className="text-sm font-medium text-gray-900 group-hover:underline">
                      Read more →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
