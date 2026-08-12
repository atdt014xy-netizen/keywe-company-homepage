import Image from "next/image";

export function ProductsCarousel() {
  return (
    <section
      id="services"
      className="mx-auto max-w-[860px] scroll-mt-20 px-5 py-14"
    >
      <span className="text-sm font-semibold text-primary">대출상품 안내</span>
      <h2 className="mt-3 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
        고객님 상황에 맞는 12가지 대출상품
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

      <div className="relative -mx-5 mt-8 aspect-[860/1499] w-auto overflow-hidden rounded-[8px] border border-border/60 shadow-lg shadow-primary/5 md:mx-auto md:w-full md:max-w-[860px] md:rounded-[18px]">
        <Image
          src="/images/hero2.png"
          alt="Key We 대부중개 알선 가능한 대출상품 12가지, 상담 진행 절차, 안내 사항"
          fill
          loading="lazy"
          className="object-cover"
          sizes="(min-width: 672px) 672px, 100vw"
        />
      </div>
    </section>
  );
}
