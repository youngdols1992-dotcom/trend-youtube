import type { YoutubeTrendingItem } from "@/lib/types";

const API_URL = "https://www.googleapis.com/youtube/v3/videos";

interface YoutubeApiVideoItem {
  id: string;
  snippet?: {
    title?: string;
    channelTitle?: string;
    publishedAt?: string;
    categoryId?: string;
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
  statistics?: {
    viewCount?: string;
  };
}

interface YoutubeApiResponse {
  items?: YoutubeApiVideoItem[];
  error?: { message?: string };
}

export async function fetchYoutubeTrending(
  regionCode = "KR",
  maxResults = 25
): Promise<YoutubeTrendingItem[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is not set");
  }

  const url = new URL(API_URL);
  url.searchParams.set("part", "snippet,statistics");
  url.searchParams.set("chart", "mostPopular");
  url.searchParams.set("regionCode", regionCode);
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { cache: "no-store" });
  const data: YoutubeApiResponse = await res.json();

  if (!res.ok) {
    throw new Error(`YouTube API error: ${data.error?.message ?? res.status}`);
  }

  const items = data.items ?? [];

  return items.map((item, index): YoutubeTrendingItem => {
    const thumb =
      item.snippet?.thumbnails?.high?.url ??
      item.snippet?.thumbnails?.medium?.url ??
      item.snippet?.thumbnails?.default?.url ??
      "";

    return {
      rank: index + 1,
      videoId: item.id,
      title: item.snippet?.title ?? "",
      channel: item.snippet?.channelTitle ?? "",
      viewCount: item.statistics?.viewCount ?? "0",
      publishedAt: item.snippet?.publishedAt ?? "",
      thumbnail: thumb,
      url: `https://www.youtube.com/watch?v=${item.id}`,
      categoryId: item.snippet?.categoryId ?? "",
    };
  });
}
