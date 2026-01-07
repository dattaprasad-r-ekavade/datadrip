import { signState } from "@/lib/security/encryption";

export interface OAuthStatePayload {
  provider: "meta" | "google-ads";
  clientId: string;
  userId: string;
  returnTo?: string;
  exp: number;
}

const encode = (payload: OAuthStatePayload) => {
  const json = JSON.stringify(payload);
  return Buffer.from(json, "utf8").toString("base64url");
};

const decode = (value: string) => {
  const json = Buffer.from(value, "base64url").toString("utf8");
  return JSON.parse(json) as OAuthStatePayload;
};

export const createOAuthState = (payload: OAuthStatePayload) => {
  const encoded = encode(payload);
  const signature = signState(encoded);
  return `${encoded}.${signature}`;
};

export const verifyOAuthState = (value: string) => {
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) {
    return null;
  }

  const expectedSignature = signState(encoded);
  if (signature !== expectedSignature) {
    return null;
  }

  const payload = decode(encoded);
  if (Date.now() > payload.exp) {
    return null;
  }

  return payload;
};
