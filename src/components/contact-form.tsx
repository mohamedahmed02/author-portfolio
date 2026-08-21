"use client";

import { FormEvent, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import { ArrowUpRight, Check } from "lucide-react";

export function ContactForm({
  locale,
  dict,
  successMessage,
}: {
  locale: Locale;
  dict: Dictionary;
  successMessage: string;
}) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatus("loading");
    setErrors({});
    setFormError("");

    const form = new FormData(e.currentTarget);

    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      subject: String(form.get("subject") || ""),
      message: String(form.get("message") || ""),
      website: String(form.get("website") || ""),
      locale,
    };

    const nextErrors: Record<string, string> = {};

    if (!payload.name.trim()) {
      nextErrors.name = dict.contact.validation.name;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      nextErrors.email = dict.contact.validation.email;
    }

    if (!payload.subject.trim()) {
      nextErrors.subject = dict.contact.validation.subject;
    }

    if (!payload.message.trim()) {
      nextErrors.message = dict.contact.validation.message;
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setStatus("error");
        setFormError(dict.contact.error);
        return;
      }

      setStatus("success");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
      setFormError(dict.contact.error);
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-elevated)] p-8 md:p-10"
        role="status"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
          <Check className="h-5 w-5" />
        </div>

        <p className="mt-6 max-w-lg font-serif text-3xl leading-tight tracking-[-0.025em]">
          {successMessage}
        </p>

        <p className="mt-3 text-sm leading-6 text-[var(--fg-muted)]">
          {locale === "en"
            ? "Your message has been sent successfully."
            : "Your message has been sent successfully."}
        </p>
      </div>
    );
  }

  const fieldClass =
    "w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 py-3 text-sm text-[var(--fg)] outline-none transition-all duration-200 placeholder:text-[var(--fg-subtle)] hover:border-[var(--fg-muted)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]";

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <Field
          label={dict.contact.name}
          name="name"
          error={errors.name}
          className={fieldClass}
          autoComplete="name"
        />

        <Field
          label={dict.contact.email}
          name="email"
          type="email"
          error={errors.email}
          className={fieldClass}
          autoComplete="email"
        />
      </div>

      <Field
        label={dict.contact.subject}
        name="subject"
        error={errors.subject}
        className={fieldClass}
      />

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-[var(--fg)]"
        >
          {dict.contact.message}
        </label>

        <textarea
          id="message"
          name="message"
          rows={7}
          className={`${fieldClass} resize-y`}
          aria-invalid={!!errors.message}
        />

        {errors.message ? (
          <p className="mt-2 text-sm text-[var(--danger)]">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div className="flex flex-col items-start gap-4">
        <button
          type="submit"
          disabled={status === "loading"}
          className="group inline-flex h-12 items-center justify-center gap-3 rounded-full bg-[var(--fg)] px-6 text-sm font-medium text-[var(--bg)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>
            {status === "loading"
              ? dict.contact.sending
              : dict.contact.send}
          </span>

          {status !== "loading" ? (
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          ) : null}
        </button>

        {formError ? (
          <p className="text-sm text-[var(--danger)]" role="alert">
            {formError}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  className,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  className: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-[var(--fg)]"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        className={className}
        autoComplete={autoComplete}
        aria-invalid={!!error}
      />

      {error ? (
        <p className="mt-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}