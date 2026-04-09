import { PrismaClient } from "@prisma/client";
import { Pool, types } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Fix for Decimal/BigInt types if needed
types.setTypeParser(1700, (val) => parseFloat(val));

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function getPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is missing in .env");
  }

  const isLocal = url.includes('localhost') || url.includes('127.0.0.1');

  const pool = new Pool({
    connectionString: url,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000,
    ...(!isLocal && { ssl: { rejectUnauthorized: false } }),
  });

  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ 
    adapter,
    log: ["error", "warn"],
  });
}

export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
