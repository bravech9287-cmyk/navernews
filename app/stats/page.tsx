/**
 * @file page.tsx
 * @description 통계 대시보드 페이지
 *
 * 전국 관광지 데이터를 차트로 시각화하여 사용자가 한눈에 현황을 파악할 수 있는 통계 페이지입니다.
 *
 * 주요 기능:
 * 1. 통계 요약 카드 (전체 개수, Top 3 지역, Top 3 타입)
 * 2. 지역별 관광지 분포 차트 (Bar Chart)
 * 3. 관광 타입별 분포 차트 (Donut Chart)
 *
 * @dependencies
 * - Next.js 15 App Router
 * - 한국관광공사 API
 * - Server Component (초기 로딩 속도 최적화)
 *
 * @see {@link /docs/PRD.md} - 통계 대시보드 요구사항 (2.6장)
 */

import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { getStatsSummary, getRegionStats, getTypeStats } from "@/lib/api/stats-api";
import { StatsSummary } from "@/components/stats/stats-summary";
import { RegionChart } from "@/components/stats/region-chart";
import { TypeChart } from "@/components/stats/type-chart";

export const metadata: Metadata = {
  title: "통계 대시보드 - My Trip",
  description: "전국 관광지 데이터를 차트로 시각화하여 지역별, 타입별 분포를 확인할 수 있습니다.",
  openGraph: {
    title: "통계 대시보드 - My Trip",
    description: "전국 관광지 데이터를 차트로 시각화하여 지역별, 타입별 분포를 확인할 수 있습니다.",
    type: "website",
    locale: "ko_KR",
  },
};

/**
 * 통계 대시보드 페이지 컴포넌트
 */
export default async function StatsPage() {
  // 통계 데이터 조회 (병렬 처리)
  let summary;
  let regionStats;
  let typeStats;
  let errorMessage: string | null = null;

  try {
    [summary, regionStats, typeStats] = await Promise.all([
      getStatsSummary(),
      getRegionStats(),
      getTypeStats(),
    ]);
  } catch (err: unknown) {
    console.error("통계 데이터 조회 실패:", err);
    const error = err instanceof Error ? err : new Error(String(err));
    errorMessage = error.message || "통계 데이터를 불러올 수 없습니다.";
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 영역 */}
      <header className="sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">통계 대시보드</h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            전국 관광지 데이터를 지역별, 타입별로 분석한 통계입니다.
          </p>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="container mx-auto max-w-7xl px-4 py-6">
        {/* 에러 상태 */}
        {errorMessage && (
          <div className="mb-6 rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-destructive">{errorMessage}</p>
          </div>
        )}

        {/* 통계 요약 카드 섹션 */}
        {summary && <StatsSummary summary={summary} className="mb-8" />}

        {/* 지역별 분포 차트 섹션 */}
        {regionStats && <RegionChart data={regionStats} className="mb-8" />}

        {/* 타입별 분포 차트 섹션 */}
        {typeStats && <TypeChart data={typeStats} className="mb-8" />}
      </main>
    </div>
  );
}

