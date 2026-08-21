"use client";

import { useActionState, useState } from "react";
import {
  updateContactSettings,
  type SettingsActionState,
} from "@/app/admin/actions/settings";

const fieldClass =
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";
const labelClass = "block text-sm font-medium text-zinc-700";

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

export function ContactSettingsForm({ values }: { values: ContactValues }) {
  const [state, formAction, pending] = useActionState<SettingsActionState, FormData>(
    updateContactSettings,
    {},
  );
  const [locale, setLocale] = useState<"en" | "id">("en");

  return (
    <form action={formAction} className="space-y-6">
      {state?.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state?.success ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {state.success}
        </p>
      ) : null}

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
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setLocale("en")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${locale === "en" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"}`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLocale("id")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${locale === "id" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"}`}
        >
          Indonesian
        </button>
      </div>

      <div className={locale === "en" ? "space-y-4" : "hidden"}>
        <div>
          <label className={labelClass} htmlFor="contactIntroEn">
            Intro (EN)
          </label>
          <textarea id="contactIntroEn" name="contactIntroEn" rows={4} className={fieldClass} defaultValue={values.contactIntroEn} />
        </div>
        <div>
          <label className={labelClass} htmlFor="contactSuccessEn">
            Success message (EN)
          </label>
          <input id="contactSuccessEn" name="contactSuccessEn" className={fieldClass} defaultValue={values.contactSuccessEn} />
        </div>
      </div>

      <div className={locale === "id" ? "space-y-4" : "hidden"}>
        <div>
          <label className={labelClass} htmlFor="contactIntroId">
            Intro (ID)
          </label>
          <textarea id="contactIntroId" name="contactIntroId" rows={4} className={fieldClass} defaultValue={values.contactIntroId} />
        </div>
        <div>
          <label className={labelClass} htmlFor="contactSuccessId">
            Success message (ID)
          </label>
          <input id="contactSuccessId" name="contactSuccessId" className={fieldClass} defaultValue={values.contactSuccessId} />
        </div>
      </div>

      <div className="grid gap-4 border-t border-zinc-200 pt-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="socialTwitter">Twitter</label>
          <input id="socialTwitter" name="socialTwitter" className={fieldClass} defaultValue={values.socialTwitter} />
        </div>
        <div>
          <label className={labelClass} htmlFor="socialInstagram">Instagram</label>
          <input id="socialInstagram" name="socialInstagram" className={fieldClass} defaultValue={values.socialInstagram} />
        </div>
        <div>
          <label className={labelClass} htmlFor="socialLinkedin">LinkedIn</label>
          <input id="socialLinkedin" name="socialLinkedin" className={fieldClass} defaultValue={values.socialLinkedin} />
        </div>
        <div>
          <label className={labelClass} htmlFor="socialGithub">GitHub</label>
          <input id="socialGithub" name="socialGithub" className={fieldClass} defaultValue={values.socialGithub} />
        </div>
        <div>
          <label className={labelClass} htmlFor="socialWebsite">Website</label>
          <input id="socialWebsite" name="socialWebsite" className={fieldClass} defaultValue={values.socialWebsite} />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save contact"}
      </button>
    </form>
  );
}
