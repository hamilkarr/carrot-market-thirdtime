'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export default function CloseButton() {
  const router = useRouter();
  return (
    <button className="absolute top-20 right-20" onClick={() => router.back()}>
      <XMarkIcon className="size-5" />
    </button>
  );
}
