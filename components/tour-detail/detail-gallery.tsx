/**
 * @file detail-gallery.tsx
 * @description 관광지 이미지 갤러리 섹션 컴포넌트
 *
 * 관광지 상세페이지의 이미지 갤러리를 표시하는 컴포넌트입니다.
 * 이미지 슬라이드 및 전체화면 모달 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 대표 이미지 + 서브 이미지들
 * 2. 이미지 슬라이드 기능 (이전/다음 버튼, 인디케이터)
 * 3. 이미지 클릭 시 전체화면 모달
 * 4. 이미지 없으면 기본 이미지 표시
 * 5. Next.js Image 컴포넌트 사용 (최적화)
 *
 * @dependencies
 * - @/lib/types/tour: TourImage 타입
 * - next/image: Next.js Image 컴포넌트
 * - @/components/ui/dialog: 모달 다이얼로그
 * - lucide-react: 아이콘
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import type { TourImage } from "@/lib/types/tour";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailGalleryProps {
  images: TourImage[];
  title?: string;
  className?: string;
}

/**
 * 관광지 이미지 갤러리 섹션 컴포넌트
 */
export function DetailGallery({
  images,
  title,
  className,
}: DetailGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleImageClick = (index: number) => {
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const handleModalPrev = () => {
    setModalIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleModalNext = () => {
    setModalIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const currentImage = images[currentIndex];
  const modalImage = images[modalIndex];

  return (
    <section className={cn("space-y-4", className)} aria-label="이미지 갤러리">
      <h2 className="text-2xl font-bold">이미지 갤러리</h2>

      {/* 메인 이미지 슬라이더 */}
      <div className="relative w-full rounded-xl overflow-hidden border bg-muted">
        {/* 메인 이미지 */}
        <div className="relative w-full h-64 md:h-96 bg-muted">
          {currentImage.originimgurl ? (
            <Image
              src={currentImage.originimgurl}
              alt={title ? `${title} 이미지 ${currentIndex + 1}` : `이미지 ${currentIndex + 1}`}
              fill
              className="object-cover cursor-pointer"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              onClick={() => handleImageClick(currentIndex)}
              priority={currentIndex === 0}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <MapPin className="h-16 w-16" />
            </div>
          )}

          {/* 이전/다음 버튼 (이미지가 2개 이상일 때만 표시) */}
          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                onClick={handlePrev}
                aria-label="이전 이미지"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                onClick={handleNext}
                aria-label="다음 이미지"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* 이미지 카운터 */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* 썸네일 그리드 (이미지가 2개 이상일 때만 표시) */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {images.map((image, index) => (
            <button
              key={image.serialnum}
              onClick={() => {
                setCurrentIndex(index);
                handleImageClick(index);
              }}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                currentIndex === index
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-border hover:border-primary/50"
              )}
              aria-label={`이미지 ${index + 1} 선택`}
            >
              {image.smallimageurl || image.originimgurl ? (
                <Image
                  src={image.smallimageurl || image.originimgurl}
                  alt={title ? `${title} 썸네일 ${index + 1}` : `썸네일 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, (max-width: 1200px) 16vw, 12vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                  <MapPin className="h-6 w-6" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 전체화면 모달 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-none [&>button]:hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* 닫기 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20"
              onClick={() => setIsModalOpen(false)}
              aria-label="닫기"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* 모달 이미지 */}
            {modalImage.originimgurl ? (
              <div className="relative w-full h-full">
                <Image
                  src={modalImage.originimgurl}
                  alt={title ? `${title} 이미지 ${modalIndex + 1}` : `이미지 ${modalIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <MapPin className="h-24 w-24" />
              </div>
            )}

            {/* 이전/다음 버튼 */}
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 text-white border-white/20"
                  onClick={handleModalPrev}
                  aria-label="이전 이미지"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 text-white border-white/20"
                  onClick={handleModalNext}
                  aria-label="다음 이미지"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                {/* 모달 이미지 카운터 */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm text-white font-medium">
                  {modalIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

