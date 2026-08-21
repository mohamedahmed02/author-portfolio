"use client";

import { useActionState } from "react";
import {
  changePassword,
  type SettingsActionState,
} from "@/app/admin/actions/settings";

const fieldClass =
  "mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--fg)] shadow-sm placeholder:text-[var(--fg-subtle)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

const labelClass =
  "block text-sm font-medium text-[var(--fg)]";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState<
    SettingsActionState,
    FormData
  >(changePassword, {});

  return (
    <form action={formAction} className="max-w-md space-y-5">
      {/* Error */}
      {state?.error ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-3 text-sm text-[var(--danger)]">
          {state.error}
        </div>
      ) : null}

      {/* Success */}
      {state?.success ? (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-3 text-sm text-[var(--success)]">
          {state.success}
        </div>
      ) : null}

      {/* Current Password */}
      <div>
        <label
          className={labelClass}
          htmlFor="currentPassword"
        >
          Current password
        </label>

        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className={fieldClass}
        />
      </div>

      {/* New Password */}
      <div>
        <label
          className={labelClass}
          htmlFor="newPassword"
        >
          New password
        </label>

        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          className={fieldClass}
        />

        <p className="mt-1.5 text-xs text-[var(--fg-muted)]">
          At least 12 characters.
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label
          className={labelClass}
          htmlFor="confirmPassword"
        >
          Confirm new password
        </label>

        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          className={fieldClass}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-fg)] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-md active:translate-y-0 disabled:pointer-events-none disabled:opacity-50"
      >
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}