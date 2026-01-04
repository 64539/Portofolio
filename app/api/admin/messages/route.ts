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
           from: "Portofolio Terminal <onboarding@resend.dev>",
           to: [reply_to_email],
           subject: `Re: [Ticket #${id.slice(0, 8)}] Response from Admin`,
           html: `
             <div style="font-family: monospace; padding: 20px; background: #000; color: #fff;">
               <p>Dear ${reply_to_name || 'Guest'},</p>
               <p>Admin has responded to your message:</p>
               <div style="border-left: 2px solid #FBBF24; padding-left: 10px; margin: 10px 0; color: #FBBF24;">
                 ${content.replace(/\n/g, '<br>')}
               </div>
               <p style="color: #666; font-size: 12px;">--<br>Secure Terminal Transmission</p>
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

