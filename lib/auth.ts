import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

// Mock fallback users when DB unavailable
const fallbackUsers = [
  {
    id: "admin-1",
    name: "Admin",
    email: "admin@edura.com",
    // password: Admin123!
    passwordHash: bcrypt.hashSync("Admin123!", 10),
    role: "ADMIN" as const,
    image: null,
  },
  {
    id: "student-1",
    name: "Student Demo",
    email: "student@edura.com",
    passwordHash: bcrypt.hashSync("Student123!", 10),
    role: "STUDENT" as const,
    image: null,
  },
];

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-in-prod-32chars!!",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email.toLowerCase().trim();

        // Try DB first
        if (process.env.DATABASE_URL) {
          try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (user && user.passwordHash) {
              const ok = await bcrypt.compare(credentials.password, user.passwordHash);
              if (ok) {
                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  image: user.image,
                  role: (user as any).role,
                } as any;
              }
            }
          } catch (e) {
            console.warn("DB auth fallback", e);
          }
        }

        // Fallback to mock users
        const mock = fallbackUsers.find((u) => u.email === email);
        if (mock) {
          const ok = await bcrypt.compare(credentials.password, mock.passwordHash);
          if (ok) {
            return {
              id: mock.id,
              name: mock.name,
              email: mock.email,
              image: mock.image,
              role: mock.role,
            } as any;
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).role = (user as any).role;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).userId = token.sub;
        (session.user as any).role = (token as any).role || "STUDENT";
        (session.user as any).id = token.id || token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
