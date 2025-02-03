import ProductList from '@/components/product-list';
import db from '@/lib/db';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Prisma } from '@prisma/client';
import { revalidatePath, unstable_cache } from 'next/cache';
import Link from 'next/link';

const getCashedProducts = unstable_cache(
  getInitialProducts,
  ['home-products'],
  {
    revalidate: 60,
  },
);

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      photo: true,
      created_at: true,
      id: true,
    },
    // take: 1,
    orderBy: {
      created_at: 'desc',
    },
  });
  return products;
}

export type initialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export const metadata = {
  title: 'Products',
};

export const dynamic = 'force-dynamic';

export default async function Products() {
  const initialProducts = await getCashedProducts();
  const revalidate = async () => {
    'use server';
    revalidatePath('/products');
  };
  return (
    <div>
      <form action={revalidate}>
        <button type="submit">revalidate</button>
      </form>
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/products/add"
        className="bg-orange-500 flex items-center justify-center size-16 rounded-full fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400 active:scale-95"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
