export type TrackerPeriod = {
  weekNumber: number;
  weekStart: string;
  weekEnd: string;
  monthStart: string;
  dateLabel: string;
  monthLabel: string;
};

function datePartsInSeoul(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  return { year: value("year"), month: value("month"), day: value("day") };
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function isoWeekNumber(date: Date) {
  const target = new Date(date);
  const day = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
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
  const { year, month, day } = datePartsInSeoul(date);
  const today = new Date(Date.UTC(year, month - 1, day));
  const isoDay = today.getUTCDay() || 7;
  const weekStartDate = new Date(today);
  weekStartDate.setUTCDate(today.getUTCDate() - isoDay + 1);
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setUTCDate(weekStartDate.getUTCDate() + 6);

  return {
    weekNumber: isoWeekNumber(today),
    weekStart: toIsoDate(weekStartDate),
    weekEnd: toIsoDate(weekEndDate),
    monthStart: `${year}-${String(month).padStart(2, "0")}-01`,
    dateLabel: `${formatShort(weekStartDate)} — ${formatShort(weekEndDate)} · ${year}`,
    monthLabel: `${year}년 ${month}월`,
  };
}

export const demoPeriod: TrackerPeriod = {
  weekNumber: 24,
  weekStart: "2026-06-08",
  weekEnd: "2026-06-14",
  monthStart: "2026-06-01",
  dateLabel: "JUN 08 — JUN 14 · 2026",
  monthLabel: "2026년 6월",
};
