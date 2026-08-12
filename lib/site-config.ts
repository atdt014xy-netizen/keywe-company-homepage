/**
 * Single source of truth for business/legal information shown across the
 * site (footer, header, /privacy, legal disclosure block).
 *
 * Do NOT invent values here. Fields left empty are intentionally blank
 * because they have not been confirmed against the actual business
 * registration / 대부중개업 등록증 documents. Empty fields should not be
 * rendered by consuming components — check for truthiness first.
 */
export const siteConfig = {
  /** Customer-facing brand name. */
  brandName: "Key We 대부중개",
  /**
   * Legally registered trade name (사업자등록증상 상호). Set to the same
   * value as brandName until the registration certificate confirms
   * otherwise — kept as a separate field so the two can diverge without
   * a refactor.
   */
  legalName: "Key We 대부중개",
  /** 대표자 성명 — TODO: 사업자등록증 확인 후 입력. Empty until confirmed. */
  representativeName: "",
  businessRegistrationNumber: "753-05-03649",
  brokerageRegistrationNumber: "2025-부산동구-03010",
  address: "부산광역시 중구 남포동1가 21-6",
  phone: "010-7741-5434",
  phoneHref: "tel:010-7741-5434",
  email: "atdt014xy@gmail.com",
  privacyOfficerName: "류수인",
  siteUrl: "https://keywe-company.vercel.app",
  hours: {
    online: "홈페이지 상담 신청: 24시간 접수",
    phone: "전화 상담: 평일 09:00~18:00",
    note: "접수된 상담은 영업시간 내 순차적으로 연락드립니다.",
  },
} as const;

/**
 * Statistics shown in the About section. These were placeholder example
 * figures, not numbers confirmed against real business records. Flip
 * SHOW_STATS to false to hide the block entirely until real figures are
 * confirmed, or edit the values once they are.
 */
export const SHOW_STATS = true;
export const aboutStats = [
  { value: "15년+", label: "대출 상담 경력" },
  { value: "1,200+", label: "누적 상담 고객" },
  { value: "4.9/5", label: "고객 만족도" },
] as const;
