"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

export default function SupabaseTestPage() {
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus("testing");
      setError(null);

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      const supabase = createClient(supabaseUrl, supabaseKey);

      // 간단한 쿼리로 연결 테스트
      const { error } = await supabase.from("users").select("count");

      if (error) throw error;

      setConnectionStatus("success");
    } catch (err) {
      setConnectionStatus("error");
      setError(err instanceof Error ? err.message : "연결 테스트 실패");
      console.error("Connection test error:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Supabase 연결 테스트</h1>
        <p className="text-gray-600">
          Clerk 없이 Supabase 연결만 테스트합니다.
        </p>
      </div>

      {/* 연결 상태 */}
      <div className="mb-8 p-6 border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Supabase 연결 상태</h2>
          <button
            onClick={testConnection}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={connectionStatus === "testing"}
          >
            {connectionStatus === "testing" ? "테스트 중..." : "다시 테스트"}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {connectionStatus === "idle" && (
            <>
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="text-gray-600">대기 중</span>
            </>
          )}
          {connectionStatus === "testing" && (
            <>
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-blue-600">연결 테스트 중...</span>
            </>
          )}
          {connectionStatus === "success" && (
            <>
              <div className="w-6 h-6 text-green-600">✓</div>
              <span className="text-green-600 font-semibold">연결 성공!</span>
            </>
          )}
          {connectionStatus === "error" && (
            <>
              <div className="w-6 h-6 text-red-600">✕</div>
              <span className="text-red-600 font-semibold">연결 실패</span>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800">에러</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      <div className="text-center">
        <a href="/" className="text-blue-600 hover:underline">
          ← 홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}
