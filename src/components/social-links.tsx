import Link from "next/link";
import type { SiteSettings } from "@prisma/client";
import { cn } from "@/lib/utils";

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
      href: settings.contactEmail ? `mailto:${settings.contactEmail}` : "",
      label: "Email",
    },
  ].filter((l) => l.href);

  if (!links.length) return null;

  return (
    <ul className={cn("flex flex-wrap gap-4 text-sm", className)}>
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="link-underline text-[var(--fg-muted)] hover:text-[var(--fg)]"
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
