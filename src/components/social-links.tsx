import Link from "next/link";
import type { SiteSettings } from "@prisma/client";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function SocialLinks({
  settings,
  className,
}: {
  settings: Pick<
    SiteSettings,
    | "socialTwitter"
    | "socialInstagram"
    | "socialLinkedin"
    | "socialGithub"
    | "socialWebsite"
    | "contactEmail"
  >;
  className?: string;
}) {
  const links = [
    { href: settings.socialWebsite, label: "Website" },
    { href: settings.socialTwitter, label: "X" },
    { href: settings.socialInstagram, label: "Instagram" },
    { href: settings.socialLinkedin, label: "LinkedIn" },
    { href: settings.socialGithub, label: "GitHub" },
    {
      href: settings.contactEmail
        ? `mailto:${settings.contactEmail}`
        : "",
      label: "Email",
    },
  ].filter((link) => link.href);

  if (!links.length) return null;

  return (
    <ul
      className={cn(
        "flex flex-wrap gap-x-6 gap-y-3",
        className,
      )}
    >
      {links.map((link) => {
        const external = link.href.startsWith("http");

        return (
          <li key={link.label}>
            <Link
              href={link.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-1.5 text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              <span className="link-underline">
                {link.label}
              </span>

              <ArrowUpRight
                className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}