/**
 * @file not-found.tsx
 * @description 404 페이지 컴포넌트
 *
 * 존재하지 않는 페이지에 접근했을 때 표시되는 페이지입니다.
 * 사용자 친화적인 메시지와 홈으로 돌아가기 버튼을 제공합니다.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 404 아이콘 */}
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <MapPin className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>

        {/* 404 메시지 */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
          <p className="text-muted-foreground">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/?keyword=">
              <Search className="mr-2 h-4 w-4" />
              관광지 검색하기
            </Link>
          </Button>
        </div>

        {/* 도움말 링크 */}
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            다른 페이지를 찾고 계신가요?{" "}
            <Link href="/" className="text-primary hover:underline">
              홈페이지
            </Link>
            ,{" "}
            <Link href="/stats" className="text-primary hover:underline">
              통계
            </Link>
            , 또는{" "}
            <Link href="/bookmarks" className="text-primary hover:underline">
              북마크
            </Link>
            를 확인해보세요.
          </p>
        </div>
      </div>
    </div>
  );
}

