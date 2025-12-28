'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/src/store/useCartStore';
import { CartPanel } from './cart/CartPanel';

export default function Header({ products }: { products: any[] }) {
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [isCartOpen, setIsCartOpen] = useState(false); // cart panel

  const items = useCartStore((state) => state.items);
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const removeFromCart = useCartStore((s) => s.removeFromCart);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          My Jewelry
        </Link>

        <nav className="hidden items-center space-x-6 md:flex">
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            Home
          </Link>
          <Link href="/products" className="text-gray-700 hover:text-gray-900">
            Products
          </Link>
          <Link
            href="/categories"
            className="text-gray-700 hover:text-gray-900"
          >
            Categories
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative text-gray-700 hover:text-gray-900"
          >
            <ShoppingBag className="h-6 w-6" />
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 rounded-full bg-rose-500 px-2 text-xs text-white">
                {totalQty}
              </span>
            )}
          </button>
        </nav>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="bg-white shadow-md md:hidden">
          <div className="flex flex-col space-y-2 px-4 py-4">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-gray-900"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-gray-700 hover:text-gray-900"
            >
              Categories
            </Link>
          </div>
        </nav>
      )}
      <CartPanel
        products={products ?? []}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 z-40 bg-black/50"
        />
      )}
    </header>
  );
}
