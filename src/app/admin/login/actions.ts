"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export type LoginState = {
  error?: string;
};

function isRateLimited(error: unknown): boolean {
  if (!error) return false;
  if (typeof error === "string") return error.includes("RATE_LIMITED");
  if (error instanceof Error) {
    if (error.message.includes("RATE_LIMITED")) return true;
    const cause = (error as { cause?: unknown }).cause;
    if (isRateLimited(cause)) return true;
  }
  if (typeof error === "object" && error !== null && "cause" in error) {
    return isRateLimited((error as { cause: unknown }).cause);
  }
  return false;
}

export async function loginAction(
  _prev: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Invalid email or password" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase().trim(),
      password: parsed.data.password,
      redirectTo: "/admin",
    });
  } catch (error) {
    if (isRateLimited(error)) {
      return { error: "Too many attempts" };
    }
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    // Successful sign-in redirects by throwing; rethrow those.
    throw error;
  }

  return {};
}
