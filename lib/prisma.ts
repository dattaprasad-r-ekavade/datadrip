import { PrismaClient } from "@prisma/client";
import { decryptString, encryptString, isEncrypted } from "@/lib/security/encryption";

type GlobalPrisma = typeof globalThis & {
  prisma?: PrismaClient;
};

const globalForPrisma = globalThis as GlobalPrisma;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["warn", "error"],
  });

const SENSITIVE_FIELDS: Record<string, string[]> = {
  MetaAccount: ["accessToken", "refreshToken"],
  GoogleAccount: ["accessToken", "refreshToken"],
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

prisma.$use(async (params, next) => {
  if (params.action === "create" || params.action === "update" || params.action === "upsert") {
    encryptData(params.model, params.args?.data);
    if (params.action === "upsert") {
      encryptData(params.model, params.args?.create);
      encryptData(params.model, params.args?.update);
    }
  }

  const result = await next(params);

  if (
    params.action === "findUnique" ||
    params.action === "findFirst" ||
    params.action === "findMany" ||
    params.action === "findUniqueOrThrow" ||
    params.action === "findFirstOrThrow"
  ) {
    decryptResult(params.model, result);
  }

  return result;
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
