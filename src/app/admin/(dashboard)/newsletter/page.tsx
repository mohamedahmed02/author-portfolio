import { format } from "date-fns";
import { prisma } from "@/lib/db";
import { Mail, Users, UserCheck } from "lucide-react";

export default async function NewsletterAdminPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  const active = subscribers.filter((s) => !s.unsubscribed).length;
  const unsubscribed = subscribers.length - active;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <Mail className="size-5 text-zinc-700 dark:text-zinc-300" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Newsletter
            </h1>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Manage your newsletter subscribers.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total subscribers
            </p>

            <Users className="size-4 text-zinc-400 dark:text-zinc-500" />
          </div>

          <p className="mt-3 text-3xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {subscribers.length}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Active
            </p>

            <UserCheck className="size-4 text-emerald-500" />
          </div>

          <p className="mt-3 text-3xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {active}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Unsubscribed
            </p>

            <Users className="size-4 text-zinc-400 dark:text-zinc-500" />
          </div>

          <p className="mt-3 text-3xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {unsubscribed}
          </p>
        </div>
      </div>

      {/* Subscribers */}
      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Subscribers
            </h2>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              All newsletter subscriptions ordered by newest.
            </p>
          </div>
        </div>

        {subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
              <Mail className="size-5 text-zinc-400 dark:text-zinc-500" />
            </div>

            <p className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              No subscribers yet
            </p>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Subscribers will appear here when people join your newsletter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/60">
                <tr>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Email
                  </th>

                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Locale
                  </th>

                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Status
                  </th>

                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {subscribers.map((sub) => (
                  <tr
                    key={sub.id}
                    className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50"
                  >
                    <td className="px-5 py-4">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {sub.email}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium uppercase text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                        {sub.locale}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {sub.unsubscribed ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                          <span className="size-1.5 rounded-full bg-zinc-400" />
                          Unsubscribed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                      {format(sub.createdAt, "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}