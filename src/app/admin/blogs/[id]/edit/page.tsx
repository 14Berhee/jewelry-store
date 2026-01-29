import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BlogForm from '../../../../../components/admin/BlogForm';

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const blog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!blog) return notFound();

  return <BlogForm blog={blog} isEdit />;
}
