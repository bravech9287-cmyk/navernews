/**
 * @file bookmark-api.ts
 * @description 북마크 API 유틸리티 함수
 *
 * Supabase를 사용하여 북마크 관련 작업을 수행하는 유틸리티 함수들입니다.
 * Clerk 인증을 사용하며, Supabase users 테이블과 bookmarks 테이블을 사용합니다.
 *
 * @dependencies
 * - @supabase/supabase-js: Supabase 클라이언트
 */

/**
 * 북마크 인터페이스
 */
export interface Bookmark {
  id: string;
  user_id: string;
  content_id: string;
  created_at: string;
}

/**
 * Supabase 클라이언트 타입
 */
type SupabaseClient = ReturnType<
  typeof import("@/lib/supabase/clerk-client").useClerkSupabaseClient
>;

/**
 * Clerk userId로 Supabase user_id 가져오기
 */
export async function getSupabaseUserId(
  supabase: SupabaseClient,
  clerkUserId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkUserId)
    .single();

  if (error || !data) {
    console.error("Failed to get Supabase user ID:", error);
    return null;
  }

  return data.id;
}

/**
 * 북마크 조회
 */
export async function getBookmark(
  supabase: SupabaseClient,
  userId: string | null | undefined,
  contentId: string
): Promise<Bookmark | null> {
  if (!userId) {
    return null;
  }

  // Supabase user_id 가져오기
  const supabaseUserId = await getSupabaseUserId(supabase, userId);
  if (!supabaseUserId) {
    return null;
  }

  // 북마크 조회
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", supabaseUserId)
    .eq("content_id", contentId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // 북마크 없음
      return null;
    }
    console.error("Failed to get bookmark:", error);
    return null;
  }

  return data;
}

/**
 * 북마크 추가
 */
export async function addBookmark(
  supabase: SupabaseClient,
  userId: string | null | undefined,
  contentId: string
): Promise<boolean> {
  if (!userId) {
    throw new Error("로그인이 필요합니다.");
  }

  // Supabase user_id 가져오기
  const supabaseUserId = await getSupabaseUserId(supabase, userId);
  if (!supabaseUserId) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }

  // 북마크 추가
  const { error } = await supabase.from("bookmarks").insert({
    user_id: supabaseUserId,
    content_id: contentId,
  });

  if (error) {
    if (error.code === "23505") {
      // UNIQUE 제약 위반 (이미 북마크됨)
      throw new Error("이미 북마크된 관광지입니다.");
    }
    console.error("Failed to add bookmark:", error);
    throw new Error("북마크 추가에 실패했습니다.");
  }

  return true;
}

/**
 * 북마크 제거
 */
export async function removeBookmark(
  supabase: SupabaseClient,
  userId: string | null | undefined,
  contentId: string
): Promise<boolean> {
  if (!userId) {
    throw new Error("로그인이 필요합니다.");
  }

  // Supabase user_id 가져오기
  const supabaseUserId = await getSupabaseUserId(supabase, userId);
  if (!supabaseUserId) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }

  // 북마크 제거
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", supabaseUserId)
    .eq("content_id", contentId);

  if (error) {
    console.error("Failed to remove bookmark:", error);
    throw new Error("북마크 제거에 실패했습니다.");
  }

  return true;
}

/**
 * 사용자 북마크 목록 조회
 */
export async function getUserBookmarks(
  supabase: SupabaseClient,
  userId: string | null | undefined
): Promise<Bookmark[]> {
  if (!userId) {
    return [];
  }

  // Supabase user_id 가져오기
  const supabaseUserId = await getSupabaseUserId(supabase, userId);
  if (!supabaseUserId) {
    return [];
  }

  // 북마크 목록 조회
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", supabaseUserId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to get bookmarks:", error);
    return [];
  }

  return data || [];
}

