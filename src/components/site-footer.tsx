import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import { ArrowUpRight } from "lucide-react";

export function SiteFooter({
  locale,
  siteName,
  dict,
}: {
  locale: Locale;
  siteName: string;
  dict: Dictionary;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-[var(--border)]">
      <div className="container-page py-16 md:py-20">
        {/* Main footer */}
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:gap-20">
          {/* Brand */}
          <div>
            <Link
              href={`/${locale}`}
              className="group inline-flex items-center gap-2 font-serif text-2xl tracking-[-0.02em]"
            >
              <span>{siteName}</span>

              <ArrowUpRight
                className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--fg-muted)]">
              {dict.footer.rights}
            </p>
          </div>

          {/* Navigation */}
          <nav
            className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm"
            aria-label="Footer"
          >
            <Link
              href={`/${locale}/writing`}
              className="group inline-flex items-center gap-2 text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              <span className="link-underline">
                {dict.footer.writing}
              </span>

              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>

            <Link
              href={`/${locale}/about`}
              className="group inline-flex items-center gap-2 text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              <span className="link-underline">
                {dict.footer.about}
              </span>

              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="group inline-flex items-center gap-2 text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              <span className="link-underline">
                {dict.footer.contact}
              </span>

              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
          </nav>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col gap-3 border-t border-[var(--border)] pt-6 text-xs text-[var(--fg-subtle)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteName}
          </p>

          <p className="uppercase tracking-[0.14em]">
            {locale === "en" ? "Built with intention" : "Built with intention"}
          </p>
        </div>
      </div>
    </footer>
  );
}