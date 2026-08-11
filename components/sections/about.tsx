import Image from "next/image";

const stats = [
  { value: "15년+", label: "대출 상담 경력" },
  { value: "1,200+", label: "누적 상담 고객" },
  { value: "4.9/5", label: "고객 만족도" },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-[860px] px-5 py-20">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="relative order-2 md:order-1">
          <div className="relative -mx-5 aspect-4/3 overflow-hidden rounded-[8px] border border-border/60 shadow-lg shadow-primary/5 md:mx-0 md:rounded-[18px]">
            <Image
              src="/images/about.png"
              alt="대부중개 상담사가 서류와 그래프로 고객에게 대출상품을 브리핑하는 모습"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>

        <div className="order-1 md:order-2">
          <span className="text-sm font-semibold text-primary">회사 소개</span>
          <h2 className="mt-3 text-balance font-heading text-3xl font-bold text-foreground sm:text-4xl">
            숫자가 아니라
            <br />
            사람을 먼저 보는 상담
          </h2>
          <p className="mt-5 leading-relaxed text-foreground/70">
            Key We Company는 직접 돈을 빌려주는 대부업체가 아닌, 등록된
            대부업체를 연결해드리는 대부중개업체입니다. 고객님의 자금
            목적과 소득, 신용상태, 담보현황을 확인해 적합한 대출상품을
            찾고, 취급업체와의 심사·계약 과정을 이해하기 쉽게 안내해
            드립니다.
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-4">
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
        </div>
      </div>
    </section>
  );
}
