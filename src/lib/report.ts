import { fetchGoogleTrends } from "@/lib/sources/googleTrends";
import { fetchGoogleNews } from "@/lib/sources/googleNews";
import { fetchYoutubeTrending } from "@/lib/sources/youtubeTrending";
import { extractKeywords } from "@/lib/keywords";
import type { DailyReport } from "@/lib/types";

function todayKstDateString(): string {
  // KST = UTC+9
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

export async function buildDailyReport(): Promise<DailyReport> {
  const [trendsResult, newsResult, youtubeResult] = await Promise.allSettled([
    fetchGoogleTrends(),
    fetchGoogleNews(),
    fetchYoutubeTrending(),
  ]);

  const googleTrends = trendsResult.status === "fulfilled" ? trendsResult.value : [];
  const news = newsResult.status === "fulfilled" ? newsResult.value : [];
  const youtubeTrending = youtubeResult.status === "fulfilled" ? youtubeResult.value : [];

  if (trendsResult.status === "rejected") {
    console.error("Google Trends fetch failed:", trendsResult.reason);
  }
  if (newsResult.status === "rejected") {
    console.error("Google News fetch failed:", newsResult.reason);
  }
  if (youtubeResult.status === "rejected") {
    console.error("YouTube trending fetch failed:", youtubeResult.reason);
  }

  return {
    date: todayKstDateString(),
    generatedAt: new Date().toISOString(),
    googleTrends,
    news,
    newsKeywords: extractKeywords(news),
    youtubeTrending,
    youtubeMissingReason:
      youtubeResult.status === "rejected" ? String(youtubeResult.reason?.message ?? youtubeResult.reason) : undefined,
  };
}
