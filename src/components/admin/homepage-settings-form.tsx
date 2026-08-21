"use client";

import { useActionState, useState } from "react";
import {
  updateHomepageSettings,
  type SettingsActionState,
} from "@/app/admin/actions/settings";
import {
  Check,
  Globe2,
  ImageIcon,
  LayoutTemplate,
  Loader2,
  Mail,
  Search,
  Share2,
  Sparkles,
} from "lucide-react";

const fieldClass =
  "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-100 dark:border-zinc-700 dark:bg-[#19191b] dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:hover:border-zinc-600 dark:focus:border-zinc-500 dark:focus:bg-[#1c1c1f] dark:focus:ring-zinc-800";

const labelClass =
  "block text-xs font-medium text-zinc-600 dark:text-zinc-400";

const cardClass =
  "rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-zinc-800 dark:bg-[#141416] dark:shadow-none";

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
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue: string;
  textarea?: boolean;
  placeholder?: string;
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
          rows={4}
          className={`${fieldClass} resize-y`}
          defaultValue={defaultValue}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={name}
          name={name}
          className={fieldClass}
          defaultValue={defaultValue}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

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

function Message({
  state,
}: {
  state: SettingsActionState;
}) {
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

export function HomepageSettingsForm({
  values,
}: {
  values: HomepageValues;
}) {
  const [state, formAction, pending] = useActionState<
    SettingsActionState,
    FormData
  >(updateHomepageSettings, {});

  const [locale, setLocale] = useState<"en" | "id">("en");

  return (
    <form action={formAction} className="space-y-6">
      {state?.error || state?.success ? (
        <Message state={state} />
      ) : null}

      {/* General */}
      <section className={cardClass}>
        <SectionHeader
          icon={Globe2}
          title="General"
          description="Basic information about your website and author."
        />

        <div className="grid gap-5 p-5 sm:grid-cols-2 md:p-6">
          <Field
            label="Site name (EN)"
            name="siteNameEn"
            defaultValue={values.siteNameEn}
            placeholder="My Website"
          />

          <Field
            label="Site name (ID)"
            name="siteNameId"
            defaultValue={values.siteNameId}
            placeholder="Website Saya"
          />

          <Field
            label="Author name"
            name="authorName"
            defaultValue={values.authorName}
            placeholder="Author name"
          />

          <Field
            label="Hero image ID"
            name="heroImageId"
            defaultValue={values.heroImageId ?? ""}
            placeholder="Media image ID"
          />
        </div>
      </section>

      {/* Hero */}
      <section className={cardClass}>
        <SectionHeader
          icon={Sparkles}
          title="Hero section"
          description="Control the main introduction visitors see on the homepage."
        />

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
            <div className="grid gap-5">
              <Field
                label="Hero eyebrow (EN)"
                name="heroEyebrowEn"
                defaultValue={values.heroEyebrowEn}
                placeholder="Writer · Author · Storyteller"
              />

              <Field
                label="Hero headline (EN)"
                name="heroHeadlineEn"
                defaultValue={values.heroHeadlineEn}
                placeholder="A headline that introduces your work."
              />

              <Field
                label="Hero description (EN)"
                name="heroDescriptionEn"
                defaultValue={values.heroDescriptionEn}
                textarea
                placeholder="Tell visitors a little about yourself..."
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="CTA label (EN)"
                  name="heroCtaLabelEn"
                  defaultValue={values.heroCtaLabelEn}
                  placeholder="Read my writings"
                />

                <Field
                  label="CTA href"
                  name="heroCtaHref"
                  defaultValue={values.heroCtaHref}
                  placeholder="/writings"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-5">
              <Field
                label="Hero eyebrow (ID)"
                name="heroEyebrowId"
                defaultValue={values.heroEyebrowId}
                placeholder="Penulis · Pengarang"
              />

              <Field
                label="Hero headline (ID)"
                name="heroHeadlineId"
                defaultValue={values.heroHeadlineId}
                placeholder="Headline utama Anda."
              />

              <Field
                label="Hero description (ID)"
                name="heroDescriptionId"
                defaultValue={values.heroDescriptionId}
                textarea
                placeholder="Ceritakan sedikit tentang diri Anda..."
              />

              <Field
                label="CTA label (ID)"
                name="heroCtaLabelId"
                defaultValue={values.heroCtaLabelId}
                placeholder="Baca tulisan saya"
              />
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section className={cardClass}>
        <SectionHeader
          icon={LayoutTemplate}
          title="About section"
          description="Content displayed in the about section of your homepage."
        />

        <div className="p-5 md:p-6">
          {locale === "en" ? (
            <div className="grid gap-5">
              <Field
                label="About title (EN)"
                name="homeAboutTitleEn"
                defaultValue={values.homeAboutTitleEn}
                placeholder="About me"
              />

              <Field
                label="About description (EN)"
                name="homeAboutDescriptionEn"
                defaultValue={values.homeAboutDescriptionEn}
                textarea
                placeholder="A short introduction..."
              />
            </div>
          ) : (
            <div className="grid gap-5">
              <Field
                label="About title (ID)"
                name="homeAboutTitleId"
                defaultValue={values.homeAboutTitleId}
                placeholder="Tentang saya"
              />

              <Field
                label="About description (ID)"
                name="homeAboutDescriptionId"
                defaultValue={values.homeAboutDescriptionId}
                textarea
                placeholder="Pengenalan singkat..."
              />
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className={cardClass}>
        <SectionHeader
          icon={Mail}
          title="Newsletter"
          description="Configure the newsletter section shown on the homepage."
        />

        <div className="p-5 md:p-6">
          {locale === "en" ? (
            <div className="grid gap-5">
              <Field
                label="Newsletter title (EN)"
                name="newsletterTitleEn"
                defaultValue={values.newsletterTitleEn}
                placeholder="Stay in the loop"
              />

              <Field
                label="Newsletter description (EN)"
                name="newsletterDescriptionEn"
                defaultValue={values.newsletterDescriptionEn}
                textarea
                placeholder="Subscribe for new writings..."
              />
            </div>
          ) : (
            <div className="grid gap-5">
              <Field
                label="Newsletter title (ID)"
                name="newsletterTitleId"
                defaultValue={values.newsletterTitleId}
                placeholder="Tetap terhubung"
              />

              <Field
                label="Newsletter description (ID)"
                name="newsletterDescriptionId"
                defaultValue={values.newsletterDescriptionId}
                textarea
                placeholder="Berlangganan untuk mendapatkan tulisan baru..."
              />
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
          <Field
            label="Twitter"
            name="socialTwitter"
            defaultValue={values.socialTwitter}
            placeholder="https://twitter.com/..."
          />

          <Field
            label="Instagram"
            name="socialInstagram"
            defaultValue={values.socialInstagram}
            placeholder="https://instagram.com/..."
          />

          <Field
            label="LinkedIn"
            name="socialLinkedin"
            defaultValue={values.socialLinkedin}
            placeholder="https://linkedin.com/in/..."
          />

          <Field
            label="GitHub"
            name="socialGithub"
            defaultValue={values.socialGithub}
            placeholder="https://github.com/..."
          />

          <Field
            label="Website"
            name="socialWebsite"
            defaultValue={values.socialWebsite}
            placeholder="https://example.com"
          />
        </div>
      </section>

      {/* SEO */}
      <section className={cardClass}>
        <SectionHeader
          icon={Search}
          title="SEO"
          description="Default metadata used by search engines and social previews."
        />

        <div className="p-5 md:p-6">
          {locale === "en" ? (
            <div className="grid gap-5">
              <Field
                label="Default SEO title (EN)"
                name="defaultSeoTitleEn"
                defaultValue={values.defaultSeoTitleEn}
                placeholder="Your website title"
              />

              <Field
                label="Default SEO description (EN)"
                name="defaultSeoDescriptionEn"
                defaultValue={values.defaultSeoDescriptionEn}
                textarea
                placeholder="A concise description of your website..."
              />
            </div>
          ) : (
            <div className="grid gap-5">
              <Field
                label="Default SEO title (ID)"
                name="defaultSeoTitleId"
                defaultValue={values.defaultSeoTitleId}
                placeholder="Judul website Anda"
              />

              <Field
                label="Default SEO description (ID)"
                name="defaultSeoDescriptionId"
                defaultValue={values.defaultSeoDescriptionId}
                textarea
                placeholder="Deskripsi singkat website Anda..."
              />
            </div>
          )}
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center justify-between gap-4 border-t border-zinc-200/80 pt-6 dark:border-zinc-800">
        <p className="hidden text-xs text-zinc-400 sm:block dark:text-zinc-500">
          Changes will be applied to the homepage immediately.
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
              Save homepage
            </>
          )}
        </button>
      </div>
    </form>
  );
}