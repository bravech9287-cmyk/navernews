/**
 * @file page.tsx
 * @description 홈페이지 - 관광지 목록
 *
 * My Trip 홈페이지입니다.
 * 관광지 목록을 표시하는 메인 페이지입니다.
 *
 * Server Component로 구현되어 있으며,
 * URL 쿼리 파라미터를 통해 필터링된 관광지 목록을 표시합니다.
 */

import { getAreaBasedList, getAreaCode, searchKeyword } from "@/lib/api/tour-api";
import { TourList } from "@/components/tour-list";
import { TourFilters } from "@/components/tour-filters";
import { TourSearch } from "@/components/tour-search";
import { Footer } from "@/components/Footer";

interface HomeProps {
  searchParams: Promise<{
    keyword?: string;
    areaCode?: string;
    contentTypeId?: string;
    arrange?: string;
    pageNo?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const keyword = params.keyword;
  const areaCode = params.areaCode;
  const contentTypeId = params.contentTypeId;
  const arrange = params.arrange || "C";
  const pageNo = Number(params.pageNo) || 1;

  let tours = [];
  let error: Error | null = null;
  let areas: Array<{ code: string; name: string }> = [];
  let resultCount = 0;

  // 지역 목록 조회
  try {
    const areaList = await getAreaCode();
    areas = areaList.map((area) => ({
      code: area.code,
      name: area.name,
    }));
  } catch (err) {
    console.error("Failed to fetch areas:", err);
  }

  // 관광지 목록 조회 (검색 또는 필터)
  try {
    if (keyword && keyword.trim()) {
      // 검색 API 사용
      const searchParams: Parameters<typeof searchKeyword>[0] = {
        keyword: keyword.trim(),
        numOfRows: 20,
        pageNo,
        arrange,
      };

      if (areaCode) {
        searchParams.areaCode = areaCode;
      }
      if (contentTypeId) {
        searchParams.contentTypeId = contentTypeId;
      }

      tours = await searchKeyword(searchParams);
      resultCount = tours.length;
    } else {
      // 필터 API 사용
      const queryParams: Parameters<typeof getAreaBasedList>[0] = {
        numOfRows: 20,
        pageNo,
        arrange,
      };

      if (areaCode) {
        queryParams.areaCode = areaCode;
      }
      if (contentTypeId) {
        queryParams.contentTypeId = contentTypeId;
      }

      tours = await getAreaBasedList(queryParams);
      resultCount = tours.length;
    }
  } catch (err) {
    error =
      err instanceof Error
        ? err
        : (new Error(
            keyword
              ? "검색 중 오류가 발생했습니다."
              : "관광지 목록을 불러오는 중 오류가 발생했습니다."
          ) as Error);
    console.error("Failed to fetch tours:", err);
  }

  return (
    <>
      {/* 메인 컨텐츠 영역 */}
      <main className="min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* Hero Section */}
          <section className="mb-12 text-center space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4 md:text-5xl lg:text-6xl">
                한국의 아름다운 관광지를 탐험하세요
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                전국의 관광지 정보를 쉽게 검색하고 발견하세요
              </p>
            </div>
            {/* Hero 검색창 */}
            <TourSearch variant="hero" />
          </section>

          {/* 필터 영역 */}
          <section className="mb-8">
            <TourFilters areas={areas} />
          </section>

          {/* 검색 결과 정보 */}
          {keyword && (
            <section className="mb-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    &quot;{keyword}&quot;
                  </span>
                  {" 검색 결과 "}
                  <span className="font-semibold text-foreground">
                    {resultCount}개
                  </span>
                </p>
              </div>
            </section>
          )}

          {/* 관광지 목록 영역 */}
          <section className="space-y-8">
            <TourList tours={tours} error={error} />
          </section>
        </div>
      </main>

      {/* 푸터 */}
      <Footer />
    </>
  );
}
