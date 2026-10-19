import { fetchYoutubeTrending } from "@/lib/sources/youtubeTrending";
import type { YoutubeTrendingItem } from "@/lib/types";

// YouTube video category IDs that tend to skew toward an older (40~60s) Korean audience:
// 25 = News & Politics, 27 = Education, 19 = Travel & Events.
const CATEGORIES: { id: string; label: string }[] = [
  { id: "25", label: "뉴스/시사" },
  { id: "27", label: "교육/교양" },
  { id: "19", label: "여행/다큐" },
];

export async function fetchOlderAudienceTrending(
  regionCode = "KR",
  perCategory = 8
): Promise<YoutubeTrendingItem[]> {
  const results = await Promise.allSettled(
    CATEGORIES.map((c) => fetchYoutubeTrending(regionCode, perCategory, c.id, c.label))
  );

  const merged: YoutubeTrendingItem[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const item of result.value) {
      if (seen.has(item.videoId)) continue;
      seen.add(item.videoId);
      merged.push(item);
    }
  }

  return merged;
}
