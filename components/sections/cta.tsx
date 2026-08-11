import Image from "next/image";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Cta() {
  return (
    <section id="cta" className="mx-auto max-w-6xl px-5 py-20">
      <div className="relative -mx-5 overflow-hidden rounded-[8px] border border-border/60 shadow-xl shadow-primary/10 md:mx-0 md:rounded-[18px]">
        <Image
          src="/images/cta.png"
          alt="저녁 노을빛 아래 열려있는 Key We Company 상담 공간의 문"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        <div className="relative flex flex-col items-center gap-6 px-6 py-20 text-center sm:px-10">
          <h2 className="max-w-xl text-balance font-heading text-3xl font-bold text-white sm:text-4xl">
            지금, 마음 편한 재무 상담을 시작하세요
          </h2>
          <p className="max-w-lg text-white/85">
            첫 상담은 무료입니다. 편하신 방법으로 언제든 문을 두드려 주세요.
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:1588-0000"
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-1.5 bg-white px-6 text-primary hover:bg-white/90"
              )}
            >
              <Phone className="size-4" />
              1588-0000 전화 상담
            </a>
            <a
              href="mailto:hello@keywe.co.kr"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-1.5 border-white/50 bg-white/10 px-6 text-white hover:bg-white/20"
              )}
            >
              <Mail className="size-4" />
              이메일로 상담 신청
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
