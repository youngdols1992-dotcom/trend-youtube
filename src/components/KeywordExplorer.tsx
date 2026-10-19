"use client";

import { useState } from "react";
import type { EbsSuggestion, KeywordCount } from "@/lib/types";

export default function KeywordExplorer({
  keywords,
  ebsSuggestions,
}: {
  keywords: KeywordCount[];
  ebsSuggestions: Record<string, EbsSuggestion[]>;
}) {
  const [active, setActive] = useState<string | null>(null);

  const activeData = keywords.find((k) => k.keyword === active);
  const activeEbs = active ? ebsSuggestions[active] ?? [] : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {keywords.map((k) => {
          const hasEbs = (ebsSuggestions[k.keyword]?.length ?? 0) > 0;
          const isActive = active === k.keyword;
          return (
            <button
              key={k.keyword}
              onClick={() => setActive(isActive ? null : k.keyword)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : hasEbs
                    ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300"
                    : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              }`}
            >
              {hasEbs && !isActive && "📺 "}
              {k.keyword} <span className="opacity-60">{k.count}</span>
            </button>
          );
        })}
      </div>

      {hasEbsLegend(ebsSuggestions) && (
        <p className="text-xs text-zinc-400">📺 표시된 키워드는 EBS에 관련 콘텐츠가 있어요 — 다큐/교양 소재로 참고하기 좋습니다.</p>
      )}

      {activeData && (
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-zinc-500">
              &quot;{activeData.keyword}&quot; 연관 키워드 (콘텐츠 파생 아이디어)
            </h3>
            {activeData.related.length === 0 ? (
              <p className="text-xs text-zinc-400">연관 키워드를 찾지 못했어요.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {activeData.related.map((r) => {
                  const clickable = keywords.some((k) => k.keyword === r);
                  return clickable ? (
                    <button
                      key={r}
                      onClick={() => setActive(r)}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-xs hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                    >
                      {r}
                    </button>
                  ) : (
                    <span
                      key={r}
                      className="rounded-full bg-zinc-50 px-3 py-1 text-xs text-zinc-500 dark:bg-zinc-900"
                    >
                      {r}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-zinc-500">EBS 관련 콘텐츠 추천</h3>
            {activeEbs.length === 0 ? (
              <p className="text-xs text-zinc-400">관련된 EBS 콘텐츠를 찾지 못했어요.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {activeEbs.map((v) => (
                  <a
                    key={v.videoId}
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col overflow-hidden rounded-lg border border-zinc-200 hover:border-emerald-400 dark:border-zinc-800"
                  >
                    {v.thumbnail && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.thumbnail} alt={v.title} className="aspect-video w-full object-cover" />
                    )}
                    <div className="flex flex-col gap-1 p-2">
                      <span className="line-clamp-2 text-xs font-medium">{v.title}</span>
                      <span className="text-[11px] text-zinc-500">{v.channel}</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function hasEbsLegend(ebsSuggestions: Record<string, EbsSuggestion[]>): boolean {
  return Object.values(ebsSuggestions).some((v) => v.length > 0);
}
