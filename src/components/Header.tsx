'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useCartStore } from '@/src/store/useCartStore';
import { CartPanel } from './cart/CartPanel';

interface ProductImage {
  url: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  images: ProductImage[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  products: Product[];
}

export default function Header({
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userName, setUserName] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const items = useCartStore((state) => state.cartItemsLocal);
  const totalQty = items.reduce(
    (sum: number, i: { quantity: number }) => sum + i.quantity,
    0
  );

  const checkAuthStatus = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const displayName =
          data?.name?.trim() || data?.email?.split('@')[0] || 'Хэрэглэгч';

        setIsLoggedIn(true);
        setUserName(displayName);
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.warn('Auth check timed out');
      } else {
        console.error('Auth check failed:', err);
      }
      setIsLoggedIn(false);
      setUserName('');
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAuthStatus();
    }, 100);

    const handleVisibilityChange = () => {
      if (!document.hidden) checkAuthStatus();
    };

    const handleFocus = () => checkAuthStatus();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [pathname, checkAuthStatus]);

  async function handleLogout() {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        setIsLoggedIn(false);
        setUserName('');
        setShowUserDropdown(false);
        router.push('/');
        router.refresh();
      } else {
        alert('Гарахад алдаа гарлаа');
      }
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Сүлжээний алдаа гарлаа');
    }
  }

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

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              onBlur={() => setTimeout(() => setIsOpen(false), 150)}
              className="flex items-center gap-1 text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              Categories
              <svg
                className={`h-4 w-4 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isOpen && (
              <ul className="absolute right-0 z-50 mt-2 w-48 rounded bg-white text-gray-800 shadow-lg">
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

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

          {isLoggedIn === null ? (
            // Loading skeleton while checking auth
            <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
          ) : isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span>{userName}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${
                    showUserDropdown ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    Миний мэдээлэл
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    Миний захиалга
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                  >
                    Гарах
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/signin"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Нэвтрэх
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Бүртгүүлэх
              </Link>
            </div>
          )}
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

            {isLoggedIn ? (
              <>
                <hr className="my-2" />
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Миний мэдээлэл
                </Link>
                <Link
                  href="/orders"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Миний захиалга
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-red-600 hover:text-red-700"
                >
                  Гарах
                </button>
              </>
            ) : (
              <>
                <hr className="my-2" />
                <Link
                  href="/signin"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Нэвтрэх
                </Link>
                <Link
                  href="/signup"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Бүртгүүлэх
                </Link>
              </>
            )}
          </div>
        </nav>
      )}

      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {(isCartOpen || showUserDropdown) && (
        <div
          onClick={() => {
            setIsCartOpen(false);
            setShowUserDropdown(false);
          }}
          className="fixed inset-0 z-40 bg-black/50"
        />
      )}
    </header>
  );
}
