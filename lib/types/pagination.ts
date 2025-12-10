/**
 * @file pagination.ts
 * @description 페이지네이션 관련 타입 정의
 */

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  numOfRows: number;
  pageNo: number;
  totalPages: number;
}

