"use client";

import { FormEvent, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";

export function ContactForm({
  locale,
  dict,
  successMessage,
}: {
  locale: Locale;
  dict: Dictionary;
  successMessage: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
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
    if (!payload.name.trim()) nextErrors.name = dict.contact.validation.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      nextErrors.email = dict.contact.validation.email;
    }
    if (!payload.subject.trim()) nextErrors.subject = dict.contact.validation.subject;
    if (!payload.message.trim()) nextErrors.message = dict.contact.validation.message;

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        className="border border-[var(--border)] bg-[var(--bg-elevated)] p-8 text-[var(--fg)]"
        role="status"
      >
        <p className="font-serif text-2xl tracking-tight">{successMessage}</p>
      </div>
    );
  }

  const fieldClass =
    "w-full border border-[var(--border-strong)] bg-[var(--bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label={dict.contact.name} name="name" error={errors.name} className={fieldClass} />
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
        <label htmlFor="message" className="mb-2 block text-sm text-[var(--fg-muted)]">
          {dict.contact.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={7}
          className={fieldClass}
          aria-invalid={!!errors.message}
        />
        {errors.message ? (
          <p className="mt-1.5 text-sm text-[var(--danger)]">{errors.message}</p>
        ) : null}
      </div>
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
        className="inline-flex h-11 items-center justify-center bg-[var(--fg)] px-6 text-sm text-[var(--bg)] transition hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] disabled:opacity-60"
      >
        {status === "loading" ? dict.contact.sending : dict.contact.send}
      </button>
      {formError ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {formError}
        </p>
      ) : null}
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
      <label htmlFor={name} className="mb-2 block text-sm text-[var(--fg-muted)]">
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
      {error ? <p className="mt-1.5 text-sm text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}
