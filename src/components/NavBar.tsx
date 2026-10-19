import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-4xl items-center gap-6 px-6 py-4">
        <Link href="/" className="font-semibold">
          📈 트렌드 대시보드
        </Link>
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
          오늘
        </Link>
        <Link
          href="/reports"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          지난 리포트
        </Link>
      </div>
    </nav>
  );
}
