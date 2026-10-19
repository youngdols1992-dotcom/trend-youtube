import ReportView from "@/components/ReportView";
import { getLatestReport } from "@/lib/getReports";

export default async function Home() {
  const report = await getLatestReport();

  if (!report) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold">아직 생성된 리포트가 없습니다</h1>
        <p className="text-sm text-zinc-500">
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">npm run fetch:daily</code>{" "}
          를 실행하면 오늘 리포트가 생성됩니다.
        </p>
      </div>
    );
  }

  return <ReportView report={report} />;
}
