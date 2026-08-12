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

      <div className="mt-8">
        <InfiniteSlider gap={24} reverse className="py-2">
          {Array.from({ length: cardCount }, (_, i) => i + 1).map((n) => (
            <img
              key={n}
              src={`/images/card/${n}.png`}
              alt={`Key We 대부중개 대출상품 안내 카드 ${n}`}
              className="h-[168px] w-[168px] shrink-0 rounded-2xl object-cover sm:h-[192px] sm:w-[192px]"
            />
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
