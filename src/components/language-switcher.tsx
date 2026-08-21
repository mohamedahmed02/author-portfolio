"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(en|id)/, "") || "";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-0.5 text-xs font-medium tracking-wide",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {(["en", "id"] as const).map((l) => {
        const active = locale === l;
        return (
          <Link
            key={l}
            href={`/${l}${rest}`}
            className={cn(
              "rounded-full px-2.5 py-1.5 uppercase transition-colors",
              active
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
            hrefLang={l}
            aria-current={active ? "true" : undefined}
          >
            {l}
          </Link>
        );
      })}
    </div>
  );
}
