/**
 * @file bookmark-list.tsx
 * @description 북마크 목록 컴포넌트
 *
 * 사용자가 북마크한 관광지 목록을 표시하는 컴포넌트입니다.
 *
 * 주요 기능:
 * 1. 북마크 목록 표시 (TourCard 사용)
 * 2. 정렬 옵션 (최신순, 이름순, 지역별)
 * 3. 개별 삭제 기능
 * 4. 일괄 삭제 기능
 * 5. 빈 상태 처리
 * 6. 로딩 상태
 *
 * @dependencies
 * - @/components/tour-card: TourCard
 * - @/lib/api/bookmark-api: getUserBookmarks, removeBookmark
 * - @/lib/api/tour-api: getDetailCommon
 * - @/lib/utils/tour: tourDetailToItem
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { getUserBookmarks, removeBookmark } from "@/lib/api/bookmark-api";
import { getDetailCommon } from "@/lib/api/tour-api";
import { tourDetailToItem } from "@/lib/utils/tour";
import type { TourItem } from "@/lib/types/tour";
import { TourCard } from "@/components/tour-card";
import { TourList } from "@/components/tour-list";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/toast";
import { Trash2, Star, Calendar, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type SortOption = "latest" | "name" | "region";

interface BookmarkWithTour extends TourItem {
  bookmarkId: string;
  createdAt: string;
}

/**
 * 북마크 목록 컴포넌트
 */
export function BookmarkList() {
  const { userId, isLoaded } = useAuth();
  const supabase = useClerkSupabaseClient();
  const [bookmarks, setBookmarks] = useState<BookmarkWithTour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 북마크 목록 조회
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchBookmarks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 북마크 목록 조회
        const bookmarkList = await getUserBookmarks(supabase, userId);

        // 각 북마크의 관광지 정보 조회 (병렬 처리)
        const tourPromises = bookmarkList.map(async (bookmark) => {
          try {
            const detail = await getDetailCommon(bookmark.content_id);
            const tourItem = tourDetailToItem(detail);
            return {
              ...tourItem,
              bookmarkId: bookmark.id,
              createdAt: bookmark.created_at,
            } as BookmarkWithTour;
          } catch (err) {
            console.error(
              `북마크 ${bookmark.content_id} 관광지 정보 조회 실패:`,
              err
            );
            return null;
          }
        });

        const tours = await Promise.all(tourPromises);
        const validTours = tours.filter(
          (tour): tour is BookmarkWithTour => tour !== null
        );

        setBookmarks(validTours);
      } catch (err) {
        console.error("북마크 목록 조회 실패:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("북마크 목록을 불러올 수 없습니다.")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [isLoaded, userId, supabase]);

  // 정렬된 북마크 목록
  const sortedBookmarks = useMemo(() => {
    const sorted = [...bookmarks];

    switch (sortBy) {
      case "latest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "name":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "region":
        return sorted.sort((a, b) => {
          // addr1에서 지역 정보 추출 (예: "서울특별시" -> "서울")
          const getRegion = (addr: string) => {
            if (addr.includes("서울")) return "서울";
            if (addr.includes("부산")) return "부산";
            if (addr.includes("대구")) return "대구";
            if (addr.includes("인천")) return "인천";
            if (addr.includes("광주")) return "광주";
            if (addr.includes("대전")) return "대전";
            if (addr.includes("울산")) return "울산";
            if (addr.includes("세종")) return "세종";
            if (addr.includes("경기")) return "경기";
            if (addr.includes("강원")) return "강원";
            if (addr.includes("충북") || addr.includes("충청북도")) return "충북";
            if (addr.includes("충남") || addr.includes("충청남도")) return "충남";
            if (addr.includes("전북") || addr.includes("전라북도")) return "전북";
            if (addr.includes("전남") || addr.includes("전라남도")) return "전남";
            if (addr.includes("경북") || addr.includes("경상북도")) return "경북";
            if (addr.includes("경남") || addr.includes("경상남도")) return "경남";
            if (addr.includes("제주")) return "제주";
            return addr;
          };
          const regionCompare = getRegion(a.addr1 || "").localeCompare(
            getRegion(b.addr1 || "")
          );
          if (regionCompare !== 0) return regionCompare;
          return a.title.localeCompare(b.title);
        });
      default:
        return sorted;
    }
  }, [bookmarks, sortBy]);

  // 개별 북마크 삭제
  const handleDelete = async (bookmarkId: string, contentId: string) => {
    if (!userId) return;

    try {
      await removeBookmark(supabase, userId, contentId);
      setBookmarks((prev) =>
        prev.filter((bookmark) => bookmark.bookmarkId !== bookmarkId)
      );
      toast.success("북마크가 삭제되었습니다.");
    } catch (err) {
      console.error("북마크 삭제 실패:", err);
      toast.error(
        err instanceof Error ? err.message : "북마크 삭제에 실패했습니다."
      );
    }
  };

  // 일괄 삭제
  const handleBulkDelete = async () => {
    if (!userId || selectedIds.size === 0) return;

    try {
      const deletePromises = Array.from(selectedIds).map(async (bookmarkId) => {
        const bookmark = bookmarks.find((b) => b.bookmarkId === bookmarkId);
        if (bookmark) {
          await removeBookmark(supabase, userId, bookmark.contentid);
        }
      });

      await Promise.all(deletePromises);
      setBookmarks((prev) =>
        prev.filter((bookmark) => !selectedIds.has(bookmark.bookmarkId))
      );
      setSelectedIds(new Set());
      setDeleteDialogOpen(false);
      toast.success(`${selectedIds.size}개의 북마크가 삭제되었습니다.`);
    } catch (err) {
      console.error("일괄 삭제 실패:", err);
      toast.error("북마크 삭제에 실패했습니다.");
    }
  };

  // 전체 선택/해제
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(sortedBookmarks.map((b) => b.bookmarkId)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // 로그인하지 않은 경우
  if (!isLoaded) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="text-center py-16">
        <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">로그인이 필요합니다</h3>
        <p className="text-sm text-muted-foreground mb-4">
          북마크 기능을 사용하려면 로그인해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 및 컨트롤 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            내 북마크
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {bookmarks.length}개의 북마크
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* 정렬 옵션 */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[140px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="name">이름순</SelectItem>
              <SelectItem value="region">지역별</SelectItem>
            </SelectContent>
          </Select>

          {/* 일괄 삭제 버튼 */}
          {selectedIds.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              삭제 ({selectedIds.size})
            </Button>
          )}
        </div>
      </div>

      {/* 전체 선택 체크박스 */}
      {sortedBookmarks.length > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-lg border bg-card">
          <Checkbox
            id="select-all"
            checked={
              selectedIds.size > 0 &&
              selectedIds.size === sortedBookmarks.length
            }
            onCheckedChange={handleSelectAll}
          />
          <label
            htmlFor="select-all"
            className="text-sm font-medium cursor-pointer"
          >
            전체 선택
          </label>
        </div>
      )}

      {/* 북마크 목록 */}
      {isLoading ? (
        <TourList tours={[]} isLoading={true} />
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-destructive mb-4">{error.message}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            다시 시도
          </Button>
        </div>
      ) : sortedBookmarks.length === 0 ? (
        <div className="text-center py-16">
          <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">북마크가 없습니다</h3>
          <p className="text-sm text-muted-foreground mb-4">
            관광지 상세페이지에서 북마크를 추가해보세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBookmarks.map((bookmark) => (
            <div key={bookmark.bookmarkId} className="relative group">
              {/* 체크박스 */}
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={selectedIds.has(bookmark.bookmarkId)}
                  onCheckedChange={(checked) => {
                    const newSelected = new Set(selectedIds);
                    if (checked) {
                      newSelected.add(bookmark.bookmarkId);
                    } else {
                      newSelected.delete(bookmark.bookmarkId);
                    }
                    setSelectedIds(newSelected);
                  }}
                  className="bg-background/80 backdrop-blur"
                />
              </div>

              {/* 삭제 버튼 */}
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() =>
                    handleDelete(bookmark.bookmarkId, bookmark.contentid)
                  }
                  aria-label="북마크 삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* 북마크 카드 */}
              <TourCard tour={bookmark} />

              {/* 북마크 날짜 */}
              <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(bookmark.createdAt).toLocaleDateString("ko-KR")}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 일괄 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>북마크 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              선택한 {selectedIds.size}개의 북마크를 삭제하시겠습니까?
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

