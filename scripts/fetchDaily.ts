import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildDailyReport } from "@/lib/report";

async function main() {
  const report = await buildDailyReport();

  const dataDir = path.join(process.cwd(), "data");
  await mkdir(dataDir, { recursive: true });

  const dailyPath = path.join(dataDir, `${report.date}.json`);
  const latestPath = path.join(dataDir, "latest.json");

  const json = JSON.stringify(report, null, 2);
  await writeFile(dailyPath, json, "utf-8");
  await writeFile(latestPath, json, "utf-8");

  console.log(`[fetchDaily] saved report for ${report.date}`);
  console.log(`  googleTrends: ${report.googleTrends.length}`);
  console.log(`  news: ${report.news.length}`);
  console.log(`  newsKeywords: ${report.newsKeywords.length}`);
  console.log(`  youtubeTrending: ${report.youtubeTrending.length}`);
  if (report.youtubeMissingReason) {
    console.log(`  youtube error: ${report.youtubeMissingReason}`);
  }
}

main().catch((err) => {
  console.error("[fetchDaily] failed:", err);
  process.exit(1);
});
