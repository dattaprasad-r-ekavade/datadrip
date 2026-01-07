import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "crypto";
import { env } from "@/lib/env";

const ENCRYPTION_PREFIX = "enc:v1:";
const IV_BYTES = 12;
const TAG_BYTES = 16;

const getKey = () => {
  const key = Buffer.from(env.TOKEN_ENCRYPTION_KEY, "base64");
  if (key.length !== 32) {
    throw new Error("TOKEN_ENCRYPTION_KEY must be 32 bytes (base64 encoded).");
  }
  return key;
};

export const isEncrypted = (value: string) => value.startsWith(ENCRYPTION_PREFIX);

export const encryptString = (value: string) => {
  if (!value || isEncrypted(value)) {
    return value;
  }

  const key = getKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [
    ENCRYPTION_PREFIX.slice(0, -1),
    iv.toString("base64"),
    tag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
};

export const decryptString = (value: string) => {
  if (!value || !isEncrypted(value)) {
    return value;
  }

  const parts = value.split(":");
  if (parts.length !== 5) {
    throw new Error("Invalid encrypted payload format.");
  }

  const [, , ivBase64, tagBase64, dataBase64] = parts;
  const key = getKey();
  const iv = Buffer.from(ivBase64, "base64");
  const tag = Buffer.from(tagBase64, "base64");
  const data = Buffer.from(dataBase64, "base64");

  if (iv.length !== IV_BYTES || tag.length !== TAG_BYTES) {
    throw new Error("Invalid encrypted payload.");
  }

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString("utf8");
};

export const signState = (payload: string) => {
  const hmac = createHmac("sha256", env.OAUTH_STATE_SECRET);
  hmac.update(payload);
  return hmac.digest("base64url");
};
