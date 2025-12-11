/**
 * @file region-chart.tsx
 * @description 지역별 관광지 분포 차트 컴포넌트
 *
 * 지역별 관광지 개수를 Bar Chart로 시각화하는 컴포넌트입니다.
 *
 * 주요 기능:
 * 1. Bar Chart로 지역별 관광지 개수 표시
 * 2. 상위 10개 지역 표시
 * 3. 바 클릭 시 해당 지역 목록 페이지로 이동
 * 4. 호버 시 정확한 개수 표시
 * 5. 반응형 디자인
 *
 * @dependencies
 * - recharts: BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
 * - @/lib/types/stats: RegionStats 타입
 * - next/link: 지역 목록 페이지 링크
 */

"use client";

import Link from "next/link";
import type { RegionStats } from "@/lib/types/stats";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface RegionChartProps {
  data: RegionStats[];
  className?: string;
}

/**
 * 지역별 관광지 분포 차트 컴포넌트
 */
export function RegionChart({ data, className }: RegionChartProps) {
  // 상위 10개 지역만 표시
  const chartData = data.slice(0, 10).map((stat) => ({
    name: stat.name,
    count: stat.count,
    code: stat.code,
  }));

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-popover p-3 shadow-md">
          <p className="font-semibold mb-1">{payload[0].payload.name}</p>
          <p className="text-sm text-muted-foreground">
            관광지 수: <span className="font-semibold text-foreground">{payload[0].value.toLocaleString()}개</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className={cn("space-y-4", className)} aria-label="지역별 관광지 분포">
      <h2 className="text-xl font-semibold">지역별 관광지 분포</h2>
      
      <div className="rounded-lg border bg-card p-6">
        {/* 차트 */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                fill="hsl(var(--primary))"
                radius={[8, 8, 0, 0]}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 상위 10개 지역 목록 (클릭 가능) */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-2">
          {chartData.map((item) => (
            <Link
              key={item.code}
              href={`/?areaCode=${item.code}`}
              className="p-3 rounded-lg border bg-muted hover:bg-accent hover:border-primary transition-colors text-center"
            >
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {item.count.toLocaleString()}개
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

