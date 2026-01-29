'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  User,
  Package,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useCartStore } from '@/src/store/useCartStore';
import { CartPanel } from './cart/CartPanel';
import { WishlistButton } from './WishListButton';

interface Metal {
  id: number;
  name: string;
  slug: string;
}
interface Category {
  id: number;
  name: string;
  slug: string;
  metals: Metal[];
}

export default function Header({ categories }: { categories: Category[] }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userName, setUserName] = useState('');
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const items = useCartStore((state) => state.cartItemsLocal);
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setUserName(data?.name || 'User');
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();

    checkAuthStatus();
    window.addEventListener('focus', checkAuthStatus);
    return () => window.removeEventListener('focus', checkAuthStatus);
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsShopMenuOpen(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsLoggedIn(false);
    setUserName('');
    router.refresh();
    router.push('/');
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${
          scrolled
            ? 'border-gray-200/80 bg-white/95 shadow-sm backdrop-blur-xl'
            : 'border-gray-100 bg-white/90 backdrop-blur-xl'
        }`}
      >
        <div className="container mx-auto flex h-14 items-center justify-between px-4 lg:h-16 lg:px-8">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="group -ml-2 rounded-lg p-1.5 transition-colors hover:bg-rose-50 md:hidden md:p-2"
            >
              <Menu className="h-5 w-5 text-gray-700 transition-colors group-hover:text-rose-600" />
            </button>
            <Link
              href="/"
              className="group flex items-center gap-1 text-base font-black tracking-tight text-gray-900 transition-all hover:text-rose-600 md:gap-1.5 md:text-xl"
            >
              <Sparkles className="h-4 w-4 text-rose-600 transition-transform group-hover:scale-110 md:h-5 md:w-5" />
              LUME
            </Link>
          </div>

          <nav className="hidden h-full items-center gap-8 md:flex">
            <Link
              href="/"
              className="group relative py-1 text-sm font-semibold text-gray-600 transition-colors hover:text-rose-600"
            >
              НҮҮР
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-rose-600 transition-all duration-300 group-hover:w-full" />
            </Link>

            <div
              className="group h-full"
              onMouseEnter={() => setIsShopMenuOpen(true)}
              onMouseLeave={() => setIsShopMenuOpen(false)}
            >
              <button
                className={`relative flex h-full items-center gap-1 text-sm font-semibold transition-colors ${
                  isShopMenuOpen
                    ? 'text-rose-600'
                    : 'text-gray-600 hover:text-rose-600'
                }`}
              >
                КАТАЛОГ{' '}
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isShopMenuOpen ? 'rotate-180' : ''
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-rose-600 transition-all duration-300 ${
                    isShopMenuOpen ? 'w-full' : 'w-0'
                  }`}
                />
              </button>
              {isShopMenuOpen && (
                <div className="animate-in fade-in slide-in-from-top-2 absolute top-16 left-0 w-full border-b border-gray-100 bg-white shadow-2xl duration-200">
                  <div className="container mx-auto grid grid-cols-2 gap-10 px-12 py-12 lg:grid-cols-4">
                    {categories.map((cat) => (
                      <div key={cat.id} className="group/cat">
                        <Link
                          href={`/categories/${cat.slug}`}
                          className="mb-4 flex items-center gap-2 text-sm font-bold tracking-widest text-gray-900 uppercase transition-colors group-hover/cat:text-rose-600"
                        >
                          <span className="h-px w-4 bg-rose-600 transition-all group-hover/cat:w-6" />{' '}
                          {cat.name}
                        </Link>
                        <ul className="space-y-2">
                          {cat.metals?.map((metal) => (
                            <li key={metal.id}>
                              <Link
                                href={`/categories/${cat.slug}?metal=${metal.slug}`}
                                className="group/link flex items-center gap-2 text-sm text-gray-600 transition-all hover:translate-x-1 hover:text-rose-600"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-gray-300 transition-all group-hover/link:bg-rose-600" />{' '}
                                {metal.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="group relative flex items-center gap-1.5 py-1 text-sm font-semibold text-gray-600 transition-colors hover:text-rose-600"
            >
              <span className="relative">
                БЛОГ
                <span className="absolute -top-1 -right-3 flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                </span>
              </span>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-rose-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          <div className="flex items-center gap-1.5 md:gap-4">
            <div className="hidden items-center md:flex">
              {isLoggedIn === null ? (
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-100" />
              ) : isLoggedIn ? (
                <div className="group relative">
                  <button className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50">
                    <User className="h-5 w-5 text-gray-700 transition-colors group-hover:text-rose-600" />
                  </button>
                  <div className="invisible absolute top-full right-0 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                    <div className="w-52 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5">
                      <div className="bg-rose-50/50 px-4 py-3">
                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                          Тавтай морил
                        </p>
                        <p className="truncate text-sm font-black text-gray-900">
                          {userName}
                        </p>
                      </div>
                      <div className="p-1.5">
                        <Link
                          href="/orders"
                          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Package size={16} /> Миний захиалгууд
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
                        >
                          <LogOut size={16} /> Гарах
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white px-5 text-sm font-bold text-gray-700 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                >
                  <User size={16} /> Нэвтрэх
                </Link>
              )}
            </div>

            <WishlistButton />

            <button
              onClick={() => setIsCartOpen(true)}
              className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50 md:h-11 md:w-11"
            >
              <ShoppingBag className="h-4 w-4 text-gray-700 transition-colors group-hover:text-rose-600 md:h-4.5 md:w-4.5" />
              {totalQty > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-[9px] font-bold text-white shadow-lg ring-2 ring-white md:h-5 md:w-5 md:text-[10px]">
                  {totalQty > 9 ? '9+' : totalQty}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="animate-in slide-in-from-left absolute left-0 h-full w-[85%] max-w-sm bg-white shadow-2xl duration-300">
            <div className="flex h-12 items-center justify-between border-b border-gray-100 bg-gradient-to-r from-rose-50 to-white px-4">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-rose-600" />
                <span className="text-base font-black tracking-tight uppercase">
                  Цэс
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg p-1.5 hover:bg-white"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="h-[calc(100%-120px)] overflow-y-auto px-4 py-4">
              <nav className="space-y-0.5">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-base font-black text-gray-900 transition-colors hover:text-rose-600"
                >
                  НҮҮР
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-base font-black text-gray-900 transition-colors hover:text-rose-600"
                >
                  БЛОГ
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                  </span>
                </Link>

                <div className="space-y-2 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
                    <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase">
                      Collections
                    </p>
                    <span className="h-px flex-1 bg-gradient-to-l from-gray-200 to-transparent" />
                  </div>
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="overflow-hidden rounded-lg border border-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-sm"
                    >
                      <button
                        onClick={() =>
                          setMobileExpanded(
                            mobileExpanded === cat.id ? null : cat.id
                          )
                        }
                        className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-bold transition-colors"
                      >
                        {cat.name}
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-300 ${
                            mobileExpanded === cat.id
                              ? 'rotate-180 text-rose-600'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                      {mobileExpanded === cat.id && (
                        <div className="animate-in fade-in slide-in-from-top-2 border-t border-gray-100 bg-white px-3 pt-1.5 pb-3">
                          <Link
                            href={`/categories/${cat.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="mb-1.5 flex items-center gap-1.5 text-xs font-bold tracking-wider text-rose-600 uppercase"
                          >
                            View All <ChevronRight className="h-2.5 w-2.5" />
                          </Link>
                          <div className="space-y-1">
                            {cat.metals?.map((metal) => (
                              <Link
                                key={metal.id}
                                href={`/categories/${cat.slug}?metal=${metal.slug}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-1.5 rounded-lg py-1.5 text-xs font-medium text-gray-600"
                              >
                                <span className="h-1 w-1 rounded-full bg-gray-300" />{' '}
                                {metal.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </nav>
            </div>

            <div className="absolute bottom-0 w-full border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <p className="text-[10px] font-bold tracking-tight text-gray-400 uppercase">
                      Нэвтэрсэн:
                    </p>
                    <p className="truncate text-xs font-black text-gray-900">
                      {userName}
                    </p>
                  </div>
                  <Link
                    href="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-700 transition-colors active:bg-gray-50"
                  >
                    <Package size={14} /> Миний захиалгууд
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl border border-red-100 bg-red-50/50 py-2.5 text-xs font-bold text-red-600 transition-colors active:bg-red-100"
                  >
                    Гарах
                  </button>
                </div>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 py-3 text-sm font-black text-white shadow-lg active:scale-[0.98]"
                >
                  Нэвтрэх
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
