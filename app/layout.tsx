import type { Metadata } from "next";
import { Noto_Sans_KR, Gowun_Batang } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { ConsultModalProvider } from "@/components/consult-modal-provider";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { KakaoChatButton } from "@/components/kakao-chat-button";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const gowunBatang = Gowun_Batang({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const title = `${siteConfig.brandName} | 부산 정식등록 대부중개업체 · 무료 대출상담`;
const description =
  `${siteConfig.brandName}는 부산광역시에 정식 등록된 대부중개업체입니다. ` +
  "등록 대부업체와 고객님을 연결해드리며, 부동산·자동차 담보대출부터 개인신용, " +
  "사업자·법인자금까지 상황에 맞는 대출상품을 무료로 상담해드립니다.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.brandName,
    locale: "ko_KR",
    type: "website",
    images: ["/images/hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/hero.png"],
  },
  /**
   * TODO: Google Search Console / 네이버 서치어드바이저에서 발급받은
   * 소유권 확인 코드를 받으면 아래에 채워 넣으세요.
   * - google: Search Console > 설정 > 소유권 확인 > HTML 태그 방식에서
   *   content="..." 값만 복사
   * - other.naver-site-verification: 네이버 서치어드바이저 > 사이트 소유
   *   확인 > HTML 태그 방식에서 content="..." 값만 복사
   */
  verification: {
    google: "",
    other: { "naver-site-verification": "" },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: siteConfig.brandName,
  legalName: siteConfig.legalName,
  url: siteConfig.siteUrl,
  logo: `${siteConfig.siteUrl}/icon.png`,
  image: `${siteConfig.siteUrl}/images/hero.png`,
  description,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address,
    addressCountry: "KR",
  },
  areaServed: "KR",
  priceRange: "무료 상담",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${gowunBatang.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ConsultModalProvider>
          {children}
          <KakaoChatButton />
          <MobileCtaBar />
        </ConsultModalProvider>
      </body>
    </html>
  );
}
