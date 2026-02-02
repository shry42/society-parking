import { NextRequest, NextResponse } from "next/server";
import { getAdminCredDoc } from "@/lib/firebase-server";
import { createSessionCookie } from "@/lib/admin-session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const data = await getAdminCredDoc();
    if (!data) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const storedUsername = (data.username ?? data.email ?? "").toString().trim();
    const storedPassword = (data.password ?? "").toString().trim();

    if (email !== storedUsername || password !== storedPassword) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const cookie = createSessionCookie(email);
    const res = NextResponse.json({ success: true });
    res.headers.set("Set-Cookie", cookie);
    return res;
  } catch {
    return NextResponse.json(
      { error: "Login failed." },
      { status: 500 }
    );
  }
}
