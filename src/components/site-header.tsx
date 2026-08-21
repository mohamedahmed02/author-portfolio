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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
    if (href === `/${locale}`) {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-xl">
      <div className="container-page flex h-[4.5rem] items-center justify-between">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="group flex items-center gap-3"
          aria-label={siteName}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--fg)] text-xs font-semibold text-[var(--bg)] transition-transform duration-300 group-hover:rotate-[-8deg]">
            {siteName.charAt(0).toUpperCase()}
          </span>

          <span className="font-serif text-xl tracking-tight text-[var(--fg)] md:text-[1.4rem]">
            {siteName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm transition-all duration-200",
                  active
                    ? "bg-[var(--fg)] text-[var(--bg)]"
                    : "text-[var(--fg-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--fg)]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden items-center gap-2 md:flex">
          <div className="flex items-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-1">
            <LanguageSwitcher locale={locale} />
          </div>

          <div className="flex items-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-1">
            <ThemeSwitcher
              labels={{
                theme: dict.nav.theme,
                themeLight: dict.nav.themeLight,
                themeDark: dict.nav.themeDark,
                themeSystem: dict.nav.themeSystem,
              }}
            />
          </div>
        </div>

        {/* Mobile Button */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 md:hidden",
            open
              ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
              : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg)] hover:border-[var(--border-strong)]",
          )}
        >
          {open ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-[var(--border)] bg-[var(--bg)] md:hidden"
        >
          <nav
            className="container-page flex flex-col gap-2 py-5"
            aria-label="Mobile navigation"
          >
            {links.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3.5 text-base transition-colors",
                    active
                      ? "bg-[var(--fg)] text-[var(--bg)]"
                      : "text-[var(--fg-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--fg)]",
                  )}
                >
                  <span>{link.label}</span>

                  {active ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  ) : null}
                </Link>
              );
            })}

            <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-5">
              <div className="flex items-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-1">
                <LanguageSwitcher locale={locale} />
              </div>

              <div className="flex items-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-1">
                <ThemeSwitcher
                  labels={{
                    theme: dict.nav.theme,
                    themeLight: dict.nav.themeLight,
                    themeDark: dict.nav.themeDark,
                    themeSystem: dict.nav.themeSystem,
                  }}
                />
              </div>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}