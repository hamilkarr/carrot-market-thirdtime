import Link from "next/link";

const Home = () => {
  return (
    <main className="flex flex-col items-center justify-between h-screen p-5">
      <div className='my-auto flex flex-col items-center gap-'>
        <span className="text-6xl">🥕</span>
        <h1 className="text-4xl">당근</h1>
        <h2 className="text-2xl">당근 마텟에 어서오세요!</h2>
      </div>
      <div className="flex flex-col items-center gap-2 w-full">
        <Link href="/create-account" className="primary-btn py-2.5 text-lg">시작하기</Link>
        <div className="flex items-center gap-2">
          <span>이미 계정이 있나요?</span>
          <Link href="/login" className="hover:underline underline-offset-2">로그인</Link>
        </div>
      </div>
    </main>
  )
};

export default Home;
