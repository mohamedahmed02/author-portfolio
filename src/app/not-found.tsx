import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--fg-subtle)]">404</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">Page not found</h1>
      <p className="mt-4 max-w-md text-[var(--fg-muted)]">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/en"
        className="mt-8 inline-flex h-11 items-center bg-[var(--fg)] px-5 text-sm text-[var(--bg)]"
      >
        Go home
      </Link>
    </div>
  );
}
