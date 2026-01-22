// app/admin/products/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: number;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    price: '',
    stock: '',
    categoryId: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleImageUrlChange(index: number, value: string) {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  }

  function addImageUrlField() {
    setImageUrls([...imageUrls, '']);
  }

  function removeImageUrlField(index: number) {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls.length === 0 ? [''] : newUrls);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const validImageUrls = imageUrls.filter((url) => url.trim() !== '');

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          categoryId: formData.categoryId
            ? parseInt(formData.categoryId)
            : null,
          images: validImageUrls,
        }),
      });

      if (res.ok) {
        alert('Product created successfully!');
        router.push('/admin/products');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Create product error:', error);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="rounded-lg p-2 hover:bg-gray-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="mt-1 text-gray-600">
            Create a new product for your store
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow">
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
              placeholder="e.g., Gold Necklace"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              title *
            </label>
            <textarea
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
              placeholder="Describe your product..."
            />
          </div>

          {/* Price & Stock */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price (₮) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700"
              >
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
                placeholder="0"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Images
            </label>
            <p className="mt-1 text-sm text-gray-500">
              Add image URLs for your product
            </p>

            <div className="mt-3 space-y-3">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) =>
                      handleImageUrlChange(index, e.target.value)
                    }
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageUrlField(index)}
                      className="rounded-lg border border-red-300 px-3 py-2 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addImageUrlField}
              className="mt-3 flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <Upload className="h-4 w-4" />
              Add another image
            </button>

            {/* Image Preview */}
            {imageUrls.some((url) => url.trim() !== '') && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {imageUrls
                  .filter((url) => url.trim() !== '')
                  .map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                    >
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <Link
              href="/admin/products"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
