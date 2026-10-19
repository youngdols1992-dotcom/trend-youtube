import type { KeywordCount, NewsItem } from "@/lib/types";

// Common Korean particles/suffixes to strip from the end of a token so that
// e.g. "정부는" and "정부가" both collapse to "정부".
const PARTICLE_SUFFIXES = [
  "으로는", "에서는", "에게는", "로서는",
  "에서의", "으로의", "부터는", "까지는",
  "에서", "으로", "에게", "부터", "까지", "보다", "처럼", "마저", "조차",
  "은", "는", "이", "가", "을", "를", "의", "에", "도", "만", "과", "와", "로",
];

const STOPWORDS = new Set([
  "오늘", "어제", "내일", "관련", "발표", "기자", "단독", "속보", "종합",
  "영상", "사진", "인터뷰", "논란", "이유", "현황", "전망", "결과", "분석",
  "것으로", "밝혔다", "전했다", "나타났다", "있다", "없다", "했다", "한다",
  "위해", "통해", "대해", "대한", "라며", "이라고", "라고", "이라며",
  "만에", "이후", "앞두고", "가운데", "넘어", "위한", "모습", "오전", "오후", "지난",
]);

function stripParticle(token: string): string {
  for (const suffix of PARTICLE_SUFFIXES) {
    if (token.length > suffix.length + 1 && token.endsWith(suffix)) {
      return token.slice(0, token.length - suffix.length);
    }
  }
  return token;
}

export function extractKeywords(news: NewsItem[], topN = 20): KeywordCount[] {
  const counts = new Map<string, number>();

  for (const item of news) {
    const rawTokens = item.title
      .replace(/[\[\]()<>'"“”‘’…,.?!·|]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    for (const raw of rawTokens) {
      const stripped = stripParticle(raw);
      if (stripped.length < 2) continue;
      if (STOPWORDS.has(stripped)) continue;
      if (/^[0-9]+$/.test(stripped)) continue;

      counts.set(stripped, (counts.get(stripped) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([keyword, count]) => ({ keyword, count }));
}
