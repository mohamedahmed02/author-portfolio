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

/**
 * Returns the submitted value when the field exists in FormData.
 * If the field is not present at all, keeps the current database value.
 *
 * This is important for the homepage language tabs because only the
 * currently visible language fields are rendered by the form.
 */
function strOrCurrent(
  formData: FormData,
  key: string,
  current: string,
): string {
  if (!formData.has(key)) {
    return current;
  }

  return String(formData.get(key) ?? "");
}

export async function updateHomepageSettings(
  _prev: SettingsActionState | undefined,
  formData: FormData,
): Promise<SettingsActionState> {
  await requireAdmin();
  await getSiteSettings();

  // Get the current settings first so fields that are not present in the
  // current language tab are not replaced with empty strings.
  const currentSettings = await prisma.siteSettings.findUnique({
    where: { id: "site" },
  });

  if (!currentSettings) {
    return { error: "Homepage settings were not found" };
  }

  const parsed = homepageSettingsSchema.safeParse({
    siteNameEn: strOrCurrent(
      formData,
      "siteNameEn",
      currentSettings.siteNameEn,
    ),

    siteNameId: strOrCurrent(
      formData,
      "siteNameId",
      currentSettings.siteNameId,
    ),

    authorName: strOrCurrent(
      formData,
      "authorName",
      currentSettings.authorName,
    ),

    heroEyebrowEn: strOrCurrent(
      formData,
      "heroEyebrowEn",
      currentSettings.heroEyebrowEn,
    ),

    heroEyebrowId: strOrCurrent(
      formData,
      "heroEyebrowId",
      currentSettings.heroEyebrowId,
    ),

    heroHeadlineEn: strOrCurrent(
      formData,
      "heroHeadlineEn",
      currentSettings.heroHeadlineEn,
    ),

    heroHeadlineId: strOrCurrent(
      formData,
      "heroHeadlineId",
      currentSettings.heroHeadlineId,
    ),

    heroDescriptionEn: strOrCurrent(
      formData,
      "heroDescriptionEn",
      currentSettings.heroDescriptionEn,
    ),

    heroDescriptionId: strOrCurrent(
      formData,
      "heroDescriptionId",
      currentSettings.heroDescriptionId,
    ),

    heroCtaLabelEn: strOrCurrent(
      formData,
      "heroCtaLabelEn",
      currentSettings.heroCtaLabelEn,
    ),

    heroCtaLabelId: strOrCurrent(
      formData,
      "heroCtaLabelId",
      currentSettings.heroCtaLabelId,
    ),

    heroCtaHref: strOrCurrent(
      formData,
      "heroCtaHref",
      currentSettings.heroCtaHref,
    ),

    heroImageId: formData.has("heroImageId")
      ? emptyToNull(formData.get("heroImageId"))
      : currentSettings.heroImageId,

    homeAboutTitleEn: strOrCurrent(
      formData,
      "homeAboutTitleEn",
      currentSettings.homeAboutTitleEn,
    ),

    homeAboutTitleId: strOrCurrent(
      formData,
      "homeAboutTitleId",
      currentSettings.homeAboutTitleId,
    ),

    homeAboutDescriptionEn: strOrCurrent(
      formData,
      "homeAboutDescriptionEn",
      currentSettings.homeAboutDescriptionEn,
    ),

    homeAboutDescriptionId: strOrCurrent(
      formData,
      "homeAboutDescriptionId",
      currentSettings.homeAboutDescriptionId,
    ),

    newsletterTitleEn: strOrCurrent(
      formData,
      "newsletterTitleEn",
      currentSettings.newsletterTitleEn,
    ),

    newsletterTitleId: strOrCurrent(
      formData,
      "newsletterTitleId",
      currentSettings.newsletterTitleId,
    ),

    newsletterDescriptionEn: strOrCurrent(
      formData,
      "newsletterDescriptionEn",
      currentSettings.newsletterDescriptionEn,
    ),

    newsletterDescriptionId: strOrCurrent(
      formData,
      "newsletterDescriptionId",
      currentSettings.newsletterDescriptionId,
    ),

    socialTwitter: strOrCurrent(
      formData,
      "socialTwitter",
      currentSettings.socialTwitter,
    ),

    socialInstagram: strOrCurrent(
      formData,
      "socialInstagram",
      currentSettings.socialInstagram,
    ),

    socialLinkedin: strOrCurrent(
      formData,
      "socialLinkedin",
      currentSettings.socialLinkedin,
    ),

    socialGithub: strOrCurrent(
      formData,
      "socialGithub",
      currentSettings.socialGithub,
    ),

    socialWebsite: strOrCurrent(
      formData,
      "socialWebsite",
      currentSettings.socialWebsite,
    ),

    defaultSeoTitleEn: strOrCurrent(
      formData,
      "defaultSeoTitleEn",
      currentSettings.defaultSeoTitleEn,
    ),

    defaultSeoTitleId: strOrCurrent(
      formData,
      "defaultSeoTitleId",
      currentSettings.defaultSeoTitleId,
    ),

    defaultSeoDescriptionEn: strOrCurrent(
      formData,
      "defaultSeoDescriptionEn",
      currentSettings.defaultSeoDescriptionEn,
    ),

    defaultSeoDescriptionId: strOrCurrent(
      formData,
      "defaultSeoDescriptionId",
      currentSettings.defaultSeoDescriptionId,
    ),
  });

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ||
        "Invalid homepage settings",
    };
  }

  await prisma.siteSettings.update({
    where: { id: "site" },
    data: parsed.data,
  });

  await logActivity(
    "settings.homepage",
    "SiteSettings",
    "site",
  );

  revalidatePath("/admin/homepage");
  revalidatePath("/");

  return {
    success: "Homepage settings saved",
  };
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
    return {
      error:
        parsed.error.issues[0]?.message ||
        "Invalid about settings",
    };
  }

  await prisma.siteSettings.update({
    where: { id: "site" },
    data: parsed.data,
  });

  await logActivity(
    "settings.about",
    "SiteSettings",
    "site",
  );

  revalidatePath("/admin/about");
  revalidatePath("/");

  return {
    success: "About settings saved",
  };
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
    return {
      error:
        parsed.error.issues[0]?.message ||
        "Invalid contact settings",
    };
  }

  await prisma.siteSettings.update({
    where: { id: "site" },
    data: parsed.data,
  });

  await logActivity(
    "settings.contact",
    "SiteSettings",
    "site",
  );

  revalidatePath("/admin/contact");
  revalidatePath("/");

  return {
    success: "Contact settings saved",
  };
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
    return {
      error:
        parsed.error.issues[0]?.message ||
        "Invalid password data",
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!user) {
    return {
      error: "Unable to update password",
    };
  }

  const valid = await verifyPassword(
    user.passwordHash,
    parsed.data.currentPassword,
  );

  if (!valid) {
    return {
      error: "Current password is incorrect",
    };
  }

  const passwordHash = await hashPassword(
    parsed.data.newPassword,
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  await logActivity(
    "settings.password",
    "User",
    user.id,
  );

  revalidatePath("/admin/settings");

  return {
    success: "Password updated",
  };
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/admin/login",
  });
}