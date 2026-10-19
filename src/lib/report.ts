import { fetchGoogleTrends } from "@/lib/sources/googleTrends";
import { fetchGoogleNews } from "@/lib/sources/googleNews";
import { fetchYoutubeTrending } from "@/lib/sources/youtubeTrending";
import { fetchOlderAudienceTrending } from "@/lib/sources/olderAudienceTrending";
import { searchEbsContent } from "@/lib/sources/ebsSearch";
import { extractKeywords } from "@/lib/keywords";
import type { DailyReport, EbsSuggestion } from "@/lib/types";

const EBS_LOOKUP_KEYWORD_COUNT = 8;

function todayKstDateString(): string {
  // KST = UTC+9
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

async function buildEbsSuggestions(keywords: string[]): Promise<Record<string, EbsSuggestion[]>> {
  const map: Record<string, EbsSuggestion[]> = {};

  for (const keyword of keywords.slice(0, EBS_LOOKUP_KEYWORD_COUNT)) {
    try {
      const suggestions = await searchEbsContent(keyword);
      if (suggestions.length > 0) {
        map[keyword] = suggestions;
      }
    } catch (err) {
      console.error(`EBS search failed for "${keyword}":`, err);
    }
  }

  return map;
}

export async function buildDailyReport(): Promise<DailyReport> {
  const [trendsResult, newsResult, youtubeResult, olderAudienceResult] = await Promise.allSettled([
    fetchGoogleTrends(),
    fetchGoogleNews(),
    fetchYoutubeTrending(),
    fetchOlderAudienceTrending(),
  ]);

  const googleTrends = trendsResult.status === "fulfilled" ? trendsResult.value : [];
  const news = newsResult.status === "fulfilled" ? newsResult.value : [];
  const youtubeTrending = youtubeResult.status === "fulfilled" ? youtubeResult.value : [];
  const olderAudienceTrending =
    olderAudienceResult.status === "fulfilled" ? olderAudienceResult.value : [];

  if (trendsResult.status === "rejected") {
    console.error("Google Trends fetch failed:", trendsResult.reason);
  }
  if (newsResult.status === "rejected") {
    console.error("Google News fetch failed:", newsResult.reason);
  }
  if (youtubeResult.status === "rejected") {
    console.error("YouTube trending fetch failed:", youtubeResult.reason);
  }
  if (olderAudienceResult.status === "rejected") {
    console.error("Older-audience trending fetch failed:", olderAudienceResult.reason);
  }

  const newsKeywords = extractKeywords(news);

  let ebsSuggestions: Record<string, EbsSuggestion[]> = {};
  if (process.env.YOUTUBE_API_KEY) {
    ebsSuggestions = await buildEbsSuggestions(newsKeywords.map((k) => k.keyword));
  }

  return {
    date: todayKstDateString(),
    generatedAt: new Date().toISOString(),
    googleTrends,
    news,
    newsKeywords,
    youtubeTrending,
    youtubeMissingReason:
      youtubeResult.status === "rejected" ? String(youtubeResult.reason?.message ?? youtubeResult.reason) : undefined,
    olderAudienceTrending,
    ebsSuggestions,
  };
}
