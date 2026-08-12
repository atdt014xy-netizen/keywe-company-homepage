import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

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
              <Image src="/icon.png" alt={siteConfig.brandName} width={28} height={28} className="rounded-full" />
              <span className="font-sans text-base font-bold text-primary">
                {siteConfig.brandName}
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
            <p>{siteConfig.address}</p>
            <p>
              전화 {siteConfig.phone} · 이메일 {siteConfig.email}
            </p>
            <p>{siteConfig.hours.phone.replace("전화 상담: ", "전화 상담 ")}</p>
            <p>{siteConfig.hours.online.replace("홈페이지 상담 신청: ", "온라인 상담 신청 ")}</p>
            <p className="mt-1 text-xs text-foreground/45">{siteConfig.hours.note}</p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-6 text-xs text-foreground/60">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
            <div className="flex gap-1.5">
              <dt className="font-bold text-foreground/80">상호</dt>
              <dd>{siteConfig.legalName}</dd>
            </div>
            {siteConfig.representativeName && (
              <div className="flex gap-1.5">
                <dt className="font-bold text-foreground/80">대표자</dt>
                <dd>{siteConfig.representativeName}</dd>
              </div>
            )}
            <div className="flex gap-1.5">
              <dt className="font-bold text-foreground/80">사업자등록번호</dt>
              <dd>{siteConfig.businessRegistrationNumber}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-bold text-foreground/80">대부중개업 등록번호</dt>
              <dd>{siteConfig.brokerageRegistrationNumber}</dd>
            </div>
          </dl>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link href="/privacy" className="font-semibold text-primary hover:underline">
              개인정보처리방침
            </Link>
            <span className="text-foreground/45">
              © {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
