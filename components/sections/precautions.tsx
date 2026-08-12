import { AlertTriangle, Phone } from "lucide-react";
import { precautionItems, lenderPartners } from "@/lib/precautions-data";
import { siteConfig } from "@/lib/site-config";

export function Precautions() {
  return (
    <section
      id="precautions"
      className="mx-auto max-w-[860px] scroll-mt-20 px-5 py-14"
    >
      <span className="text-sm font-semibold text-primary">이용 안내</span>
      <h2 className="mt-3 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
        대출 이용 전 꼭 확인하세요
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-foreground/70">
        {siteConfig.brandName}는 대부중개업 등록업체로서 고객님을 등록
        대부업체와 연결해드리며, 대출 계약 및 실행의 당사자가 아닙니다.
        아래 내용을 계약 전에 꼭 확인해 주세요.
      </p>

      <div className="mt-8 rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
        <h3 className="font-heading text-base font-bold text-foreground">
          중개를 위탁한 등록 대부업체
        </h3>
        {lenderPartners.length > 0 ? (
          <ul className="mt-3 space-y-2 text-sm text-foreground/75">
            {lenderPartners.map((partner) => (
              <li
                key={partner.name}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-secondary/50 px-3 py-2"
              >
                <span className="font-semibold text-foreground">
                  {partner.name}
                </span>
                {partner.registrationNumber && (
                  <span className="text-foreground/60">
                    등록번호 {partner.registrationNumber}
                  </span>
                )}
                <a
                  href={`tel:${partner.phone}`}
                  className="ml-auto inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <Phone className="size-3.5" />
                  {partner.phone}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-lg bg-secondary/50 px-3 py-2.5 text-sm text-foreground/60">
            제휴 대부업체 목록은 확인 후 게시 예정입니다. 상담 과정에서
            연결될 업체명과 연락처를 안내해 드립니다.
          </p>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {precautionItems.map((item) => (
          <details
            key={item.id}
            className="group rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-heading text-base font-bold text-foreground">
              <span className="flex items-center gap-2">
                {item.title}
                {item.status === "pending" && (
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    확인 후 게시
                  </span>
                )}
              </span>
              <span className="text-foreground/40 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-foreground/70">
              {item.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-5 text-sm leading-relaxed text-foreground/75">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-primary" />
        <p>
          과도한 빚, 고통의 시작입니다. 상환 능력을 초과하는 대출은
          개인신용평점 하락 등 불이익을 초래할 수 있으니 신중하게 결정해
          주세요.
        </p>
      </div>
    </section>
  );
}
