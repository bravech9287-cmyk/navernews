/**
 * @file page.tsx
 * @description 관광지 상세페이지
 *
 * 특정 관광지의 상세 정보를 표시하는 페이지입니다.
 *
 * 주요 기능:
 * 1. 관광지 기본 정보 표시
 * 2. 운영 정보 표시
 * 3. 이미지 갤러리
 * 4. 지도 표시
 * 5. 북마크 기능
 * 6. 공유 기능
 *
 * @dependencies
 * - Next.js 15 App Router (동적 라우팅)
 * - 한국관광공사 API
 * - Supabase (북마크 기능)
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getDetailCommon, getDetailIntro, getDetailImage, getDetailPetTour } from "@/lib/api/tour-api";
import { DetailInfo } from "@/components/tour-detail/detail-info";
import { DetailIntro } from "@/components/tour-detail/detail-intro";
import { DetailGallery } from "@/components/tour-detail/detail-gallery";
import { DetailMap } from "@/components/tour-detail/detail-map";
import { DetailPetTour } from "@/components/tour-detail/detail-pet-tour";
import { DetailRecommended } from "@/components/tour-detail/detail-recommended";
import { ShareButton } from "@/components/tour-detail/share-button";
import { BookmarkButton } from "@/components/bookmarks/bookmark-button";
import { Error as ErrorDisplay } from "@/components/ui/error";

interface PlaceDetailPageProps {
  params: Promise<{
    contentId: string;
  }>;
}

/**
 * 동적 메타데이터 생성
 */
export async function generateMetadata({
  params,
}: PlaceDetailPageProps): Promise<Metadata> {
  const { contentId } = await params;

  try {
    const detail = await getDetailCommon(contentId);

    const title = `${detail.title} - My Trip`;
    const description = detail.overview
      ? detail.overview.substring(0, 100).replace(/\n/g, " ").trim()
      : `${detail.title}의 상세 정보를 확인하세요.`;
    const image =
      detail.firstimage || detail.firstimage2 || "/og-image.png";
    // URL 생성 (환경변수 또는 기본값 사용)
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://my-trip.vercel.app";
    const url = `${baseUrl}/places/${contentId}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: detail.title,
          },
        ],
        url,
        type: "website",
        locale: "ko_KR",
        siteName: "My Trip",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    return {
      title: "관광지 상세 - My Trip",
      description: "관광지 상세 정보를 확인하세요.",
    };
  }
}

/**
 * 관광지 상세페이지 컴포넌트
 * 
 * @param params - 동적 라우팅 파라미터 (contentId)
 * @returns 상세페이지 JSX
 */
export default async function PlaceDetailPage({
  params,
}: PlaceDetailPageProps) {
  // Next.js 15: params는 Promise이므로 await 필요
  const { contentId } = await params;

  // contentId 유효성 검사 (숫자만 허용)
  if (!contentId || !/^\d+$/.test(contentId)) {
    notFound();
  }

  // 관광지 상세 정보 조회
  let detail;
  let intro;
  let images;
  let petInfo;
  let errorMessage: string | null = null;

  try {
    detail = await getDetailCommon(contentId);
    
    // 운영 정보 조회 (contentTypeId 필요)
    if (detail) {
      try {
        intro = await getDetailIntro(contentId, detail.contenttypeid);
      } catch (introErr: unknown) {
        // 운영 정보는 없을 수 있으므로 에러를 무시 (로그만)
        console.warn("운영 정보 조회 실패:", introErr);
      }

      // 이미지 목록 조회
      try {
        images = await getDetailImage(contentId);
      } catch (imageErr: unknown) {
        // 이미지는 없을 수 있으므로 에러를 무시 (로그만)
        console.warn("이미지 목록 조회 실패:", imageErr);
      }

      // 반려동물 정보 조회
      try {
        petInfo = await getDetailPetTour(contentId);
      } catch (petErr: unknown) {
        // 반려동물 정보는 없을 수 있으므로 에러를 무시 (로그만)
        console.warn("반려동물 정보 조회 실패:", petErr);
      }
    }
  } catch (err: unknown) {
    console.error("관광지 상세 정보 조회 실패:", err);
    
    // 타입 가드로 Error 인스턴스 확인
    const error = err instanceof Error ? err : new Error(String(err));
    
    // 404 에러인 경우 not-found 페이지로 리다이렉트
    if (error.message.includes("not found")) {
      notFound();
    }
    
    errorMessage = error.message || "관광지 정보를 불러올 수 없습니다.";
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 영역 - 뒤로가기 버튼, 북마크 버튼 및 공유 버튼 */}
      <header className="sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              aria-label="목록으로 돌아가기"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">목록으로</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BookmarkButton contentId={contentId} size="sm" />
            <ShareButton size="sm" />
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="container mx-auto max-w-7xl px-4 py-6">
        {/* 에러 상태 */}
        {errorMessage && (
          <div className="mb-6">
            <ErrorDisplay
              message={errorMessage}
            />
          </div>
        )}

        {/* 기본 정보 섹션 */}
        {detail && <DetailInfo detail={detail} className="mb-8" />}

        {/* 운영 정보 섹션 */}
        {intro && <DetailIntro intro={intro} className="mb-8" />}

        {/* 이미지 갤러리 */}
        {images && images.length > 0 && (
          <DetailGallery
            images={images}
            title={detail?.title}
            className="mb-8"
          />
        )}

        {/* 지도 섹션 */}
        {detail && detail.mapx && detail.mapy && (
          <DetailMap
            mapx={detail.mapx}
            mapy={detail.mapy}
            title={detail.title}
            address={detail.addr1}
            className="mb-8"
          />
        )}

        {/* 반려동물 정보 섹션 */}
        {petInfo && <DetailPetTour petInfo={petInfo} className="mb-8" />}

        {/* 추천 관광지 섹션 */}
        {detail && (
          <DetailRecommended
            currentContentId={contentId}
            areaCode={detail.areacode}
            contentTypeId={detail.contenttypeid}
            className="mb-8"
          />
        )}
      </main>
    </div>
  );
}

