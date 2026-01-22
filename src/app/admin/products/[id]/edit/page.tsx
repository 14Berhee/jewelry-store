'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  title: string;
  price: number;
  stock: number;
  categoryId: number | null;
  images: Array<{
    id: number;
    url: string;
  }>;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    price: '',
    stock: '',
    categoryId: '',
  });

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  // Fetch product data
  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        const product: Product = data.product;

        setFormData({
          name: product.name,
          title: product.title,
          price: product.price.toString(),
          stock: product.stock.toString(),
          categoryId: product.categoryId?.toString() || '',
        });

        setImageUrls(
          product.images.length > 0
            ? product.images.map((img) => img.url)
            : ['']
        );
      } else {
        alert('Product not found');
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      alert('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [productId, router]);

  // Load categories and product on mount
  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [fetchCategories, fetchProduct]);

  // Form input change
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

  // Image URL handlers
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

  // Form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const validImageUrls = imageUrls.filter((url) => url.trim() !== '');

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
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
        alert('Product updated successfully!');
        router.push('/admin/products');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Update product error:', error);
      alert('Failed to update product');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="rounded-lg p-2 hover:bg-gray-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="mt-1 text-gray-600">Update product information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow">
        <div className="space-y-6">
          {/* Name */}
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
            />
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title *
            </label>
            <textarea
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
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

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Images
            </label>
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

          {/* Submit / Cancel */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
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
