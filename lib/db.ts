// Prevent multiple Prisma Client instances in development (Next.js hot reload)
let prismaInstance: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require('@prisma/client');
  if (PrismaClient) {
    const globalForPrisma = globalThis as unknown as { prisma: any };
    prismaInstance =
      globalForPrisma.prisma ??
      new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
      });

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance;
    }
  }
} catch {
  // Prisma client not yet generated or DB not configured
}

export const prisma = prismaInstance;
export default prisma;
