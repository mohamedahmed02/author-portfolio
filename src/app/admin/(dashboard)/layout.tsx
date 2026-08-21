import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpen,
  FileText,
  FolderOpen,
  Home,
  ImageIcon,
  LayoutDashboard,
  Mail,
  Newspaper,
  Settings,
  UserRound,
  LogOut,
  ArrowUpRight,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { logoutAction } from "@/app/admin/actions/settings";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/writings", label: "Writings", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/about", label: "About", icon: UserRound },
  { href: "/admin/contact", label: "Contact", icon: Mail },
  { href: "/admin/newsletter", label: "Newsletter", icon: Newspaper },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div
      className={cn(
        "min-h-screen text-zinc-900",
        "bg-[#f7f7f5]",
        "dark:bg-[#111110] dark:text-zinc-100",
      )}
    >
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {/* ───────────────── Sidebar ───────────────── */}
        <aside
          className={cn(
            "sticky top-0 flex h-screen w-[250px] shrink-0 flex-col",
            "border-r",
            "border-zinc-200/80 bg-[#f7f7f5]",
            "dark:border-zinc-800/80 dark:bg-[#111110]",
          )}
        >
          {/* Brand */}
          <div className="px-6 pb-8 pt-7">
            <Link
              href="/admin"
              className="group inline-flex items-center gap-3"
            >
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full",
                  "bg-zinc-900 text-white",
                  "transition-colors duration-200",
                  "dark:bg-zinc-100 dark:text-zinc-900",
                )}
              >
                <BookOpen className="size-4" strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-[15px] font-semibold tracking-[-0.02em]">
                  Author CMS
                </p>

                <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                  Administration
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="px-4">
            <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
              Workspace
            </p>

            <nav className="space-y-1">
              {nav.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5",
                      "text-[13px] font-medium",
                      "text-zinc-500 dark:text-zinc-400",
                      "transition-all duration-200",
                      "hover:bg-white hover:text-zinc-900 hover:shadow-sm",
                      "dark:hover:bg-zinc-900 dark:hover:text-zinc-100",
                      "dark:hover:shadow-none",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-[17px] shrink-0",
                        "text-zinc-400",
                        "transition-colors",
                        "group-hover:text-zinc-700",
                        "dark:text-zinc-500 dark:group-hover:text-zinc-200",
                      )}
                      strokeWidth={1.7}
                    />

                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom section */}
          <div className="mt-auto p-4">
            <div className="mb-3 h-px bg-zinc-200/80 dark:bg-zinc-800/80" />

            {/* View website */}
            <Link
              href="/"
              target="_blank"
              className={cn(
                "group mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5",
                "text-[13px] font-medium",
                "text-zinc-500 dark:text-zinc-400",
                "transition-all duration-200",
                "hover:bg-white hover:text-zinc-900 hover:shadow-sm",
                "dark:hover:bg-zinc-900 dark:hover:text-zinc-100",
                "dark:hover:shadow-none",
              )}
            >
              <ArrowUpRight
                className={cn(
                  "size-[17px]",
                  "text-zinc-400 group-hover:text-zinc-700",
                  "dark:text-zinc-500 dark:group-hover:text-zinc-200",
                )}
                strokeWidth={1.7}
              />

              <span>View website</span>
            </Link>

            {/* Settings */}
            <Link
              href="/admin/settings"
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5",
                "text-[13px] font-medium",
                "text-zinc-500 dark:text-zinc-400",
                "transition-all duration-200",
                "hover:bg-white hover:text-zinc-900 hover:shadow-sm",
                "dark:hover:bg-zinc-900 dark:hover:text-zinc-100",
                "dark:hover:shadow-none",
              )}
            >
              <Settings
                className={cn(
                  "size-[17px]",
                  "text-zinc-400 group-hover:text-zinc-700",
                  "dark:text-zinc-500 dark:group-hover:text-zinc-200",
                )}
                strokeWidth={1.7}
              />

              <span>Settings</span>
            </Link>

            {/* User card */}
            <div
              className={cn(
                "mt-4 rounded-xl border p-3",
                "border-zinc-200/80 bg-white",
                "shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
                "dark:border-zinc-800 dark:bg-zinc-900",
                "dark:shadow-none",
              )}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full",
                    "bg-zinc-100 text-xs font-semibold text-zinc-600",
                    "dark:bg-zinc-800 dark:text-zinc-300",
                  )}
                >
                  {session.user.email?.charAt(0).toUpperCase()}
                </div>

                {/* User info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-zinc-800 dark:text-zinc-200">
                    {session.user.email}
                  </p>

                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Administrator
                  </p>
                </div>

                {/* Logout */}
                <form action={logoutAction}>
                  <button
                    type="submit"
                    title="Logout"
                    className={cn(
                      "flex size-7 items-center justify-center rounded-md",
                      "text-zinc-400",
                      "transition-colors",
                      "hover:bg-zinc-100 hover:text-zinc-900",
                      "dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
                    )}
                  >
                    <LogOut className="size-3.5" strokeWidth={1.8} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </aside>

        {/* ───────────────── Main content ───────────────── */}
        <main
          className={cn(
            "min-w-0 flex-1",
            "px-6 py-7 md:px-10 md:py-9 lg:px-12",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}