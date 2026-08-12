import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "개인정보 처리방침 | Key We 대부중개",
  description: "Key We 대부중개의 개인정보 수집·이용, 제3자 제공, 보유기간 및 이용자 권리에 관한 안내입니다.",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-[860px] px-5 py-16">
          <span className="text-sm font-semibold text-primary">개인정보처리방침</span>
          <h1 className="mt-3 text-balance font-heading text-3xl font-bold text-foreground sm:text-4xl">
            개인정보 수집·이용 및 제3자 제공 안내
          </h1>
          <p className="mt-5 leading-relaxed text-foreground/70">
            Key We 대부중개(이하 &ldquo;회사&rdquo;)는 대부중개업 등록업체로서,
            고객님의 대출 상담 신청 접수를 위해 아래와 같이 개인정보를
            수집·이용하며, 고객님의 동의가 있는 경우에 한해 제휴 대부업체에
            정보를 제공합니다.
          </p>

          <div className="mt-10 space-y-8">
            <section className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-foreground">
                1. 개인정보 수집·이용 (필수)
              </h2>
              <dl className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/75">
                <div>
                  <dt className="font-semibold text-foreground">수집 목적</dt>
                  <dd>대출 상담 신청 접수 및 고객 상담 연락</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">수집 항목</dt>
                  <dd>이름, 휴대전화번호, 상담 분야(선택 입력)</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">보유·이용 기간</dt>
                  <dd>상담 종료 후 3개월 후 파기</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">동의 거부 권리 및 불이익</dt>
                  <dd>
                    귀하는 개인정보 수집·이용에 대한 동의를 거부할 권리가
                    있습니다. 다만, 필수 정보 수집에 동의하지 않을 경우 상담
                    신청이 제한될 수 있습니다.
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-foreground">
                2. 제휴 대부업체 개인정보 제공 (해당 시 필수)
              </h2>
              <dl className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/75">
                <div>
                  <dt className="font-semibold text-foreground">제공받는 자</dt>
                  <dd>고객님의 상담 내용에 적합한 정식 등록 제휴 대부업체</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">제공 목적</dt>
                  <dd>대출 상담 및 심사 진행</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">제공 항목</dt>
                  <dd>이름, 휴대전화번호, 상담 분야 및 상담 내용</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">보유·이용 기간</dt>
                  <dd>심사 완료 후 파기 또는 관계 법령에서 정한 기간까지 보관</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">동의 거부 권리 및 불이익</dt>
                  <dd>
                    귀하는 제3자 제공에 대한 동의를 거부할 권리가 있습니다.
                    다만, 동의하지 않을 경우 제휴 대부업체를 통한 대출 상담이
                    제한될 수 있습니다.
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-foreground">
                3. 마케팅 정보 수신 동의 (선택)
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground/75">
                문자·전화 등을 통한 상품·이벤트 안내를 받아보시려는 고객님에
                한해 별도로 동의를 받으며, 동의하지 않으셔도 상담 신청에는
                영향이 없습니다. 수신 동의는 언제든 철회하실 수 있습니다.
              </p>
            </section>

            <section className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-foreground">
                4. 문의처
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground/75">
                개인정보 관련 문의는 전화 010-7741-5434 또는 이메일
                atdt014xy@gmail.com 로 연락해 주시기 바랍니다. 급한 용무는
                365일 언제든 연락 주세요.
              </p>
            </section>
          </div>

          <Link
            href="/#cta"
            className="mt-10 inline-block text-sm font-semibold text-primary hover:underline"
          >
            ← 홈으로 돌아가기
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
