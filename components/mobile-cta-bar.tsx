import { Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { ConsultCtaButton } from "@/components/consult-cta-button";

export function MobileCtaBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border/60 bg-background/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={siteConfig.phoneHref}
        className="flex flex-1 items-center justify-center gap-1.5 py-3.5 text-sm font-semibold text-foreground/80 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
      >
        <Phone className="size-4" aria-hidden="true" />
        전화 상담
      </a>
      <ConsultCtaButton className="flex flex-1 items-center justify-center gap-1.5 bg-primary py-3.5 text-sm font-semibold text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring">
        <MessageCircle className="size-4" aria-hidden="true" />
        무료 상담 신청
      </ConsultCtaButton>
    </div>
  );
}
