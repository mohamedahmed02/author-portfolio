import { getSiteSettings } from "@/lib/content";
import { ContactSettingsForm } from "@/components/admin/contact-settings-form";

export default async function ContactAdminPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Contact</h1>
        <p className="mt-1 text-sm text-zinc-500">Edit contact page copy and social links.</p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
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
    </div>
  );
}
