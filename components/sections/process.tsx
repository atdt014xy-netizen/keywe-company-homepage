import Image from "next/image";
import {
  PhoneCall,
  MessagesSquare,
  FileSearch,
  Search,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    icon: PhoneCall,
    title: "상담 신청",
    description: "전화·홈페이지 등으로 간편하게 상담을 신청합니다.",
  },
  {
    icon: MessagesSquare,
    title: "기본 상담",
    description: "전문 상담사가 고객님의 상황과 필요 자금을 확인합니다.",
  },
  {
    icon: FileSearch,
    title: "필요서류 안내",
    description: "대출 심사에 필요한 서류를 안내하고 준비를 도와드립니다.",
  },
  {
    icon: Search,
    title: "제휴 대부업체 심사",
    description: "저희가 아닌 제휴 대부업체가 대출 가능 여부와 조건을 직접 심사합니다.",
  },
  {
    icon: ClipboardCheck,
    title: "조건 안내",
    description: "심사 결과와 한도·금리 등 대출 조건을 상세히 안내합니다.",
  },
  {
    icon: CheckCircle2,
    title: "고객 동의 후 대출 실행",
    description: "고객님이 조건에 동의하면 제휴 대부업체가 대출을 실행합니다.",
  },
];

export function Process() {
  return (
    <section id="process" className="mx-auto max-w-[860px] scroll-mt-20 px-5 py-14">
      <span className="text-sm font-semibold text-primary">상담 절차</span>
      <h2 className="mt-3 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
        상담 진행 6단계
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-foreground/70">
        <strong className="rounded bg-primary/10 px-1 py-0.5 font-bold text-primary">
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
          <li key={step.title} className="flex items-center gap-3.5 px-5 py-3.5 sm:gap-4 sm:px-6 sm:py-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
              {index + 1}
            </span>
            <step.icon className="size-5 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
            <div className="min-w-0">
              <h3 className="font-heading text-sm font-bold text-foreground sm:text-base">
                {step.title}
              </h3>
              <p className="mt-0.5 text-xs leading-snug text-foreground/60 sm:text-sm">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
