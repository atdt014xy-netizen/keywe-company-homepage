import Image from "next/image";
import { loanProducts, LOAN_PRODUCT_COUNT } from "@/lib/loan-products";

export function ProductsCarousel() {
  return (
    <section
      id="services"
      className="mx-auto max-w-[860px] scroll-mt-20 px-5 py-14"
    >
      <span className="text-sm font-semibold text-primary">대출상품 안내</span>
      <h2 className="mt-3 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
        고객님 상황에 맞는 {LOAN_PRODUCT_COUNT}가지 대출상품
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-foreground/70">
        <strong className="rounded bg-primary/10 px-1 py-0.5 font-bold text-primary">
          Key We 대부중개는 직접 대출을 실행하지 않는 대부중개업체입니다.
        </strong>{" "}
        고객의 필요금액, 자금 목적, 직업·소득, 신용상태, 보유 담보 등을
        확인해 적합한 대출 종류를 함께 찾아드립니다. 실제 대출 가능 여부와
        한도·금리·기간은 심사를 진행하는 제휴 대부업체의 기준에 따라
        달라집니다.
      </p>

      <ul
        className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
        aria-label={`대출상품 ${LOAN_PRODUCT_COUNT}가지`}
      >
        {loanProducts.map((product) => (
          <li
            key={product.id}
            className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]"
          >
            <a
              href="#consult"
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-secondary">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={`${product.title} — ${product.description}`}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 78vw"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-background p-6 text-center">
                    <product.icon className="size-10 text-primary" strokeWidth={1.5} aria-hidden="true" />
                    <span className="text-xs font-semibold text-primary/70">
                      {product.badge}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <h3 className="font-heading text-base font-bold text-foreground">
                  {product.title}
                </h3>
                <p className="text-sm leading-snug text-foreground/65">
                  {product.description}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
