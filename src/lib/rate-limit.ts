import { prisma } from "@/lib/db";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export async function checkLoginRateLimit(ip: string, email: string) {
  const since = new Date(Date.now() - WINDOW_MS);

  const [byIp, byEmail] = await Promise.all([
    prisma.loginAttempt.count({
      where: { ip, success: false, createdAt: { gte: since } },
    }),
    prisma.loginAttempt.count({
      where: { email: email.toLowerCase(), success: false, createdAt: { gte: since } },
    }),
  ]);

  if (byIp >= MAX_ATTEMPTS || byEmail >= MAX_ATTEMPTS) {
    return { allowed: false as const, retryAfterMinutes: 15 };
  }

  return { allowed: true as const };
}

export async function recordLoginAttempt(ip: string, email: string, success: boolean) {
  await prisma.loginAttempt.create({
    data: {
      ip,
      email: email.toLowerCase(),
      success,
    },
  });

  // Keep table lean
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  await prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: cutoff } } });
}
