// app/admin/products/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number | null;
  category: {
    id: number;
    name: string;
  } | null;
  images: Array<{
    id: number;
    url: string;
  }>;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch('/api/admin/products', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(productId: number) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setDeleteLoading(productId);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== productId));
        alert('Product deleted successfully!');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete product');
    } finally {
      setDeleteLoading(null);
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-gray-600">Manage your product inventory</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
        >
          <Plus className="h-5 w-5" />
          Add New Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <p className="text-gray-500">
            {searchQuery ? 'No products found' : 'No products yet'}
          </p>
          {!searchQuery && (
            <Link
              href="/admin/products/new"
              className="mt-4 inline-flex items-center gap-2 text-gray-900 hover:underline"
            >
              <Plus className="h-4 w-4" />
              Create your first product
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-lg"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100">
                {product.images[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-400">No image</p>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                  {product.description}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      ₮{product.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </p>
                  </div>
                  {product.category && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {product.category.name}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    target="_blank"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deleteLoading === product.id}
                    className="flex items-center justify-center rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deleteLoading === product.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
