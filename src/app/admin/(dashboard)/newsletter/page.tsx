import { format } from "date-fns";
import { prisma } from "@/lib/db";

export default async function NewsletterAdminPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  const active = subscribers.filter((s) => !s.unsubscribed).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Newsletter</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {active} active · {subscribers.length} total subscribers
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        {subscribers.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-zinc-500">No subscribers yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Locale</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {subscribers.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-4 py-3 font-medium text-zinc-900">{sub.email}</td>
                  <td className="px-4 py-3 uppercase text-zinc-600">{sub.locale}</td>
                  <td className="px-4 py-3">
                    {sub.unsubscribed ? (
                      <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                        Unsubscribed
                      </span>
                    ) : (
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {format(sub.createdAt, "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
