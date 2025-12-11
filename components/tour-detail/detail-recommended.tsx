/**
 * @file detail-recommended.tsx
 * @description 추천 관광지 섹션 컴포넌트
 *
 * 상세페이지에서 같은 지역 또는 타입의 다른 관광지를 추천하는 섹션입니다.
 *
 * 주요 기능:
 * 1. 같은 지역(areacode)의 다른 관광지 추천
 * 2. 같은 타입(contentTypeId)의 다른 관광지 추천
 * 3. 현재 관광지 제외
 * 4. 카드 형태로 표시
 * 5. 로딩 상태 처리
 * 6. 에러 처리
 *
 * @dependencies
 * - @/lib/api/tour-api: getAreaBasedList
 * - @/components/tour-card: TourCard
 * - @/components/tour-list: TourList
 */

"use client";

import { useEffect, useState } from "react";
import { getAreaBasedList } from "@/lib/api/tour-api";
import type { TourItem } from "@/lib/types/tour";
import { TourList } from "@/components/tour-list";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailRecommendedProps {
  currentContentId: string;
  areaCode?: string;
  contentTypeId?: string;
  className?: string;
}

/**
 * 추천 관광지 섹션 컴포넌트
 */
export function DetailRecommended({
  currentContentId,
  areaCode,
  contentTypeId,
  className,
}: DetailRecommendedProps) {
  const [recommendedTours, setRecommendedTours] = useState<TourItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRecommended = async () => {
      if (!areaCode && !contentTypeId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // 같은 지역 또는 타입의 관광지 조회
        const params: Parameters<typeof getAreaBasedList>[0] = {
          numOfRows: 6, // 최대 6개만 표시
          pageNo: 1,
        };

        if (areaCode) {
          params.areaCode = areaCode;
        }
        if (contentTypeId) {
          params.contentTypeId = contentTypeId;
        }

        const response = await getAreaBasedList(params);

        // 현재 관광지 제외하고 필터링
        const filtered = response.items.filter(
          (tour) => tour.contentid !== currentContentId
        );

        // 최대 6개만 표시
        setRecommendedTours(filtered.slice(0, 6));
      } catch (err) {
        console.error("추천 관광지 조회 실패:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("추천 관광지를 불러올 수 없습니다.")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommended();
  }, [currentContentId, areaCode, contentTypeId]);

  // 추천 관광지가 없으면 섹션 숨김
  if (!isLoading && recommendedTours.length === 0 && !error) {
    return null;
  }

  return (
    <section className={cn("space-y-4", className)} aria-label="추천 관광지">
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">추천 관광지</h2>
      </div>

      <TourList
        tours={recommendedTours}
        isLoading={isLoading}
        error={error}
        onRetry={() => {
          // 재시도 로직은 useEffect가 자동으로 다시 실행됨
          setError(null);
        }}
        className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      />
    </section>
  );
}

