import { KeyRound, ShieldCheck } from "lucide-react";
import { ChangePasswordForm } from "@/components/admin/change-password-form";

export default function SettingsAdminPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <KeyRound className="size-5 text-zinc-700 dark:text-zinc-300" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Settings
            </h1>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Manage your admin account and security settings.
            </p>
          </div>
        </div>
      </div>

      {/* Security section */}
      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-start gap-4 border-b border-zinc-200 px-5 py-5 dark:border-zinc-800 sm:px-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900">
            <ShieldCheck className="size-5 text-zinc-600 dark:text-zinc-400" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Account security
            </h2>

            <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Keep your admin account secure by using a strong password.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <ChangePasswordForm />
        </div>
      </section>
    </div>
  );
}