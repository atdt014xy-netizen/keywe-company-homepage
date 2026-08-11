import Image from "next/image";
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
} from "lucide-react";

const loanProducts = [
  {
    icon: Building2,
    title: "부동산 담보대출",
    description: "보유 부동산 가치와 기존 담보현황을 기준으로 적합한 상품을 안내합니다.",
  },
  {
    icon: Layers,
    title: "후순위 담보대출",
    description: "기존 담보대출이 있어도 잔여 담보가치를 기준으로 추가 대출 가능 여부를 검토합니다.",
  },
  {
    icon: Car,
    title: "자동차 담보대출",
    description: "본인 명의 차량의 차종·연식·시세를 기준으로 담보대출 상품을 안내합니다.",
  },
  {
    icon: ClipboardList,
    title: "전월세보증금 관련 대출",
    description: "전세·월세 보증금 및 임대차 조건을 검토하여 취급 가능한 상품을 안내합니다.",
  },
  {
    icon: UserCheck,
    title: "개인 신용대출",
    description: "담보 없이 소득·직업·신용상태를 기준으로 이용 가능한 신용대출을 확인합니다.",
  },
  {
    icon: Store,
    title: "사업자 대출",
    description: "사업현황과 매출·담보 등을 고려하여 운영자금·사업자금 상품을 안내합니다.",
  },
  {
    icon: Building,
    title: "법인·기업자금 대출",
    description: "법인의 사업현황과 담보·매출을 검토하여 적합한 기업자금 상품을 안내합니다.",
  },
  {
    icon: Gauge,
    title: "저신용자 맞춤대출",
    description: "신용상태만으로 단정하지 않고 조건을 확인하여 취급 가능한 상품을 찾아드립니다.",
  },
  {
    icon: HeartHandshake,
    title: "개인회생·신용회복 관련 대출",
    description: "개인회생·신용회복 진행 상황을 확인해 취급 가능한 상품이 있는지 상담해드립니다.",
  },
  {
    icon: RefreshCw,
    title: "대환대출·채무정리 상담",
    description: "기존 대출현황을 확인해 대환·채무구조 조정에 활용할 수 있는 상품을 확인합니다.",
  },
  {
    icon: HardHat,
    title: "PF·브릿지·사업자금",
    description: "부동산 개발·시행사업 등 사업구조와 담보조건을 검토해 상품을 안내합니다.",
  },
  {
    icon: CircleEllipsis,
    title: "기타 담보대출",
    description: "그 외 보유 자산과 조건을 확인해 취급 가능한 담보대출 상품을 안내합니다.",
  },
];

export function Services() {
  return (
    <section id="services" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-[860px] px-5">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="text-sm font-semibold text-primary">대출상품 안내</span>
            <h2 className="mt-3 text-balance font-heading text-3xl font-bold text-foreground sm:text-4xl">
              고객님 상황에 맞는
              <br />
              12가지 대출상품
            </h2>
            <p className="mt-5 leading-relaxed text-foreground/70">
              Key We Company는 직접 대출을 실행하지 않습니다. 고객님의 상황을
              상담한 뒤, 조건에 맞는 상품을 취급하는 등록 대부업체와
              연결해드리는 대부중개업체입니다.
            </p>

            <div className="relative mt-8 hidden aspect-4/3 overflow-hidden rounded-[8px] border border-border/60 shadow-lg shadow-primary/5 md:block">
              <Image
                src="/images/services.png"
                alt="도심 사무실에서 차량 키와 현금을 주고받으며 대부중개 상담을 진행하는 모습"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-background p-5">
            <p className="text-sm leading-relaxed text-foreground/70">
              고객의 필요금액, 자금 목적, 직업·소득, 신용상태, 보유 담보 등을
              확인해 적합한 대출 종류를 함께 찾아드립니다. 실제 대출 가능
              여부와 한도·금리·기간은 심사를 진행하는 제휴 대부업체의
              기준에 따라 달라집니다.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loanProducts.map((product, index) => (
            <div
              key={product.title}
              className="rounded-xl border border-border/60 bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <product.icon className="size-4.5" strokeWidth={1.75} />
                </span>
                <span className="text-xs font-semibold text-primary/50">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-3 font-heading text-base font-bold text-foreground">
                {product.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/65">
                {product.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
