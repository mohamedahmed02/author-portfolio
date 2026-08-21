import en from "@/messages/en.json";
import id from "@/messages/id.json";
import type { Locale } from "@/lib/i18n";

const dictionaries = { en, id } as const;

export type Dictionary = typeof en;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

export function t(
  dict: Dictionary,
  path: string,
  vars?: Record<string, string | number>,
): string {
  const parts = path.split(".");
  let cur: unknown = dict;
  for (const part of parts) {
    if (cur && typeof cur === "object" && part in cur) {
      cur = (cur as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }
  let str = typeof cur === "string" ? cur : path;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }
  return str;
}
