import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url().optional(),
  EMAIL_SERVER_HOST: z.string().min(1, "EMAIL_SERVER_HOST is required"),
  EMAIL_SERVER_PORT: z.coerce.number().min(1, "EMAIL_SERVER_PORT must be a positive number"),
  EMAIL_SERVER_USER: z.string().min(1, "EMAIL_SERVER_USER is required"),
  EMAIL_SERVER_PASSWORD: z.string().min(1, "EMAIL_SERVER_PASSWORD is required"),
  EMAIL_FROM: z.string().email("EMAIL_FROM must be a valid email address"),
});

const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
  EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT ?? "1025",
  EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
  EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM,
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
