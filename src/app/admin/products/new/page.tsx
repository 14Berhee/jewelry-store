'use client';

import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import Image from 'next/image';

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface Metal {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminCreateProduct() {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    price: '',
    stock: 0,
    categoryId: 0,
    metalId: 0,
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [metals, setMetals] = useState<Metal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchMetals();
    fetchCategories();
  }, []);

  const fetchMetals = async () => {
    try {
      const res = await fetch('/api/metals');
      if (res.ok) {
        const data = await res.json();
        setMetals(data.metals || []);
      }
    } catch (error) {
      console.error('Error fetching metals:', error);
      setMetals([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const addImageUrlField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrlField = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls.length === 0 ? [''] : newUrls);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validImageUrls = imageUrls.filter((url) => url.trim() !== '');

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          title: formData.title,
          price: formData.price,
          stock: formData.stock,
          categoryId: formData.categoryId > 0 ? formData.categoryId : null,
          metalId: formData.metalId > 0 ? formData.metalId : null,
          availableSizes: selectedSizes,
          images: validImageUrls,
        }),
      });

      if (response.ok) {
        alert('Бүтээгдэхүүн амжилттай үүслээ!');
        window.location.href = '/admin/products';
      } else {
        const error = await response.json();
        alert('Алдаа: ' + (error.message || 'Алдаа гарлаа'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">
        Бүтээгдэхүүн нэмэх
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg bg-white p-4 shadow sm:p-6">
          <h2 className="mb-4 text-lg font-semibold sm:text-xl">
            Үндсэн мэдээлэл
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Нэр</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Дэлгэрэнгүй
              </label>
              <textarea
                rows={4}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Үнэ (₮)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Нөөц</label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Ангилал
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoryId: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                >
                  <option value={0}>Сонгох</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Металл</label>
                <select
                  value={formData.metalId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metalId: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                >
                  <option value={0}>Сонгох</option>
                  {metals.map((metal) => (
                    <option key={metal.id} value={metal.id}>
                      {metal.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow sm:p-6">
          <h2 className="mb-4 text-lg font-semibold sm:text-xl">Зургийн URL</h2>

          <div className="space-y-4">
            <div className="space-y-3">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) =>
                      handleImageUrlChange(index, e.target.value)
                    }
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
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
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <Upload className="h-4 w-4" />
              Зураг нэмэх
            </button>

            {imageUrls.some((url) => url.trim() !== '') && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
        </div>

        <div className="rounded-lg bg-white p-4 shadow sm:p-6">
          <h2 className="mb-4 text-lg font-semibold sm:text-xl">Хэмжээ</h2>
          <div className="flex flex-wrap gap-2">
            {SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  selectedSizes.includes(size)
                    ? 'bg-neutral-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-neutral-900 py-3 text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? 'Уншиж байна...' : 'Хадгалах'}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-lg border border-gray-300 px-6 py-3 hover:bg-gray-50"
          >
            Буцах
          </button>
        </div>
      </form>
    </div>
  );
}
