/**
 * @file route.ts
 * @description 무한 스크롤용 API Route
 *
 * 클라이언트에서 무한 스크롤을 위해 다음 페이지 데이터를 가져오는 API Route입니다.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAreaBasedList, searchKeyword } from "@/lib/api/tour-api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword");
    const areaCode = searchParams.get("areaCode");
    const contentTypeId = searchParams.get("contentTypeId");
    const arrange = searchParams.get("arrange") || "C";
    const pageNo = Number(searchParams.get("pageNo")) || 1;
    const numOfRows = Number(searchParams.get("numOfRows")) || 20;

    let result;

    if (keyword && keyword.trim()) {
      // 검색 API 사용
      const searchParams: Parameters<typeof searchKeyword>[0] = {
        keyword: keyword.trim(),
        numOfRows,
        pageNo,
        arrange,
      };

      if (areaCode) {
        searchParams.areaCode = areaCode;
      }
      if (contentTypeId) {
        searchParams.contentTypeId = contentTypeId;
      }

      result = await searchKeyword(searchParams);
    } else {
      // 필터 API 사용
      const queryParams: Parameters<typeof getAreaBasedList>[0] = {
        numOfRows,
        pageNo,
        arrange,
      };

      if (areaCode) {
        queryParams.areaCode = areaCode;
      }
      if (contentTypeId) {
        queryParams.contentTypeId = contentTypeId;
      }

      result = await getAreaBasedList(queryParams);
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Failed to fetch tours:", error);
    return NextResponse.json(
      {
        error: "관광지 목록을 불러오는 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

