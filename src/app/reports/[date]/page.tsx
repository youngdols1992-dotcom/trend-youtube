import { notFound } from "next/navigation";
import ReportView from "@/components/ReportView";
import { getReportByDate } from "@/lib/getReports";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const report = await getReportByDate(date);

  if (!report) {
    notFound();
  }

  return <ReportView report={report} />;
}
