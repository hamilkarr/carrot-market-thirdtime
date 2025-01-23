import Link from 'next/link';
import Image from 'next/image';
import { formatToTimeAgo } from '@/lib/utils';

interface ListProductProps {
  title: string;
  price: number;
  photo: string | null;
  created_at: Date | string;
  id: number;
}

export default function ListProduct({
  title,
  price,
  photo,
  created_at,
  id,
}: ListProductProps) {
  const date = created_at instanceof Date ? created_at : new Date(created_at);

  return (
    <Link href={`/products/${id}`}>
      <div className="flex gap-5">
        {photo && (
          <div className="relative size-28 rounded-md overflow-hidden">
            <Image
              fill
              src={`${photo}/width=100,height=100`}
              alt={title}
              className="object-cover"
              sizes="100px"
            />
          </div>
        )}
        <div className="flex flex-col gap-2 *:text-white">
          <h2 className="text-lg">{title}</h2>
          <p>{formatToTimeAgo(date.toISOString())}</p>
          <p className="text-lg font-semibold">
            {price.toLocaleString('ko-KR')}원
          </p>
        </div>
      </div>
    </Link>
  );
}
