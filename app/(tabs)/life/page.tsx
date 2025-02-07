import db from '@/lib/db';
import { formatToTimeAgo } from '@/lib/utils';
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export const metadata = {
  title: '동네 생활',
};

async function getPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          Comment: true,
          Like: true,
        },
      },
    },
  });
  return posts;
}

export default async function LifePage() {
  const posts = await getPosts();
  return (
    <div className="p-5 flex flex-col gap-5">
      {posts.map((post) => (
        <Link
          href={`/posts/${post.id}`}
          key={post.id}
          className="pb-5 border-b border-neutral-400 flex flex-col gap-2 last:pb-0 last:border-b-0 text-neutral-400"
        >
          <h2 className="text-lg text-white font-semibold">{post.title}</h2>
          <p>{post.description}</p>
          <div className="flex justify-between text-sm">
            <div className="flex gap-4 items-center">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
              <span>·</span>
              <span>조회 {post.views}</span>
            </div>
            <div className="flex gap-4 items-center *:flex *:items-center *:gap-1">
              <span>
                <HandThumbUpIcon className="size-4" /> {post._count.Like}
              </span>
              <span>
                <ChatBubbleBottomCenterIcon className="size-4" />{' '}
                {post._count.Comment}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
