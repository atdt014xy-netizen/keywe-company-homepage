"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = ["신용대출", "담보대출", "사업자대출", "기타"];

type Status = "idle" | "submitting" | "success" | "error";

export function ConsultForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [consentRequired, setConsentRequired] = useState(false);
  const [consentThirdParty, setConsentThirdParty] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit =
    name.trim().length > 0 &&
    phone.trim().length > 0 &&
    consentRequired &&
    consentThirdParty &&
    status !== "submitting";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          category,
          consentRequired,
          consentThirdParty,
          consentMarketing,
          website,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "전송 중 오류가 발생했습니다.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="-mx-5 mt-8 flex flex-col items-center gap-3 rounded-[8px] border border-border/60 bg-card p-8 text-center shadow-sm md:mx-0 md:rounded-[18px]">
        <CheckCircle2 className="size-10 text-primary" strokeWidth={1.5} />
        <p className="font-heading text-lg font-bold text-foreground">
          상담 신청이 정상적으로 접수되었습니다.
        </p>
        <p className="text-sm text-foreground/70">
          담당자가 확인 후 연락드리겠습니다.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="-mx-5 mt-8 rounded-[8px] border border-border/60 bg-card p-6 shadow-sm sm:p-8 md:mx-0 md:rounded-[18px]"
    >
      <h3 className="font-heading text-xl font-bold text-foreground">무료 상담 신청</h3>
      <p className="mt-1.5 text-sm text-foreground/60">
        이름과 연락처만 남겨주시면 담당자가 확인 후 연락드립니다.
      </p>

      {/* honeypot field, hidden from real users */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="consult-name" className="text-sm font-medium text-foreground">
            이름
          </label>
          <input
            id="consult-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/40 outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
          />
        </div>

        <div>
          <label htmlFor="consult-phone" className="text-sm font-medium text-foreground">
            휴대전화
          </label>
          <input
            id="consult-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/40 outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
          />
        </div>

        <div>
          <label htmlFor="consult-category" className="text-sm font-medium text-foreground">
            상담 분야 <span className="text-foreground/40">(선택사항)</span>
          </label>
          <select
            id="consult-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
          >
            <option value="">선택 안 함</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 space-y-2.5 border-t border-border/60 pt-5">
        <label className="flex items-start gap-2.5 text-sm text-foreground/80">
          <input
            type="checkbox"
            required
            checked={consentRequired}
            onChange={(e) => setConsentRequired(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />
          <span>
            <span className="font-medium text-foreground">[필수]</span> 개인정보
            수집·이용에 동의합니다.{" "}
            <Link href="/privacy" target="_blank" className="text-primary underline underline-offset-2">
              내용보기
            </Link>
          </span>
        </label>

        <label className="flex items-start gap-2.5 text-sm text-foreground/80">
          <input
            type="checkbox"
            required
            checked={consentThirdParty}
            onChange={(e) => setConsentThirdParty(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />
          <span>
            <span className="font-medium text-foreground">[필수]</span> 제휴
            대부업체 개인정보 제공에 동의합니다.{" "}
            <Link href="/privacy" target="_blank" className="text-primary underline underline-offset-2">
              내용보기
            </Link>
          </span>
        </label>

        <label className="flex items-start gap-2.5 text-sm text-foreground/80">
          <input
            type="checkbox"
            checked={consentMarketing}
            onChange={(e) => setConsentMarketing(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />
          <span>
            <span className="font-medium text-foreground/60">[선택]</span> 문자·전화
            등 마케팅 정보 수신에 동의합니다.
          </span>
        </label>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-destructive">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full gap-1.5")}
      >
        {status === "submitting" && <Loader2 className="size-4 animate-spin" />}
        무료 상담 신청하기
      </button>
    </form>
  );
}
