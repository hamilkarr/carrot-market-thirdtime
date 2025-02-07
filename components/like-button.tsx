import { HandThumbUpIcon } from '@heroicons/react/24/solid';
import { HandThumbUpIcon as HandThumbUpIconOutline } from '@heroicons/react/24/outline';

export default function LikeButton({
  isLiked,
  likeCount,
}: {
  isLiked: boolean;
  likeCount: number;
}) {
  return (
    <button
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 ${
        isLiked
          ? 'bg-orange-600 text-white border-orange-600'
          : 'hover:bg-neutral-800 transition-colors'
      }`}
    >
      {isLiked ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <HandThumbUpIconOutline className="size-5" />
      )}
      {isLiked ? <span>{likeCount}</span> : <span>공감하기 ({likeCount})</span>}
    </button>
  );
}
