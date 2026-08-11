"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#about", label: "회사 소개" },
  { href: "#services", label: "서비스" },
  { href: "#process", label: "상담 절차" },
  { href: "#trust", label: "고객 신뢰" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[860px] items-center justify-between px-5">
        <Link href="#top" className="flex items-center gap-2">
          <Image src="/icon.png" alt="Key We Company" width={32} height={32} className="rounded-full" />
          <span className="font-heading text-lg font-bold text-primary">Key We Company</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a href="#cta" className={cn(buttonVariants({ size: "lg" }), "px-5")}>
            무료 상담 신청
          </a>
        </div>

        <button
          type="button"
          aria-label="메뉴 열기"
          className="flex size-9 items-center justify-center rounded-full border border-border md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-[860px] flex-col gap-1 px-5 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-primary"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#cta"
              className="mt-2 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
              onClick={() => setOpen(false)}
            >
              무료 상담 신청
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
