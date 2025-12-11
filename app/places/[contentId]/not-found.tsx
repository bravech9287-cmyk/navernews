/**
 * @file not-found.tsx
 * @description 관광지 상세페이지 404 에러 페이지
 *
 * 유효하지 않은 contentId로 접근한 경우 표시되는 페이지입니다.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function PlaceNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">관광지를 찾을 수 없습니다</h1>
            <p className="text-muted-foreground text-lg">
              요청하신 관광지 정보를 찾을 수 없습니다.
              <br />
              관광지 ID가 올바른지 확인해주세요.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
            <Link href="/">
              <Button variant="default" size="lg" className="gap-2">
                <Home className="h-4 w-4" />
                홈으로 돌아가기
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                목록으로 돌아가기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

