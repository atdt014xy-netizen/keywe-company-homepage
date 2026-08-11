import Image from "next/image";
import { Quote, ShieldCheck, Award, Users } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "금융 관련 자격 보유 상담사" },
  { icon: Award, label: "15년 이상의 상담 노하우" },
  { icon: Users, label: "1,200명 이상이 함께한 상담" },
];

export function Trust() {
  return (
    <section id="trust" className="bg-secondary/40 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
        <div className="relative -mx-5 aspect-4/5 overflow-hidden rounded-[8px] border border-border/60 shadow-lg shadow-primary/5 md:mx-0 md:rounded-[18px]">
          <Image
            src="/images/trust.png"
            alt="도시 스카이라인 속에서 따뜻하게 빛나는 빌딩과 신뢰를 상징하는 동전"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>

        <div>
          <span className="text-sm font-semibold text-primary">고객 신뢰</span>
          <h2 className="mt-3 text-balance font-heading text-3xl font-bold text-foreground sm:text-4xl">
            안전하게, 그리고
            <br />
            투명하게
          </h2>
          <p className="mt-5 leading-relaxed text-foreground/70">
            Key We Company는 상품 판매 실적이 아닌 고객님의 이익을 최우선으로
            생각합니다. 모든 상담 내용은 문서로 정리해 투명하게 공유합니다.
          </p>

          <ul className="mt-6 space-y-3">
            {badges.map((badge) => (
              <li key={badge.label} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-primary">
                  <badge.icon className="size-4.5" strokeWidth={1.75} />
                </span>
                <span className="text-sm font-medium text-foreground/80">
                  {badge.label}
                </span>
              </li>
            ))}
          </ul>

          <blockquote className="mt-8 rounded-xl bg-background p-6 shadow-sm">
            <Quote className="size-6 text-primary/40" />
            <p className="mt-3 leading-relaxed text-foreground/80">
              &ldquo;복잡하게만 느껴지던 재무 설계를 제 상황에 맞게 차근차근
              설명해 주셔서 마음이 놓였어요. 지금도 정기적으로 점검받고
              있습니다.&rdquo;
            </p>
            <footer className="mt-3 text-sm font-medium text-foreground/50">
              — Key We Company 상담 고객
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
