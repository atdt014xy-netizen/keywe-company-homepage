"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ConsultForm } from "@/components/sections/consult-form";

const ConsultModalContext = createContext<{ open: () => void } | null>(null);

export function ConsultModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <ConsultModalContext.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-6 sm:p-7">
          <DialogTitle className="sr-only">무료 상담 신청</DialogTitle>
          <DialogDescription className="sr-only">
            이름과 연락처를 남기면 담당자가 확인 후 연락드립니다.
          </DialogDescription>
          <ConsultForm bare />
        </DialogContent>
      </Dialog>
    </ConsultModalContext.Provider>
  );
}

export function useConsultModal() {
  const ctx = useContext(ConsultModalContext);
  if (!ctx) {
    throw new Error("useConsultModal must be used within a ConsultModalProvider");
  }
  return ctx;
}
