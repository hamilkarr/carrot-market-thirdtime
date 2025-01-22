import { PhotoIcon } from '@heroicons/react/24/solid';
import CloseButton from '@/components/close-button';
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import Image from 'next/image';

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: { id },
  });
  if (!product) {
    notFound();
  }
  return product;
}

export default async function Modal({ params }: { params: { id: string } }) {
  const idNumber = parseInt(params.id, 10);
  if (isNaN(idNumber)) notFound();

  const product = await getProduct(idNumber);

  return (
    <div className="absolute w-full h-full bg-black/60 left-0 top-0 z-50 flex justify-center items-center">
      <div className="max-w-screen-sm w-full h-1/2 flex justify-center">
        <CloseButton />
        {product.photo ? (
          <div className="aspect-square bg-neutral-700 text-neutral-200 rounded-md flex justify-center items-center overflow-hidden">
            <Image
              src={`${product.photo}/width=500,height=500`}
              alt={product.title}
              width={500}
              height={500}
            />
          </div>
        ) : (
          <div className="aspect-square bg-neutral-700 text-neutral-200 rounded-md flex justify-center items-center">
            <PhotoIcon className="h-28" />
          </div>
        )}
      </div>
      <div className="text-white mt-4 text-center">
        <h2 className="text-xl font-semibold">{product.title}</h2>
        <p className="text-lg">{product.price.toLocaleString('ko-KR')}원</p>
        <p className="text-sm">
          상품 등록일:&nbsp;
          {new Date(product.created_at).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
}
