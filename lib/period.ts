export type TrackerPeriod = {
  weekNumber: number;
  weekStart: string;
  weekEnd: string;
  monthStart: string;
  dateLabel: string;
  monthLabel: string;
};

const DEFAULT_HUB_START_DATE = "2026-07-13";
export const WEEK_BOUNDARY_LABEL = "월요일 23:59";

function datePartsInSeoul(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
    hour: value("hour"),
    minute: value("minute"),
  };
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatShort(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "2-digit",
  })
    .format(date)
    .toUpperCase();
}

export function getCurrentPeriod(date = new Date()): TrackerPeriod {
  const { year, month, day, hour, minute } = datePartsInSeoul(date);
  const today = new Date(Date.UTC(year, month - 1, day));
  const isoDay = today.getUTCDay() || 7;
  const weekStartDate = new Date(today);
  weekStartDate.setUTCDate(today.getUTCDate() - isoDay + 1);

  // Monday belongs to the previous tracking week until the 23:59 KST boundary.
  if (isoDay === 1 && (hour < 23 || (hour === 23 && minute < 59))) {
    weekStartDate.setUTCDate(weekStartDate.getUTCDate() - 7);
  }

  return {
    ...periodFromWeekStart(weekStartDate),
    monthStart: `${year}-${String(month).padStart(2, "0")}-01`,
    monthLabel: `${year}년 ${month}월`,
  };
}

function parseIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function getHubStartDate() {
  const configured = process.env.HUB_START_DATE;
  return /^\d{4}-\d{2}-\d{2}$/.test(configured ?? "")
    ? configured!
    : DEFAULT_HUB_START_DATE;
}

export function getProgramWeekNumber(weekStart: string | Date) {
  const start = parseIsoDate(getHubStartDate());
  const target = typeof weekStart === "string" ? parseIsoDate(weekStart) : weekStart;
  const difference = Math.floor((target.getTime() - start.getTime()) / 604800000);
  return Math.max(1, difference + 1);
}

export function getWeekDeadline(weekStart: string) {
  const nextMonday = parseIsoDate(weekStart);
  nextMonday.setUTCDate(nextMonday.getUTCDate() + 7);
  return new Date(`${toIsoDate(nextMonday)}T23:59:00+09:00`);
}

export function getOutcomeForDate(
  weekStart: string,
  date = new Date(),
): "submitted" | "late" {
  return date.getTime() < getWeekDeadline(weekStart).getTime() ? "submitted" : "late";
}

export function getPreviousPeriods(count = 1) {
  const current = getCurrentPeriod();
  const currentStart = parseIsoDate(current.weekStart);
  return Array.from({ length: count }, (_, index) => {
    const start = new Date(currentStart);
    start.setUTCDate(currentStart.getUTCDate() - index * 7);
    return periodFromWeekStart(start);
  });
}

export function periodFromWeekStart(value: string | Date): TrackerPeriod {
  const weekStartDate = typeof value === "string" ? parseIsoDate(value) : new Date(value);
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setUTCDate(weekStartDate.getUTCDate() + 7);
  const monthStart = `${weekStartDate.getUTCFullYear()}-${String(
    weekStartDate.getUTCMonth() + 1,
  ).padStart(2, "0")}-01`;

  return {
    weekNumber: getProgramWeekNumber(weekStartDate),
    weekStart: toIsoDate(weekStartDate),
    weekEnd: toIsoDate(weekEndDate),
    monthStart,
    dateLabel: `${formatShort(weekStartDate)} 23:59 — ${formatShort(weekEndDate)} 23:59 · ${weekStartDate.getUTCFullYear()}`,
    monthLabel: `${weekStartDate.getUTCFullYear()}년 ${weekStartDate.getUTCMonth() + 1}월`,
  };
}
