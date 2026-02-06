import { NextResponse } from "next/server";

/**
 * GET /api/firebase-status
 * Returns whether Firebase env vars are available (for debugging production login).
 * Remove or restrict this route once debugging is done.
 */
export async function GET() {
  const configured =
    !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  return NextResponse.json({ configured });
}
