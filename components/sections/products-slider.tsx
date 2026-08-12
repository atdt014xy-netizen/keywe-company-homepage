import { InfiniteSlider } from "@/components/core/infinite-slider";

const cardCount = 11;

export function ProductsSlider() {
  return (
    <section id="products-slider" className="bg-background">
      <div className="mx-auto max-w-[860px] px-5 pt-2 text-center">
        <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
          어떤 상황이든, 맞는 대출상품이 있습니다
        </h2>
        <p className="mt-2 text-sm text-foreground/60">
          다양한 대출상품을 확인해보세요
        </p>
      </div>

      <div className="relative mx-auto mt-8 max-w-[860px] px-5">
        <InfiniteSlider gap={24} reverse className="py-2">
          {Array.from({ length: cardCount }, (_, i) => i + 1).map((n) => (
            <img
              key={n}
              src={`/images/card/${n}.png`}
              alt={`Key We 대부중개 대출상품 안내 카드 ${n}`}
              className="h-[140px] w-[140px] shrink-0 rounded-2xl object-cover sm:h-[160px] sm:w-[160px]"
            />
          ))}
        </InfiniteSlider>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent sm:w-20" />
      </div>
    </section>
  );
}
