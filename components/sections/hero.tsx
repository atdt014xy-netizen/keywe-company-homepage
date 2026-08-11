import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import OrbitingCirclesGlobe from "@/components/ui/orbiting-circles-02";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/70 via-background to-background" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-16 pb-8 md:grid-cols-2 md:pt-24">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            재무 상담 전문 파트너
          </span>

          <h1 className="mt-5 text-balance font-heading text-4xl leading-tight font-bold text-foreground sm:text-5xl">
            당신의 평생 자산에,
            <br />
            믿을 수 있는{" "}
            <span className="text-primary">열쇠</span>가 되어드립니다
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/70 sm:text-lg">
            저축부터 투자, 은퇴 설계까지 — Key We Company가 숫자가 아닌
            사람을 먼저 보는 따뜻하고 정직한 재무 상담으로 함께합니다.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#cta"
              className={cn(buttonVariants({ size: "lg" }), "gap-1.5 rounded-full px-6")}
            >
              무료 상담 신청하기
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#services"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-6"
              )}
            >
              서비스 살펴보기
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-16/9 overflow-hidden rounded-4xl border border-border/60 shadow-xl shadow-primary/10">
            <Image
              src="/images/hero.png"
              alt="차량이 나란히 주차된 Key We Company 재무 상담 사무실 전경"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-4">
        <OrbitingCirclesGlobe />
      </div>
    </section>
  );
}
