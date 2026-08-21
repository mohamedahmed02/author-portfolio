"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";

export function SiteHeader({
  locale,
  siteName,
  dict,
}: {
  locale: Locale;
  siteName: string;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/writing`, label: dict.nav.writing },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
        <Link
          href={`/${locale}`}
          className="font-serif text-xl tracking-tight text-[var(--fg)] md:text-[1.35rem]"
        >
          {siteName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm tracking-wide transition-colors",
                isActive(link.href)
                  ? "text-[var(--accent)]"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher locale={locale} />
          <ThemeSwitcher
            labels={{
              theme: dict.nav.theme,
              themeLight: dict.nav.themeLight,
              themeDark: dict.nav.themeDark,
              themeSystem: dict.nav.themeSystem,
            }}
          />
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center border border-[var(--border)] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-[var(--border)] bg-[var(--bg)] md:hidden"
        >
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-1 py-3 text-base",
                  isActive(link.href) ? "text-[var(--accent)]" : "text-[var(--fg)]",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-4">
              <LanguageSwitcher locale={locale} />
              <ThemeSwitcher
                labels={{
                  theme: dict.nav.theme,
                  themeLight: dict.nav.themeLight,
                  themeDark: dict.nav.themeDark,
                  themeSystem: dict.nav.themeSystem,
                }}
              />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
