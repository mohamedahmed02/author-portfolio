import { getSiteSettings } from "@/lib/content";
import { AboutSettingsForm } from "@/components/admin/about-settings-form";

export default async function AboutAdminPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">About</h1>
        <p className="mt-1 text-sm text-zinc-500">Edit bilingual about page content.</p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
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
