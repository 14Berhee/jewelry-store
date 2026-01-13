import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { skip } from 'node:test';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.metal.deleteMany();

  console.log('🧹 Cleared existing data...');

  const categoryNames = [
    { name: 'Rings', slug: 'rings' },
    { name: 'Necklaces', slug: 'necklaces' },
    { name: 'Bracelets', slug: 'bracelets' },
    { name: 'Earrings', slug: 'earrings' },
  ];

  await prisma.category.createMany({
    data: categoryNames.map((c) => ({
      name: c.name,
      slug: c.slug,
      imageUrl: `https://cdn.yoursite.com/categories/${c.slug}.jpg`,
    })),
    skipDuplicates: true,
  });

  const metalNames = ['Gold', 'Silver', 'Platinum', 'Rose Gold'];

  await prisma.metal.createMany({
    data: metalNames.map((m) => ({ name: m })),
    skipDuplicates: true,
  });

  const categories = await prisma.category.findMany();
  const metals = await prisma.metal.findMany();

  const getMetalId = (name: string) => metals.find((m) => m.name === name)?.id;

  const getCategoryId = (name: string) =>
    categories.find((c) => c.name === name)?.id;

  // Product data
  const productsData = [
    {
      name: 'Gold Ring Classic',
      price: 299.99,
      categoryId: getCategoryId('Rings'),
      metal: 'Gold',
      images: [
        'https://cdn.yoursite.com/necklace/silver-chain-main.jpg',
        'https://cdn.yoursite.com/necklace/silver-chain-detail.jpg',
      ],
    },
    {
      name: 'Silver Chain Elegant',
      price: 199.99,
      categoryId: getCategoryId('Necklaces'),
      metal: 'Gold',
      images: [
        'https://cdn.yoursite.com/necklace/silver-chain-main.jpg',
        'https://cdn.yoursite.com/necklace/silver-chain-detail.jpg',
      ],
    },
    {
      name: 'Golden Bracelet Stylish',
      price: 249.99,
      categoryId: getCategoryId('Bracelets'),
      metal: 'Gold',
      images: [
        'https://cdn.yoursite.com/bracelet/golden-bracelet-main.jpg',
        'https://cdn.yoursite.com/bracelet/golden-bracelet-detail.jpg',
      ],
    },
  ];

  // Create products with images
  for (const p of productsData) {
    await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        title: p.name,
        categoryId: p.categoryId,
        metalId: getMetalId(p.metal),
        images: {
          create: p.images.map((url, i) => ({ url, order: i })),
        },
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
