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
              <Image src="/icon.png" alt="Key We 대부중개" width={28} height={28} className="rounded-full" />
              <span className="font-sans text-base font-bold text-primary">
                Key We 대부중개
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground/60">
              등록 대부업체와 고객님을 연결해드리는 대부중개업체입니다.{" "}
              <strong className="rounded bg-primary/10 px-1 py-0.5 font-bold text-primary">
                고객에게 별도의 중개수수료를 요구하지 않습니다.
              </strong>
            </p>
          </div>

          <div className="text-sm leading-relaxed text-foreground/60">
            <p>부산광역시 중구 남포동1가 21-6</p>
            <p>전화 010-7741-5434 · 이메일 atdt014xy@gmail.com</p>
            <p>평일 09:00 – 18:00 (주말·공휴일 휴무)</p>
            <p className="mt-1 font-medium text-primary">
              급한 용무는 365일 언제든 연락 주세요.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-6 text-xs text-foreground/60">
          <p className="font-bold text-foreground/80">
            사업자등록번호 753-05-03649 · 대부중개업 등록번호 2025-부산동구-03010
          </p>
          <p className="mt-2 text-foreground/45">
            © {new Date().getFullYear()} Key We 대부중개. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
