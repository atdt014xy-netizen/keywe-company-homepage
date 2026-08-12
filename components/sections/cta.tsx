import Image from "next/image";
import { Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConsultForm } from "@/components/sections/consult-form";

export function Cta() {
  return (
    <section id="cta" className="mx-auto max-w-[860px] px-5 py-20">
      <div className="relative -mx-5 aspect-square w-auto overflow-hidden rounded-[8px] border border-border/60 shadow-xl shadow-primary/10 md:mx-0 md:w-full md:rounded-[18px]">
        <Image
          src="/images/foot.png"
          alt="자산 상담 도구와 함께 상담사가 고객과 마주 앉아 상담하는 모습"
          fill
          className="object-cover"
          sizes="(min-width: 860px) 860px, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center sm:px-10">
          <h2 className="max-w-xl text-balance font-heading text-3xl font-bold text-white sm:text-4xl">
            지금, 마음 편한 대출 상담을 시작하세요
          </h2>
          <p className="max-w-lg text-white/85">
            상담은 무료이며, 고객님께 별도의 중개수수료를 요구하지 않습니다.
          </p>

          <a
            href="tel:1588-0000"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-2 gap-1.5 bg-white px-6 text-primary hover:bg-white/90"
            )}
          >
            <Phone className="size-4" />
            1588-0000 전화 상담
          </a>
        </div>
      </div>

      <ConsultForm />
    </section>
  );
}
