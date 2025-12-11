/**
 * @file page.tsx
 * @description 북마크 목록 페이지
 *
 * 사용자가 북마크한 관광지 목록을 표시하는 페이지입니다.
 *
 * 주요 기능:
 * 1. 북마크 목록 표시
 * 2. 정렬 옵션 (최신순, 이름순, 지역별)
 * 3. 개별/일괄 삭제 기능
 * 4. 인증된 사용자만 접근 가능
 *
 * @dependencies
 * - Next.js 15 App Router
 * - Clerk: 인증 확인
 * - Supabase: 북마크 데이터
 *
 * @see {@link /docs/PRD.md} - 북마크 기능 요구사항 (2.4.5장)
 */

import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Bookmark } from "lucide-react";
import { BookmarkList } from "@/components/bookmarks/bookmark-list";

export const metadata: Metadata = {
  title: "내 북마크 - My Trip",
  description: "북마크한 관광지 목록을 확인하고 관리할 수 있습니다.",
  openGraph: {
    title: "내 북마크 - My Trip",
    description: "북마크한 관광지 목록을 확인하고 관리할 수 있습니다.",
    type: "website",
    locale: "ko_KR",
  },
};

/**
 * 북마크 목록 페이지 컴포넌트
 */
export default async function BookmarksPage() {
  // 인증 확인
  const { userId } = await auth();

  // 로그인하지 않은 경우 리다이렉트 (선택 사항: 로그인 유도)
  // 여기서는 페이지를 표시하되, BookmarkList 컴포넌트에서 로그인 유도 메시지를 표시합니다.

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 영역 */}
      <header className="sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-3">
            <Bookmark className="h-6 w-6 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">내 북마크</h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            북마크한 관광지 목록을 확인하고 관리할 수 있습니다.
          </p>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="container mx-auto max-w-7xl px-4 py-6">
        <BookmarkList />
      </main>
    </div>
  );
}

