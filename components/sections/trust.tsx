import Image from "next/image";
import { Quote, ShieldCheck, HandCoins, Lock, Star } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "정식 등록된 대부업체만 연결합니다" },
  { icon: HandCoins, label: "고객에게 중개수수료·사례금을 요구하지 않습니다" },
  { icon: Lock, label: "수집한 정보는 대부중개 목적 외로 사용하지 않습니다" },
];

const reviews = [
  {
    rating: 5,
    quote:
      "복잡하게만 느껴지던 대출 상담을 제 상황에 맞게 차근차근 설명해 주셔서 마음이 놓였어요. 어떤 대부업체와 연결되는지도 투명하게 알려주셔서 믿음이 갔습니다.",
    author: "상담 고객",
  },
  {
    rating: 5,
    quote:
      "급하게 자금이 필요해 마음이 급했는데, 상담사님이 편안하게 이야기를 들어주셔서 부담 없이 진행할 수 있었어요. 원하는 조건으로 잘 해결됐습니다.",
    author: "사업자대출 상담 고객",
  },
  {
    rating: 4.5,
    quote:
      "여기저기 알아봐도 막막했는데, 제 상황을 꼼꼼히 살펴보고 맞는 상품을 찾아주셔서 감사했습니다. 상담이 편안해서 끝까지 믿고 맡길 수 있었어요.",
    author: "개인신용대출 상담 고객",
  },
  {
    rating: 5,
    quote:
      "대출이 처음이라 걱정이 많았는데, 하나하나 친절하게 설명해 주셔서 마음 편하게 상담받았고 무사히 해결됐습니다.",
    author: "자동차담보대출 상담 고객",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`평점 ${rating}점`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fillPercent = Math.max(0, Math.min(1, rating - i)) * 100;
        return (
          <span key={i} className="relative inline-block size-3.5">
            <Star className="absolute inset-0 size-3.5 text-amber-400" strokeWidth={1.5} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
              <Star className="size-3.5 fill-amber-400 text-amber-400" strokeWidth={1.5} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function Trust() {
  return (
    <section id="trust" className="bg-secondary/40 py-14">
      <div className="mx-auto max-w-[860px] px-5">
        <h2 className="sr-only">고객 신뢰 — 안전하게, 그리고 투명하게</h2>

        <div className="relative -mx-5 aspect-[1672/941] w-auto overflow-hidden rounded-[8px] border border-border/60 shadow-lg shadow-primary/5 md:mx-0 md:w-full md:rounded-[18px]">
          <Image
            src="/images/menu4.png"
            alt="고객 신뢰 — 안전하게, 그리고 투명하게, 상담사가 체크리스트로 안내하는 모습"
            fill
            className="object-cover"
            sizes="(min-width: 860px) 860px, 100vw"
          />
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center leading-relaxed text-foreground/70">
          Key We 대부중개는 대부중개업 등록업체로서, 고객님을 직접 대출을
          실행하는 제휴 대부업체와 연결해드립니다. 승인 여부와 대출 조건은
          심사를 진행하는 해당 업체의 기준에 따라 결정됩니다.
        </p>

        <ul className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center sm:gap-6">
          {badges.map((badge) => (
            <li key={badge.label} className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-primary">
                <badge.icon className="size-4.5" strokeWidth={1.75} />
              </span>
              <span className="font-sans text-sm font-bold text-foreground/80">
                {badge.label}
              </span>
            </li>
          ))}
        </ul>

        <div className="-mx-5 mt-8 grid gap-4 sm:grid-cols-2 md:mx-0">
          {reviews.map((review) => (
            <blockquote
              key={review.author + review.quote.slice(0, 8)}
              className="rounded-xl bg-background p-5 shadow-sm sm:p-6"
            >
              <div className="flex items-center justify-between">
                <Quote className="size-5 text-primary/40" />
                <StarRating rating={review.rating} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                &ldquo;{review.quote}&rdquo;
              </p>
              <footer className="mt-3 text-xs font-medium text-foreground/50">
                — Key We 대부중개 {review.author}
              </footer>
            </blockquote>
          ))}
        </div>

        <p className="mx-auto mt-4 max-w-xl text-center text-xs leading-relaxed text-foreground/45">
          대출 가능 여부, 한도, 금리 및 기타 조건은 실제 심사를 진행하는
          제휴 대부업체의 기준에 따라 달라질 수 있습니다.
        </p>
      </div>
    </section>
  );
}
