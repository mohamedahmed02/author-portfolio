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
        "inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.14em]",
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
            hrefLang={l}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative px-2 py-1 transition-colors duration-200",
              active
                ? "text-[var(--fg)]"
                : "text-[var(--fg-subtle)] hover:text-[var(--fg)]",
            )}
          >
            {l}

            {active ? (
              <span className="absolute inset-x-2 -bottom-0.5 h-px bg-[var(--accent)]" />
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}