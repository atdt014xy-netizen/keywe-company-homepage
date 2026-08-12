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
  interestRateText:
    "연 20% 이내 (2021년 7월 7일 이후 체결·갱신·연장되는 계약에 한함)",
  overdueRateText: "연 20% 이내",
  extraCostText: "취급수수료 없음 · 중개수수료 없음",
  earlyRepaymentText: "중도상환수수료 없음",
  repaymentPeriodText: "12~60개월",
  loanExampleText:
    "100만원을 12개월, 최대금리 연 20%, 원리금균등상환 방법으로 이용하는 경우 총 상환금액 1,111,614원. 대출상품 및 상환방법 등 대출계약 조건에 따라 달라질 수 있습니다.",
  debtWarningText: "과도한 빚은 당신에게 큰 불행을 안겨줄 수 있습니다.",
  creditScoreWarningText:
    "대출 시 신용등급 또는 개인신용평점 하락으로 다른 금융거래가 제약받을 수 있습니다.",
  brokerageFeeWarningText: "중개수수료를 요구하거나 받는 것은 불법입니다.",
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
          <div className="flex gap-1.5">
            <dt className="shrink-0 font-medium text-foreground/70">상환기간</dt>
            <dd>{disclosure.repaymentPeriodText}</dd>
          </div>
        </dl>
        <p className="mt-3">
          <span className="font-medium text-foreground/70">대출 예시</span>{" "}
          {disclosure.loanExampleText}
        </p>
        <p className="mt-3 space-y-0.5">
          <span className="block">{disclosure.brokerageFeeWarningText}</span>
          <span className="block">{disclosure.debtWarningText}</span>
          <span className="block">{disclosure.creditScoreWarningText}</span>
        </p>
      </div>
    </section>
  );
}
