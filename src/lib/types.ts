export interface GoogleTrendItem {
  keyword: string;
  approxTraffic: string;
  relatedNews: {
    title: string;
    source: string;
    url: string;
  }[];
}

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
}

export interface YoutubeTrendingItem {
  rank: number;
  videoId: string;
  title: string;
  channel: string;
  viewCount: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  categoryId: string;
  categoryLabel?: string;
}

export interface KeywordCount {
  keyword: string;
  count: number;
  related: string[];
}

export interface EbsSuggestion {
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
  url: string;
}

export interface DailyReport {
  date: string;
  generatedAt: string;
  googleTrends: GoogleTrendItem[];
  news: NewsItem[];
  newsKeywords: KeywordCount[];
  youtubeTrending: YoutubeTrendingItem[];
  youtubeMissingReason?: string;
  olderAudienceTrending: YoutubeTrendingItem[];
  ebsSuggestions: Record<string, EbsSuggestion[]>;
}
