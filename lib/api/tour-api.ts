/**
 * @file tour-api.ts
 * @description 한국관광공사 공공 API(KorService2) 클라이언트
 *
 * 이 파일은 한국관광공사 API를 호출하는 서버 사이드 함수들을 제공합니다.
 * 모든 함수는 서버 사이드에서만 사용해야 하며, API 키는 환경변수로 관리됩니다.
 *
 * 주요 기능:
 * 1. 지역코드 조회 (areaCode2)
 * 2. 지역 기반 목록 조회 (areaBasedList2)
 * 3. 키워드 검색 (searchKeyword2)
 * 4. 상세 정보 조회 (detailCommon2, detailIntro2, detailImage2, detailPetTour2)
 *
 * 에러 처리:
 * - 네트워크 에러 처리
 * - API 에러 응답 처리
 * - 재시도 로직 (최대 3회, 지수 백오프)
 *
 * @see {@link /docs/PRD.md} - API 명세
 * @see {@link /lib/types/tour.ts} - 타입 정의
 */

import type {
  ApiResponse,
  ApiErrorResponse,
  TourItem,
  TourDetail,
  TourIntro,
  TourImage,
  PetTourInfo,
  AreaCode,
} from "@/lib/types/tour";
import type { PaginatedResponse } from "@/lib/types/pagination";

/**
 * 커스텀 에러 클래스
 */
export class TourApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public apiErrorCode?: string
  ) {
    super(message);
    this.name = "TourApiError";
  }
}

/**
 * Base URL
 */
const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

/**
 * 공통 파라미터 타입
 */
interface CommonParams {
  serviceKey?: string;
  MobileOS?: string;
  MobileApp?: string;
  _type?: string;
  numOfRows?: number;
  pageNo?: number;
}

/**
 * API 키 가져오기
 */
function getApiKey(): string {
  const key =
    process.env.TOUR_API_KEY || process.env.NEXT_PUBLIC_TOUR_API_KEY;
  if (!key) {
    throw new TourApiError(
      "TOUR_API_KEY or NEXT_PUBLIC_TOUR_API_KEY environment variable is not set"
    );
  }
  return key;
}

/**
 * 공통 파라미터 생성
 */
function getCommonParams(
  customParams?: Partial<CommonParams>
): Record<string, string> {
  const params: Record<string, string> = {
    serviceKey: customParams?.serviceKey || getApiKey(),
    MobileOS: customParams?.MobileOS || "ETC",
    MobileApp: customParams?.MobileApp || "MyTrip",
    _type: customParams?._type || "json",
  };

  if (customParams?.numOfRows) {
    params.numOfRows = String(customParams.numOfRows);
  }
  if (customParams?.pageNo) {
    params.pageNo = String(customParams.pageNo);
  }

  return params;
}

/**
 * 지수 백오프를 사용한 재시도 로직
 */
async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * API 호출 (재시도 로직 포함)
 */
async function fetchWithRetry<T>(
  url: string,
  maxRetries = 3
): Promise<ApiResponse<T>> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        // Next.js 15에서 fetch 캐싱 설정
        next: { revalidate: 3600 }, // 1시간 캐싱
      });

      if (!response.ok) {
        throw new TourApiError(
          `API request failed with status ${response.status}`,
          response.status
        );
      }

      const data = (await response.json()) as ApiResponse<T> | ApiErrorResponse;

      // 에러 응답 확인
      if ("response" in data && data.response.header.resultCode !== "0000") {
        const errorMsg = data.response.header.resultMsg || "Unknown API error";
        throw new TourApiError(
          `API error: ${errorMsg}`,
          undefined,
          data.response.header.resultCode
        );
      }

      return data as ApiResponse<T>;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // 마지막 시도가 아니면 재시도
      if (attempt < maxRetries - 1) {
        const backoffMs = Math.pow(2, attempt) * 1000; // 지수 백오프: 1s, 2s, 4s
        await sleep(backoffMs);
        continue;
      }
    }
  }

  throw lastError || new TourApiError("API request failed after retries");
}

/**
 * 응답 데이터 추출 (단일 객체 또는 배열 처리)
 */
function extractItems<T>(response: ApiResponse<T>): T[] {
  const items = response.response.body.items;
  if (!items) {
    return [];
  }

  const item = items.item;
  if (!item) {
    return [];
  }

  // 배열인 경우
  if (Array.isArray(item)) {
    return item;
  }

  // 단일 객체인 경우
  return [item];
}

/**
 * 페이지네이션 정보 추출
 */
function extractPaginationInfo(response: ApiResponse<unknown>) {
  const body = response.response.body;
  return {
    totalCount: body.totalCount || 0,
    numOfRows: body.numOfRows || 20,
    pageNo: body.pageNo || 1,
  };
}

/**
 * 지역코드 조회 (areaCode2)
 * @param areaCode - 상위 지역코드 (선택, 없으면 시/도 목록)
 */
export async function getAreaCode(
  areaCode?: string
): Promise<AreaCode[]> {
  const params = getCommonParams();
  if (areaCode) {
    params.areaCode = areaCode;
  }

  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/areaCode2?${queryString}`;

  const response = await fetchWithRetry<AreaCode>(url);
  return extractItems(response);
}

/**
 * 지역 기반 목록 조회 (areaBasedList2)
 */
export interface GetAreaBasedListParams {
  areaCode?: string; // 지역코드
  sigunguCode?: string; // 시군구코드
  contentTypeId?: string; // 콘텐츠타입ID
  cat1?: string; // 대분류
  cat2?: string; // 중분류
  cat3?: string; // 소분류
  numOfRows?: number; // 페이지당 항목 수
  pageNo?: number; // 페이지 번호
  arrange?: string; // 정렬 (A: 제목순, B: 조회순, C: 수정일순, D: 생성일순)
  modifiedtime?: string; // 수정일 (YYYYMMDD)
}

export async function getAreaBasedList(
  params: GetAreaBasedListParams
): Promise<PaginatedResponse<TourItem>> {
  const numOfRows = params.numOfRows || 20;
  const pageNo = params.pageNo || 1;
  
  const commonParams = getCommonParams({
    numOfRows,
    pageNo,
  });

  const queryParams: Record<string, string> = { ...commonParams };

  if (params.areaCode) queryParams.areaCode = params.areaCode;
  if (params.sigunguCode) queryParams.sigunguCode = params.sigunguCode;
  if (params.contentTypeId) queryParams.contentTypeId = params.contentTypeId;
  if (params.cat1) queryParams.cat1 = params.cat1;
  if (params.cat2) queryParams.cat2 = params.cat2;
  if (params.cat3) queryParams.cat3 = params.cat3;
  if (params.arrange) queryParams.arrange = params.arrange;
  if (params.modifiedtime) queryParams.modifiedtime = params.modifiedtime;

  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${BASE_URL}/areaBasedList2?${queryString}`;

  const response = await fetchWithRetry<TourItem>(url);
  const items = extractItems(response);
  const pagination = extractPaginationInfo(response);
  
  const totalPages = Math.ceil(pagination.totalCount / numOfRows);

  return {
    items,
    totalCount: pagination.totalCount,
    numOfRows,
    pageNo,
    totalPages,
  };
}

/**
 * 키워드 검색 (searchKeyword2)
 */
export interface SearchKeywordParams {
  keyword: string; // 검색 키워드
  areaCode?: string; // 지역코드
  sigunguCode?: string; // 시군구코드
  contentTypeId?: string; // 콘텐츠타입ID
  cat1?: string; // 대분류
  cat2?: string; // 중분류
  cat3?: string; // 소분류
  numOfRows?: number;
  pageNo?: number;
  arrange?: string;
  modifiedtime?: string;
}

export async function searchKeyword(
  params: SearchKeywordParams
): Promise<PaginatedResponse<TourItem>> {
  if (!params.keyword || params.keyword.trim() === "") {
    throw new TourApiError("Keyword is required");
  }

  const numOfRows = params.numOfRows || 20;
  const pageNo = params.pageNo || 1;

  const commonParams = getCommonParams({
    numOfRows,
    pageNo,
  });

  const queryParams: Record<string, string> = {
    ...commonParams,
    keyword: params.keyword.trim(),
  };

  if (params.areaCode) queryParams.areaCode = params.areaCode;
  if (params.sigunguCode) queryParams.sigunguCode = params.sigunguCode;
  if (params.contentTypeId) queryParams.contentTypeId = params.contentTypeId;
  if (params.cat1) queryParams.cat1 = params.cat1;
  if (params.cat2) queryParams.cat2 = params.cat2;
  if (params.cat3) queryParams.cat3 = params.cat3;
  if (params.arrange) queryParams.arrange = params.arrange;
  if (params.modifiedtime) queryParams.modifiedtime = params.modifiedtime;

  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${BASE_URL}/searchKeyword2?${queryString}`;

  const response = await fetchWithRetry<TourItem>(url);
  const items = extractItems(response);
  const pagination = extractPaginationInfo(response);
  
  const totalPages = Math.ceil(pagination.totalCount / numOfRows);

  return {
    items,
    totalCount: pagination.totalCount,
    numOfRows,
    pageNo,
    totalPages,
  };
}

/**
 * 공통 정보 조회 (detailCommon2)
 */
export async function getDetailCommon(contentId: string): Promise<TourDetail> {
  if (!contentId || contentId.trim() === "") {
    throw new TourApiError("ContentId is required");
  }

  const params = getCommonParams();
  params.contentId = contentId.trim();

  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/detailCommon2?${queryString}`;

  const response = await fetchWithRetry<TourDetail>(url);
  const items = extractItems(response);

  if (items.length === 0) {
    throw new TourApiError(`Tour detail not found for contentId: ${contentId}`);
  }

  return items[0];
}

/**
 * 소개 정보 조회 (detailIntro2)
 */
export async function getDetailIntro(
  contentId: string,
  contentTypeId: string
): Promise<TourIntro> {
  if (!contentId || contentId.trim() === "") {
    throw new TourApiError("ContentId is required");
  }
  if (!contentTypeId || contentTypeId.trim() === "") {
    throw new TourApiError("ContentTypeId is required");
  }

  const params = getCommonParams();
  params.contentId = contentId.trim();
  params.contentTypeId = contentTypeId.trim();

  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/detailIntro2?${queryString}`;

  const response = await fetchWithRetry<TourIntro>(url);
  const items = extractItems(response);

  if (items.length === 0) {
    throw new TourApiError(
      `Tour intro not found for contentId: ${contentId}, contentTypeId: ${contentTypeId}`
    );
  }

  return items[0];
}

/**
 * 이미지 목록 조회 (detailImage2)
 */
export async function getDetailImage(contentId: string): Promise<TourImage[]> {
  if (!contentId || contentId.trim() === "") {
    throw new TourApiError("ContentId is required");
  }

  const params = getCommonParams();
  params.contentId = contentId.trim();

  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/detailImage2?${queryString}`;

  const response = await fetchWithRetry<TourImage>(url);
  return extractItems(response);
}

/**
 * 반려동물 정보 조회 (detailPetTour2)
 */
export async function getDetailPetTour(
  contentId: string
): Promise<PetTourInfo | null> {
  if (!contentId || contentId.trim() === "") {
    throw new TourApiError("ContentId is required");
  }

  const params = getCommonParams();
  params.contentId = contentId.trim();

  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/detailPetTour2?${queryString}`;

  try {
    const response = await fetchWithRetry<PetTourInfo>(url);
    const items = extractItems(response);

    // 반려동물 정보가 없을 수 있으므로 null 반환
    if (items.length === 0) {
      return null;
    }

    return items[0];
  } catch (error) {
    // API 에러가 발생해도 null 반환 (반려동물 정보는 선택 사항)
    if (error instanceof TourApiError && error.apiErrorCode === "SERVICE_ERROR") {
      return null;
    }
    throw error;
  }
}

