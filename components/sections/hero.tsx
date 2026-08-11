import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import OrbitingCirclesGlobe from "@/components/ui/orbiting-circles-02";
import { BorderBeamPanel } from "@/components/ui/border-beam-panel";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/70 via-background to-background" />
      <div className="mx-auto max-w-[860px] px-5 pt-16 pb-8 md:pt-24">
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
              alt="Key We Company 로고와 '신뢰를 바탕으로 한 맞춤 금융 상담' 문구, 도심 빌딩가에 위치한 사무실"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </BorderBeamPanel>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#cta"
            className={cn(buttonVariants({ size: "lg" }), "gap-1.5 px-6")}
          >
            무료 상담 신청하기
            <ArrowRight className="size-4" />
          </a>
          <a
            href="#services"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "px-6"
            )}
          >
            대출상품 살펴보기
          </a>
        </div>

        <div className="relative mx-auto mt-8 aspect-[860/1499] w-full max-w-[860px] overflow-hidden rounded-[8px] border border-border/60 shadow-lg shadow-primary/5 md:rounded-[18px]">
          <Image
            src="/images/hero2.png"
            alt="Key We Company 알선 가능한 주요 대출 상품 8종, 상담 진행 절차, 안내 사항"
            fill
            className="object-cover"
            sizes="(min-width: 672px) 672px, 100vw"
          />
        </div>
      </div>

      <div className="mx-auto max-w-[860px] px-5 pb-4">
        <OrbitingCirclesGlobe />
      </div>
    </section>
  );
}
