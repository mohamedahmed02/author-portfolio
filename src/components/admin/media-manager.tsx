"use client";

import Image from "next/image";
import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

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

export function MediaManager({ initialItems }: { initialItems: MediaItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

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
      const res = await fetch(`/api/admin/media?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
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

  return (
    <div className="space-y-6">
      <form
        className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const fd = new FormData(form);
          await onUpload(fd);
          form.reset();
        }}
      >
        {error ? (
          <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <label className="block text-sm font-medium text-zinc-700" htmlFor="file">
              File
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept="image/*"
              required
              className="mt-1 block w-full text-sm text-zinc-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700" htmlFor="altEn">
              Alt text (EN)
            </label>
            <input
              id="altEn"
              name="altEn"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700" htmlFor="altId">
              Alt text (ID)
            </label>
            <input
              id="altId"
              name="altId"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={uploading || pending}
              className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </div>
        </div>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">No media uploaded yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-zinc-100">
                {item.mimeType?.startsWith("image/") || item.url.match(/\.(jpe?g|png|gif|webp|svg)$/i) ? (
                  <Image
                    src={item.url}
                    alt={item.altEn || item.filename}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                    {item.filename}
                  </div>
                )}
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-sm font-medium text-zinc-900">{item.filename}</p>
                <p className="break-all font-mono text-[11px] text-zinc-500">{item.id}</p>
                <p className="truncate text-xs text-zinc-400">{item.url}</p>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
