import Image from "next/image";
import { CalendarCheck, Stethoscope, FileText, HeartHandshake } from "lucide-react";

const steps = [
  {
    icon: CalendarCheck,
    title: "상담 신청",
    description: "홈페이지 또는 전화로 편하신 시간에 상담을 예약합니다.",
  },
  {
    icon: Stethoscope,
    title: "초기 재무 진단",
    description: "현재 자산과 목표를 함께 살펴보며 상황을 진단합니다.",
  },
  {
    icon: FileText,
    title: "맞춤 설계 제안",
    description: "고객님만을 위한 재무 설계안을 알기 쉽게 안내합니다.",
  },
  {
    icon: HeartHandshake,
    title: "지속적인 사후 관리",
    description: "설계 이후에도 정기적으로 점검하며 함께 걸어갑니다.",
  },
];

export function Process() {
  return (
    <section id="process" className="mx-auto max-w-6xl px-5 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold text-primary">상담 절차</span>
        <h2 className="mt-3 text-balance font-heading text-3xl font-bold text-foreground sm:text-4xl">
          네 걸음이면 충분합니다
        </h2>
        <p className="mt-4 leading-relaxed text-foreground/70">
          첫 상담부터 이후 관리까지, Key We Company가 함께 걸어가는 여정입니다.
        </p>
      </div>

      <div className="relative -mx-5 mt-10 aspect-21/9 w-auto overflow-hidden rounded-[8px] border border-border/60 shadow-lg shadow-primary/5 md:mx-0 md:w-full md:rounded-[18px]">
        <Image
          src="/images/process.png"
          alt="빌딩 사이로 해가 떠오르는 도심 거리로 표현한 재무 설계 여정"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.title} className="relative rounded-3xl bg-secondary/50 p-6">
            <span className="font-heading text-3xl font-bold text-primary/25">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="mt-2 flex size-10 items-center justify-center rounded-xl bg-background text-primary">
              <step.icon className="size-5" strokeWidth={1.75} />
            </div>
            <h3 className="mt-3 font-heading text-base font-bold text-foreground">
              {step.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/65">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
