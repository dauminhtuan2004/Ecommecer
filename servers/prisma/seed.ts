import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Áo sơ mi' },
      update: {},
      create: {
        name: 'Áo sơ mi',
        image: 'https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Áo thun' },
      update: {},
      create: {
        name: 'Áo thun',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Quần jeans' },
      update: {},
      create: {
        name: 'Quần jeans',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Giày thể thao' },
      update: {},
      create: {
        name: 'Giày thể thao',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
      },
    }),
  ]);

  console.log('✅ Categories created:', categories.length);

  // Seed Banners
  const banners = await Promise.all([
    prisma.banner.create({
      data: {
        title: 'Bộ Sưu Tập Mùa Hè 2024',
        subtitle: 'Xu hướng thời trang mới nhất',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
        buttonText: 'Khám Phá Ngay',
        link: '/products',
        isActive: true,
        order: 1,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Sale Cuối Năm',
        subtitle: 'Giảm giá lên đến 50%',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050',
        buttonText: 'Mua Ngay',
        link: '/products/sale',
        isActive: true,
        order: 2,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Phong Cách Năng Động',
        subtitle: 'Thể hiện cá tính riêng của bạn',
        image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891',
        buttonText: 'Xem Ngay',
        link: '/products',
        isActive: true,
        order: 3,
      },
    }),
  ]);

  console.log('✅ Banners created:', banners.length);
  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
