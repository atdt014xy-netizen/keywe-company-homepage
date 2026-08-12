/**
 * Content for the "대출 이용 전 꼭 확인하세요" section.
 *
 * `status: "ready"` items use generic, publicly-verifiable guidance and
 * confirmed site policy — safe to publish as-is.
 *
 * `status: "pending"` items require company/product-specific facts
 * (interest rates, fees, partner lenders) that have not been supplied.
 * Do not fill these in with plausible-sounding numbers — replace the
 * placeholder body once the real figures are confirmed.
 */
export type PrecautionItem = {
  id: string;
  title: string;
  status: "ready" | "pending";
  body: string[];
};

export type LenderPartner = {
  name: string;
  phone: string;
  registrationNumber?: string;
};

/**
 * TODO: 실제로 중개를 위탁하는 등록 대부업체명·연락처·등록번호를 확인 후
 * 아래 배열에 입력하세요. 비어 있는 동안 화면에는 "확인 후 게시 예정"
 * 안내만 표시됩니다.
 */
export const lenderPartners: LenderPartner[] = [];

export const precautionItems: PrecautionItem[] = [
  {
    id: "verify-registration",
    title: "대부업 등록 여부 확인 방법",
    status: "ready",
    body: [
      "금융감독원 또는 거래하려는 대부업체의 관할 지자체(시·도) 등록대부업체 통합관리시스템에서 상호, 대표자, 등록번호를 조회하여 정식 등록 업체인지 반드시 확인하시기 바랍니다.",
      "등록번호가 조회되지 않거나 상호·대표자 정보가 다르면 거래를 진행하지 마시고 저희에게 문의해 주세요.",
    ],
  },
  {
    id: "before-contract",
    title: "대출 계약 전 확인사항",
    status: "ready",
    body: [
      "계약서에 기재된 대출금액, 이자율, 상환방법, 상환기간, 연체이자율, 중도상환수수료 등 주요 조건을 계약 체결 전에 반드시 직접 확인하세요.",
      "계약서 사본은 반드시 교부받아 보관하시고, 서명 전 이해되지 않는 조항은 반드시 질문하여 확인하세요.",
    ],
  },
  {
    id: "interest-rate",
    title: "이자율 및 연체이자율 안내",
    status: "pending",
    body: [
      "실제 이자율 및 연체이자율은 심사를 진행하는 제휴 대부업체와 고객님의 신용상태·상품 조건에 따라 달라지며, 상담 및 계약 과정에서 해당 업체가 직접 안내합니다.",
    ],
  },
  {
    id: "early-repayment",
    title: "중도상환 및 부대비용 안내",
    status: "pending",
    body: [
      "중도상환수수료 및 그 밖의 부대비용 여부와 금액은 계약을 체결하는 제휴 대부업체의 상품 조건에 따라 다르며, 계약 전 해당 업체를 통해 정확히 안내받으실 수 있습니다.",
    ],
  },
  {
    id: "privacy",
    title: "개인정보 보호 안내",
    status: "ready",
    body: [
      "상담 신청 시 수집하는 개인정보의 항목, 목적, 보유기간과 제3자 제공에 관한 사항은 개인정보 처리방침 페이지에서 확인하실 수 있습니다.",
    ],
  },
  {
    id: "illegal-lending",
    title: "불법사금융 주의사항",
    status: "ready",
    body: [
      "미등록 대부업체와의 거래, 정상적인 절차 없이 신분증·통장·인감을 요구하는 경우, 과도한 선이자 공제 등은 불법사금융의 전형적인 특징입니다.",
      "불법사금융이 의심되는 경우 금융감독원 불법사금융 신고센터(국번 없이 1332)로 신고하실 수 있습니다.",
    ],
  },
  {
    id: "brokerage-fee",
    title: "중개수수료 안내",
    status: "ready",
    body: [
      "Key We 대부중개는 고객님께 중개의 대가로 어떠한 수수료나 사례금도 요구하지 않습니다. 상담 및 중개 과정에서 금전을 요구받으신 경우 즉시 당사로 연락해 주세요.",
    ],
  },
  {
    id: "debt-warning",
    title: "과도한 채무에 대한 경고",
    status: "ready",
    body: [
      "과도한 빚, 고통의 시작입니다.",
      "필요 이상의 대출은 상환 부담을 가중시키고 개인신용평점 하락 등 불이익을 초래할 수 있습니다. 상환 능력을 충분히 고려하여 신중하게 결정하시기 바랍니다.",
    ],
  },
];
