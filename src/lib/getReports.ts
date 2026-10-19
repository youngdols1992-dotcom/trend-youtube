import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { DailyReport } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");

export async function getLatestReport(): Promise<DailyReport | null> {
  try {
    const raw = await readFile(path.join(DATA_DIR, "latest.json"), "utf-8");
    return JSON.parse(raw) as DailyReport;
  } catch {
    return null;
  }
}

export async function listReportDates(): Promise<string[]> {
  try {
    const files = await readdir(DATA_DIR);
    return files
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .map((f) => f.replace(".json", ""))
      .sort((a, b) => (a < b ? 1 : -1));
  } catch {
    return [];
  }
}

export async function getReportByDate(date: string): Promise<DailyReport | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  try {
    const raw = await readFile(path.join(DATA_DIR, `${date}.json`), "utf-8");
    return JSON.parse(raw) as DailyReport;
  } catch {
    return null;
  }
}
