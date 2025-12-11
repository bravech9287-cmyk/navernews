/**
 * @file stats-summary.tsx
 * @description 통계 요약 카드 컴포넌트
 *
 * 통계 대시보드의 요약 정보를 카드 형태로 표시하는 컴포넌트입니다.
 *
 * 주요 기능:
 * 1. 전체 관광지 수 표시
 * 2. Top 3 지역 표시
 * 3. Top 3 타입 표시
 * 4. 마지막 업데이트 시간 표시
 *
 * @dependencies
 * - @/lib/types/stats: StatsSummary 타입
 * - lucide-react: 아이콘
 */

import type { StatsSummary } from "@/lib/types/stats";
import { MapPin, Trophy, Calendar, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsSummaryProps {
  summary: StatsSummary;
  className?: string;
}

/**
 * 통계 요약 카드 컴포넌트
 */
export function StatsSummary({ summary, className }: StatsSummaryProps) {
  return (
    <section className={cn("space-y-4", className)} aria-label="통계 요약">
      <h2 className="text-xl font-semibold">통계 요약</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 전체 관광지 수 */}
        <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">전체 관광지 수</p>
              <p className="text-2xl font-bold">{summary.totalCount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Top 1 지역 */}
        {summary.topRegions[0] && (
          <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Top 지역</p>
                <p className="text-lg font-semibold truncate">{summary.topRegions[0].name}</p>
                <p className="text-sm text-muted-foreground">
                  {summary.topRegions[0].count.toLocaleString()}개
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top 1 타입 */}
        {summary.topTypes[0] && (
          <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Top 타입</p>
                <p className="text-lg font-semibold truncate">{summary.topTypes[0].typeName}</p>
                <p className="text-sm text-muted-foreground">
                  {summary.topTypes[0].count.toLocaleString()}개
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 마지막 업데이트 */}
        <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">마지막 업데이트</p>
              <p className="text-sm font-medium">
                {summary.lastUpdated.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {summary.lastUpdated.toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 지역 및 타입 상세 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Top 3 지역 */}
        <div className="p-4 rounded-lg border bg-card">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            Top 3 지역
          </h3>
          <div className="space-y-2">
            {summary.topRegions.map((region, index) => (
              <div
                key={region.code}
                className="flex items-center justify-between p-2 rounded-lg bg-muted"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground w-6">
                    {index + 1}위
                  </span>
                  <span className="font-medium">{region.name}</span>
                </div>
                <span className="text-sm font-semibold">
                  {region.count.toLocaleString()}개
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 타입 */}
        <div className="p-4 rounded-lg border bg-card">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Top 3 타입
          </h3>
          <div className="space-y-2">
            {summary.topTypes.map((type, index) => (
              <div
                key={type.contentTypeId}
                className="flex items-center justify-between p-2 rounded-lg bg-muted"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground w-6">
                    {index + 1}위
                  </span>
                  <span className="font-medium">{type.typeName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {type.percentage.toFixed(1)}%
                  </span>
                  <span className="text-sm font-semibold">
                    {type.count.toLocaleString()}개
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

