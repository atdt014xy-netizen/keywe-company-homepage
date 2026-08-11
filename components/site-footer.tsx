import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border/60">
      <div
        className="absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage: "url('/images/pattern.png')",
          backgroundSize: "420px 420px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="mx-auto max-w-[860px] px-5 py-12">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/icon.png" alt="Key We Company" width={28} height={28} className="rounded-full" />
              <span className="font-heading text-base font-bold text-primary">
                Key We Company
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground/60">
              당신의 평생 자산 여정에 함께하는 재무 상담 파트너
            </p>
          </div>

          <div className="text-sm leading-relaxed text-foreground/60">
            <p>서울특별시 강남구 테헤란로 000, 0층</p>
            <p>전화 1588-0000 · 이메일 hello@keywe.co.kr</p>
            <p>평일 09:00 – 18:00 (주말·공휴일 휴무)</p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-6 text-xs text-foreground/45">
          © {new Date().getFullYear()} Key We Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
