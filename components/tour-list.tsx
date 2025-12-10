/**
 * @file tour-list.tsx
 * @description 관광지 목록 컴포넌트
 *
 * 관광지 목록을 그리드 레이아웃으로 표시하는 컴포넌트입니다.
 * 로딩 상태, 빈 상태, 에러 상태를 처리합니다.
 *
 * @see {@link /docs/PRD.md} - 관광지 목록 요구사항 (2.1장)
 */

import type { TourItem } from "@/lib/types/tour";
import { TourCard } from "@/components/tour-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Error } from "@/components/ui/error";
import { cn } from "@/lib/utils";

interface TourListProps {
  tours: TourItem[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onTourClick?: (tour: TourItem) => void;
  selectedTourId?: string;
  className?: string;
}

export function TourList({
  tours,
  isLoading = false,
  error = null,
  onRetry,
  onTourClick,
  selectedTourId,
  className,
}: TourListProps) {
  // 로딩 상태
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          className
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-xl shadow-md border border-border overflow-hidden"
          >
            <Skeleton className="w-full h-48 rounded-t-xl" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Error
        message={error.message || "관광지 목록을 불러오는 중 오류가 발생했습니다."}
        onRetry={onRetry}
      />
    );
  }

  // 빈 상태
  if (tours.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          관광지가 없습니다
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          검색 조건이나 필터를 변경해보세요. 다른 지역이나 관광 타입을 선택하면
          더 많은 결과를 찾을 수 있습니다.
        </p>
      </div>
    );
  }

  // 목록 표시
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {tours.map((tour) => (
        <TourCard
          key={tour.contentid}
          tour={tour}
          onClick={() => onTourClick?.(tour)}
          isSelected={selectedTourId === tour.contentid}
        />
      ))}
    </div>
  );
}

