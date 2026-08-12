import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "개인정보 처리방침 | Key We 대부중개",
  description:
    "Key We 대부중개의 개인정보 처리 목적, 항목, 보유기간, 제3자 제공, 위탁, 파기, 정보주체의 권리 및 보호책임자에 관한 안내입니다.",
};

function Article({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border/60 bg-card p-6 shadow-sm sm:p-7">
      <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
        제{number}조 {title}
      </h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/75">
        {children}
      </div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <p className="font-semibold text-foreground">{children}</p>;
}

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-[860px] px-5 py-16">
          <span className="text-sm font-semibold text-primary">개인정보처리방침</span>
          <h1 className="mt-3 text-balance font-heading text-3xl font-bold text-foreground sm:text-4xl">
            개인정보 처리방침
          </h1>
          <p className="mt-5 leading-relaxed text-foreground/70">
            Key We 대부중개(이하 &ldquo;회사&rdquo;)는 고객님의 개인정보를
            중요하게 생각하며, 「개인정보 보호법」 등 관련 법령을 준수하고
            있습니다. 회사는 대출 상담 및 대부중개 서비스 제공 과정에서
            필요한 최소한의 개인정보만을 처리하며, 개인정보가 어떠한
            목적으로 수집·이용되고 어떻게 보호되는지 고객님께 안내하기
            위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
          </p>

          <div className="mt-10 space-y-6">
            <Article number={1} title="개인정보의 처리 목적">
              <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다.</p>

              <SubHeading>1. 대출 상담 신청 접수</SubHeading>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>홈페이지를 통한 상담 신청 확인</li>
                <li>신청 고객 본인 확인 및 연락</li>
                <li>상담 희망 분야 확인</li>
                <li>상담 일정 안내</li>
              </ul>

              <SubHeading>2. 대부중개 상담</SubHeading>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>고객의 자금 필요 목적 및 상황 확인</li>
                <li>고객에게 적합한 대출상품 안내</li>
                <li>대출 가능 여부에 대한 사전 상담</li>
                <li>제휴 대부업체 연결 및 상담 진행</li>
              </ul>

              <SubHeading>3. 고객 문의 및 민원 처리</SubHeading>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>상담 진행 상황 확인</li>
                <li>고객 문의사항에 대한 답변</li>
                <li>불만 및 민원사항 처리</li>
                <li>분쟁 발생 시 사실관계 확인</li>
              </ul>

              <SubHeading>4. 마케팅 및 상담 안내</SubHeading>
              <p>
                고객이 별도로 동의한 경우에 한하여 전화 또는 문자 등을
                이용하여 상담 안내, 상품 안내 등의 정보를 제공할 수
                있습니다. 마케팅 수신 동의는 선택사항이며, 동의하지
                않더라도 기본적인 대출 상담 신청에는 불이익이 없습니다.
              </p>
            </Article>

            <Article number={2} title="처리하는 개인정보의 항목">
              <SubHeading>1. 홈페이지 상담 신청 시</SubHeading>
              <p className="font-medium text-foreground">필수항목</p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>이름</li>
                <li>휴대전화번호</li>
              </ul>
              <p className="font-medium text-foreground">선택항목</p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>상담 분야</li>
              </ul>

              <SubHeading>2. 상담 진행 과정에서 필요한 경우</SubHeading>
              <p>
                상담 내용에 따라 고객이 직접 제공하거나 별도의 안내 및
                동의를 거쳐 다음과 같은 정보가 추가로 처리될 수 있습니다.
              </p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>직업 및 재직 관련 정보</li>
                <li>사업자 여부 및 사업 관련 정보</li>
                <li>소득 관련 정보</li>
                <li>보유 부동산·자동차 등 담보 관련 정보</li>
                <li>기존 대출 및 채무 현황</li>
                <li>희망 대출금액</li>
                <li>대출 목적</li>
                <li>기타 고객이 상담 과정에서 직접 제공한 정보</li>
              </ul>
              <p>
                개인신용정보 또는 별도의 동의가 필요한 정보는 관련 법령에
                따라 필요한 절차를 거친 후 처리합니다. 회사는 홈페이지의
                최초 상담 신청 단계에서는 주민등록번호, 계좌 비밀번호, 카드
                비밀번호 등의 정보를 요구하지 않습니다.
              </p>
            </Article>

            <Article number={3} title="개인정보의 처리 및 보유기간">
              <p>
                회사는 개인정보의 수집 및 이용 목적이 달성된 후 해당 정보를
                지체 없이 파기하는 것을 원칙으로 합니다.
              </p>

              <SubHeading>홈페이지 상담 신청 정보</SubHeading>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>대상: 이름, 휴대전화번호, 상담 분야</li>
                <li>보유기간: 상담 종료일로부터 3개월</li>
                <li>목적: 상담 이력 확인, 추가 문의 및 민원 처리</li>
              </ul>
              <p>
                다만, 고객이 개인정보 삭제를 요청한 경우 관계 법령상 보관
                의무가 없는 정보는 확인 후 지체 없이 삭제합니다.
              </p>

              <SubHeading>마케팅 수신 동의 정보</SubHeading>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>대상: 이름, 휴대전화번호, 마케팅 수신 동의 여부</li>
                <li>
                  보유기간: 동의일로부터 2년 또는 동의 철회일까지 중 먼저
                  도래하는 때
                </li>
              </ul>
              <p>
                고객은 언제든지 마케팅 수신 동의를 철회할 수 있습니다.
                관계 법령에서 일정 기간 개인정보 또는 거래 관련 자료의
                보관을 의무화한 경우에는 해당 법령에서 정한 기간 동안
                별도로 보관할 수 있습니다.
              </p>
            </Article>

            <Article number={4} title="개인정보의 제3자 제공">
              <p>
                회사는 원칙적으로 고객의 개인정보를 수집한 목적 범위 내에서
                처리하며, 고객의 사전 동의 없이 제3자에게 개인정보를
                제공하지 않습니다.
              </p>
              <p>
                다만, 고객이 제휴 대부업체를 통한 대출 심사 및 상담 진행을
                희망하는 경우 고객에게 적합한 제휴 대부업체가 결정된 후
                개인정보를 제공할 수 있습니다.
              </p>
              <p>
                회사는 개인정보를 제휴 대부업체에 제공하기 전에 고객에게
                다음 사항을 안내하고 별도의 동의를 받습니다.
              </p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>개인정보를 제공받는 대부업체의 상호</li>
                <li>개인정보 제공 목적</li>
                <li>제공하는 개인정보 항목</li>
                <li>개인정보를 제공받는 업체의 보유·이용기간</li>
                <li>개인정보 제공 동의를 거부할 권리</li>
                <li>동의 거부 시 발생할 수 있는 서비스 이용 제한</li>
              </ul>

              <SubHeading>제공 목적</SubHeading>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>대출 상담</li>
                <li>대출 가능 여부 확인</li>
                <li>대출 심사</li>
                <li>대출 조건 및 한도 안내</li>
                <li>고객이 신청한 대출 절차 진행</li>
              </ul>

              <SubHeading>제공될 수 있는 개인정보</SubHeading>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>이름</li>
                <li>휴대전화번호</li>
                <li>상담 분야</li>
                <li>희망 대출금액</li>
                <li>직업 및 소득 관련 정보</li>
                <li>담보 관련 정보</li>
                <li>상담 과정에서 고객이 제공한 대출 관련 정보</li>
              </ul>

              <p>
                고객의 개인정보는 고객에게 안내한 해당 제휴 대부업체에
                한하여 제공하며, 불특정 다수의 대부업체에 임의로 제공하지
                않습니다.
              </p>
              <p>
                고객은 개인정보 제3자 제공에 대한 동의를 거부할 권리가
                있습니다. 다만, 동의하지 않을 경우 해당 제휴 대부업체를
                통한 대출 상담 또는 심사 진행이 제한될 수 있습니다.
              </p>
            </Article>

            <Article number={5} title="개인정보 처리업무의 위탁">
              <p>
                회사는 개인정보 처리업무를 외부 업체에 위탁하는 경우
                「개인정보 보호법」에 따라 위탁계약을 체결하고 개인정보가
                안전하게 관리될 수 있도록 필요한 사항을 관리·감독합니다.
                현재 회사가 개인정보 처리업무를 위탁하고 있는 현황은 다음과
                같습니다.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border/60">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead className="bg-secondary/50 text-foreground">
                    <tr>
                      <th className="px-3 py-2 font-semibold">수탁업체</th>
                      <th className="px-3 py-2 font-semibold">위탁업무 내용</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr>
                      <td className="px-3 py-2 align-top">
                        Resend, Inc.
                      </td>
                      <td className="px-3 py-2 align-top">
                        홈페이지 상담 신청 정보를 담당자 이메일로 전달하기
                        위한 이메일 발송 대행
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                회사는 홈페이지 상담 신청 정보를 별도의 데이터베이스에
                저장하지 않으며, 위 이메일 발송 서비스를 통하여 담당자에게
                즉시 전달되는 방식으로만 처리합니다. 향후 위탁 업체 또는
                위탁 업무의 내용이 변경되는 경우 이 조항을 통하여 지체
                없이 공개합니다.
              </p>
            </Article>

            <Article number={6} title="개인정보의 파기절차 및 파기방법">
              <p>
                회사는 개인정보의 보유기간이 경과하거나 처리 목적이
                달성되는 등 개인정보가 불필요하게 된 경우 지체 없이 해당
                개인정보를 파기합니다.
              </p>
              <SubHeading>파기절차</SubHeading>
              <p>
                보유기간이 경과하거나 상담 목적이 달성된 개인정보를 확인한
                후 내부 절차에 따라 파기합니다.
              </p>
              <SubHeading>파기방법</SubHeading>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>전자파일: 복구 또는 재생할 수 없는 방법으로 삭제</li>
                <li>출력물 및 종이서류: 분쇄 또는 소각 등의 방법으로 파기</li>
              </ul>
              <p>
                관계 법령에 따라 일정 기간 보존하여야 하는 정보는 다른
                개인정보와 분리하여 보관한 후 보존기간이 종료되면
                파기합니다.
              </p>
            </Article>

            <Article number={7} title="정보주체의 권리 및 행사방법">
              <p>
                고객은 언제든지 회사에 자신의 개인정보에 대하여 다음과 같은
                권리를 행사할 수 있습니다.
              </p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>개인정보 열람 요구</li>
                <li>개인정보 정정 요구</li>
                <li>개인정보 삭제 요구</li>
                <li>개인정보 처리정지 요구</li>
                <li>개인정보 수집·이용 동의 철회</li>
                <li>개인정보 제3자 제공 동의 철회</li>
                <li>마케팅 수신 동의 철회</li>
              </ul>
              <p>
                개인정보에 관한 요청은 전화 또는 이메일을 통해 신청할 수
                있습니다. 회사는 본인 여부를 확인한 후 관련 법령에서 정한
                절차에 따라 신속하게 처리합니다.
              </p>
            </Article>

            <Article number={8} title="개인정보의 안전성 확보조치">
              <p>
                회사는 고객의 개인정보가 분실·도난·유출·변조 또는
                훼손되지 않도록 다음과 같은 안전성 확보조치를 시행합니다.
              </p>
              <SubHeading>관리적 조치</SubHeading>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>개인정보 접근 담당자 최소화</li>
                <li>개인정보 보호 관련 내부 관리</li>
                <li>개인정보 취급자 교육 및 관리</li>
              </ul>
              <SubHeading>기술적 조치</SubHeading>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>개인정보에 대한 접근권한 관리</li>
                <li>비밀번호 등 인증정보의 안전한 관리</li>
                <li>개인정보 전송 및 저장 시 필요한 보안조치</li>
                <li>해킹 및 악성 프로그램 등에 대한 보안조치</li>
              </ul>
              <SubHeading>물리적 조치</SubHeading>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>개인정보가 포함된 서류 및 저장매체에 대한 접근 제한</li>
                <li>필요하지 않은 개인정보 자료의 안전한 폐기</li>
              </ul>
            </Article>

            <Article number={9} title="개인정보 자동수집 장치 등에 관한 사항">
              <p>
                홈페이지 이용 과정에서 서비스 운영 및 보안을 위하여 다음과
                같은 정보가 자동으로 생성될 수 있습니다.
              </p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>접속 IP 주소</li>
                <li>접속 일시</li>
                <li>브라우저 정보</li>
                <li>기기 및 운영체제 정보</li>
                <li>서비스 이용 기록</li>
              </ul>
              <p>
                회사가 향후 쿠키(Cookie), 방문자 분석 또는 광고·통계
                서비스를 사용하는 경우 해당 서비스의 목적과 거부 방법 등을
                개인정보 처리방침을 통하여 추가로 안내합니다.
              </p>
            </Article>

            <Article number={10} title="개인정보 보호책임자 및 문의처">
              <p>
                회사는 고객의 개인정보를 보호하고 개인정보와 관련한 문의 및
                불만사항을 처리하기 위하여 다음과 같이 개인정보
                보호책임자를 지정하고 있습니다.
              </p>
              <dl className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-foreground">상호</dt>
                  <dd>Key We 대부중개</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">개인정보 보호책임자</dt>
                  <dd>류수인</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">전화</dt>
                  <dd>010-7741-5434</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">이메일</dt>
                  <dd>atdt014xy@gmail.com</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">주소</dt>
                  <dd>부산광역시 중구 남포동1가 21-6</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">사업자등록번호</dt>
                  <dd>753-05-03649</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">대부중개업 등록번호</dt>
                  <dd>2025-부산동구-03010</dd>
                </div>
              </dl>
              <p>
                개인정보와 관련한 문의, 열람, 정정, 삭제, 처리정지 또는
                동의 철회를 원하시는 경우 위 연락처로 문의해 주시기
                바랍니다.
              </p>
            </Article>

            <Article number={11} title="개인정보 침해 관련 권리구제">
              <p>
                개인정보 침해와 관련하여 상담 또는 피해구제가 필요한 경우
                개인정보보호위원회, 개인정보침해 신고센터, 개인정보분쟁조정위원회
                등 관계기관을 통하여 도움을 받을 수 있습니다.
              </p>
              <p>
                회사는 고객의 개인정보 관련 문의 및 불만사항을 신속하고
                원활하게 처리할 수 있도록 최선을 다하겠습니다.
              </p>
            </Article>

            <Article number={12} title="개인정보 처리방침의 변경">
              <p>
                본 개인정보 처리방침의 내용이 변경되는 경우 회사는 홈페이지를
                통하여 변경 내용과 시행일을 공개합니다. 중요한 변경사항이
                있는 경우 고객이 쉽게 확인할 수 있도록 별도로 안내할 수
                있습니다.
              </p>
            </Article>

            <section className="rounded-xl border border-border/60 bg-secondary/40 p-6 text-sm leading-relaxed text-foreground/70 sm:p-7">
              <p className="font-semibold text-foreground">부칙</p>
              <p className="mt-2">공고일자: 2026년 8월 12일</p>
              <p>시행일자: 2026년 8월 12일</p>
              <p className="mt-4">
                Key We 대부중개는 고객님의 개인정보를 소중하게 보호하며,
                수집한 개인정보를 고객이 동의한 목적과 범위를 벗어나
                임의로 이용하거나 제공하지 않습니다.
              </p>
            </section>
          </div>

          <Link
            href="/#consult"
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
