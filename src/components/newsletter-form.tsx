"use client";

import { useState, FormEvent } from "react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";

export function NewsletterForm({
  locale,
  dict,
  title,
  description,
}: {
  locale: Locale;
  dict: Dictionary;
  title: string;
  description: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, website: "" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error === "invalid" ? dict.newsletter.invalid : dict.newsletter.error);
        return;
      }
      setStatus("success");
      setMessage(dict.newsletter.success);
      setEmail("");
    } catch {
      setStatus("error");
      setMessage(dict.newsletter.error);
    }
  }

  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="container-page grid gap-8 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-end md:py-20">
        <div className="fade-in">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--fg-subtle)]">Newsletter</p>
          <h2 className="mt-3 max-w-md font-serif text-3xl tracking-tight md:text-4xl">{title}</h2>
          <p className="mt-4 max-w-md text-[var(--fg-muted)] leading-relaxed">{description}</p>
        </div>

        <form onSubmit={onSubmit} className="fade-in space-y-3" noValidate>
          <label className="sr-only" htmlFor="newsletter-email">
            {dict.newsletter.email}
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict.newsletter.email}
            className="w-full border border-[var(--border-strong)] bg-[var(--bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
          />
          {/* honeypot */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex h-11 items-center justify-center bg-[var(--fg)] px-5 text-sm text-[var(--bg)] transition hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] disabled:opacity-60"
          >
            {status === "loading" ? dict.newsletter.subscribing : dict.newsletter.subscribe}
          </button>
          {message ? (
            <p
              className={`text-sm ${status === "success" ? "text-[var(--success)]" : "text-[var(--danger)]"}`}
              role="status"
            >
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
