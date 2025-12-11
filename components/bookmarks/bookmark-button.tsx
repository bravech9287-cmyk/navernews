/**
 * @file bookmark-button.tsx
 * @description 북마크 버튼 컴포넌트
 *
 * 관광지를 북마크할 수 있는 버튼 컴포넌트입니다.
 * Clerk 인증을 사용하며, Supabase bookmarks 테이블에 저장합니다.
 *
 * 주요 기능:
 * 1. 북마크 상태 확인 (Supabase 조회)
 * 2. 북마크 추가/제거 기능
 * 3. 인증된 사용자 확인 (Clerk)
 * 4. 로그인하지 않은 경우: 로그인 유도
 * 5. 별 아이콘 (채워짐/비어있음)
 *
 * @dependencies
 * - @clerk/nextjs: useAuth, SignInButton
 * - @/lib/supabase/clerk-client: useClerkSupabaseClient
 * - @/lib/api/bookmark-api: 북마크 API 함수들
 * - lucide-react: Star 아이콘
 */

"use client";

import { useState, useEffect } from "react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { getBookmark, addBookmark, removeBookmark } from "@/lib/api/bookmark-api";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  contentId: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "sm" | "default" | "lg" | "icon";
}

/**
 * 북마크 버튼 컴포넌트
 */
export function BookmarkButton({
  contentId,
  className,
  variant = "outline",
  size = "default",
}: BookmarkButtonProps) {
  const { userId, isLoaded } = useAuth();
  const supabase = useClerkSupabaseClient();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  // 북마크 상태 확인
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const checkBookmark = async () => {
      if (!userId) {
        setIsBookmarked(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const bookmark = await getBookmark(supabase, userId, contentId);
        setIsBookmarked(!!bookmark);
      } catch (error) {
        console.error("Failed to check bookmark:", error);
        setIsBookmarked(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkBookmark();
  }, [isLoaded, userId, contentId, supabase]);

  // 북마크 토글
  const handleToggle = async () => {
    if (!userId) {
      return;
    }

    try {
      setIsToggling(true);

      if (isBookmarked) {
        // 북마크 제거
        await removeBookmark(supabase, userId, contentId);
        setIsBookmarked(false);
        toast.success("북마크가 제거되었습니다.");
      } else {
        // 북마크 추가
        await addBookmark(supabase, userId, contentId);
        setIsBookmarked(true);
        toast.success("북마크에 추가되었습니다.");
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "북마크 작업에 실패했습니다."
      );
    } finally {
      setIsToggling(false);
    }
  };

  // 로그인하지 않은 경우
  if (!isLoaded) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled
        className={cn("gap-2", className)}
        aria-label="북마크"
      >
        <Star className="h-4 w-4" />
        <span className="hidden sm:inline">북마크</span>
      </Button>
    );
  }

  if (!userId) {
    return (
      <SignInButton mode="modal">
        <Button
          variant={variant}
          size={size}
          className={cn("gap-2", className)}
          aria-label="로그인하여 북마크"
        >
          <Star className="h-4 w-4" />
          <span className="hidden sm:inline">북마크</span>
        </Button>
      </SignInButton>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={isLoading || isToggling}
      className={cn(
        "gap-2",
        isBookmarked && "bg-primary text-primary-foreground",
        className
      )}
      aria-label={isBookmarked ? "북마크 제거" : "북마크 추가"}
    >
      {isLoading || isToggling ? (
        <>
          <Star className="h-4 w-4 animate-pulse" />
          <span className="hidden sm:inline">
            {isLoading ? "로딩 중..." : "처리 중..."}
          </span>
        </>
      ) : (
        <>
          <Star
            className={cn(
              "h-4 w-4",
              isBookmarked ? "fill-current" : "stroke-current"
            )}
          />
          <span className="hidden sm:inline">
            {isBookmarked ? "북마크됨" : "북마크"}
          </span>
        </>
      )}
    </Button>
  );
}

