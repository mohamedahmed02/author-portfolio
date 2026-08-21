import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";

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
    <footer className="mt-auto border-t border-[var(--border)]">
      <div className="container-page flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between md:py-14">
        <div>
          <p className="font-serif text-xl tracking-tight">{siteName}</p>
          <p className="mt-2 text-sm text-[var(--fg-muted)]">
            © {year} {siteName}. {dict.footer.rights}
          </p>
        </div>
        <nav className="flex flex-wrap gap-6 text-sm text-[var(--fg-muted)]" aria-label="Footer">
          <Link href={`/${locale}/writing`} className="link-underline hover:text-[var(--fg)]">
            {dict.footer.writing}
          </Link>
          <Link href={`/${locale}/about`} className="link-underline hover:text-[var(--fg)]">
            {dict.footer.about}
          </Link>
          <Link href={`/${locale}/contact`} className="link-underline hover:text-[var(--fg)]">
            {dict.footer.contact}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
