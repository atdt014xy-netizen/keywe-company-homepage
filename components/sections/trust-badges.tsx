import { ShieldCheck, HandCoins, Gift } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "정식 등록 대부중개업체" },
  { icon: HandCoins, label: "고객 중개수수료 0원" },
  { icon: Gift, label: "상담 신청 무료" },
];

export function TrustBadges() {
  return (
    <section aria-label="신뢰 정보" className="mx-auto max-w-[860px] px-5 pb-10">
      <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-center">
        {badges.map((badge, i) => (
          <li key={badge.label} className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm font-bold text-foreground/80">
              <badge.icon className="size-4 text-primary" strokeWidth={1.75} aria-hidden="true" />
              {badge.label}
            </span>
            {i < badges.length - 1 && (
              <span className="text-foreground/30" aria-hidden="true">
                ·
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
