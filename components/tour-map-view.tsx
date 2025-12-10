/**
 * @file tour-map-view.tsx
 * @description 관광지 목록 + 지도 통합 뷰
 *
 * 관광지 목록과 네이버 지도를 함께 표시하는 컴포넌트입니다.
 * 데스크톱에서는 분할 레이아웃, 모바일에서는 탭 형태로 전환합니다.
 *
 * @see {@link /docs/PRD.md} - 네이버 지도 연동 요구사항 (2.2장)
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { TourItem } from "@/lib/types/tour";
import { TourList } from "@/components/tour-list";
import { NaverMap } from "@/components/naver-map";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourMapViewProps {
  tours: TourItem[];
  error?: Error | null;
  totalCount?: number;
  initialPageNo?: number;
  enableInfiniteScroll?: boolean;
  className?: string;
}

export function TourMapView({
  tours: initialTours,
  error,
  totalCount = 0,
  initialPageNo = 1,
  enableInfiniteScroll = false,
  className,
}: TourMapViewProps) {
  const searchParams = useSearchParams();
  const [tours, setTours] = useState<TourItem[]>(initialTours);
  const [currentPage, setCurrentPage] = useState(initialPageNo);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState<string | undefined>();

  // 검색 파라미터가 변경되면 초기화
  useEffect(() => {
    setTours(initialTours);
    setCurrentPage(initialPageNo);
  }, [initialTours, initialPageNo, searchParams.toString()]);

  const handleTourSelect = (tour: TourItem) => {
    setSelectedTourId(tour.contentid);
  };

  const handleTourCardClick = (tour: TourItem) => {
    setSelectedTourId(tour.contentid);
    // 스크롤을 지도 영역으로 이동 (모바일에서 탭 전환)
    if (window.innerWidth < 1024) {
      const mapTab = document.getElementById("map-tab");
      if (mapTab) {
        mapTab.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const loadMore = useCallback(async () => {
    if (isLoading || tours.length >= totalCount) return;

    setIsLoading(true);

    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set("pageNo", String(currentPage + 1));
      params.set("numOfRows", "20");

      const response = await fetch(`/api/tour/infinite?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to load more tours");
      }

      const data = await response.json();
      const newTours = data.items || [];

      setTours((prev) => [...prev, ...newTours]);
      setCurrentPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load more tours:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isLoading, searchParams, totalCount, tours.length]);

  const hasMore = enableInfiniteScroll && tours.length < totalCount;

  // 관광지의 평균 좌표 계산 (지도 초기 중심점)
  const getInitialCenter = (): [number, number] | undefined => {
    if (tours.length === 0) return undefined;

    let sumLng = 0;
    let sumLat = 0;
    let count = 0;

    tours.forEach((tour) => {
      try {
        const [lng, lat] = [
          parseFloat(tour.mapx) / 10000000,
          parseFloat(tour.mapy) / 10000000,
        ];
        if (!isNaN(lng) && !isNaN(lat) && lng !== 0 && lat !== 0) {
          sumLng += lng;
          sumLat += lat;
          count++;
        }
      } catch {
        // 좌표 변환 실패 시 무시
      }
    });

    if (count === 0) return undefined;
    return [sumLng / count, sumLat / count];
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* 데스크톱: 분할 레이아웃 */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
        {/* 좌측: 리스트 */}
        <div
          className="overflow-y-auto pr-2"
          style={{ maxHeight: "calc(100vh - 300px)" }}
        >
          <TourList
            tours={tours}
            error={error}
            onTourClick={handleTourCardClick}
            selectedTourId={selectedTourId}
          />
          {enableInfiniteScroll && (
            <InfiniteScroll
              onLoadMore={loadMore}
              hasMore={hasMore}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* 우측: 지도 */}
        <div className="sticky top-4 h-fit">
          <NaverMap
            tours={tours}
            selectedTourId={selectedTourId}
            onTourSelect={handleTourSelect}
            initialCenter={getInitialCenter()}
            className="h-[600px] lg:h-[700px]"
          />
        </div>
      </div>

      {/* 모바일/태블릿: 탭 형태 */}
      <div className="lg:hidden">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              목록
            </TabsTrigger>
            <TabsTrigger value="map" id="map-tab" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              지도
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-4">
            <TourList
              tours={tours}
              error={error}
              onTourClick={handleTourCardClick}
              selectedTourId={selectedTourId}
            />
            {enableInfiniteScroll && (
              <InfiniteScroll
                onLoadMore={loadMore}
                hasMore={hasMore}
                isLoading={isLoading}
              />
            )}
          </TabsContent>
          <TabsContent value="map" className="mt-4">
            <NaverMap
              tours={tours}
              selectedTourId={selectedTourId}
              onTourSelect={handleTourSelect}
              initialCenter={getInitialCenter()}
              className="h-[400px]"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

