import Image from "next/image";
import { PhoneCall, Search, FileSearch, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: PhoneCall,
    title: "상담 신청",
    description: "이름과 연락처를 남겨주세요.",
  },
  {
    icon: Search,
    title: "상황 확인",
    description: "필요 자금과 현재 조건을 확인합니다.",
  },
  {
    icon: FileSearch,
    title: "상품 안내",
    description: "취급 가능한 등록 대부업체의 상품을 안내합니다.",
  },
  {
    icon: CheckCircle2,
    title: "선택 및 진행",
    description: "조건을 충분히 확인한 후 고객님이 직접 결정합니다.",
  },
];

export function Process() {
  return (
    <section id="process" className="mx-auto max-w-[860px] scroll-mt-20 px-5 py-14">
      <span className="text-sm font-semibold text-primary">상담 절차</span>
      <h2 className="mt-3 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
        상담 진행 4단계
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-foreground/70">
        <strong className="font-bold text-primary">
          키위대부중개가 대출을 직접 실행하는 것이 아니라, 제휴 대부업체가
          심사하고 실행합니다.
        </strong>{" "}
        저희는 그 과정을 상담부터 조건 안내까지 함께 도와드립니다.
      </p>

      <div className="relative -mx-5 mt-8 aspect-[1672/941] w-auto overflow-hidden rounded-[8px] border border-border/60 shadow-lg shadow-primary/5 md:mx-0 md:w-full md:rounded-[18px]">
        <Image
          src="/images/menu3.png"
          alt="상담사가 고객에게 상담 절차를 안내하는 모습"
          fill
          loading="lazy"
          className="object-cover"
          sizes="(min-width: 860px) 860px, 100vw"
        />
      </div>

      <ol className="-mx-5 mt-8 divide-y divide-border/60 overflow-hidden border-y border-border/60 bg-card md:mx-0 md:rounded-xl md:border-x">
        {steps.map((step, index) => (
          <li key={step.title} className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-base font-bold text-primary">
              {index + 1}
            </span>
            <step.icon className="size-6 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
            <div className="min-w-0">
              <h3 className="font-heading text-base font-bold text-foreground sm:text-lg">
                {step.title}
              </h3>
              <p className="mt-0.5 text-sm leading-snug text-foreground/60">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
