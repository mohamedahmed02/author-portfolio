"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, signOut } from "@/lib/auth";
import { getSiteSettings, logActivity } from "@/lib/content";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { sanitizeRichText } from "@/lib/sanitize";
import {
  aboutSettingsSchema,
  changePasswordSchema,
  contactSettingsSchema,
  homepageSettingsSchema,
} from "@/lib/validations";

export type SettingsActionState = {
  error?: string;
  success?: string;
};

function emptyToNull(value: FormDataEntryValue | null): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

function str(formData: FormData, key: string, fallback = "") {
  const v = formData.get(key);
  return v == null ? fallback : String(v);
}

export async function updateHomepageSettings(
  _prev: SettingsActionState | undefined,
  formData: FormData,
): Promise<SettingsActionState> {
  await requireAdmin();
  await getSiteSettings();

  const parsed = homepageSettingsSchema.safeParse({
    siteNameEn: str(formData, "siteNameEn"),
    siteNameId: str(formData, "siteNameId"),
    authorName: str(formData, "authorName"),
    heroEyebrowEn: str(formData, "heroEyebrowEn"),
    heroEyebrowId: str(formData, "heroEyebrowId"),
    heroHeadlineEn: str(formData, "heroHeadlineEn"),
    heroHeadlineId: str(formData, "heroHeadlineId"),
    heroDescriptionEn: str(formData, "heroDescriptionEn"),
    heroDescriptionId: str(formData, "heroDescriptionId"),
    heroCtaLabelEn: str(formData, "heroCtaLabelEn"),
    heroCtaLabelId: str(formData, "heroCtaLabelId"),
    heroCtaHref: str(formData, "heroCtaHref"),
    heroImageId: emptyToNull(formData.get("heroImageId")),
    homeAboutTitleEn: str(formData, "homeAboutTitleEn"),
    homeAboutTitleId: str(formData, "homeAboutTitleId"),
    homeAboutDescriptionEn: str(formData, "homeAboutDescriptionEn"),
    homeAboutDescriptionId: str(formData, "homeAboutDescriptionId"),
    newsletterTitleEn: str(formData, "newsletterTitleEn"),
    newsletterTitleId: str(formData, "newsletterTitleId"),
    newsletterDescriptionEn: str(formData, "newsletterDescriptionEn"),
    newsletterDescriptionId: str(formData, "newsletterDescriptionId"),
    socialTwitter: str(formData, "socialTwitter"),
    socialInstagram: str(formData, "socialInstagram"),
    socialLinkedin: str(formData, "socialLinkedin"),
    socialGithub: str(formData, "socialGithub"),
    socialWebsite: str(formData, "socialWebsite"),
    defaultSeoTitleEn: str(formData, "defaultSeoTitleEn"),
    defaultSeoTitleId: str(formData, "defaultSeoTitleId"),
    defaultSeoDescriptionEn: str(formData, "defaultSeoDescriptionEn"),
    defaultSeoDescriptionId: str(formData, "defaultSeoDescriptionId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid homepage settings" };
  }

  await prisma.siteSettings.update({
    where: { id: "site" },
    data: parsed.data,
  });
  await logActivity("settings.homepage", "SiteSettings", "site");

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { success: "Homepage settings saved" };
}

export async function updateAboutSettings(
  _prev: SettingsActionState | undefined,
  formData: FormData,
): Promise<SettingsActionState> {
  await requireAdmin();
  await getSiteSettings();

  const parsed = aboutSettingsSchema.safeParse({
    aboutShortEn: str(formData, "aboutShortEn"),
    aboutShortId: str(formData, "aboutShortId"),
    aboutLongEn: sanitizeRichText(str(formData, "aboutLongEn")),
    aboutLongId: sanitizeRichText(str(formData, "aboutLongId")),
    aboutPhilosophyEn: str(formData, "aboutPhilosophyEn"),
    aboutPhilosophyId: str(formData, "aboutPhilosophyId"),
    aboutInterestsEn: str(formData, "aboutInterestsEn"),
    aboutInterestsId: str(formData, "aboutInterestsId"),
    aboutPublicationsEn: str(formData, "aboutPublicationsEn"),
    aboutPublicationsId: str(formData, "aboutPublicationsId"),
    aboutImageId: emptyToNull(formData.get("aboutImageId")),
    socialTwitter: str(formData, "socialTwitter"),
    socialInstagram: str(formData, "socialInstagram"),
    socialLinkedin: str(formData, "socialLinkedin"),
    socialGithub: str(formData, "socialGithub"),
    socialWebsite: str(formData, "socialWebsite"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid about settings" };
  }

  await prisma.siteSettings.update({
    where: { id: "site" },
    data: parsed.data,
  });
  await logActivity("settings.about", "SiteSettings", "site");

  revalidatePath("/admin/about");
  revalidatePath("/");
  return { success: "About settings saved" };
}

export async function updateContactSettings(
  _prev: SettingsActionState | undefined,
  formData: FormData,
): Promise<SettingsActionState> {
  await requireAdmin();
  await getSiteSettings();

  const parsed = contactSettingsSchema.safeParse({
    contactEmail: str(formData, "contactEmail"),
    contactIntroEn: str(formData, "contactIntroEn"),
    contactIntroId: str(formData, "contactIntroId"),
    contactSuccessEn: str(formData, "contactSuccessEn"),
    contactSuccessId: str(formData, "contactSuccessId"),
    socialTwitter: str(formData, "socialTwitter"),
    socialInstagram: str(formData, "socialInstagram"),
    socialLinkedin: str(formData, "socialLinkedin"),
    socialGithub: str(formData, "socialGithub"),
    socialWebsite: str(formData, "socialWebsite"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid contact settings" };
  }

  await prisma.siteSettings.update({
    where: { id: "site" },
    data: parsed.data,
  });
  await logActivity("settings.contact", "SiteSettings", "site");

  revalidatePath("/admin/contact");
  revalidatePath("/");
  return { success: "Contact settings saved" };
}

export async function changePassword(
  _prev: SettingsActionState | undefined,
  formData: FormData,
): Promise<SettingsActionState> {
  const session = await requireAdmin();

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid password data" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true, passwordHash: true },
  });

  if (!user) {
    return { error: "Unable to update password" };
  }

  const valid = await verifyPassword(user.passwordHash, parsed.data.currentPassword);
  if (!valid) {
    return { error: "Current password is incorrect" };
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });
  await logActivity("settings.password", "User", user.id);

  revalidatePath("/admin/settings");
  return { success: "Password updated" };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
