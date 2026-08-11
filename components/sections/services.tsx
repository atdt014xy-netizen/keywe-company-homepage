import Image from "next/image";
import { Wallet, PiggyBank, ShieldCheck, Landmark } from "lucide-react";

const services = [
  {
    icon: Wallet,
    title: "자산관리",
    description: "자산 포트폴리오 진단과 분산 투자 전략으로 균형 잡힌 자산을 설계합니다.",
  },
  {
    icon: PiggyBank,
    title: "은퇴 설계",
    description: "여유로운 노후를 위한 장기 자금 계획을 함께 세워드립니다.",
  },
  {
    icon: ShieldCheck,
    title: "보험 컨설팅",
    description: "꼭 필요한 보장만 남기는 보험 점검과 리모델링을 도와드립니다.",
  },
  {
    icon: Landmark,
    title: "세무·상속 상담",
    description: "절세 전략과 원활한 자산 이전을 위한 전문 상담을 제공합니다.",
  },
];

export function Services() {
  return (
    <section id="services" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="text-sm font-semibold text-primary">서비스 소개</span>
            <h2 className="mt-3 text-balance font-heading text-3xl font-bold text-foreground sm:text-4xl">
              삶의 단계에 맞춘
              <br />
              맞춤 재무 서비스
            </h2>
            <p className="mt-5 leading-relaxed text-foreground/70">
              지금 필요한 상담이 무엇인지 잘 모르셔도 괜찮습니다. 첫 상담에서
              함께 방향을 찾아드립니다.
            </p>

            <div className="relative mt-8 hidden aspect-4/3 overflow-hidden rounded-[18px] border border-border/60 shadow-lg shadow-primary/5 md:block">
              <Image
                src="/images/services.png"
                alt="도심 사무실에서 차량 키와 현금을 주고받으며 대부중개 상담을 진행하는 모습"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <service.icon className="size-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
