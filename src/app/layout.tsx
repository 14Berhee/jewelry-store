import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import prisma from '@/lib/prisma';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = await prisma.product.findMany({
    include: { images: true, metal: true, category: true },
  });

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
        <Header products={products} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
