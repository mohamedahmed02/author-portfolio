"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/content";
import { prisma } from "@/lib/db";
import { categorySchema } from "@/lib/validations";

export type CategoryActionState = {
  error?: string;
  success?: string;
};

function isUniqueConflict(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}

export async function createCategory(
  _prev: CategoryActionState | undefined,
  formData: FormData,
): Promise<CategoryActionState> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    nameEn: formData.get("nameEn"),
    nameId: formData.get("nameId"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid category data" };
  }

  try {
    const category = await prisma.category.create({ data: parsed.data });
    await logActivity("category.create", "Category", category.id, {
      slug: category.slug,
    });
  } catch (error) {
    if (isUniqueConflict(error)) {
      return { error: "Slug is already in use" };
    }
    throw error;
  }

  revalidatePath("/admin/categories");
  return { success: "Category created" };
}

export async function updateCategory(
  id: string,
  _prev: CategoryActionState | undefined,
  formData: FormData,
): Promise<CategoryActionState> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    nameEn: formData.get("nameEn"),
    nameId: formData.get("nameId"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid category data" };
  }

  const slugTaken = await prisma.category.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
    select: { id: true },
  });
  if (slugTaken) {
    return { error: "Slug is already in use" };
  }

  try {
    await prisma.category.update({ where: { id }, data: parsed.data });
    await logActivity("category.update", "Category", id, { slug: parsed.data.slug });
  } catch (error) {
    if (isUniqueConflict(error)) {
      return { error: "Slug is already in use" };
    }
    throw error;
  }

  revalidatePath("/admin/categories");
  return { success: "Category updated" };
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  const category = await prisma.category.findUnique({
    where: { id },
    select: { slug: true },
  });
  if (!category) {
    throw new Error("Category not found");
  }

  await prisma.category.delete({ where: { id } });
  await logActivity("category.delete", "Category", id, { slug: category.slug });

  revalidatePath("/admin/categories");
}
