'use client';

import {
  HomeIcon as SolidHomeIcon,
  NewspaperIcon as SolidNewspaperIcon,
  ChatBubbleOvalLeftIcon as SolidChatIcon,
  VideoCameraIcon as SolidVideoCameraIcon,
  UserIcon as SolidUserIcon,
} from '@heroicons/react/24/solid';
import {
  HomeIcon as OutlineHomeIcon,
  NewspaperIcon as OutlineNewspaperIcon,
  ChatBubbleOvalLeftIcon as OutlineChatIcon,
  VideoCameraIcon as OutlineVideoCameraIcon,
  UserIcon as OutlineUserIcon,
} from '@heroicons/react/24/outline';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TabBar = () => {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 w-full mx-auto max-w-screen-md grid grid-cols-5 bg-neutral-800 border-neutral-600 border-t px-5 py-3 *:text-white">
      <Link href="/products" className="flex flex-col items-center gap-1">
        {pathname === '/products' ? (
          <SolidHomeIcon className="size-7" />
        ) : (
          <OutlineHomeIcon className="size-7" />
        )}
        <span>홈</span>
      </Link>
      <Link href="/life" className="flex flex-col items-center gap-1">
        {pathname === '/life' ? (
          <SolidNewspaperIcon className="size-7" />
        ) : (
          <OutlineNewspaperIcon className="size-7" />
        )}
        <span>동네 생활</span>
      </Link>
      <Link href="/live" className="flex flex-col items-center gap-1">
        {pathname === '/live' ? (
          <SolidVideoCameraIcon className="size-7" />
        ) : (
          <OutlineVideoCameraIcon className="size-7" />
        )}
        <span>라이브</span>
      </Link>
      <Link href="/chat" className="flex flex-col items-center gap-1">
        {pathname === '/chat' ? (
          <SolidChatIcon className="size-7" />
        ) : (
          <OutlineChatIcon className="size-7" />
        )}
        <span>채팅</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-1">
        {pathname === '/profile' ? (
          <SolidUserIcon className="size-7" />
        ) : (
          <OutlineUserIcon className="size-7" />
        )}
        <span>나의 당근</span>
      </Link>
    </div>
  );
};

export default TabBar;
