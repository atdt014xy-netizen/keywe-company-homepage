import Image from "next/image";

const stats = [
  { value: "15년+", label: "대출 상담 경력" },
  { value: "1,200+", label: "누적 상담 고객" },
  { value: "4.9/5", label: "고객 만족도" },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-[860px] px-5 py-14">
      <div className="relative -mx-5 aspect-[1672/941] w-auto overflow-hidden rounded-[8px] border border-border/60 shadow-lg shadow-primary/5 md:mx-0 md:w-full md:rounded-[18px]">
        <Image
          src="/images/menu1.png"
          alt="회사 소개 — 숫자가 아니라 사람을 먼저 보는 상담, 대부중개 상담사가 고객에게 브리핑하는 모습"
          fill
          className="object-cover"
          sizes="(min-width: 860px) 860px, 100vw"
        />
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <span className="text-sm font-semibold text-primary">회사 소개</span>
        <h2 className="mt-3 text-balance font-heading text-3xl font-bold text-foreground sm:text-4xl">
          숫자가 아니라, 사람을 먼저 보는 상담
        </h2>

        <div className="-mx-5 mt-6 rounded-xl border border-border/60 bg-card p-6 leading-relaxed text-foreground/70 shadow-sm sm:p-8 md:mx-0">
          <p>
            Key We Company는 고객님의 상황을 먼저 이해하고, 그에 맞는 대출
            방향을 함께 찾아가는 대출 상담·중개 전문 회사입니다. 단순히 한
            가지 상품을 권하기보다 소득, 신용상태, 보유자산, 자금의 목적과
            상환 계획 등을 종합적으로 살펴 고객님께 적합한 금융상품을
            안내해 드립니다. 주택담보대출, 전세자금, 사업자금, 차량담보
            등 다양한 대출상품을 비교하여 복잡한 조건은 알기 쉽게
            설명하고, 진행 과정과 필요한 서류도 차근차근 안내합니다.
            무리한 대출을 권하지 않고, 정확하고 투명한 상담을 기본으로
            하며 고객님의 선택을 가장 중요하게 생각합니다. Key We
            Company는 한 번의 상담으로 끝나는 곳이 아니라, 필요한 순간
            편하게 다시 찾을 수 있는 믿음직한 금융 파트너가 되겠습니다.
          </p>
        </div>
      </div>

      <dl className="-mx-5 mt-8 grid grid-cols-3 gap-4 md:mx-auto md:max-w-2xl">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg bg-secondary/60 px-3 py-4 text-center"
          >
            <dt className="sr-only">{stat.label}</dt>
            <dd className="font-heading text-xl font-bold text-primary sm:text-2xl">
              {stat.value}
            </dd>
            <dd className="mt-1 text-xs text-foreground/60 sm:text-sm">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
