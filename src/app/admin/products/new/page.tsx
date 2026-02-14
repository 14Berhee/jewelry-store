'use client';

import { useState, useEffect } from 'react';
import {
  CloudinaryUploadWidget,
  CloudinaryImage,
} from '../../../../components/Cloudinaryuploadwidget';

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface Metal {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface FormData {
  name: string;
  title: string;
  price: string;
  stock: number;
  categoryId: number;
  metalId: number;
}

export default function AdminCreateProduct() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    title: '',
    price: '',
    stock: 0,
    categoryId: 0,
    metalId: 0,
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [images, setImages] = useState<CloudinaryImage[]>([]);
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

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Бүтээгдэхүүний нэрийг оруулна уу');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Үнэ оруулна уу');
      return;
    }

    if (images.length === 0) {
      alert('Дор хаяж 1 зураг оруулна уу');
      return;
    }

    setLoading(true);

    try {
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
          images: images.map((img, index) => ({
            url: img.url,
            publicId: img.publicId,
            width: img.width,
            height: img.height,
            format: img.format,
            bytes: img.bytes,
            originalFilename: img.originalFilename,
            isPrimary: index === 0, // First image is primary
            displayOrder: index,
          })),
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Бүтээгдэхүүн нэмэх</h1>
        <p className="mt-1 text-sm text-gray-600">
          Шинэ бүтээгдэхүүн үүсгэх болон зураг оруулах
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-lg bg-white p-4 shadow sm:p-6">
          <h2 className="mb-4 text-lg font-semibold sm:text-xl">
            Үндсэн мэдээлэл
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Нэр <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                placeholder="Бүтээгдэхүүний нэр"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Дэлгэрэнгүй
              </label>
              <textarea
                rows={4}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                placeholder="Бүтээгдэхүүний тайлбар"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Үнэ (₮) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  inputMode="numeric"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Нөөц <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
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
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Металл
                </label>
                <select
                  value={formData.metalId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metalId: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
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

        {/* Images Section */}
        <div className="rounded-lg bg-white p-4 shadow sm:p-6">
          <h2 className="mb-4 text-lg font-semibold sm:text-xl">
            Зургууд <span className="text-red-500">*</span>
          </h2>
          <CloudinaryUploadWidget
            onImagesChange={setImages}
            initialImages={images}
            maxImages={10}
            folder="products"
            useOriginalFilename={false}
          />
        </div>

        {/* Sizes Section */}
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
          {selectedSizes.length > 0 && (
            <p className="mt-2 text-xs text-gray-600">
              Сонгосон: {selectedSizes.join(', ')}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-neutral-900 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Хадгалж байна...' : 'Хадгалах'}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Буцах
          </button>
        </div>
      </form>
    </div>
  );
}
