/**
 * Edge-compatible session verification (uses Web Crypto API).
 * Use this in middleware; use admin-session.ts in API routes.
 */

const COOKIE_NAME = "admin_session";
const SECRET = process.env.ADMIN_SESSION_SECRET || "change-me-in-production";

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a[i]! ^ b[i]!;
  }
  return out === 0;
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) base64 += "=".repeat(4 - pad);
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

async function hmacSha256(key: string, message: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const keyData = enc.encode(key);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return new Uint8Array(sig);
}

export async function verifySessionCookieAsync(cookieHeader: string | null): Promise<{ email: string } | null> {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const raw = match?.[1];
  if (!raw) return null;
  const [payloadB64, signatureB64] = raw.split(".");
  if (!payloadB64 || !signatureB64) return null;

  try {
    const payloadStr = new TextDecoder().decode(base64UrlDecode(payloadB64));
    const payload = JSON.parse(payloadStr) as { email?: string; exp?: number };
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    const expected = await hmacSha256(SECRET, payloadStr);
    const signature = base64UrlDecode(signatureB64);
    if (expected.length !== signature.length || !timingSafeEqual(expected, signature)) {
      return null;
    }
    return { email: payload.email ?? "" };
  } catch {
    return null;
  }
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}
