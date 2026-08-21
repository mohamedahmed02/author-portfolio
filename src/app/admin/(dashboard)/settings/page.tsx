import { ChangePasswordForm } from "@/components/admin/change-password-form";

export default function SettingsAdminPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">Change your admin password.</p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
