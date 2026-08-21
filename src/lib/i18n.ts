export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocalized<T extends Record<string, unknown>>(
  record: T,
  locale: Locale,
  field: string,
) {
  const key = `${field}${locale === "id" ? "Id" : "En"}` as keyof T;
  const fallback = `${field}En` as keyof T;
  const value = record[key] ?? record[fallback];
  return typeof value === "string" ? value : String(value ?? "");
}
