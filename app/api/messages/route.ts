import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      user_session?: string;
      content?: string;
      sender_name?: string;
      sender_email?: string;
    };

    const userSession = (body.user_session ?? "").trim();
    const content = (body.content ?? "").trim();

    if (!userSession || !content) {
      return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
    }

    if (content.length > 5000) {
      return NextResponse.json({ error: "CONTENT_TOO_LONG" }, { status: 413 });
    }

    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("messages")
      .insert({
        user_session: userSession,
        content,
        is_from_admin: false,
        sender_name: body.sender_name,
        sender_email: body.sender_email,
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("[API/Messages] DB Insert Error:", error);
      return NextResponse.json({ error: "DB_INSERT_FAILED", details: error.message }, { status: 500 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (resendApiKey && adminEmail) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "Portofolio Terminal <onboarding@resend.dev>",
          to: [adminEmail],
          subject: "[Portofolio] Incoming Terminal Message",
          html: `
            <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
              <p><b>New message received</b></p>
              <p><b>Session:</b> ${escapeHtml(userSession)}</p>
              <pre style="white-space: pre-wrap; background:#000; color:#3b82f6; padding:12px; border-radius:8px; border:1px solid rgba(59,130,246,0.3);">${escapeHtml(
                content
              )}</pre>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("[API/Messages] Email Send Warning:", emailError);
        // Don't fail the request if email fails, just log it
      }
    }

    return NextResponse.json({ ok: true, message: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[API/Messages] Unhandled Error:", err);
    return NextResponse.json({ error: "SERVER_ERROR", details: message }, { status: 500 });
  }
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

