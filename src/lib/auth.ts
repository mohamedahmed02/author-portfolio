import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { checkLoginRateLimit, recordLoginAttempt } from "@/lib/rate-limit";

const credentialsSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(200),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email.toLowerCase().trim();
        const password = parsed.data.password;
        const ip =
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          request.headers.get("x-real-ip") ||
          "unknown";

        const rate = await checkLoginRateLimit(ip, email);
        if (!rate.allowed) {
          throw new Error("RATE_LIMITED");
        }

        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
        if (!adminEmail || email !== adminEmail) {
          await recordLoginAttempt(ip, email, false);
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email: adminEmail } });
        if (!user || user.role !== "ADMIN") {
          await recordLoginAttempt(ip, email, false);
          return null;
        }

        const valid = await verifyPassword(user.passwordHash, password);
        await recordLoginAttempt(ip, email, valid);

        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "ADMIN";
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as string) || "ADMIN";
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.AUTH_SECRET,
});

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email || session.user.role !== "ADMIN") {
    throw new Error("UNAUTHORIZED");
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  if (!adminEmail || session.user.email.toLowerCase() !== adminEmail) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}
