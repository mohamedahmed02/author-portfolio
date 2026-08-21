"use client";

import Image from "next/image";
import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  CloudUpload,
  Copy,
  FileImage,
  ImageIcon,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";

type MediaItem = {
  id: string;
  url: string;
  filename: string;
  altEn: string;
  altId: string;
  mimeType: string | null;
  size: number | null;
  createdAt: string | Date;
};

export function MediaManager({
  initialItems,
}: {
  initialItems: MediaItem[];
}) {
  const router = useRouter();

  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  const onUpload = async (formData: FormData) => {
    setError(null);
    setUploading(true);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      setItems((prev) => [data.item, ...prev]);
      refresh();
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this media file?")) return;

    setError(null);

    try {
      const res = await fetch(
        `/api/admin/media?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Delete failed");
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
      refresh();
    } catch {
      setError("Delete failed");
    }
  };

  const copyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);

      setTimeout(() => {
        setCopiedId(null);
      }, 1500);
    } catch {
      setError("Could not copy media ID");
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
          <ImageIcon className="size-3.5" />
          Media library
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 md:text-3xl">
            Media
          </h1>

          <p className="mt-1.5 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Upload and manage the images used across your website.
          </p>
        </div>
      </header>

      {/* Upload section */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const form = e.currentTarget;
          const fd = new FormData(form);

          await onUpload(fd);

          form.reset();
        }}
        className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-zinc-800 dark:bg-[#141416] dark:shadow-none"
      >
        {/* Upload area */}
        <div className="p-5 md:p-6">
          {error ? (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              <span className="mt-0.5 size-2 shrink-0 rounded-full bg-red-500" />
              <p>{error}</p>
            </div>
          ) : null}

          <label
            htmlFor="file"
            className="group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-zinc-50/70 px-6 text-center transition-all duration-200 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-[#19191b] dark:hover:border-zinc-600 dark:hover:bg-[#1c1c1f]"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <CloudUpload className="size-5" strokeWidth={1.7} />
            </div>

            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Drop an image here or{" "}
              <span className="underline underline-offset-4">
                browse files
              </span>
            </p>

            <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
              PNG, JPG, GIF, WEBP or SVG
            </p>

            <input
              id="file"
              name="file"
              type="file"
              accept="image/*"
              required
              className="sr-only"
            />
          </label>
        </div>

        {/* Metadata */}
        <div className="border-t border-zinc-200/80 px-5 py-5 dark:border-zinc-800 md:px-6">
          <div className="mb-4">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Accessibility
            </p>

            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              Add descriptive alt text for better accessibility and SEO.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="altEn"
                className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                Alt text · English
              </label>

              <input
                id="altEn"
                name="altEn"
                placeholder="Describe the image..."
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-100 dark:border-zinc-700 dark:bg-[#19191b] dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:hover:border-zinc-600 dark:focus:border-zinc-500 dark:focus:bg-[#1c1c1f] dark:focus:ring-zinc-800"
              />
            </div>

            <div>
              <label
                htmlFor="altId"
                className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                Alt text · Indonesian
              </label>

              <input
                id="altId"
                name="altId"
                placeholder="Describe the image..."
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-100 dark:border-zinc-700 dark:bg-[#19191b] dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:hover:border-zinc-600 dark:focus:border-zinc-500 dark:focus:bg-[#1c1c1f] dark:focus:ring-zinc-800"
              />
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex justify-end border-t border-zinc-200/80 bg-zinc-50/60 px-5 py-4 dark:border-zinc-800 dark:bg-[#111112] md:px-6">
          <button
            type="submit"
            disabled={uploading || pending}
            className="inline-flex min-w-[130px] items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading
              </>
            ) : (
              <>
                <Upload className="size-4" />
                Upload media
              </>
            )}
          </button>
        </div>
      </form>

      {/* Library header */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold tracking-[-0.02em] text-zinc-900 dark:text-zinc-100">
              Your media
            </h2>

            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              {items.length} {items.length === 1 ? "file" : "files"} in your
              library
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 px-6 text-center dark:border-zinc-800 dark:bg-[#141416]">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
              <FileImage className="size-5" />
            </div>

            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              No media uploaded yet
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-400 dark:text-zinc-500">
              Upload your first image using the area above.
            </p>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const isImage =
                item.mimeType?.startsWith("image/") ||
                item.url.match(/\.(jpe?g|png|gif|webp|svg)$/i);

              return (
                <li
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md dark:border-zinc-800 dark:bg-[#141416] dark:shadow-none dark:hover:border-zinc-700"
                >
                  {/* Preview */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-[#1b1b1d]">
                    {isImage ? (
                      <Image
                        src={item.url}
                        alt={item.altEn || item.filename}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-zinc-400 dark:text-zinc-600">
                        <FileImage className="size-8" strokeWidth={1.3} />

                        <span className="max-w-full truncate text-xs">
                          {item.filename}
                        </span>
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </div>

                  {/* Info */}
                  <div className="space-y-3 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {item.filename}
                      </p>

                      <p className="mt-1 truncate text-xs text-zinc-400 dark:text-zinc-500">
                        {item.mimeType || "Image"}
                      </p>
                    </div>

                    {/* ID */}
                    <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-2.5 py-2 dark:bg-[#1b1b1d]">
                      <code className="min-w-0 flex-1 truncate font-mono text-[10px] text-zinc-500 dark:text-zinc-500">
                        {item.id}
                      </code>

                      <button
                        type="button"
                        title="Copy media ID"
                        onClick={() => copyId(item.id)}
                        className="flex size-6 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                      >
                        {copiedId === item.id ? (
                          <Check className="size-3.5" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
                      <p className="max-w-[70%] truncate text-[11px] text-zinc-400 dark:text-zinc-600">
                        {item.altEn || "No alt text"}
                      </p>

                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}