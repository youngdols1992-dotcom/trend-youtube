import type { EbsSuggestion } from "@/lib/types";

const SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

interface YoutubeSearchItem {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    channelTitle?: string;
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
}

interface YoutubeSearchResponse {
  items?: YoutubeSearchItem[];
  error?: { message?: string };
}

// Searches YouTube for the keyword and keeps only results whose channel name
// contains "EBS", so it naturally covers EBS's many sub-channels
// (EBS 다큐, EBS 지식채널e, EBS 교양, EBS NEWS 등) without a hardcoded channel list.
export async function searchEbsContent(
  keyword: string,
  maxResults = 3
): Promise<EbsSuggestion[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is not set");
  }

  const url = new URL(SEARCH_URL);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", `${keyword} EBS`);
  url.searchParams.set("type", "video");
  url.searchParams.set("order", "relevance");
  url.searchParams.set("regionCode", "KR");
  url.searchParams.set("relevanceLanguage", "ko");
  url.searchParams.set("maxResults", "10");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { cache: "no-store" });
  const data: YoutubeSearchResponse = await res.json();

  if (!res.ok) {
    throw new Error(`YouTube search API error: ${data.error?.message ?? res.status}`);
  }

  const items = data.items ?? [];

  return items
    .filter((item) => (item.snippet?.channelTitle ?? "").toUpperCase().includes("EBS"))
    .slice(0, maxResults)
    .map((item): EbsSuggestion => {
      const videoId = item.id?.videoId ?? "";
      const thumb =
        item.snippet?.thumbnails?.high?.url ??
        item.snippet?.thumbnails?.medium?.url ??
        item.snippet?.thumbnails?.default?.url ??
        "";

      return {
        videoId,
        title: item.snippet?.title ?? "",
        channel: item.snippet?.channelTitle ?? "",
        thumbnail: thumb,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });
}
