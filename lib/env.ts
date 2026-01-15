import { z } from "zod";

const envSchema = z.object({
  // DATABASE_URL is optional when using Turso (TURSO_DATABASE_URL)
  DATABASE_URL: z.string().optional(),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url().optional(),
  TOKEN_ENCRYPTION_KEY: z.string().min(1, "TOKEN_ENCRYPTION_KEY is required"),
  OAUTH_STATE_SECRET: z.string().min(1, "OAUTH_STATE_SECRET is required"),
  META_APP_ID: z.string().min(1, "META_APP_ID is required"),
  META_APP_SECRET: z.string().min(1, "META_APP_SECRET is required"),
  META_REDIRECT_URI: z.string().url("META_REDIRECT_URI must be a valid URL"),
  META_API_VERSION: z.string().min(1, "META_API_VERSION is required"),
  META_SCOPES: z.string().min(1, "META_SCOPES is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  GOOGLE_REDIRECT_URI: z.string().url("GOOGLE_REDIRECT_URI must be a valid URL"),
  GOOGLE_ADS_DEVELOPER_TOKEN: z.string().min(1, "GOOGLE_ADS_DEVELOPER_TOKEN is required"),
  CRON_SECRET: z.string().min(1, "CRON_SECRET is required"),
});

const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL ?? process.env.TURSO_DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  TOKEN_ENCRYPTION_KEY: process.env.TOKEN_ENCRYPTION_KEY,
  OAUTH_STATE_SECRET: process.env.OAUTH_STATE_SECRET,
  META_APP_ID: process.env.META_APP_ID,
  META_APP_SECRET: process.env.META_APP_SECRET,
  META_REDIRECT_URI: process.env.META_REDIRECT_URI,
  META_API_VERSION: process.env.META_API_VERSION ?? "v19.0",
  META_SCOPES: process.env.META_SCOPES ?? "ads_read,ads_management,business_management",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  GOOGLE_ADS_DEVELOPER_TOKEN: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  CRON_SECRET: process.env.CRON_SECRET,
});

if (!parsed.success) {
  console.error("? Invalid environment variables", parsed.error.flatten().fieldErrors);
  throw new Error("Environment validation failed");
}

export const env = {
  ...parsed.data,
  NODE_ENV: process.env.NODE_ENV ?? "development",
};

export type Env = typeof env;
