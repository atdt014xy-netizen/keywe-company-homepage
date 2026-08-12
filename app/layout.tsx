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

const title = `${siteConfig.brandName} | 믿을 수 있는 대출 상담`;
const description =
  `${siteConfig.brandName}는 등록 대부업체와 고객님을 연결해드리는 대부중개업체입니다. ` +
  "부동산·자동차 담보대출부터 개인신용, 사업자·법인자금까지 상황에 맞는 대출상품을 안내합니다.";

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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${gowunBatang.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ConsultModalProvider>
          {children}
          <KakaoChatButton />
          <MobileCtaBar />
        </ConsultModalProvider>
      </body>
    </html>
  );
}
