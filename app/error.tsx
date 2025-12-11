/**
 * @file error.tsx
 * @description 전역 에러 페이지 컴포넌트
 *
 * Next.js App Router의 에러 바운더리입니다.
 * 서버/클라이언트 컴포넌트에서 발생한 에러를 처리합니다.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 에러 모니터링 서비스로 전송)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 에러 아이콘 */}
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        {/* 에러 메시지 */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">문제가 발생했습니다</h1>
          <p className="text-muted-foreground">
            예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
          {process.env.NODE_ENV === "development" && error.message && (
            <div className="mt-4 p-4 bg-muted rounded-lg text-left">
              <p className="text-sm font-mono text-destructive break-all">
                {error.message}
              </p>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default" className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

