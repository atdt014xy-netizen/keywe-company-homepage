import Image from "next/image";
import { Lightbulb } from "lucide-react";

const consultCases = [
  {
    category: "개인신용대출 상담 사례",
    summary:
      "여러 곳에 알아봐도 막막했던 경우, 소득·신용상태를 확인한 뒤 취급 가능한 신용대출 상품을 함께 비교해 안내한 사례입니다.",
  },
  {
    category: "사업자대출 상담 사례",
    summary:
      "사업자금이 급하게 필요했던 경우, 사업 현황과 매출·담보 조건을 확인해 운영자금 상품 여부를 상담한 사례입니다.",
  },
  {
    category: "자동차담보대출 상담 사례",
    summary:
      "대출이 처음이라 절차가 낯설었던 경우, 필요서류와 진행 절차를 단계별로 안내해 상담을 진행한 사례입니다.",
  },
  {
    category: "대환대출 상담 사례",
    summary:
      "기존 대출 조건을 부담스러워했던 경우, 현재 대출 현황을 확인해 대환 가능 여부를 함께 검토한 사례입니다.",
  },
];

export function Trust() {
  return (
    <section id="trust" className="bg-secondary/40 py-14">
      <div className="mx-auto max-w-[860px] scroll-mt-20 px-5">
        <span className="text-sm font-semibold text-primary">안전하고 투명한 상담</span>
        <h2 className="mt-3 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
          고객 신뢰 — 안전하게, 그리고 투명하게
        </h2>

        <div className="relative -mx-5 mt-6 aspect-[1672/941] w-auto overflow-hidden rounded-[8px] border border-border/60 shadow-lg shadow-primary/5 md:mx-0 md:w-full md:rounded-[18px]">
          <Image
            src="/images/menu4.png"
            alt="상담사가 체크리스트를 짚어가며 고객에게 상담 절차를 안내하는 모습"
            fill
            loading="lazy"
            className="object-cover"
            sizes="(min-width: 860px) 860px, 100vw"
          />
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center leading-relaxed text-foreground/70">
          키위대부중개는 대부중개업 등록업체로서, 고객님을 직접 대출을
          실행하는 제휴 대부업체와 연결해드립니다. 승인 여부와 대출 조건은
          심사를 진행하는 해당 업체의 기준에 따라 결정됩니다.
        </p>

        <div className="mt-10">
          <h3 className="text-center font-heading text-lg font-bold text-foreground">
            상담 사례 예시
          </h3>
          <p className="mx-auto mt-1.5 max-w-xl text-center text-xs text-foreground/50">
            아래 내용은 상담 유형을 소개하기 위해 구성한 예시이며, 특정
            고객의 실제 후기가 아닙니다.
          </p>

          <div className="-mx-5 mt-6 grid gap-4 sm:grid-cols-2 md:mx-0">
            {consultCases.map((item) => (
              <div
                key={item.category}
                className="rounded-xl bg-background p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="size-4.5 text-primary/60" aria-hidden="true" />
                  <span className="text-sm font-bold text-foreground">
                    {item.category}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-relaxed text-foreground/45">
          대출 가능 여부, 한도, 금리 및 기타 조건은 실제 심사를 진행하는
          제휴 대부업체의 기준에 따라 달라질 수 있습니다.
        </p>
      </div>
    </section>
  );
}
