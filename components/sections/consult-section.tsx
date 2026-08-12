import { ConsultForm } from "@/components/sections/consult-form";

export function ConsultSection() {
  return (
    <section
      id="consult"
      className="mx-auto max-w-[860px] scroll-mt-20 px-5 py-14"
    >
      <div className="mx-auto max-w-xl text-center">
        <span className="text-sm font-semibold text-primary">무료 상담 신청</span>
        <h2 className="mt-3 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
          혼자 고민하지 마세요. 먼저 상황부터 확인해드립니다.
        </h2>
        <p className="mt-3 leading-relaxed text-foreground/70">
          간단한 정보를 남겨주시면 담당자가 고객님의 상황을 확인한 후
          상담을 도와드립니다. 상담 신청은 무료이며 고객에게
          대부중개수수료를 요구하지 않습니다.
        </p>
      </div>
      <div className="mx-auto max-w-xl">
        <ConsultForm />
      </div>
    </section>
  );
}
