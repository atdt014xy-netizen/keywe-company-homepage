import Image from "next/image";
import { Quote, ShieldCheck, HandCoins, Lock } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "정식 등록된 대부업체만 연결합니다" },
  { icon: HandCoins, label: "고객에게 중개수수료·사례금을 요구하지 않습니다" },
  { icon: Lock, label: "수집한 정보는 대부중개 목적 외로 사용하지 않습니다" },
];

export function Trust() {
  return (
    <section id="trust" className="bg-secondary/40 py-20">
      <div className="mx-auto grid max-w-[860px] items-center gap-12 px-5 md:grid-cols-2">
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
            Key We Company는 대부중개업 등록업체로서, 고객님을 직접 대출을
            실행하는 제휴 대부업체와 연결해드립니다. 승인 여부와 대출
            조건은 심사를 진행하는 해당 업체의 기준에 따라 결정됩니다.
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
              &ldquo;복잡하게만 느껴지던 대출 상담을 제 상황에 맞게 차근차근
              설명해 주셔서 마음이 놓였어요. 어떤 대부업체와 연결되는지도
              투명하게 알려주셔서 믿음이 갔습니다.&rdquo;
            </p>
            <footer className="mt-3 text-sm font-medium text-foreground/50">
              — Key We Company 상담 고객
            </footer>
          </blockquote>

          <p className="mt-4 text-xs leading-relaxed text-foreground/45">
            대출 가능 여부, 한도, 금리 및 기타 조건은 실제 심사를 진행하는
            제휴 대부업체의 기준에 따라 달라질 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
