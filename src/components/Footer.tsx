import Link from 'next/link';
import { Diamond } from 'lucide-react';

type SvgProps = React.SVGProps<SVGSVGElement>;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const SocialIcons = {
    Facebook: (props: SvgProps) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
    Instagram: (props: SvgProps) => (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        {...props}
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  };

  return (
    <footer className="w-full border-t border-white/5 bg-gray-950 text-gray-300">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <Diamond className="h-6 w-6 text-amber-500" />
              <h2 className="font-serif text-xl font-bold tracking-widest text-white uppercase">
                LUME
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Хамгийн нандин зүйлс үргэлж нүдэнд үл үзэгдэх жижиг хэсэгтээ
              нуугддаг. Зөвхөн танд л зориулсан онцгой урлал.
            </p>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold tracking-wider text-white uppercase">
              Категориуд
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/categories/rings"
                  className="transition-colors hover:text-amber-500"
                >
                  Rings
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/earrings"
                  className="transition-colors hover:text-amber-500"
                >
                  Earrings
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/necklaces"
                  className="transition-colors hover:text-amber-500"
                >
                  Necklaces
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/bracelets"
                  className="transition-colors hover:text-amber-500"
                >
                  Bracelets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold tracking-wider text-white uppercase">
              Тусламж
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/shipping"
                  className="transition-colors hover:text-amber-500"
                >
                  Хүргэлт ба буцаалт
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/altan-edlel-kherkhen-archilakh-ve"
                  className="transition-colors hover:text-amber-500"
                >
                  Алтан эдлэл хэрхэн арчилах вэ?
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-amber-500"
                >
                  Бидэнтэй холбогдох
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 text-sm font-semibold tracking-wider text-white uppercase">
              Бидэнтэй нэгдээрэй
            </h3>
            <div className="flex space-x-5">
              <a
                href="https://www.instagram.com/berh.bat  "
                className="transition-transform hover:scale-110 hover:text-white"
                aria-label="Instagram"
              >
                <SocialIcons.Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/enkhbold.berhee"
                className="transition-transform hover:scale-110 hover:text-white"
                aria-label="Facebook"
              >
                <SocialIcons.Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs font-medium tracking-tighter text-gray-500 uppercase md:flex-row">
          <p>&copy; {currentYear} LUME. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
