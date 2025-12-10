/**
 * @file route.ts
 * @description 한국관광공사 API 프록시 엔드포인트
 *
 * 이 API Route는 클라이언트에서 한국관광공사 API를 호출할 수 있도록 프록시 역할을 합니다.
 * 쿼리 파라미터로 엔드포인트를 구분하여 각 API 함수를 호출합니다.
 *
 * 지원 엔드포인트:
 * - areaCode2: 지역코드 조회
 * - areaBasedList2: 지역 기반 목록
 * - searchKeyword2: 키워드 검색
 * - detailCommon2: 공통 정보
 * - detailIntro2: 소개 정보
 * - detailImage2: 이미지 목록
 * - detailPetTour2: 반려동물 정보
 *
 * @example
 * GET /api/tour?endpoint=areaCode2
 * GET /api/tour?endpoint=areaBasedList2&areaCode=1&contentTypeId=12
 * GET /api/tour?endpoint=searchKeyword2&keyword=서울
 * GET /api/tour?endpoint=detailCommon2&contentId=125266
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getAreaCode,
  getAreaBasedList,
  searchKeyword,
  getDetailCommon,
  getDetailIntro,
  getDetailImage,
  getDetailPetTour,
  TourApiError,
} from "@/lib/api/tour-api";

/**
 * GET 핸들러
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get("endpoint");

    if (!endpoint) {
      return NextResponse.json(
        { error: "endpoint parameter is required" },
        { status: 400 }
      );
    }

    let result;

    switch (endpoint) {
      case "areaCode2": {
        const areaCode = searchParams.get("areaCode") || undefined;
        result = await getAreaCode(areaCode);
        break;
      }

      case "areaBasedList2": {
        const params = {
          areaCode: searchParams.get("areaCode") || undefined,
          sigunguCode: searchParams.get("sigunguCode") || undefined,
          contentTypeId: searchParams.get("contentTypeId") || undefined,
          cat1: searchParams.get("cat1") || undefined,
          cat2: searchParams.get("cat2") || undefined,
          cat3: searchParams.get("cat3") || undefined,
          numOfRows: searchParams.get("numOfRows")
            ? Number(searchParams.get("numOfRows"))
            : undefined,
          pageNo: searchParams.get("pageNo")
            ? Number(searchParams.get("pageNo"))
            : undefined,
          arrange: searchParams.get("arrange") || undefined,
          modifiedtime: searchParams.get("modifiedtime") || undefined,
        };
        result = await getAreaBasedList(params);
        break;
      }

      case "searchKeyword2": {
        const keyword = searchParams.get("keyword");
        if (!keyword) {
          return NextResponse.json(
            { error: "keyword parameter is required for searchKeyword2" },
            { status: 400 }
          );
        }
        const params = {
          keyword,
          areaCode: searchParams.get("areaCode") || undefined,
          sigunguCode: searchParams.get("sigunguCode") || undefined,
          contentTypeId: searchParams.get("contentTypeId") || undefined,
          cat1: searchParams.get("cat1") || undefined,
          cat2: searchParams.get("cat2") || undefined,
          cat3: searchParams.get("cat3") || undefined,
          numOfRows: searchParams.get("numOfRows")
            ? Number(searchParams.get("numOfRows"))
            : undefined,
          pageNo: searchParams.get("pageNo")
            ? Number(searchParams.get("pageNo"))
            : undefined,
          arrange: searchParams.get("arrange") || undefined,
          modifiedtime: searchParams.get("modifiedtime") || undefined,
        };
        result = await searchKeyword(params);
        break;
      }

      case "detailCommon2": {
        const contentId = searchParams.get("contentId");
        if (!contentId) {
          return NextResponse.json(
            { error: "contentId parameter is required for detailCommon2" },
            { status: 400 }
          );
        }
        result = await getDetailCommon(contentId);
        break;
      }

      case "detailIntro2": {
        const contentId = searchParams.get("contentId");
        const contentTypeId = searchParams.get("contentTypeId");
        if (!contentId || !contentTypeId) {
          return NextResponse.json(
            {
              error:
                "contentId and contentTypeId parameters are required for detailIntro2",
            },
            { status: 400 }
          );
        }
        result = await getDetailIntro(contentId, contentTypeId);
        break;
      }

      case "detailImage2": {
        const contentId = searchParams.get("contentId");
        if (!contentId) {
          return NextResponse.json(
            { error: "contentId parameter is required for detailImage2" },
            { status: 400 }
          );
        }
        result = await getDetailImage(contentId);
        break;
      }

      case "detailPetTour2": {
        const contentId = searchParams.get("contentId");
        if (!contentId) {
          return NextResponse.json(
            { error: "contentId parameter is required for detailPetTour2" },
            { status: 400 }
          );
        }
        result = await getDetailPetTour(contentId);
        break;
      }

      default:
        return NextResponse.json(
          {
            error: `Unknown endpoint: ${endpoint}`,
            availableEndpoints: [
              "areaCode2",
              "areaBasedList2",
              "searchKeyword2",
              "detailCommon2",
              "detailIntro2",
              "detailImage2",
              "detailPetTour2",
            ],
          },
          { status: 400 }
        );
    }

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Tour API error:", error);

    if (error instanceof TourApiError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          apiErrorCode: error.apiErrorCode,
          statusCode: error.statusCode,
        },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

