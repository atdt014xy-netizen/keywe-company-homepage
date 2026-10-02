import { DateTime } from "luxon";
export type Stock = { tracked: boolean; available: number | null };
export function stockStatus(s: Stock, threshold = 5) {
  if (!s.tracked || s.available === null) return "untracked";
  if (s.available <= 0) return "out";
  return s.available < threshold ? "low" : "healthy";
}
export function stockTransition(
  before: Stock | undefined,
  after: Stock,
  threshold: number,
): "low" | "out" | null {
  if (
    !after.tracked ||
    after.available === null ||
    !before?.tracked ||
    before.available === null
  )
    return null;
  if (after.available <= 0 && before.available > 0) return "out";
  if (after.available < threshold && before.available >= threshold)
    return "low";
  return null;
}
export function quietNow(
  now: Date,
  zone: string,
  start: number,
  end: number,
  enabled: boolean,
) {
  const local = DateTime.fromJSDate(now).setZone(zone);
  if (!local.isValid) throw new Error("Invalid timezone");
  if (!enabled || start === end) return false;
  const minute = local.hour * 60 + local.minute;
  return start < end
    ? minute >= start && minute < end
    : minute >= start || minute < end;
}
export function canCreateDiscount(
  status: string,
  checkedAt: Date | null,
  allowTrial: boolean,
  now = new Date(),
) {
  if (allowTrial && status === "free_development") return true;
  return (
    status === "active" &&
    checkedAt !== null &&
    now.getTime() - checkedAt.getTime() < 15 * 60_000
  );
}
