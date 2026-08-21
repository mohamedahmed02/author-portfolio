"use client";

import { useState, FormEvent } from "react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import { ArrowUpRight, Check } from "lucide-react";

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
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
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
        setMessage(
          data.error === "invalid"
            ? dict.newsletter.invalid
            : dict.newsletter.error,
        );
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
    <section className="border-y border-[var(--border)]">
      <div className="container-page py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-end md:gap-20">
          {/* Copy */}
          <div className="fade-in">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-6 bg-[var(--accent)]" />

              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
                Newsletter
              </p>
            </div>

            <h2 className="max-w-lg font-serif text-4xl leading-[1.05] tracking-[-0.035em] md:text-5xl">
              {title}
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-[var(--fg-muted)] md:text-lg md:leading-8">
              {description}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="fade-in"
            noValidate
          >
            <label
              className="sr-only"
              htmlFor="newsletter-email"
            >
              {dict.newsletter.email}
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="newsletter-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={dict.newsletter.email}
                className="h-12 min-w-0 flex-1 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-5 text-sm text-[var(--fg)] outline-none transition-all duration-200 placeholder:text-[var(--fg-subtle)] hover:border-[var(--fg-muted)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
              />

              {/* Honeypot */}
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
                className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--fg)] px-6 text-sm font-medium text-[var(--bg)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {status === "loading"
                    ? dict.newsletter.subscribing
                    : dict.newsletter.subscribe}
                </span>

                {status !== "loading" && (
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                )}
              </button>
            </div>

            {message ? (
              <div
                className={`mt-4 flex items-center gap-2 text-sm ${
                  status === "success"
                    ? "text-[var(--success)]"
                    : "text-[var(--danger)]"
                }`}
                role="status"
              >
                {status === "success" && (
                  <Check className="h-4 w-4" />
                )}

                <p>{message}</p>
              </div>
            ) : (
              <p className="mt-4 text-xs text-[var(--fg-subtle)]">
                {locale === "en"
                  ? "No spam. Just thoughtful writing."
                  : "No spam. Just thoughtful writing."}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}