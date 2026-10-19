import Link from "next/link";
import { listReportDates } from "@/lib/getReports";

export default async function ReportsListPage() {
  const dates = await listReportDates();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">지난 리포트</h1>
      {dates.length === 0 ? (
        <p className="text-sm text-zinc-500">아직 저장된 리포트가 없습니다.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {dates.map((date) => (
            <li key={date} className="py-3">
              <Link href={`/reports/${date}`} className="font-medium hover:underline">
                {date}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
