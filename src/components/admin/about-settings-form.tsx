"use client";

import { useActionState, useState } from "react";
import {
  updateAboutSettings,
  type SettingsActionState,
} from "@/app/admin/actions/settings";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

const fieldClass =
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";
const labelClass = "block text-sm font-medium text-zinc-700";

type AboutValues = {
  aboutShortEn: string;
  aboutShortId: string;
  aboutLongEn: string;
  aboutLongId: string;
  aboutPhilosophyEn: string;
  aboutPhilosophyId: string;
  aboutInterestsEn: string;
  aboutInterestsId: string;
  aboutPublicationsEn: string;
  aboutPublicationsId: string;
  aboutImageId: string | null;
  socialTwitter: string;
  socialInstagram: string;
  socialLinkedin: string;
  socialGithub: string;
  socialWebsite: string;
};

export function AboutSettingsForm({ values }: { values: AboutValues }) {
  const [state, formAction, pending] = useActionState<SettingsActionState, FormData>(
    updateAboutSettings,
    {},
  );
  const [locale, setLocale] = useState<"en" | "id">("en");
  const [aboutLongEn, setAboutLongEn] = useState(values.aboutLongEn);
  const [aboutLongId, setAboutLongId] = useState(values.aboutLongId);

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

      <div>
        <label className={labelClass} htmlFor="aboutImageId">
          About image ID
        </label>
        <input
          id="aboutImageId"
          name="aboutImageId"
          className={fieldClass}
          defaultValue={values.aboutImageId ?? ""}
        />
      </div>

      <div className={locale === "en" ? "space-y-4" : "hidden"}>
        <div>
          <label className={labelClass} htmlFor="aboutShortEn">
            Short bio (EN)
          </label>
          <textarea id="aboutShortEn" name="aboutShortEn" rows={3} className={fieldClass} defaultValue={values.aboutShortEn} />
        </div>
        <div>
          <span className={labelClass}>Long bio (EN)</span>
          <div className="mt-1">
            <RichTextEditor value={aboutLongEn} onChange={setAboutLongEn} />
          </div>
          <input type="hidden" name="aboutLongEn" value={aboutLongEn} />
        </div>
        <div>
          <label className={labelClass} htmlFor="aboutPhilosophyEn">
            Philosophy (EN)
          </label>
          <textarea id="aboutPhilosophyEn" name="aboutPhilosophyEn" rows={3} className={fieldClass} defaultValue={values.aboutPhilosophyEn} />
        </div>
        <div>
          <label className={labelClass} htmlFor="aboutInterestsEn">
            Interests (EN)
          </label>
          <textarea id="aboutInterestsEn" name="aboutInterestsEn" rows={2} className={fieldClass} defaultValue={values.aboutInterestsEn} />
        </div>
        <div>
          <label className={labelClass} htmlFor="aboutPublicationsEn">
            Publications (EN)
          </label>
          <textarea id="aboutPublicationsEn" name="aboutPublicationsEn" rows={4} className={fieldClass} defaultValue={values.aboutPublicationsEn} />
        </div>
      </div>

      <div className={locale === "id" ? "space-y-4" : "hidden"}>
        <div>
          <label className={labelClass} htmlFor="aboutShortId">
            Short bio (ID)
          </label>
          <textarea id="aboutShortId" name="aboutShortId" rows={3} className={fieldClass} defaultValue={values.aboutShortId} />
        </div>
        <div>
          <span className={labelClass}>Long bio (ID)</span>
          <div className="mt-1">
            <RichTextEditor value={aboutLongId} onChange={setAboutLongId} />
          </div>
          <input type="hidden" name="aboutLongId" value={aboutLongId} />
        </div>
        <div>
          <label className={labelClass} htmlFor="aboutPhilosophyId">
            Philosophy (ID)
          </label>
          <textarea id="aboutPhilosophyId" name="aboutPhilosophyId" rows={3} className={fieldClass} defaultValue={values.aboutPhilosophyId} />
        </div>
        <div>
          <label className={labelClass} htmlFor="aboutInterestsId">
            Interests (ID)
          </label>
          <textarea id="aboutInterestsId" name="aboutInterestsId" rows={2} className={fieldClass} defaultValue={values.aboutInterestsId} />
        </div>
        <div>
          <label className={labelClass} htmlFor="aboutPublicationsId">
            Publications (ID)
          </label>
          <textarea id="aboutPublicationsId" name="aboutPublicationsId" rows={4} className={fieldClass} defaultValue={values.aboutPublicationsId} />
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
        {pending ? "Saving…" : "Save about"}
      </button>
    </form>
  );
}
