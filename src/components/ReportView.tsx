import type { DailyReport } from "@/lib/types";

function formatViewCount(v: string): string {
  const n = Number(v);
  if (!Number.isFinite(n)) return v;
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만회`;
  return `${n.toLocaleString()}회`;
}

export default function ReportView({ report }: { report: DailyReport }) {
  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-2xl font-bold">{report.date} 트렌드 리포트</h1>
        <p className="text-sm text-zinc-500">
          생성 시각: {new Date(report.generatedAt).toLocaleString("ko-KR")}
        </p>
      </header>

      {/* 유튜브 인기 급상승 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">🎬 유튜브 인기 급상승 (한국)</h2>
        {report.youtubeTrending.length === 0 ? (
          <p className="text-sm text-zinc-500">
            데이터 없음{report.youtubeMissingReason ? ` (${report.youtubeMissingReason})` : ""}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {report.youtubeTrending.map((v) => (
              <a
                key={v.videoId}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col overflow-hidden rounded-lg border border-zinc-200 hover:border-zinc-400 dark:border-zinc-800"
              >
                {v.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v.thumbnail} alt={v.title} className="aspect-video w-full object-cover" />
                )}
                <div className="flex flex-1 flex-col gap-1 p-3">
                  <span className="text-xs font-medium text-zinc-400">#{v.rank}</span>
                  <span className="line-clamp-2 text-sm font-medium">{v.title}</span>
                  <span className="text-xs text-zinc-500">{v.channel}</span>
                  <span className="text-xs text-zinc-500">{formatViewCount(v.viewCount)}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* 구글 급상승 검색어 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">🔥 구글 급상승 검색어</h2>
        <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {report.googleTrends.map((t, i) => (
            <div key={t.keyword + i} className="flex flex-col gap-1 py-3">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-zinc-400">{i + 1}</span>
                <span className="font-medium">{t.keyword}</span>
                <span className="text-xs text-zinc-500">검색 {t.approxTraffic}</span>
              </div>
              {t.relatedNews[0] && (
                <a
                  href={t.relatedNews[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-500 hover:underline"
                >
                  {t.relatedNews[0].title} · {t.relatedNews[0].source}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 뉴스 키워드 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">📰 오늘의 뉴스 키워드</h2>
        <div className="flex flex-wrap gap-2">
          {report.newsKeywords.map((k) => (
            <span
              key={k.keyword}
              className="rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800"
            >
              {k.keyword} <span className="text-zinc-400">{k.count}</span>
            </span>
          ))}
        </div>
      </section>

      {/* 뉴스 헤드라인 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">🗞️ 주요 뉴스 헤드라인</h2>
        <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {report.news.slice(0, 40).map((n, i) => (
            <li key={n.url + i} className="py-2">
              <a href={n.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {n.title}
              </a>
              <span className="ml-2 text-xs text-zinc-500">{n.source}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
