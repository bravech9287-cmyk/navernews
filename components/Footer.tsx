/**
 * @file Footer.tsx
 * @description 푸터 컴포넌트
 *
 * 사이트 하단에 표시되는 푸터입니다.
 * 저작권 정보, 링크, API 제공 정보를 포함합니다.
 */

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>My Trip © {currentYear}</p>
            <p className="text-xs">
              한국관광공사 공공데이터 API 제공
            </p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              홈
            </Link>
            <Link
              href="/stats"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              통계
            </Link>
            <a
              href="https://www.data.go.kr/data/15101578/openapi.do"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              API 정보
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

