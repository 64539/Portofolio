import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { Resend } from "resend";

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
    const expected = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY ?? process.env.ADMIN_SECRET_KEY ?? "";
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
    const expected = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY ?? process.env.ADMIN_SECRET_KEY ?? "";
    const provided = (req.headers.get("x-admin-key") ?? "").trim();

    if (!expected || !timingSafeEqual(provided, expected)) {
      return NextResponse.json({ ok: false, error: "ACCESS_DENIED" }, { status: 401 });
    }

    const body = await req.json();
    
    // Check if this is a reply (Resend integration)
    if (body.reply_to_email) {
       const { id, content, reply_to_email, reply_to_name } = body;
       
       if (!id || !content) {
         return NextResponse.json({ ok: false, error: "MISSING_FIELDS" }, { status: 400 });
       }

       const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
          const resend = new Resend(resendApiKey);
          await resend.emails.send({
            from: "Jabriel Dev <terminal@resend.dev>", // Updated sender name
            to: [reply_to_email],
            subject: `[TICKET #${id.slice(0, 8)}] ENCRYPTED RESPONSE`,
            html: `
              <div style="font-family: 'Courier New', monospace; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333; line-height: 1.6;">
                <header style="border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 24px;">
                  <h2 style="margin: 0; font-size: 18px; letter-spacing: 1px;">[ ENCRYPTED RESPONSE FROM JABRIEL_DEV ]</h2>
                  <div style="font-size: 12px; color: #666; margin-top: 4px;">TICKET ID: ${id}</div>
                </header>
                
                <div style="margin-bottom: 20px;">
                  <div style="font-size: 12px; color: #666; margin-bottom: 4px;">&gt; INCOMING TRANSMISSION:</div>
                  <blockquote style="background: #f5f5f5; padding: 12px 16px; margin: 0; border-left: 4px solid #ccc; font-style: italic;">
                    "Message received from ${reply_to_name || 'Guest'}..."
                  </blockquote>
                </div>
                
                <div style="margin-bottom: 30px;">
                  <div style="font-size: 12px; color: #FBBF24; font-weight: bold; margin-bottom: 4px;">&gt; ADMIN RESPONSE:</div>
                  <div style="background: #FFFBEB; border: 1px solid #FCD34D; padding: 16px; border-radius: 4px; color: #92400E;">
                    ${content.replace(/\n/g, '<br>')}
                  </div>
                </div>
                
                <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 11px; color: #888; text-align: center;">
                  TERMINAL OUTPUT SIMULATION<br>
                  [ |||||||||||||||| ] 100%<br>
                  PROCESS COMPLETED<br>
                  <br>
                  &copy; ${new Date().getFullYear()} Jabriel Dev Portfolio. All rights reserved.
                </footer>
              </div>
            `,
          });
        }
       return NextResponse.json({ ok: true });
    }

    // Default POST behavior (Admin sending message to DB directly, if needed)
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

export async function DELETE(req: Request) {
  try {
    const expected = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY ?? process.env.ADMIN_SECRET_KEY ?? "";
    const provided = (req.headers.get("x-admin-key") ?? "").trim();

    if (!expected || !timingSafeEqual(provided, expected)) {
      return NextResponse.json({ ok: false, error: "ACCESS_DENIED" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = (url.searchParams.get("id") ?? "").trim();

    if (!id) {
      return NextResponse.json({ ok: false, error: "MISSING_ID" }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("messages").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ ok: false, error: "DB_DELETE_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const expected = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY ?? process.env.ADMIN_SECRET_KEY ?? "";
    const provided = (req.headers.get("x-admin-key") ?? "").trim();

    if (!expected || !timingSafeEqual(provided, expected)) {
      return NextResponse.json({ ok: false, error: "ACCESS_DENIED" }, { status: 401 });
    }

    const { id, is_read } = await req.json();

    if (!id) {
      return NextResponse.json({ ok: false, error: "MISSING_ID" }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const { error } = await supabase
      .from("messages")
      .update({ is_read })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ ok: false, error: "DB_UPDATE_FAILED" }, { status: 500 });
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

