/**
 * @file detail-intro.tsx
 * @description 관광지 운영 정보 섹션 컴포넌트
 *
 * 관광지 상세페이지의 운영 정보를 표시하는 컴포넌트입니다.
 * 타입별로 다른 필드를 표시합니다.
 *
 * 주요 기능:
 * 1. 운영시간/개장시간 (타입별로 다른 필드)
 * 2. 휴무일 (타입별로 다른 필드)
 * 3. 이용요금 (타입별로 다른 필드)
 * 4. 주차 가능 여부
 * 5. 수용인원
 * 6. 체험 프로그램 (관광지 타입)
 * 7. 유모차/반려동물 동반 가능 여부
 * 8. 정보 없는 항목 숨김 처리
 *
 * @dependencies
 * - @/lib/types/tour: TourIntro 타입
 * - @/lib/types/tour: ContentTypeId
 * - lucide-react: 아이콘
 */

"use client";

import type { TourIntro } from "@/lib/types/tour";
import { ContentTypeId } from "@/lib/types/tour";
import {
  Clock,
  Calendar,
  DollarSign,
  Car,
  Users,
  Baby,
  Dog,
  Info,
  MapPin,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailIntroProps {
  intro: TourIntro;
  className?: string;
}

/**
 * 정보 항목을 표시하는 헬퍼 컴포넌트
 */
function InfoItem({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-3 p-4 rounded-lg border bg-card", className)}>
      <Icon className="h-5 w-5 mt-0.5 text-primary shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium mb-1">{label}</p>
        <p className="text-muted-foreground whitespace-pre-wrap break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

/**
 * 관광지 운영 정보 섹션 컴포넌트
 */
export function DetailIntro({ intro, className }: DetailIntroProps) {
  const contentTypeId = intro.contenttypeid;
  const hasInfo = Boolean(
    intro.usetime ||
      intro.restdate ||
      intro.infocenter ||
      intro.parking ||
      intro.chkpet ||
      intro.expguide ||
      intro.expagerange ||
      intro.usefee ||
      intro.usetimeculture ||
      intro.restdateculture ||
      intro.playtime ||
      intro.eventstartdate ||
      intro.eventenddate ||
      intro.eventplace ||
      intro.eventhomepage ||
      intro.distance ||
      intro.taketime ||
      intro.usefeeleports ||
      intro.usetimeleports ||
      intro.roomcount ||
      intro.roomtype ||
      intro.refundregulation ||
      intro.opentime ||
      intro.restdateshopping ||
      intro.shopguide ||
      intro.opentimefood ||
      intro.restdatefood ||
      intro.treatmenu ||
      intro.firstmenu ||
      intro.reservationfood ||
      intro.lcnsno
  );

  if (!hasInfo) {
    return null;
  }

  return (
    <section className={cn("space-y-6", className)} aria-label="운영 정보">
      <h2 className="text-2xl font-bold">운영 정보</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 운영시간/이용시간 - 타입별로 다른 필드 */}
        {(intro.usetime ||
          intro.usetimeculture ||
          intro.usetimeleports ||
          intro.opentime ||
          intro.opentimefood) && (
          <InfoItem
            icon={Clock}
            label="운영시간"
            value={
              intro.usetime ||
              intro.usetimeculture ||
              intro.usetimeleports ||
              intro.opentime ||
              intro.opentimefood ||
              ""
            }
          />
        )}

        {/* 휴무일 - 타입별로 다른 필드 */}
        {(intro.restdate ||
          intro.restdateculture ||
          intro.restdateshopping ||
          intro.restdatefood) && (
          <InfoItem
            icon={Calendar}
            label="휴무일"
            value={
              intro.restdate ||
              intro.restdateculture ||
              intro.restdateshopping ||
              intro.restdatefood ||
              ""
            }
          />
        )}

        {/* 이용요금 - 타입별로 다른 필드 */}
        {(intro.usefee || intro.usefeeleports) && (
          <InfoItem
            icon={DollarSign}
            label="이용요금"
            value={intro.usefee || intro.usefeeleports || ""}
          />
        )}

        {/* 주차 가능 여부 */}
        {intro.parking && (
          <InfoItem icon={Car} label="주차 정보" value={intro.parking} />
        )}

        {/* 문의처 */}
        {intro.infocenter && (
          <InfoItem icon={Info} label="문의처" value={intro.infocenter} />
        )}

        {/* 반려동물 동반 가능 여부 */}
        {intro.chkpet && (
          <InfoItem
            icon={Dog}
            label="반려동물 동반"
            value={intro.chkpet}
          />
        )}
      </div>

      {/* 타입별 특수 정보 */}
      {contentTypeId === ContentTypeId.TOURIST_SPOT && (
        <>
          {/* 체험안내 */}
          {intro.expguide && (
            <InfoItem icon={Info} label="체험안내" value={intro.expguide} />
          )}
          {/* 체험가능연령 */}
          {intro.expagerange && (
            <InfoItem
              icon={Users}
              label="체험가능연령"
              value={intro.expagerange}
            />
          )}
        </>
      )}

      {contentTypeId === ContentTypeId.FESTIVAL && (
        <>
          {/* 행사기간 */}
          {(intro.eventstartdate || intro.eventenddate) && (
            <InfoItem
              icon={Calendar}
              label="행사기간"
              value={`${intro.eventstartdate || ""} ~ ${intro.eventenddate || ""}`}
            />
          )}
          {/* 공연시간 */}
          {intro.playtime && (
            <InfoItem icon={Clock} label="공연시간" value={intro.playtime} />
          )}
          {/* 행사장소 */}
          {intro.eventplace && (
            <InfoItem icon={MapPin} label="행사장소" value={intro.eventplace} />
          )}
          {/* 행사홈페이지 */}
          {intro.eventhomepage && (
            <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
              <Globe className="h-5 w-5 mt-0.5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-1">행사홈페이지</p>
                <a
                  href={intro.eventhomepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all"
                >
                  {intro.eventhomepage}
                </a>
              </div>
            </div>
          )}
        </>
      )}

      {contentTypeId === ContentTypeId.TOUR_COURSE && (
        <>
          {/* 코스거리 */}
          {intro.distance && (
            <InfoItem icon={MapPin} label="코스거리" value={intro.distance} />
          )}
          {/* 소요시간 */}
          {intro.taketime && (
            <InfoItem icon={Clock} label="소요시간" value={intro.taketime} />
          )}
        </>
      )}

      {contentTypeId === ContentTypeId.ACCOMMODATION && (
        <>
          {/* 객실수 */}
          {intro.roomcount && (
            <InfoItem icon={Users} label="객실수" value={intro.roomcount} />
          )}
          {/* 객실유형 */}
          {intro.roomtype && (
            <InfoItem icon={Info} label="객실유형" value={intro.roomtype} />
          )}
          {/* 환불규정 */}
          {intro.refundregulation && (
            <InfoItem
              icon={Info}
              label="환불규정"
              value={intro.refundregulation}
            />
          )}
        </>
      )}

      {contentTypeId === ContentTypeId.SHOPPING && (
        <>
          {/* 쇼핑안내 */}
          {intro.shopguide && (
            <InfoItem icon={Info} label="쇼핑안내" value={intro.shopguide} />
          )}
        </>
      )}

      {contentTypeId === ContentTypeId.RESTAURANT && (
        <>
          {/* 대표메뉴 */}
          {intro.treatmenu && (
            <InfoItem icon={Info} label="대표메뉴" value={intro.treatmenu} />
          )}
          {/* 주메뉴 */}
          {intro.firstmenu && (
            <InfoItem icon={Info} label="주메뉴" value={intro.firstmenu} />
          )}
          {/* 예약안내 */}
          {intro.reservationfood && (
            <InfoItem
              icon={Info}
              label="예약안내"
              value={intro.reservationfood}
            />
          )}
          {/* 인허가번호 */}
          {intro.lcnsno && (
            <InfoItem icon={Info} label="인허가번호" value={intro.lcnsno} />
          )}
        </>
      )}
    </section>
  );
}

