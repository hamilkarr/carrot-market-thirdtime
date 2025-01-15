'use server';

import db from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function deleteProduct(id: number) {
  await db.product.delete({ where: { id } });
  redirect('/products');
}
