import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, BarChart3, Bookmark } from "lucide-react";
import { TourSearch } from "@/components/tour-search";
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4">
        {/* 로고 */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity"
          aria-label="My Trip 홈으로 이동"
        >
          <MapPin className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            My Trip
          </span>
        </Link>

        {/* 네비게이션 링크 */}
        <nav className="hidden md:flex items-center gap-6" aria-label="주요 네비게이션">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
          >
            홈
          </Link>
          <Link
            href="/stats"
            className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
          >
            <BarChart3 className="h-4 w-4" />
            통계
          </Link>
          <SignedIn>
            <Link
              href="/bookmarks"
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
            >
              <Bookmark className="h-4 w-4" />
              북마크
            </Link>
          </SignedIn>
        </nav>

        {/* 검색창 및 로그인 */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* 검색창 */}
          <TourSearch variant="navbar" />

          {/* 테마 전환 버튼 */}
          <ThemeToggle />

          {/* 로그인 버튼 */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="default" size="sm" className="shrink-0">
                로그인
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
