"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fafafa] text-[#111]">
        <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6">
          <h1 className="font-serif text-4xl tracking-tight">Something went wrong</h1>
          <p className="mt-4 text-[#5c5c5c]">
            An unexpected error occurred. Please try again later.
          </p>
          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-11 items-center bg-[#111] px-5 text-sm text-white"
            >
              Try again
            </button>
            <Link href="/en" className="inline-flex h-11 items-center text-sm underline">
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
