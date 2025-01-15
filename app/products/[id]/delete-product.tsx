'use client';

import deleteProduct from './action';

interface DeleteButtonProps {
  id: number;
}

export default function DeleteButton({ id }: DeleteButtonProps) {
  return (
    <button
      onClick={async () => {
        if (confirm('정말로 이 상품을 삭제하시겠습니까?')) {
          await deleteProduct(id);
        }
      }}
      className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold"
    >
      Delete Product
    </button>
  );
}
