import Image from "next/image";

const stats = [
  { value: "15년+", label: "대출 상담 경력" },
  { value: "1,200+", label: "누적 상담 고객" },
  { value: "4.9/5", label: "고객 만족도" },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-[860px] px-5 py-20">
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

        <div className="mt-6 space-y-4 rounded-xl border border-border/60 bg-card p-6 leading-relaxed text-foreground/70 shadow-sm sm:p-8">
          <p>
            대출이 필요한 순간에는 누구나 마음 한편에 걱정을 안고 상담을
            시작합니다. 얼마나 가능할지, 조건은 괜찮을지, 혹시 내가
            잘못된 선택을 하는 것은 아닐지 쉽게 말하지 못하는 고민도
            많습니다. Key We Company는 그런 고객님의 마음부터 이해하는
            상담을 하고 싶습니다.
          </p>
          <p>
            저희는 단순히 대출 한도와 금리만을 보고 상품을 권하지
            않습니다. 고객님의 현재 상황과 자금이 필요한 이유, 소득과
            신용상태, 보유자산, 앞으로의 상환 계획까지 충분히 듣고
            살펴본 뒤 가장 현실적인 방향을 함께 찾아드립니다.
            주택담보대출, 전세자금, 사업자금, 차량담보 등 여러
            금융상품 가운데 고객님께 적합한 조건을 비교하고, 어렵고
            복잡한 금융용어와 진행 절차도 누구나 이해할 수 있도록
            차근차근 설명해 드립니다.
          </p>
          <p>
            때로는 대출을 많이 받는 것보다 필요한 만큼만 안전하게
            이용하는 것이 더 좋은 선택일 수 있습니다. 그래서 무리한
            진행을 권하지 않고, 가능한 부분과 어려운 부분을 솔직하게
            말씀드리는 것을 원칙으로 합니다.
          </p>
          <p>
            한 번의 상담이라도 고객님의 삶에는 중요한 결정이 될 수
            있다는 것을 알고 있습니다. 숫자보다 사람을 먼저 보고,
            결과보다 신뢰를 먼저 생각하는 곳. 상담이 끝난 뒤에도
            &ldquo;잘 상담받았다&rdquo;는 편안한 마음이 남을 수 있도록,
            Key We Company가 고객님의 든든한 금융 파트너가 되어
            함께하겠습니다.
          </p>
        </div>
      </div>

      <dl className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-4">
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
