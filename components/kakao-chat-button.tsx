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
      className="fixed right-3 bottom-20 z-40 flex size-11 items-center justify-center rounded-full bg-[#FEE500] shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:right-4 md:bottom-4"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        aria-hidden="true"
      >
        <path
          fill="#3A1D1D"
          d="M12 3.6c-5.376 0-9.735 3.44-9.735 7.687 0 2.755 1.826 5.174 4.573 6.545-.15.53-.964 3.336-.996 3.556 0 0-.02.166.088.23a.31.31 0 0 0 .245.008c.324-.046 3.746-2.462 4.34-2.877.48.068.973.104 1.485.104 5.376 0 9.735-3.44 9.735-7.686S17.376 3.6 12 3.6"
        />
      </svg>
    </a>
  );
}
