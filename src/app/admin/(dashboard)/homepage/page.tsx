import { getSiteSettings } from "@/lib/content";
import { HomepageSettingsForm } from "@/components/admin/homepage-settings-form";

export default async function HomepageAdminPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Homepage
        </h1>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Edit bilingual homepage content.
        </p>
      </div>

      {/* Settings */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-[#0f0f10] dark:shadow-none md:p-6">
        <HomepageSettingsForm
          values={{
            siteNameEn: settings.siteNameEn,
            siteNameId: settings.siteNameId,
            authorName: settings.authorName,

            heroEyebrowEn: settings.heroEyebrowEn,
            heroEyebrowId: settings.heroEyebrowId,

            heroHeadlineEn: settings.heroHeadlineEn,
            heroHeadlineId: settings.heroHeadlineId,

            heroDescriptionEn: settings.heroDescriptionEn,
            heroDescriptionId: settings.heroDescriptionId,

            heroCtaLabelEn: settings.heroCtaLabelEn,
            heroCtaLabelId: settings.heroCtaLabelId,

            heroCtaHref: settings.heroCtaHref,
            heroImageId: settings.heroImageId,

            homeAboutTitleEn: settings.homeAboutTitleEn,
            homeAboutTitleId: settings.homeAboutTitleId,

            homeAboutDescriptionEn:
              settings.homeAboutDescriptionEn,
            homeAboutDescriptionId:
              settings.homeAboutDescriptionId,

            newsletterTitleEn: settings.newsletterTitleEn,
            newsletterTitleId: settings.newsletterTitleId,

            newsletterDescriptionEn:
              settings.newsletterDescriptionEn,
            newsletterDescriptionId:
              settings.newsletterDescriptionId,

            socialTwitter: settings.socialTwitter,
            socialInstagram: settings.socialInstagram,
            socialLinkedin: settings.socialLinkedin,
            socialGithub: settings.socialGithub,
            socialWebsite: settings.socialWebsite,

            defaultSeoTitleEn: settings.defaultSeoTitleEn,
            defaultSeoTitleId: settings.defaultSeoTitleId,

            defaultSeoDescriptionEn:
              settings.defaultSeoDescriptionEn,
            defaultSeoDescriptionId:
              settings.defaultSeoDescriptionId,
          }}
        />
      </div>
    </div>
  );
}