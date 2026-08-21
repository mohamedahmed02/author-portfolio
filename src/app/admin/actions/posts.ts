"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PostStatus, Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/content";
import { prisma } from "@/lib/db";
import { sanitizeRichText } from "@/lib/sanitize";
import { postSchema } from "@/lib/validations";

function isUniqueConflict(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}

export type PostActionState = {
  error?: string;
  success?: string;
};

function emptyToNull(value: FormDataEntryValue | null): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

function parsePostForm(formData: FormData) {
  return postSchema.safeParse({
    titleEn: formData.get("titleEn"),
    titleId: formData.get("titleId"),
    slug: formData.get("slug"),
    excerptEn: formData.get("excerptEn"),
    excerptId: formData.get("excerptId"),
    bodyEn: formData.get("bodyEn"),
    bodyId: formData.get("bodyId"),
    categoryId: emptyToNull(formData.get("categoryId")),
    featuredImageId: emptyToNull(formData.get("featuredImageId")),
    readingTime: formData.get("readingTime") || 5,
    featured: formData.get("featured") === "on" || formData.get("featured") === "true",
    status: formData.get("status") || "DRAFT",
    publishedAt: emptyToNull(formData.get("publishedAt")),
    seoTitleEn: emptyToNull(formData.get("seoTitleEn")),
    seoTitleId: emptyToNull(formData.get("seoTitleId")),
    seoDescriptionEn: emptyToNull(formData.get("seoDescriptionEn")),
    seoDescriptionId: emptyToNull(formData.get("seoDescriptionId")),
    tagIds: [],
  });
}

function toPostData(data: ReturnType<typeof postSchema.parse>) {
  const status = data.status as PostStatus;
  const publishedAt =
    status === PostStatus.PUBLISHED
      ? data.publishedAt
        ? new Date(data.publishedAt)
        : new Date()
      : null;

  return {
    titleEn: data.titleEn,
    titleId: data.titleId,
    slug: data.slug,
    excerptEn: data.excerptEn,
    excerptId: data.excerptId,
    bodyEn: sanitizeRichText(data.bodyEn),
    bodyId: sanitizeRichText(data.bodyId),
    categoryId: data.categoryId || null,
    featuredImageId: data.featuredImageId || null,
    readingTime: data.readingTime,
    featured: data.featured,
    status,
    publishedAt,
    seoTitleEn: data.seoTitleEn || null,
    seoTitleId: data.seoTitleId || null,
    seoDescriptionEn: data.seoDescriptionEn || null,
    seoDescriptionId: data.seoDescriptionId || null,
  };
}

export async function createPost(
  _prev: PostActionState | undefined,
  formData: FormData,
): Promise<PostActionState> {
  await requireAdmin();

  const parsed = parsePostForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid post data" };
  }

  const existing = await prisma.post.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });
  if (existing) {
    return { error: "Slug is already in use" };
  }

  try {
    const post = await prisma.post.create({ data: toPostData(parsed.data) });
    await logActivity("post.create", "Post", post.id, { slug: post.slug });
  } catch (error) {
    if (isUniqueConflict(error)) {
      return { error: "Slug is already in use" };
    }
    throw error;
  }

  revalidatePath("/admin/writings");
  revalidatePath("/admin");
  revalidatePath("/en");
  revalidatePath("/id");
  revalidatePath("/en/writing");
  revalidatePath("/id/writing");
  redirect("/admin/writings");
}

export async function updatePost(
  id: string,
  _prev: PostActionState | undefined,
  formData: FormData,
): Promise<PostActionState> {
  await requireAdmin();

  const parsed = parsePostForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid post data" };
  }

  const current = await prisma.post.findUnique({ where: { id } });
  if (!current) {
    return { error: "Post not found" };
  }

  const slugTaken = await prisma.post.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
    select: { id: true },
  });
  if (slugTaken) {
    return { error: "Slug is already in use" };
  }

  const data = toPostData(parsed.data);
  if (
    data.status === PostStatus.PUBLISHED &&
    !data.publishedAt &&
    current.publishedAt
  ) {
    data.publishedAt = current.publishedAt;
  }

  try {
    await prisma.post.update({ where: { id }, data });
    await logActivity("post.update", "Post", id, { slug: data.slug });
  } catch (error) {
    if (isUniqueConflict(error)) {
      return { error: "Slug is already in use" };
    }
    throw error;
  }

  revalidatePath("/admin/writings");
  revalidatePath(`/admin/writings/${id}`);
  revalidatePath("/admin");
  revalidatePath("/en");
  revalidatePath("/id");
  revalidatePath("/en/writing");
  revalidatePath("/id/writing");
  revalidatePath(`/en/writing/${data.slug}`);
  revalidatePath(`/id/writing/${data.slug}`);
  redirect("/admin/writings");
}

export async function deletePost(id: string) {
  await requireAdmin();

  const post = await prisma.post.findUnique({ where: { id }, select: { slug: true } });
  if (!post) {
    throw new Error("Post not found");
  }

  await prisma.post.delete({ where: { id } });
  await logActivity("post.delete", "Post", id, { slug: post.slug });

  revalidatePath("/admin/writings");
  revalidatePath("/admin");
  redirect("/admin/writings");
}

export async function publishPost(id: string) {
  await requireAdmin();

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    throw new Error("Post not found");
  }

  await prisma.post.update({
    where: { id },
    data: {
      status: PostStatus.PUBLISHED,
      publishedAt: post.publishedAt ?? new Date(),
    },
  });
  await logActivity("post.publish", "Post", id, { slug: post.slug });

  revalidatePath("/admin/writings");
  revalidatePath(`/admin/writings/${id}`);
  revalidatePath("/admin");
}

export async function unpublishPost(id: string) {
  await requireAdmin();

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    throw new Error("Post not found");
  }

  await prisma.post.update({
    where: { id },
    data: { status: PostStatus.DRAFT },
  });
  await logActivity("post.unpublish", "Post", id, { slug: post.slug });

  revalidatePath("/admin/writings");
  revalidatePath(`/admin/writings/${id}`);
  revalidatePath("/admin");
}
