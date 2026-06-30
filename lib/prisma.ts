import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/aoo/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set.");
    }
    if (databaseUrl.startsWith("prisma+postgres://")) {
      return new PrismaClient({
        accelerateUrl: databaseUrl,
      });
    } else {
      const pool = new pg.Pool({
        connectionString: databaseUrl,
        max: process.env.NODE_ENV === "production" ? undefined : 1,
        idleTimeoutMillis: process.env.NODE_ENV === "production" ? undefined : 5000,
      });
      const adapter = new PrismaPg(pool);
      return new PrismaClient({ adapter });
    }
  })();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
