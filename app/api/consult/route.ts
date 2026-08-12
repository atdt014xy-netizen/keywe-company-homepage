import { NextResponse } from "next/server";
import { Resend } from "resend";

const RECIPIENT = "sejongbiz@naver.com";
const PHONE_PATTERN = /^[0-9-+ ]{9,15}$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const category = String(body.category ?? "").trim();
  const consentRequired = Boolean(body.consentRequired);
  const consentThirdParty = Boolean(body.consentThirdParty);
  const consentMarketing = Boolean(body.consentMarketing);
  const website = String(body.website ?? ""); // honeypot

  if (website) {
    // Bot submission: pretend success without sending anything.
    return NextResponse.json({ ok: true });
  }

  if (!name || !phone || !consentRequired || !consentThirdParty) {
    return NextResponse.json(
      { error: "이름, 휴대전화번호와 필수 동의 항목을 모두 입력해주세요." },
      { status: 400 }
    );
  }

  if (!PHONE_PATTERN.test(phone)) {
    return NextResponse.json(
      { error: "휴대전화번호 형식을 확인해주세요." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json(
      { error: "상담 신청 접수가 일시적으로 불가능합니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  const receivedAt = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    dateStyle: "medium",
    timeStyle: "short",
  });

  try {
    const { error } = await resend.emails.send({
      from: "Key We Company 상담신청 <onboarding@resend.dev>",
      to: RECIPIENT,
      subject: `[무료 상담 신청] ${name} / ${phone}`,
      text: [
        `접수 시각: ${receivedAt}`,
        `이름: ${name}`,
        `휴대전화: ${phone}`,
        `상담 분야: ${category || "선택 안 함"}`,
        `개인정보 수집·이용 동의: ${consentRequired ? "동의" : "미동의"}`,
        `제휴 대부업체 제공 동의: ${consentThirdParty ? "동의" : "미동의"}`,
        `마케팅 수신 동의: ${consentMarketing ? "동의" : "미동의"}`,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend error", error);
      return NextResponse.json(
        { error: "전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Consult form send failed", err);
    return NextResponse.json(
      { error: "전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
