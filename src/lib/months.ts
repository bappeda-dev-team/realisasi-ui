export type MonthKey =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

const MONTH_NAMES: Record<MonthKey, string> = {
  "1": "Januari",
  "2": "Februari",
  "3": "Maret",
  "4": "April",
  "5": "Mei",
  "6": "Juni",
  "7": "Juli",
  "8": "Agustus",
  "9": "September",
  "10": "Oktober",
  "11": "November",
  "12": "Desember",
};

const NAME_TO_KEY: Record<string, MonthKey> = {
  januari: "1",
  january: "1",
  feb: "2",
  februari: "2",
  february: "2",
  // tolerate misspelling present in some UIs
  februrari: "2",
  maret: "3",
  march: "3",
  april: "4",
  mei: "5",
  may: "5",
  juni: "6",
  june: "6",
  juli: "7",
  july: "7",
  agustus: "8",
  august: "8",
  september: "9",
  sept: "9",
  oktober: "10",
  october: "10",
  november: "11",
  desember: "12",
  december: "12",
};

function coerceMonthNumber(input: string): MonthKey | null {
  const match = input.match(/\d{1,2}/);
  if (!match) return null;
  const n = Number.parseInt(match[0], 10);
  if (!Number.isFinite(n) || n < 1 || n > 12) return null;
  return String(n) as MonthKey;
}

export function getMonthKey(value: string | number | null | undefined): MonthKey | null {
  if (value === null || value === undefined) return null;

  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;
    const n = Math.trunc(value);
    if (n < 1 || n > 12) return null;
    return String(n) as MonthKey;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;

  if (NAME_TO_KEY[normalized]) return NAME_TO_KEY[normalized];

  const numeric = coerceMonthNumber(normalized);
  if (numeric) return numeric;

  return null;
}

export function getMonthName(value: string | number | null | undefined): string | null {
  const key = getMonthKey(value);
  return key ? MONTH_NAMES[key] : null;
}

export function formatMonthHeader(
  value: string | number | null | undefined,
  fallback = "Bulan"
): string {
  const key = getMonthKey(value);
  if (!key) return fallback;
  return `Bulan ${key}`;
}

