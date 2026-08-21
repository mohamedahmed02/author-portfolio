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
  { href: "/admin/settings", label: "Settings", icon: Settings },
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
    <div className="admin-shell min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-4">
            <BookOpen className="size-4 text-zinc-700" />
            <div>
              <p className="text-sm font-semibold text-zinc-900">Admin</p>
              <p className="truncate text-xs text-zinc-500">{session.user.email}</p>
            </div>
          </div>
          <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-700 hover:bg-zinc-200/70 hover:text-zinc-900",
                  )}
                >
                  <Icon className="size-4 shrink-0 opacity-70" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-zinc-200 p-2">
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full rounded-md px-2.5 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900"
              >
                Logout
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
