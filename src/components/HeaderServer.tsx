import Header from './Header';
import { getCategoriesWithMetals } from '@/lib/categories';

export default async function HeaderServer() {
  const categories = await getCategoriesWithMetals();
  return <Header categories={categories} />;
}
