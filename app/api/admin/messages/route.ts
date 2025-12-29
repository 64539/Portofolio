import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const runtime = "nodejs";

type MessageRow = {
  id: string;
  created_at: string;
  user_session: string;
  content: string;
  is_from_admin: boolean;
};

export async function GET(req: Request) {
  try {
    const expected = process.env.ADMIN_SECRET_KEY ?? "";
    const provided = (req.headers.get("x-admin-key") ?? "").trim();

    if (!expected) {
      return NextResponse.json({ ok: false, error: "ADMIN_SECRET_NOT_SET" }, { status: 500 });
    }

    if (!timingSafeEqual(provided, expected)) {
      return NextResponse.json({ ok: false, error: "ACCESS_DENIED" }, { status: 401 });
    }

    const url = new URL(req.url);
    const session = (url.searchParams.get("session") ?? "").trim();

    const supabase = createSupabaseServerClient();

    if (session) {
      const { data, error } = await supabase
        .from("messages")
        .select("id, created_at, user_session, content, is_from_admin")
        .eq("user_session", session)
        .order("created_at", { ascending: true })
        .limit(500);

      if (error) {
        return NextResponse.json({ ok: false, error: "DB_QUERY_FAILED" }, { status: 500 });
      }

      return NextResponse.json({ ok: true, messages: (data ?? []) as MessageRow[] });
    }

    const { data, error } = await supabase
      .from("messages")
      .select("user_session, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      return NextResponse.json({ ok: false, error: "DB_QUERY_FAILED" }, { status: 500 });
    }

    const seen = new Set<string>();
    const sessions: string[] = [];
    for (const row of data ?? []) {
      const s = (row as { user_session: string }).user_session;
      if (!s || seen.has(s)) continue;
      seen.add(s);
      sessions.push(s);
    }

    return NextResponse.json({ ok: true, sessions });
  } catch {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const expected = process.env.ADMIN_SECRET_KEY ?? "";
    const provided = (req.headers.get("x-admin-key") ?? "").trim();

    if (!expected) {
      return NextResponse.json({ ok: false, error: "ADMIN_SECRET_NOT_SET" }, { status: 500 });
    }

    if (!timingSafeEqual(provided, expected)) {
      return NextResponse.json({ ok: false, error: "ACCESS_DENIED" }, { status: 401 });
    }

    const body = (await req.json()) as { user_session?: string; content?: string };
    const userSession = (body.user_session ?? "").trim();
    const content = (body.content ?? "").trim();

    if (!userSession || !content) {
      return NextResponse.json({ ok: false, error: "INVALID_PAYLOAD" }, { status: 400 });
    }

    if (content.length > 4000) {
      return NextResponse.json({ ok: false, error: "CONTENT_TOO_LONG" }, { status: 413 });
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({ user_session: userSession, content, is_from_admin: true })
      .select("id, created_at, user_session, content, is_from_admin")
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: "DB_INSERT_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: data as MessageRow });
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

