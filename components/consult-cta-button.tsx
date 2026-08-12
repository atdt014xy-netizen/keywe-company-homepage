"use client";

import type { ReactNode, MouseEvent } from "react";
import { useConsultModal } from "@/components/consult-modal-provider";

/**
 * "무료 상담 신청" call-to-action. On mobile viewports it opens the
 * consult modal instead of jumping to the bottom-of-page form, since the
 * form now sits after several sections. On larger screens it falls back
 * to a plain anchor smooth-scroll to #consult.
 */
export function ConsultCtaButton({
  className,
  children,
  onNavigate,
}: {
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  const { open } = useConsultModal();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      e.preventDefault();
      open();
    }
    onNavigate?.();
  }

  return (
    <a href="#consult" onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
