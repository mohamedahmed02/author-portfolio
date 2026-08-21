import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validations";
import { logActivity } from "@/lib/content";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    // Honeypot
    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        subject: parsed.data.subject,
        message: parsed.data.message,
      },
    });

    await logActivity("contact.message", "ContactMessage", undefined, {
      email: parsed.data.email.toLowerCase(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
