import { getSiteSettings } from "@/lib/content";
import { AboutSettingsForm } from "@/components/admin/about-settings-form";

export default async function AboutAdminPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          About
        </h1>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Edit bilingual about page content.
        </p>
      </div>

      {/* Settings */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-[#0f0f10] dark:shadow-none md:p-6">
        <AboutSettingsForm
          values={{
            aboutShortEn: settings.aboutShortEn,
            aboutShortId: settings.aboutShortId,

            aboutLongEn: settings.aboutLongEn,
            aboutLongId: settings.aboutLongId,

            aboutPhilosophyEn: settings.aboutPhilosophyEn,
            aboutPhilosophyId: settings.aboutPhilosophyId,

            aboutInterestsEn: settings.aboutInterestsEn,
            aboutInterestsId: settings.aboutInterestsId,

            aboutPublicationsEn: settings.aboutPublicationsEn,
            aboutPublicationsId: settings.aboutPublicationsId,

            aboutImageId: settings.aboutImageId,

            socialTwitter: settings.socialTwitter,
            socialInstagram: settings.socialInstagram,
            socialLinkedin: settings.socialLinkedin,
            socialGithub: settings.socialGithub,
            socialWebsite: settings.socialWebsite,
          }}
        />
      </div>
    </div>
  );
}