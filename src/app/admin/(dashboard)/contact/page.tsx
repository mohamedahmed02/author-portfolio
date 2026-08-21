import { getSiteSettings } from "@/lib/content";
import { ContactSettingsForm } from "@/components/admin/contact-settings-form";

export default async function ContactAdminPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="text-lg">✉</span>
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Contact
            </h1>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Edit contact page copy and social links.
            </p>
          </div>
        </div>
      </div>

      <ContactSettingsForm
        values={{
          contactEmail: settings.contactEmail,
          contactIntroEn: settings.contactIntroEn,
          contactIntroId: settings.contactIntroId,
          contactSuccessEn: settings.contactSuccessEn,
          contactSuccessId: settings.contactSuccessId,
          socialTwitter: settings.socialTwitter,
          socialInstagram: settings.socialInstagram,
          socialLinkedin: settings.socialLinkedin,
          socialGithub: settings.socialGithub,
          socialWebsite: settings.socialWebsite,
        }}
      />
    </div>
  );
}