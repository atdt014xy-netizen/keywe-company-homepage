import { siteConfig } from "@/lib/site-config";

/**
 * Statutory-style advertising disclosure for a 대부중개업체. Values come
 * from siteConfig where confirmed; fields without a confirmed real value
 * stay as an explicit "확인 후 입력" placeholder instead of an invented
 * number — edit the constants below once the real figures are supplied.
 */
const disclosure = {
  businessName: siteConfig.legalName,
  brokerageRegistrationNumber: siteConfig.brokerageRegistrationNumber,
  advertisingPhone: siteConfig.phone,
  interestRateText: "확인 후 입력 — 제휴 대부업체 상품별 이자율은 상담 시 안내됩니다.",
  overdueRateText: "확인 후 입력 — 연체이자율은 제휴 대부업체 상품 조건에 따라 다릅니다.",
  extraCostText: "확인 후 입력 — 중도상환수수료 등 부대비용은 제휴 대부업체 상품 조건에 따라 다릅니다.",
  earlyRepaymentText: "확인 후 입력 — 중도상환 조건은 계약하는 제휴 대부업체를 통해 안내됩니다.",
  debtWarningText: "과도한 빚, 고통의 시작입니다.",
  creditScoreWarningText:
    "과도한 채무는 개인신용평점 하락 등 불이익의 원인이 될 수 있습니다.",
  brokerageFeeWarningText:
    "본 업체는 고객에게 중개의 대가로 수수료를 요구하지 않습니다.",
} as const;

export function LoanAdvertisementDisclosure() {
  return (
    <section
      aria-label="대출 관련 법적 광고정보"
      className="mx-auto max-w-[860px] px-5 py-8"
    >
      <div className="rounded-xl border border-border/60 bg-muted/40 p-5 text-xs leading-relaxed text-foreground/60 sm:p-6">
        <p className="font-semibold text-foreground/80">
          {disclosure.businessName} (대부중개업 등록번호{" "}
          {disclosure.brokerageRegistrationNumber}) · 광고 문의{" "}
          {disclosure.advertisingPhone}
        </p>
        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
          <div className="flex gap-1.5">
            <dt className="shrink-0 font-medium text-foreground/70">이자율</dt>
            <dd>{disclosure.interestRateText}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="shrink-0 font-medium text-foreground/70">연체이자율</dt>
            <dd>{disclosure.overdueRateText}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="shrink-0 font-medium text-foreground/70">부대비용</dt>
            <dd>{disclosure.extraCostText}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="shrink-0 font-medium text-foreground/70">중도상환</dt>
            <dd>{disclosure.earlyRepaymentText}</dd>
          </div>
        </dl>
        <p className="mt-3 space-y-0.5">
          <span className="block">{disclosure.debtWarningText}</span>
          <span className="block">{disclosure.creditScoreWarningText}</span>
          <span className="block">{disclosure.brokerageFeeWarningText}</span>
        </p>
      </div>
    </section>
  );
}
