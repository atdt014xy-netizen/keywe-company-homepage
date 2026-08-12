import Image from "next/image";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-[860px] scroll-mt-20 px-5 py-14">
      <div className="relative -mx-5 aspect-[1672/941] w-auto overflow-hidden rounded-[8px] border border-border/60 shadow-lg shadow-primary/5 md:mx-0 md:w-full md:rounded-[18px]">
        <Image
          src="/images/menu1.png"
          alt="회사 소개 — 숫자보다 사람을 먼저 보는 금융상담, 대부중개 상담사가 고객에게 브리핑하는 모습"
          fill
          className="object-cover"
          sizes="(min-width: 860px) 860px, 100vw"
        />
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <span className="text-sm font-semibold text-primary">회사 소개</span>
        <h2 className="mt-3 text-balance font-heading text-3xl font-bold text-foreground sm:text-4xl">
          숫자보다 사람을 먼저 보는 금융상담, 키위대부중개
        </h2>

        <div className="-mx-5 mt-6 space-y-4 rounded-xl border border-border/60 bg-card p-6 leading-relaxed text-foreground/70 shadow-sm sm:p-8 md:mx-0">
          <p>
            키위대부중개는 단순히 대출상품을 연결하는 곳이 아닙니다.
            고객님의 소득, 직업, 신용상태, 보유자산과 자금이 필요한
            이유까지 꼼꼼히 살펴 현재 상황에 맞는 현실적인 금융
            선택지를 찾는 것에서 상담을 시작합니다.
          </p>
          <p>
            무리한 대출을 권하지 않습니다. 가능한 조건과 필요한 절차를
            정확하게 설명하고, 고객님이 충분히 이해한 뒤 스스로 결정할
            수 있도록 돕습니다.
          </p>
          <p>
            정식 등록 대부중개업체로서 투명하게, 책임감 있게. 막막한
            순간 가장 먼저 떠올릴 수 있는 든든한 상담창구가 되겠습니다.
          </p>
          <p className="font-semibold text-foreground">
            키위대부중개 — 필요한 순간, 가능한 길을 함께 찾겠습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
