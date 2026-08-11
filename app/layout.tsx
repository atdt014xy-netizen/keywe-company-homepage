import type { Metadata } from "next";
import { Noto_Sans_KR, Gowun_Batang } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Key We Company | 믿을 수 있는 대부중개",
  description:
    "Key We Company는 등록 대부업체와 고객님을 연결해드리는 대부중개업체입니다. 부동산·자동차 담보대출부터 개인신용, 사업자·법인자금까지 상황에 맞는 대출상품을 안내합니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${gowunBatang.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
