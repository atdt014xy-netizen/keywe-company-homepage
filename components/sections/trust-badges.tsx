import { ShieldCheck, HandCoins, Gift } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "정식 등록 대부중개업체" },
  { icon: HandCoins, label: "고객 중개수수료 없음" },
  { icon: Gift, label: "상담 신청 무료" },
];

export function TrustBadges() {
  return (
    <section aria-label="신뢰 정보" className="mx-auto max-w-[860px] px-5 pb-10">
      <ul className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-8">
        {badges.map((badge) => (
          <li key={badge.label} className="flex items-center justify-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <badge.icon className="size-4.5" strokeWidth={1.75} />
            </span>
            <span className="font-sans text-sm font-bold text-foreground/80">
              {badge.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
