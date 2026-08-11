import Image from "next/image";

const stats = [
  { value: "15년+", label: "대출 상담 경력" },
  { value: "1,200+", label: "누적 상담 고객" },
  { value: "4.9/5", label: "고객 만족도" },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-[860px] px-5 py-20">
      <h2 className="sr-only">회사 소개 — 숫자가 아니라 사람을 먼저 보는 상담</h2>

      <div className="relative -mx-5 aspect-[1672/941] w-auto overflow-hidden rounded-[8px] border border-border/60 shadow-lg shadow-primary/5 md:mx-0 md:w-full md:rounded-[18px]">
        <Image
          src="/images/menu1.png"
          alt="회사 소개 — 숫자가 아니라 사람을 먼저 보는 상담, 대부중개 상담사가 고객에게 브리핑하는 모습"
          fill
          className="object-cover"
          sizes="(min-width: 860px) 860px, 100vw"
        />
      </div>

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
    </section>
  );
}
