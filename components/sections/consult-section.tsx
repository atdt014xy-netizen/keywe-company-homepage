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
          지금 바로 무료로 상담받아 보세요
        </h2>
      </div>
      <div className="mx-auto max-w-xl">
        <ConsultForm />
      </div>
    </section>
  );
}
