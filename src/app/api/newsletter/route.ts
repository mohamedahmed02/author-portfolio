import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { newsletterSchema } from "@/lib/validations";
import { logActivity } from "@/lib/content";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    const email = parsed.data.email.toLowerCase();

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { unsubscribed: false, locale: parsed.data.locale },
      create: { email, locale: parsed.data.locale },
    });

    if (process.env.NEWSLETTER_WEBHOOK_URL) {
      try {
        await fetch(process.env.NEWSLETTER_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, locale: parsed.data.locale }),
        });
      } catch {
        // DB is source of truth
      }
    }

    await logActivity("newsletter.subscribe", "NewsletterSubscriber", undefined, {
      email,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
