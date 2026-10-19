import { XMLParser } from "fast-xml-parser";
import type { NewsItem } from "@/lib/types";

const NEWS_TOPICS = {
  top: "https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko",
  nation: "https://news.google.com/rss/headlines/section/topic/NATION?hl=ko&gl=KR&ceid=KR:ko",
  business: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=ko&gl=KR&ceid=KR:ko",
  world: "https://news.google.com/rss/headlines/section/topic/WORLD?hl=ko&gl=KR&ceid=KR:ko",
  health: "https://news.google.com/rss/headlines/section/topic/HEALTH?hl=ko&gl=KR&ceid=KR:ko",
} as const;

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

// Google News titles look like "Headline text - Source Name"
function splitTitleSource(rawTitle: string): { title: string; source: string } {
  const idx = rawTitle.lastIndexOf(" - ");
  if (idx === -1) return { title: rawTitle, source: "" };
  return {
    title: rawTitle.slice(0, idx).trim(),
    source: rawTitle.slice(idx + 3).trim(),
  };
}

async function fetchFeed(url: string): Promise<NewsItem[]> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (trend-dashboard RSS reader)" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Google News RSS fetch failed (${url}): ${res.status}`);
  }

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });
  const data = parser.parse(xml);
  const items = toArray(data?.rss?.channel?.item);

  return items.map((item): NewsItem => {
    const { title, source } = splitTitleSource(String(item.title ?? ""));
    return {
      title,
      source,
      url: String(item.link ?? ""),
      publishedAt: String(item.pubDate ?? ""),
    };
  });
}

export async function fetchGoogleNews(): Promise<NewsItem[]> {
  const entries = Object.entries(NEWS_TOPICS);
  const results = await Promise.allSettled(entries.map(([, url]) => fetchFeed(url)));

  const seen = new Set<string>();
  const merged: NewsItem[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const item of result.value) {
      if (!item.title || seen.has(item.title)) continue;
      seen.add(item.title);
      merged.push(item);
    }
  }

  return merged;
}
