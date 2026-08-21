"use client";

import { useActionState, useState } from "react";
import {
  updateContactSettings,
  type SettingsActionState,
} from "@/app/admin/actions/settings";

const fieldClass =
  "mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:bg-zinc-800 dark:focus:ring-zinc-700";

const labelClass =
  "block text-sm font-medium text-zinc-800 dark:text-zinc-200";

const sectionClass =
  "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6";

type ContactValues = {
  contactEmail: string;
  contactIntroEn: string;
  contactIntroId: string;
  contactSuccessEn: string;
  contactSuccessId: string;
  socialTwitter: string;
  socialInstagram: string;
  socialLinkedin: string;
  socialGithub: string;
  socialWebsite: string;
};

function LanguageButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function ContactSettingsForm({
  values,
}: {
  values: ContactValues;
}) {
  const [state, formAction, pending] = useActionState<
    SettingsActionState,
    FormData
  >(updateContactSettings, {});

  const [locale, setLocale] = useState<"en" | "id">("en");

  return (
    <form action={formAction} className="space-y-6">
      {/* Status */}
      {state?.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
          {state.error}
        </div>
      ) : null}

      {state?.success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400">
          {state.success}
        </div>
      ) : null}

      {/* Contact information */}
      <section className={sectionClass}>
        <div className="mb-5">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Contact information
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Set the main email visitors can use to contact you.
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="contactEmail">
            Contact email
          </label>

          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            className={fieldClass}
            defaultValue={values.contactEmail}
            placeholder="hello@example.com"
          />
        </div>
      </section>

      {/* Language switcher */}
      <section className={sectionClass}>
        <div className="mb-5">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Page content
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage the contact page content for each language.
          </p>
        </div>

        <div className="mb-5 inline-flex rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
          <LanguageButton
            active={locale === "en"}
            onClick={() => setLocale("en")}
          >
            English
          </LanguageButton>

          <LanguageButton
            active={locale === "id"}
            onClick={() => setLocale("id")}
          >
            Indonesian
          </LanguageButton>
        </div>

        {/* English */}
        {locale === "en" ? (
          <div className="space-y-5">
            <div>
              <label className={labelClass} htmlFor="contactIntroEn">
                Intro
              </label>

              <textarea
                id="contactIntroEn"
                name="contactIntroEn"
                rows={5}
                className={fieldClass}
                defaultValue={values.contactIntroEn}
                placeholder="Write your contact page introduction..."
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="contactSuccessEn">
                Success message
              </label>

              <input
                id="contactSuccessEn"
                name="contactSuccessEn"
                className={fieldClass}
                defaultValue={values.contactSuccessEn}
                placeholder="Your message has been sent."
              />
            </div>
          </div>
        ) : null}

        {/* Indonesian */}
        {locale === "id" ? (
          <div className="space-y-5">
            <div>
              <label className={labelClass} htmlFor="contactIntroId">
                Intro
              </label>

              <textarea
                id="contactIntroId"
                name="contactIntroId"
                rows={5}
                className={fieldClass}
                defaultValue={values.contactIntroId}
                placeholder="Write your contact page introduction..."
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="contactSuccessId">
                Success message
              </label>

              <input
                id="contactSuccessId"
                name="contactSuccessId"
                className={fieldClass}
                defaultValue={values.contactSuccessId}
                placeholder="Your message has been sent."
              />
            </div>
          </div>
        ) : null}
      </section>

      {/* Social links */}
      <section className={sectionClass}>
        <div className="mb-5">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Social links
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Add the social profiles that should appear across the website.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="socialTwitter">
              Twitter
            </label>
            <input
              id="socialTwitter"
              name="socialTwitter"
              className={fieldClass}
              defaultValue={values.socialTwitter}
              placeholder="https://twitter.com/..."
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="socialInstagram">
              Instagram
            </label>
            <input
              id="socialInstagram"
              name="socialInstagram"
              className={fieldClass}
              defaultValue={values.socialInstagram}
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="socialLinkedin">
              LinkedIn
            </label>
            <input
              id="socialLinkedin"
              name="socialLinkedin"
              className={fieldClass}
              defaultValue={values.socialLinkedin}
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="socialGithub">
              GitHub
            </label>
            <input
              id="socialGithub"
              name="socialGithub"
              className={fieldClass}
              defaultValue={values.socialGithub}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="socialWebsite">
              Website
            </label>
            <input
              id="socialWebsite"
              name="socialWebsite"
              className={fieldClass}
              defaultValue={values.socialWebsite}
              placeholder="https://example.com"
            />
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center justify-end border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-zinc-800 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {pending ? "Saving…" : "Save contact"}
        </button>
      </div>
    </form>
  );
}