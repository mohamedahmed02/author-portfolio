import { put, del } from "@vercel/blob";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { auth, requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/content";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

async function ensureAdmin() {
  const session = await auth();
  if (!session?.user?.email || session.user.role !== "ADMIN") {
    return null;
  }
  try {
    await requireAdmin();
    return session;
  } catch {
    return null;
  }
}

export async function GET() {
  const session = await ensureAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await ensureAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const altEn = String(formData.get("altEn") || "");
  const altId = String(formData.get("altId") || "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
  }

  const mimeType = file.type || "application/octet-stream";
  if (!ALLOWED_TYPES.has(mimeType)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${Date.now()}-${safeName}`;

  let url: string;
  let pathname: string | null = null;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, bytes, {
      access: "public",
      contentType: mimeType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    url = blob.url;
    pathname = blob.pathname;
  } else {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const diskPath = path.join(uploadsDir, filename);
    await writeFile(diskPath, bytes);
    url = `/uploads/${filename}`;
    pathname = `uploads/${filename}`;
  }

  const media = await prisma.media.create({
    data: {
      url,
      pathname,
      filename: file.name,
      altEn,
      altId,
      mimeType,
      size: file.size,
    },
  });

  await logActivity("media.upload", "Media", media.id, { filename: media.filename });

  return NextResponse.json({ item: media }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await ensureAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (process.env.BLOB_READ_WRITE_TOKEN && media.url.includes("blob.vercel-storage.com")) {
    try {
      await del(media.url, { token: process.env.BLOB_READ_WRITE_TOKEN });
    } catch {
      // Continue deleting DB record even if blob delete fails
    }
  } else if (media.pathname?.startsWith("uploads/")) {
    try {
      await unlink(path.join(process.cwd(), "public", media.pathname));
    } catch {
      // File may already be missing
    }
  }

  await prisma.media.delete({ where: { id } });
  await logActivity("media.delete", "Media", id, { filename: media.filename });

  return NextResponse.json({ ok: true });
}
