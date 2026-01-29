// app/admin/blogs/new/page.tsx (and similar for edit)
// app/admin/blogs/[id]/edit/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Upload,
  Loader2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';

interface BlogFormProps {
  blog?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    published: boolean;
  };
  isEdit?: boolean;
}

export default function BlogForm({ blog, isEdit = false }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(blog?.coverImage || '');

  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    coverImage: blog?.coverImage || '',
    published: blog?.published || false,
  });

  // Auto-generate slug from title with Cyrillic transliteration
  const generateSlug = (title: string) => {
    // Mongolian Cyrillic to Latin transliteration map
    const cyrillicMap: { [key: string]: string } = {
      а: 'a',
      б: 'b',
      в: 'v',
      г: 'g',
      д: 'd',
      е: 'e',
      ё: 'yo',
      ж: 'zh',
      з: 'z',
      и: 'i',
      й: 'y',
      к: 'k',
      л: 'l',
      м: 'm',
      н: 'n',
      о: 'o',
      ө: 'o',
      п: 'p',
      р: 'r',
      с: 's',
      т: 't',
      у: 'u',
      ү: 'u',
      ф: 'f',
      х: 'kh',
      ц: 'ts',
      ч: 'ch',
      ш: 'sh',
      щ: 'shch',
      ъ: '',
      ы: 'y',
      ь: '',
      э: 'e',
      ю: 'yu',
      я: 'ya',
    };

    let slug = title.toLowerCase();

    // Replace Cyrillic characters with Latin equivalents
    slug = slug
      .split('')
      .map((char) => cyrillicMap[char] || char)
      .join('');

    // Remove special characters and replace spaces with hyphens
    slug = slug
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return slug;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      // Only auto-generate slug when creating new posts AND slug hasn't been manually edited
      slug: !isEdit && !prev.slug ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setFormData((prev) => ({ ...prev, coverImage: data.url }));
      setImagePreview(data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/admin/blogs/${blog?.id}` : '/api/admin/blogs';
      const method = isEdit ? 'PUT' : 'POST';

      console.log('Submitting to:', url);
      console.log('Data:', formData);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log('Response:', data);

      if (res.ok) {
        router.push('/admin/blogs');
        router.refresh();
      } else {
        throw new Error(data.error || 'Failed to save blog');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(
        `Failed to save blog post: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Simple formatting helpers
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content;
    const selectedText = text.substring(start, end) || 'text';

    const newText =
      text.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      text.substring(end);
    setFormData((prev) => ({ ...prev, content: newText }));

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/blogs"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blogs
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        <div className="space-y-6 rounded-lg border bg-white p-6">
          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
              placeholder="Enter blog title"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Slug *{' '}
              <span className="font-normal text-gray-500">
                (URL-friendly version)
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={formData.slug}
                onChange={handleSlugChange}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                placeholder="blog-post-url"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    slug: generateSlug(prev.title),
                  }))
                }
                className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Generate
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              URL: /blog/{formData.slug || 'your-slug'}
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Excerpt *
            </label>
            <textarea
              required
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
              placeholder="Brief description for the blog card"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Cover Image
            </label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={imagePreview}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-6 py-4 hover:border-gray-400">
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {imagePreview ? 'Change Image' : 'Upload Cover Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                <div className="text-center text-xs text-gray-500">or</div>

                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => {
                    const url = e.target.value;
                    setFormData((prev) => ({ ...prev, coverImage: url }));
                    setImagePreview(url);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                />
                <p className="text-xs text-gray-500">
                  Paste an image URL or upload a file
                </p>
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Content * (HTML supported)
            </label>

            {/* Formatting Toolbar */}
            <div className="mb-2 flex flex-wrap gap-1 rounded-t-lg border border-b-0 bg-gray-50 p-2">
              <button
                type="button"
                onClick={() => insertFormatting('<h2>', '</h2>')}
                className="rounded px-3 py-1 text-sm hover:bg-gray-200"
                title="Heading 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<h3>', '</h3>')}
                className="rounded px-3 py-1 text-sm hover:bg-gray-200"
                title="Heading 3"
              >
                H3
              </button>
              <div className="w-px bg-gray-300" />
              <button
                type="button"
                onClick={() => insertFormatting('<strong>', '</strong>')}
                className="rounded p-1 hover:bg-gray-200"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<em>', '</em>')}
                className="rounded p-1 hover:bg-gray-200"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </button>
              <div className="w-px bg-gray-300" />
              <button
                type="button"
                onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n</ul>')}
                className="rounded p-1 hover:bg-gray-200"
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<ol>\n  <li>', '</li>\n</ol>')}
                className="rounded p-1 hover:bg-gray-200"
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </button>
              <div className="w-px bg-gray-300" />
              <button
                type="button"
                onClick={() => insertFormatting('<a href="URL">', '</a>')}
                className="rounded p-1 hover:bg-gray-200"
                title="Link"
              >
                <Link2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<img src="URL" alt="', '" />')}
                className="rounded p-1 hover:bg-gray-200"
                title="Image"
              >
                <ImageIcon className="h-4 w-4" />
              </button>
              <div className="w-px bg-gray-300" />
              <button
                type="button"
                onClick={() => insertFormatting('<p>', '</p>')}
                className="rounded px-3 py-1 text-sm hover:bg-gray-200"
                title="Paragraph"
              >
                P
              </button>
              <button
                type="button"
                onClick={() =>
                  insertFormatting('<blockquote>', '</blockquote>')
                }
                className="rounded px-3 py-1 text-sm hover:bg-gray-200"
                title="Quote"
              >
                &ldquo;&rdquo;
              </button>
            </div>

            <textarea
              id="content"
              required
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={20}
              className="w-full rounded-b-lg border border-gray-300 px-4 py-3 font-mono text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
              placeholder="Write your content here. HTML tags are supported for formatting."
            />
            <p className="mt-1 text-xs text-gray-500">
              Use the toolbar buttons to format text or write HTML directly
            </p>
          </div>

          {/* Published Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  published: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
            />
            <label
              htmlFor="published"
              className="text-sm font-medium text-gray-700"
            >
              Publish immediately
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 border-t pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? 'Update Post' : 'Create Post'}
            </button>
            <Link
              href="/admin/blogs"
              className="rounded-lg border px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
