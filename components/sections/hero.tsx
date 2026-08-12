import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BorderBeamPanel } from "@/components/ui/border-beam-panel";
import { ConsultCtaButton } from "@/components/consult-cta-button";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/70 via-background to-background" />
      <div className="mx-auto max-w-[860px] px-5 pt-10 pb-8 md:pt-14">
        <BorderBeamPanel
          beams={2}
          colors={["#8bc34a", "#1e5631"]}
          radius={12}
          thickness={2}
          className="relative -mx-5 aspect-square w-auto border-border/60 p-0 shadow-xl shadow-primary/10 md:mx-0 md:w-full"
        >
          <div className="absolute inset-0 overflow-hidden rounded-[12px]">
            <Image
              src="/images/hero.png"
              alt="키위대부중개 로고와 도심 빌딩가에 위치한 사무실 전경 일러스트"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </BorderBeamPanel>

        <div className="mx-auto mt-8 max-w-xl text-center">
          <h1 className="text-balance font-heading text-3xl font-bold text-foreground sm:text-4xl">
            상황이 다르면, 대출의 답도 달라야 합니다
          </h1>
          <p className="mt-3 text-balance leading-relaxed text-foreground/70">
            고객님의 현재 상황을 확인하고 취급 가능한 등록 대부업체의
            상품을 안내합니다.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <ConsultCtaButton className={cn(buttonVariants({ size: "lg" }), "gap-1.5 px-6")}>
            무료 상담 신청
            <ArrowRight className="size-4" />
          </ConsultCtaButton>
          <a
            href="#services"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "px-6"
            )}
          >
            대출상품 보기
          </a>
        </div>
      </div>
    </section>
  );
}
