"use client";

import { useActionState, useState } from "react";
import {
  updateAboutSettings,
  type SettingsActionState,
} from "@/app/admin/actions/settings";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import {
  Check,
  ImageIcon,
  Loader2,
  Share2,
  UserRound,
} from "lucide-react";

const fieldClass =
  "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-100 dark:border-zinc-700 dark:bg-[#19191b] dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:hover:border-zinc-600 dark:focus:border-zinc-500 dark:focus:bg-[#1c1c1f] dark:focus:ring-zinc-800";

const labelClass =
  "block text-xs font-medium text-zinc-600 dark:text-zinc-400";

const cardClass =
  "rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-zinc-800 dark:bg-[#141416] dark:shadow-none";

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

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-zinc-200/80 px-5 py-4 dark:border-zinc-800 md:px-6">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
        <Icon className="size-4" strokeWidth={1.8} />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>

        <p className="mt-0.5 text-xs leading-5 text-zinc-400 dark:text-zinc-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function Message({ state }: { state: SettingsActionState }) {
  if (state?.error) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
        <span className="mt-1 size-2 shrink-0 rounded-full bg-red-500" />
        <p>{state.error}</p>
      </div>
    );
  }

  if (state?.success) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
        <Check className="mt-0.5 size-4 shrink-0" />
        <p>{state.success}</p>
      </div>
    );
  }

  return null;
}

export function AboutSettingsForm({
  values,
}: {
  values: AboutValues;
}) {
  const [state, formAction, pending] = useActionState<
    SettingsActionState,
    FormData
  >(updateAboutSettings, {});

  const [locale, setLocale] = useState<"en" | "id">("en");

  const [aboutLongEn, setAboutLongEn] = useState(values.aboutLongEn);
  const [aboutLongId, setAboutLongId] = useState(values.aboutLongId);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error || state?.success ? (
        <Message state={state} />
      ) : null}

      {/* Profile image */}
      <section className={cardClass}>
        <SectionHeader
          icon={ImageIcon}
          title="Profile image"
          description="Choose the image used on your about page."
        />

        <div className="p-5 md:p-6">
          <label className={labelClass} htmlFor="aboutImageId">
            About image ID
          </label>

          <input
            id="aboutImageId"
            name="aboutImageId"
            className={fieldClass}
            defaultValue={values.aboutImageId ?? ""}
            placeholder="Media image ID"
          />

          <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
            You can connect this to the Media library later.
          </p>
        </div>
      </section>

      {/* About content */}
      <section className={cardClass}>
        <SectionHeader
          icon={UserRound}
          title="About content"
          description="Write the bilingual content that appears on your about page."
        />

        {/* Language switcher */}
        <div className="border-b border-zinc-200/80 px-5 pt-5 dark:border-zinc-800 md:px-6 md:pt-6">
          <div className="inline-flex rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-700 dark:bg-[#0f0f10]">
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-150 ${
                locale === "en"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
              }`}
            >
              English
            </button>

            <button
              type="button"
              onClick={() => setLocale("id")}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-150 ${
                locale === "id"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
              }`}
            >
              Indonesian
            </button>
          </div>
        </div>

        <div className="p-5 md:p-6">
          {locale === "en" ? (
            <div className="space-y-6">
              <div>
                <label
                  className={labelClass}
                  htmlFor="aboutShortEn"
                >
                  Short bio (EN)
                </label>

                <textarea
                  id="aboutShortEn"
                  name="aboutShortEn"
                  rows={4}
                  className={`${fieldClass} resize-y`}
                  defaultValue={values.aboutShortEn}
                  placeholder="A short introduction..."
                />
              </div>

              <div>
                <span className={labelClass}>Long bio (EN)</span>

                <div className="mt-2">
                  <RichTextEditor
                    value={aboutLongEn}
                    onChange={setAboutLongEn}
                  />
                </div>

                <input
                  type="hidden"
                  name="aboutLongEn"
                  value={aboutLongEn}
                />
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="aboutPhilosophyEn"
                >
                  Philosophy (EN)
                </label>

                <textarea
                  id="aboutPhilosophyEn"
                  name="aboutPhilosophyEn"
                  rows={4}
                  className={`${fieldClass} resize-y`}
                  defaultValue={values.aboutPhilosophyEn}
                  placeholder="Your philosophy and perspective..."
                />
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="aboutInterestsEn"
                >
                  Interests (EN)
                </label>

                <textarea
                  id="aboutInterestsEn"
                  name="aboutInterestsEn"
                  rows={3}
                  className={`${fieldClass} resize-y`}
                  defaultValue={values.aboutInterestsEn}
                  placeholder="Your interests..."
                />
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="aboutPublicationsEn"
                >
                  Publications (EN)
                </label>

                <textarea
                  id="aboutPublicationsEn"
                  name="aboutPublicationsEn"
                  rows={5}
                  className={`${fieldClass} resize-y`}
                  defaultValue={values.aboutPublicationsEn}
                  placeholder="Books, articles, publications..."
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label
                  className={labelClass}
                  htmlFor="aboutShortId"
                >
                  Short bio (ID)
                </label>

                <textarea
                  id="aboutShortId"
                  name="aboutShortId"
                  rows={4}
                  className={`${fieldClass} resize-y`}
                  defaultValue={values.aboutShortId}
                  placeholder="Pengenalan singkat..."
                />
              </div>

              <div>
                <span className={labelClass}>Long bio (ID)</span>

                <div className="mt-2">
                  <RichTextEditor
                    value={aboutLongId}
                    onChange={setAboutLongId}
                  />
                </div>

                <input
                  type="hidden"
                  name="aboutLongId"
                  value={aboutLongId}
                />
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="aboutPhilosophyId"
                >
                  Philosophy (ID)
                </label>

                <textarea
                  id="aboutPhilosophyId"
                  name="aboutPhilosophyId"
                  rows={4}
                  className={`${fieldClass} resize-y`}
                  defaultValue={values.aboutPhilosophyId}
                  placeholder="Filosofi dan perspektif Anda..."
                />
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="aboutInterestsId"
                >
                  Interests (ID)
                </label>

                <textarea
                  id="aboutInterestsId"
                  name="aboutInterestsId"
                  rows={3}
                  className={`${fieldClass} resize-y`}
                  defaultValue={values.aboutInterestsId}
                  placeholder="Minat Anda..."
                />
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="aboutPublicationsId"
                >
                  Publications (ID)
                </label>

                <textarea
                  id="aboutPublicationsId"
                  name="aboutPublicationsId"
                  rows={5}
                  className={`${fieldClass} resize-y`}
                  defaultValue={values.aboutPublicationsId}
                  placeholder="Buku, artikel, publikasi..."
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Social */}
      <section className={cardClass}>
        <SectionHeader
          icon={Share2}
          title="Social links"
          description="Add your social media and personal website links."
        />

        <div className="grid gap-5 p-5 sm:grid-cols-2 md:p-6">
          <div>
            <label
              className={labelClass}
              htmlFor="socialTwitter"
            >
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
            <label
              className={labelClass}
              htmlFor="socialInstagram"
            >
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
            <label
              className={labelClass}
              htmlFor="socialLinkedin"
            >
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
            <label
              className={labelClass}
              htmlFor="socialGithub"
            >
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
            <label
              className={labelClass}
              htmlFor="socialWebsite"
            >
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
      <div className="flex items-center justify-between gap-4 border-t border-zinc-200/80 pt-6 dark:border-zinc-800">
        <p className="hidden text-xs text-zinc-400 sm:block dark:text-zinc-500">
          Changes will be applied to the about page immediately.
        </p>

        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:hover:shadow-lg"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Check className="size-4 transition-transform duration-150 group-hover:scale-110" />
              Save about
            </>
          )}
        </button>
      </div>
    </form>
  );
}