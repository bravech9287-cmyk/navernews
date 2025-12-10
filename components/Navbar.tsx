import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, BarChart3, Bookmark } from "lucide-react";
import { TourSearch } from "@/components/tour-search";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <MapPin className="h-6 w-6" />
          <span>My Trip</span>
        </Link>

        {/* 네비게이션 링크 */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            홈
          </Link>
          <Link
            href="/stats"
            className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
          >
            <BarChart3 className="h-4 w-4" />
            통계
          </Link>
          <SignedIn>
            <Link
              href="/bookmarks"
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
            >
              <Bookmark className="h-4 w-4" />
              북마크
            </Link>
          </SignedIn>
        </nav>

        {/* 검색창 및 로그인 */}
        <div className="flex items-center gap-4">
          {/* 검색창 */}
          <TourSearch variant="navbar" />

          {/* 로그인 버튼 */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="default" size="sm">
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
