import { Link } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 w-full bg-gray-900 text-gray-200">
      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 md:grid-cols-3">
        {/* Logo / Brand */}
        <div>
          <h2 className="text-xl font-bold text-white">My Jewelry</h2>
          <p className="mt-2 text-gray-400">
            Quality rings, chains, and earrings.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">Quick Links</h3>
          <ul>
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-white">
                Products
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-white">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white">
                Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white">
              Instagram
            </a>
            <a href="#" className="hover:text-white">
              Facebook
            </a>
            <a href="#" className="hover:text-white">
              Twitter
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} My Jewelry. All rights reserved.
      </div>
    </footer>
  );
}
