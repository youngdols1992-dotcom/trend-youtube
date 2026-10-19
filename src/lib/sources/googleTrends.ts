import { XMLParser } from "fast-xml-parser";
import type { GoogleTrendItem } from "@/lib/types";

const TRENDS_RSS_URL = "https://trends.google.com/trending/rss?geo=KR";

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export async function fetchGoogleTrends(): Promise<GoogleTrendItem[]> {
  const res = await fetch(TRENDS_RSS_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (trend-dashboard RSS reader)" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Google Trends RSS fetch failed: ${res.status}`);
  }

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });
  const data = parser.parse(xml);

  const items = toArray(data?.rss?.channel?.item);

  return items.map((item): GoogleTrendItem => {
    const newsItems = toArray(item.news_item).map((n) => {
      const source = String(n.news_item_source ?? "");
      let title = String(n.news_item_title ?? "");
      const suffix = ` - ${source}`;
      if (source && title.endsWith(suffix)) {
        title = title.slice(0, title.length - suffix.length);
      }
      return {
        title,
        source,
        url: String(n.news_item_url ?? ""),
      };
    });

    return {
      keyword: String(item.title ?? ""),
      approxTraffic: String(item.approx_traffic ?? ""),
      relatedNews: newsItems,
    };
  });
}
