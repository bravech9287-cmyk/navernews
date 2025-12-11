/**
 * @file type-chart.tsx
 * @description 관광 타입별 분포 차트 컴포넌트
 *
 * 관광 타입별 관광지 개수를 Donut Chart로 시각화하는 컴포넌트입니다.
 *
 * 주요 기능:
 * 1. Donut Chart로 타입별 관광지 비율 표시
 * 2. 타입별 개수 및 비율 표시
 * 3. 섹션 클릭 시 해당 타입 목록 페이지로 이동
 * 4. 호버 시 타입명, 개수, 비율 표시
 * 5. 반응형 디자인
 *
 * @dependencies
 * - recharts: PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer
 * - @/lib/types/stats: TypeStats 타입
 * - next/link: 타입별 목록 페이지 링크
 */

"use client";

import Link from "next/link";
import type { TypeStats } from "@/lib/types/stats";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface TypeChartProps {
  data: TypeStats[];
  className?: string;
}

// 차트 색상 팔레트
const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
];

/**
 * 관광 타입별 분포 차트 컴포넌트
 */
export function TypeChart({ data, className }: TypeChartProps) {
  // 차트 데이터 준비
  const chartData = data.map((stat, index) => ({
    name: stat.typeName,
    value: stat.count,
    percentage: stat.percentage,
    contentTypeId: stat.contentTypeId,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-popover p-3 shadow-md">
          <p className="font-semibold mb-1">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            개수: <span className="font-semibold text-foreground">{data.value.toLocaleString()}개</span>
          </p>
          <p className="text-sm text-muted-foreground">
            비율: <span className="font-semibold text-foreground">{data.percentage.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // 커스텀 레전드
  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <Link
            key={entry.value}
            href={`/?contentTypeId=${chartData[index].contentTypeId}`}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium">{entry.value}</span>
            <span className="text-xs text-muted-foreground">
              ({entry.payload.percentage.toFixed(1)}%)
            </span>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <section className={cn("space-y-4", className)} aria-label="관광 타입별 분포">
      <h2 className="text-xl font-semibold">관광 타입별 분포</h2>
      
      <div className="rounded-lg border bg-card p-6">
        {/* 차트 */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}: ${entry.percentage.toFixed(1)}%`}
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                className="cursor-pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderCustomLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 타입별 상세 목록 (클릭 가능) */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {chartData.map((item, index) => (
            <Link
              key={item.contentTypeId}
              href={`/?contentTypeId=${item.contentTypeId}`}
              className="p-3 rounded-lg border bg-muted hover:bg-accent hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-sm font-medium">{item.name}</p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {item.percentage.toFixed(1)}%
                </p>
                <p className="text-xs font-semibold">
                  {item.value.toLocaleString()}개
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

