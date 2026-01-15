import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { decryptString, encryptString, isEncrypted } from "@/lib/security/encryption";

type GlobalPrisma = typeof globalThis & {
  prisma?: PrismaClient;
};

const globalForPrisma = globalThis as GlobalPrisma;

function createPrismaClient() {
  // Use Turso in production (when TURSO_DATABASE_URL is set)
  if (process.env.TURSO_DATABASE_URL) {
    const adapter = new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }

  // Use local SQLite in development
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["warn", "error"],
  });
}

const prismaClient = globalForPrisma.prisma ?? createPrismaClient();

const SENSITIVE_FIELDS: Record<string, string[]> = {
  MetaAccount: ["accessToken", "refreshToken"],
  GoogleAccount: ["accessToken", "refreshToken"],
  AIProvider: ["apiKey"],
};

const encryptValue = (value: unknown) => {
  if (typeof value !== "string") {
    return value;
  }
  return encryptString(value);
};

const decryptValue = (value: unknown) => {
  if (typeof value !== "string" || !isEncrypted(value)) {
    return value;
  }
  return decryptString(value);
};

const encryptData = (model: string | undefined, data: Record<string, unknown> | undefined) => {
  if (!model || !data) {
    return;
  }

  const fields = SENSITIVE_FIELDS[model];
  if (!fields) {
    return;
  }

  for (const field of fields) {
    const value = data[field];
    if (typeof value === "string") {
      data[field] = encryptValue(value);
      continue;
    }

    if (value && typeof value === "object" && "set" in value) {
      const setValue = (value as { set?: unknown }).set;
      if (typeof setValue === "string") {
        data[field] = { ...value, set: encryptValue(setValue) };
      }
    }
  }
};

const decryptResult = (model: string | undefined, result: unknown) => {
  if (!model || !result) {
    return;
  }

  const fields = SENSITIVE_FIELDS[model];
  if (!fields) {
    return;
  }

  const decryptRecord = (record: Record<string, unknown>) => {
    for (const field of fields) {
      record[field] = decryptValue(record[field]);
    }
  };

  if (Array.isArray(result)) {
    result.forEach((record) => decryptRecord(record as Record<string, unknown>));
  } else if (typeof result === "object") {
    decryptRecord(result as Record<string, unknown>);
  }
};

export const prisma = prismaClient.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const argsAny = args as Record<string, any> | undefined;
        if (operation === "create" || operation === "update" || operation === "upsert") {
          encryptData(model, argsAny?.data);
          if (operation === "upsert") {
            encryptData(model, argsAny?.create);
            encryptData(model, argsAny?.update);
          }
        }

        const result = await query(args);

        if (
          operation === "findUnique" ||
          operation === "findFirst" ||
          operation === "findMany" ||
          operation === "findUniqueOrThrow" ||
          operation === "findFirstOrThrow"
        ) {
          decryptResult(model, result);
        }

        return result;
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient;
}

export default prisma;
