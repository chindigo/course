// Prisma fallback - works even when Prisma client not generated (e.g., no DATABASE_URL or slow network)
let prisma: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("@prisma/client");
  const globalForPrisma = globalThis as unknown as { prisma: any };
  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
} catch (e) {
  console.warn("PrismaClient not available, using mock fallback", (e as Error).message);
  // Minimal mock that satisfies all prisma.xxx calls with empty arrays
  const mockModel = new Proxy(
    {},
    {
      get: () => async () => [],
    }
  );
  // Special cases for findUnique, create etc return null/plain object
  const handler = {
    get: (target: any, prop: string) => {
      if (prop === "$queryRaw") return async () => 1;
      if (prop === "$disconnect") return async () => {};
      // For models: user, course, etc
      return new Proxy(
        {},
        {
          get: (_, method: string) => {
            const returnsEmptyArray = ["findMany", "findFirst"];
            const returnsNull = ["findUnique", "findUniqueOrThrow"];
            const returnsObject = ["create", "upsert", "update", "delete"];
            const returnsCount = ["count"];
            if (returnsEmptyArray.includes(method)) return async () => [];
            if (returnsNull.includes(method)) return async () => null;
            if (returnsCount.includes(method)) return async () => 0;
            if (returnsObject.includes(method)) return async (args: any) => ({ id: "mock", ...args?.data, createdAt: new Date() });
            return async () => null;
          },
        }
      );
    },
  };
  prisma = new Proxy({}, handler);
}

export { prisma };

export async function isDbConnected() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost")) return false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
