'use client';

import { HandThumbUpIcon } from '@heroicons/react/24/solid';
import { HandThumbUpIcon as HandThumbUpIconOutline } from '@heroicons/react/24/outline';
import { useOptimistic } from 'react';
import { dislikePost } from '@/app/posts/[id]/actions';
import { likePost } from '@/app/posts/[id]/actions';
import { startTransition } from 'react';

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (prevState) => {
      return {
        isLiked: !prevState.isLiked,
        likeCount: prevState.isLiked
          ? prevState.likeCount - 1
          : prevState.likeCount + 1,
      };
    },
  );

  const onClickFn = async () => {
    startTransition(() => {
      reducerFn(undefined);
    });
    if (state.isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };

  return (
    <button
      onClick={onClickFn}
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 ${
        state.isLiked
          ? 'bg-orange-600 text-white border-orange-600'
          : 'hover:bg-neutral-800 transition-colors'
      }`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <HandThumbUpIconOutline className="size-5" />
      )}
      {state.isLiked ? (
        <span>{state.likeCount}</span>
      ) : (
        <span>공감하기 ({state.likeCount})</span>
      )}
    </button>
  );
}
