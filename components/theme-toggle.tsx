"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

/**
 * 테마 전환 버튼 컴포넌트
 * 
 * 라이트/다크 모드를 전환할 수 있는 토글 버튼입니다.
 * 시스템 설정, 라이트 모드, 다크 모드 중 선택 가능합니다.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // hydration 이후에만 렌더링하여 클라이언트/서버 불일치 방지
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        aria-label="테마 전환"
        disabled
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="shrink-0"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      title={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 transition-all" />
      ) : (
        <Moon className="h-5 w-5 transition-all" />
      )}
    </Button>
  );
}

