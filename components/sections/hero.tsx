import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import OrbitingCirclesGlobe from "@/components/ui/orbiting-circles-02";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/70 via-background to-background" />
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-8 md:pt-24">
        <div className="relative -mx-5 aspect-16/9 w-auto overflow-hidden rounded-[8px] border border-border/60 shadow-xl shadow-primary/10 md:mx-0 md:w-full md:rounded-[18px]">
          <Image
            src="/images/hero.png"
            alt="Key We Company 로고와 '신뢰를 바탕으로 한 맞춤 금융 상담' 문구, 도심 빌딩가에 위치한 사무실"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

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
            서비스 살펴보기
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-4">
        <OrbitingCirclesGlobe />
      </div>
    </section>
  );
}
