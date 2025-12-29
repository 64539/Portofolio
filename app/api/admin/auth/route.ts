import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { secretKey?: string };
    const provided = (body.secretKey ?? "").trim();
    const expected = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY ?? process.env.ADMIN_SECRET_KEY ?? "";

    if (!expected) {
      return NextResponse.json({ ok: false, error: "ADMIN_SECRET_NOT_SET" }, { status: 500 });
    }

    if (!timingSafeEqual(provided, expected)) {
      return NextResponse.json({ ok: false, error: "ACCESS_DENIED" }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

