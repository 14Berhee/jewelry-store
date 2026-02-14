import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getCategoriesWithMetals } from '@/lib/categories';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategoriesWithMetals();
  return (
    <html lang="en">
      <script
        src="https://upload-widget.cloudinary.com/global/all.js"
        type="text/javascript"
        async
      />
      <body className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
        <Header categories={categories} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
