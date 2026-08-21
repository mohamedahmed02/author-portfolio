"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";

export function ShareActions({
  locale,
  dict,
  url,
  title,
}: {
  locale: Locale;
  dict: Dictionary;
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-sm text-[var(--fg-muted)]">{dict.article.share}</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm link-underline"
      >
        X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm link-underline"
      >
        LinkedIn
      </a>
      <button type="button" onClick={copy} className="text-sm link-underline">
        {copied ? dict.article.copied : dict.article.copyLink}
      </button>
      <span className="sr-only">{locale}</span>
    </div>
  );
}
