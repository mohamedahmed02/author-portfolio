import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(200),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
  website: z.string().max(0).optional().or(z.literal("")),
  locale: z.enum(["en", "id"]).default("en"),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(254),
  locale: z.enum(["en", "id"]).default("en"),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const categorySchema = z.object({
  nameEn: z.string().trim().min(1).max(80),
  nameId: z.string().trim().min(1).max(80),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export const postSchema = z.object({
  titleEn: z.string().trim().min(1).max(200),
  titleId: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerptEn: z.string().trim().min(1).max(1000),
  excerptId: z.string().trim().min(1).max(1000),
  bodyEn: z.string().min(1),
  bodyId: z.string().min(1),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional().default([]),
  featuredImageId: z.string().optional().nullable(),
  readingTime: z.coerce.number().int().min(1).max(120).default(5),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  publishedAt: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() ? v : null))
    .refine((v) => v === null || !Number.isNaN(Date.parse(v)), {
      message: "Invalid publication date",
    }),
  seoTitleEn: z.string().max(200).optional().nullable(),
  seoTitleId: z.string().max(200).optional().nullable(),
  seoDescriptionEn: z.string().max(500).optional().nullable(),
  seoDescriptionId: z.string().max(500).optional().nullable(),
});

export const homepageSettingsSchema = z.object({
  siteNameEn: z.string().min(1).max(100),
  siteNameId: z.string().min(1).max(100),
  authorName: z.string().min(1).max(100),
  heroEyebrowEn: z.string().max(120),
  heroEyebrowId: z.string().max(120),
  heroHeadlineEn: z.string().min(1).max(200),
  heroHeadlineId: z.string().min(1).max(200),
  heroDescriptionEn: z.string().min(1).max(1000),
  heroDescriptionId: z.string().min(1).max(1000),
  heroCtaLabelEn: z.string().max(80),
  heroCtaLabelId: z.string().max(80),
  heroCtaHref: z.string().max(200),
  heroImageId: z.string().optional().nullable(),
  homeAboutTitleEn: z.string().max(120),
  homeAboutTitleId: z.string().max(120),
  homeAboutDescriptionEn: z.string().max(1000),
  homeAboutDescriptionId: z.string().max(1000),
  newsletterTitleEn: z.string().max(120),
  newsletterTitleId: z.string().max(120),
  newsletterDescriptionEn: z.string().max(500),
  newsletterDescriptionId: z.string().max(500),
  socialTwitter: z.string().max(300).optional().default(""),
  socialInstagram: z.string().max(300).optional().default(""),
  socialLinkedin: z.string().max(300).optional().default(""),
  socialGithub: z.string().max(300).optional().default(""),
  socialWebsite: z.string().max(300).optional().default(""),
  defaultSeoTitleEn: z.string().max(200).optional().default(""),
  defaultSeoTitleId: z.string().max(200).optional().default(""),
  defaultSeoDescriptionEn: z.string().max(500).optional().default(""),
  defaultSeoDescriptionId: z.string().max(500).optional().default(""),
});

export const aboutSettingsSchema = z.object({
  aboutShortEn: z.string().min(1).max(1000),
  aboutShortId: z.string().min(1).max(1000),
  aboutLongEn: z.string().min(1).max(20000),
  aboutLongId: z.string().min(1).max(20000),
  aboutPhilosophyEn: z.string().max(5000),
  aboutPhilosophyId: z.string().max(5000),
  aboutInterestsEn: z.string().max(1000),
  aboutInterestsId: z.string().max(1000),
  aboutPublicationsEn: z.string().max(10000),
  aboutPublicationsId: z.string().max(10000),
  aboutImageId: z.string().optional().nullable(),
  socialTwitter: z.string().max(300).optional().default(""),
  socialInstagram: z.string().max(300).optional().default(""),
  socialLinkedin: z.string().max(300).optional().default(""),
  socialGithub: z.string().max(300).optional().default(""),
  socialWebsite: z.string().max(300).optional().default(""),
});

export const contactSettingsSchema = z.object({
  contactEmail: z.string().email().or(z.literal("")),
  contactIntroEn: z.string().max(2000),
  contactIntroId: z.string().max(2000),
  contactSuccessEn: z.string().max(300),
  contactSuccessId: z.string().max(300),
  socialTwitter: z.string().max(300).optional().default(""),
  socialInstagram: z.string().max(300).optional().default(""),
  socialLinkedin: z.string().max(300).optional().default(""),
  socialGithub: z.string().max(300).optional().default(""),
  socialWebsite: z.string().max(300).optional().default(""),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(200),
    newPassword: z.string().min(12).max(200),
    confirmPassword: z.string().min(12).max(200),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
