import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/**
 * Floating button linking to a KakaoTalk open-chat room. Renders nothing
 * until siteConfig.kakaoChatUrl is set, so an unconfigured link never
 * ships to visitors.
 */
export function KakaoChatButton() {
  if (!siteConfig.kakaoChatUrl) return null;

  return (
    <a
      href={siteConfig.kakaoChatUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="카카오톡으로 상담 문의하기"
      className="fixed right-4 bottom-20 z-40 flex items-center gap-2 rounded-full bg-[#FEE500] px-4 py-3 text-sm font-bold text-[#3A1D1D] shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:right-6 md:bottom-6"
    >
      <MessageCircle className="size-5" aria-hidden="true" />
      카카오톡 상담
    </a>
  );
}
