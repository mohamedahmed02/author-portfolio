"use client";

import { useActionState, useState } from "react";
import {
  updateHomepageSettings,
  type SettingsActionState,
} from "@/app/admin/actions/settings";

const fieldClass =
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";
const labelClass = "block text-sm font-medium text-zinc-700";

type HomepageValues = {
  siteNameEn: string;
  siteNameId: string;
  authorName: string;
  heroEyebrowEn: string;
  heroEyebrowId: string;
  heroHeadlineEn: string;
  heroHeadlineId: string;
  heroDescriptionEn: string;
  heroDescriptionId: string;
  heroCtaLabelEn: string;
  heroCtaLabelId: string;
  heroCtaHref: string;
  heroImageId: string | null;
  homeAboutTitleEn: string;
  homeAboutTitleId: string;
  homeAboutDescriptionEn: string;
  homeAboutDescriptionId: string;
  newsletterTitleEn: string;
  newsletterTitleId: string;
  newsletterDescriptionEn: string;
  newsletterDescriptionId: string;
  socialTwitter: string;
  socialInstagram: string;
  socialLinkedin: string;
  socialGithub: string;
  socialWebsite: string;
  defaultSeoTitleEn: string;
  defaultSeoTitleId: string;
  defaultSeoDescriptionEn: string;
  defaultSeoDescriptionId: string;
};

function Field({
  label,
  name,
  defaultValue,
  textarea,
}: {
  label: string;
  name: string;
  defaultValue: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          className={fieldClass}
          defaultValue={defaultValue}
        />
      ) : (
        <input id={name} name={name} className={fieldClass} defaultValue={defaultValue} />
      )}
    </div>
  );
}

export function HomepageSettingsForm({ values }: { values: HomepageValues }) {
  const [state, formAction, pending] = useActionState<SettingsActionState, FormData>(
    updateHomepageSettings,
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Site name (EN)" name="siteNameEn" defaultValue={values.siteNameEn} />
        <Field label="Site name (ID)" name="siteNameId" defaultValue={values.siteNameId} />
        <Field label="Author name" name="authorName" defaultValue={values.authorName} />
        <Field label="Hero image ID" name="heroImageId" defaultValue={values.heroImageId ?? ""} />
        <Field label="CTA href" name="heroCtaHref" defaultValue={values.heroCtaHref} />
      </div>

      <div className={locale === "en" ? "grid gap-4" : "hidden"}>
        <Field label="Hero eyebrow (EN)" name="heroEyebrowEn" defaultValue={values.heroEyebrowEn} />
        <Field label="Hero headline (EN)" name="heroHeadlineEn" defaultValue={values.heroHeadlineEn} />
        <Field label="Hero description (EN)" name="heroDescriptionEn" defaultValue={values.heroDescriptionEn} textarea />
        <Field label="CTA label (EN)" name="heroCtaLabelEn" defaultValue={values.heroCtaLabelEn} />
        <Field label="Home about title (EN)" name="homeAboutTitleEn" defaultValue={values.homeAboutTitleEn} />
        <Field label="Home about description (EN)" name="homeAboutDescriptionEn" defaultValue={values.homeAboutDescriptionEn} textarea />
        <Field label="Newsletter title (EN)" name="newsletterTitleEn" defaultValue={values.newsletterTitleEn} />
        <Field label="Newsletter description (EN)" name="newsletterDescriptionEn" defaultValue={values.newsletterDescriptionEn} textarea />
        <Field label="Default SEO title (EN)" name="defaultSeoTitleEn" defaultValue={values.defaultSeoTitleEn} />
        <Field label="Default SEO description (EN)" name="defaultSeoDescriptionEn" defaultValue={values.defaultSeoDescriptionEn} textarea />
      </div>

      <div className={locale === "id" ? "grid gap-4" : "hidden"}>
        <Field label="Hero eyebrow (ID)" name="heroEyebrowId" defaultValue={values.heroEyebrowId} />
        <Field label="Hero headline (ID)" name="heroHeadlineId" defaultValue={values.heroHeadlineId} />
        <Field label="Hero description (ID)" name="heroDescriptionId" defaultValue={values.heroDescriptionId} textarea />
        <Field label="CTA label (ID)" name="heroCtaLabelId" defaultValue={values.heroCtaLabelId} />
        <Field label="Home about title (ID)" name="homeAboutTitleId" defaultValue={values.homeAboutTitleId} />
        <Field label="Home about description (ID)" name="homeAboutDescriptionId" defaultValue={values.homeAboutDescriptionId} textarea />
        <Field label="Newsletter title (ID)" name="newsletterTitleId" defaultValue={values.newsletterTitleId} />
        <Field label="Newsletter description (ID)" name="newsletterDescriptionId" defaultValue={values.newsletterDescriptionId} textarea />
        <Field label="Default SEO title (ID)" name="defaultSeoTitleId" defaultValue={values.defaultSeoTitleId} />
        <Field label="Default SEO description (ID)" name="defaultSeoDescriptionId" defaultValue={values.defaultSeoDescriptionId} textarea />
      </div>

      <div className="grid gap-4 border-t border-zinc-200 pt-6 sm:grid-cols-2">
        <Field label="Twitter" name="socialTwitter" defaultValue={values.socialTwitter} />
        <Field label="Instagram" name="socialInstagram" defaultValue={values.socialInstagram} />
        <Field label="LinkedIn" name="socialLinkedin" defaultValue={values.socialLinkedin} />
        <Field label="GitHub" name="socialGithub" defaultValue={values.socialGithub} />
        <Field label="Website" name="socialWebsite" defaultValue={values.socialWebsite} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save homepage"}
      </button>
    </form>
  );
}
