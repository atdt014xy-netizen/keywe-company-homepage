import CarouselStacked from "@/components/ui/carousel-07";

export function ProductsCarousel() {
  return (
    <section id="products-carousel" className="bg-background">
      <div className="mx-auto max-w-[860px] px-5 pt-2 text-center">
        <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
          어떤 상황이든, 맞는 대출상품이 있습니다
        </h2>
        <p className="mt-2 text-sm text-foreground/60">
          카드를 좌우로 밀어 다양한 대출상품을 확인해보세요
        </p>
      </div>
      <CarouselStacked />
    </section>
  );
}
