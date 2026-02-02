import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";
const SECRET = process.env.ADMIN_SESSION_SECRET || "change-me-in-production";
const MAX_AGE_SEC = 7 * 24 * 60 * 60; // 7 days

export function createSessionCookie(email: string): string {
  const payloadStr = JSON.stringify({
    email,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SEC,
  });
  const payloadB64 = Buffer.from(payloadStr, "utf8").toString("base64url");
  const signature = createHmac("sha256", SECRET).update(payloadStr).digest("base64url");
  const value = payloadB64 + "." + signature;
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE_SEC}`;
}

export function verifySessionCookie(cookieHeader: string | null): { email: string } | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const raw = match?.[1];
  if (!raw) return null;
  const [payloadB64, signature] = raw.split(".");
  if (!payloadB64 || !signature) return null;
  try {
    const payloadStr = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(payloadStr);
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return null;
    const expected = createHmac("sha256", SECRET).update(payloadStr).digest("base64url");
    if (!timingSafeEqual(Buffer.from(signature, "base64url"), Buffer.from(expected, "base64url"))) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}
