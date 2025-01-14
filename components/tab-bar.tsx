import { HomeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const TabBar = () => {
  return (
    <div>
      <Link href="/products">
        <HomeIcon className="size-7" />
        <span>홈</span>
      </Link>
      <Link href="/life">
        <HomeIcon className="size-7" />
        <span>동네 생활</span>
      </Link>
      <Link href="/live">
        <HomeIcon className="size-7" />
        <span>라이브</span>
      </Link>
      <Link href="/chat">
        <HomeIcon className="size-7" />
        <span>채팅</span>
      </Link>
      <Link href="/profile">
        <HomeIcon className="size-7" />
        <span>나의 당근</span>
      </Link>
    </div>
  );
};

export default TabBar;
