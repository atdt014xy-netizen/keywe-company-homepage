import {
  Building2,
  Layers,
  Car,
  ClipboardList,
  UserCheck,
  Store,
  Building,
  Gauge,
  HeartHandshake,
  RefreshCw,
  HardHat,
  CircleEllipsis,
  type LucideIcon,
} from "lucide-react";

export type LoanProduct = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Card illustration path, or null when no matching asset exists yet. */
  image: string | null;
  badge: string;
};

/**
 * Canonical list of the 12 loan-brokerage products. Shared by the
 * services grid and the product carousel so the "12가지" count and each
 * product's copy only need to be edited in one place.
 *
 * Note: 11 of the 12 products have a matching illustrated card in
 * public/images/card/ (1.png–11.png). "전월세보증금 관련 대출" does not
 * have a matching illustration yet — its `image` is null and the
 * carousel renders an icon-based fallback card instead of a mismatched
 * or fabricated photo. Add /images/card/12.png in the same style and
 * set `image` below once it exists.
 */
export const loanProducts: LoanProduct[] = [
  {
    id: "real-estate",
    title: "부동산 담보대출",
    description: "보유 부동산 가치와 기존 담보현황을 기준으로 적합한 상품을 안내합니다.",
    icon: Building2,
    image: "/images/card/4.png",
    badge: "ESTATE",
  },
  {
    id: "second-lien",
    title: "후순위 담보대출",
    description: "기존 담보대출이 있어도 잔여 담보가치를 기준으로 추가 대출 가능 여부를 검토합니다.",
    icon: Layers,
    image: "/images/card/2.png",
    badge: "SECOND",
  },
  {
    id: "auto",
    title: "자동차 담보대출",
    description: "본인 명의 차량의 차종·연식·시세를 기준으로 담보대출 상품을 안내합니다.",
    icon: Car,
    image: "/images/card/3.png",
    badge: "AUTO",
  },
  {
    id: "lease-deposit",
    title: "전월세보증금 관련 대출",
    description: "전세·월세 보증금 및 임대차 조건을 검토하여 취급 가능한 상품을 안내합니다.",
    icon: ClipboardList,
    image: null,
    badge: "LEASE",
  },
  {
    id: "personal-credit",
    title: "개인 신용대출",
    description: "담보 없이 소득·직업·신용상태를 기준으로 이용 가능한 신용대출을 확인합니다.",
    icon: UserCheck,
    image: "/images/card/5.png",
    badge: "CREDIT",
  },
  {
    id: "business",
    title: "사업자 대출",
    description: "사업현황과 매출·담보 등을 고려하여 운영자금·사업자금 상품을 안내합니다.",
    icon: Store,
    image: "/images/card/6.png",
    badge: "BIZ",
  },
  {
    id: "corporate",
    title: "법인·기업자금 대출",
    description: "법인의 사업현황과 담보·매출을 검토하여 적합한 기업자금 상품을 안내합니다.",
    icon: Building,
    image: "/images/card/7.png",
    badge: "CORP",
  },
  {
    id: "low-credit",
    title: "저신용자 맞춤대출",
    description: "신용상태만으로 단정하지 않고 조건을 확인하여 취급 가능한 상품을 찾아드립니다.",
    icon: Gauge,
    image: "/images/card/8.png",
    badge: "LOW",
  },
  {
    id: "recovery",
    title: "개인회생·신용회복 관련 대출",
    description: "개인회생·신용회복 진행 상황을 확인해 취급 가능한 상품이 있는지 상담해드립니다.",
    icon: HeartHandshake,
    image: "/images/card/1.png",
    badge: "RECOVERY",
  },
  {
    id: "refinance",
    title: "대환대출·채무정리 상담",
    description: "기존 대출현황을 확인해 대환·채무구조 조정에 활용할 수 있는 상품을 확인합니다.",
    icon: RefreshCw,
    image: "/images/card/10.png",
    badge: "CHANGE",
  },
  {
    id: "pf-bridge",
    title: "PF·브릿지·사업자금",
    description: "부동산 개발·시행사업 등 사업구조와 담보조건을 검토해 상품을 안내합니다.",
    icon: HardHat,
    image: "/images/card/9.png",
    badge: "PF",
  },
  {
    id: "other-secured",
    title: "기타 담보대출",
    description: "그 외 보유 자산과 조건을 확인해 취급 가능한 담보대출 상품을 안내합니다.",
    icon: CircleEllipsis,
    image: "/images/card/11.png",
    badge: "SECURE",
  },
];

export const LOAN_PRODUCT_COUNT = loanProducts.length;
