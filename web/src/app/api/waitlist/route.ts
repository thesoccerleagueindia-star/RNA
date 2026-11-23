import { NextResponse } from "next/server";
import { readStore, writeStore, type WaitlistEntry } from "@/lib/store";
import { supabaseConfigured, supabaseInsert } from "@/lib/supabase";

export async function GET() {
  const store = await readStore();
  return NextResponse.json({ mock: true, waitlist: store.waitlist });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.playerName || !body?.city || !body?.email || !body?.phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const entry: WaitlistEntry = {
    id: `WL-${Date.now().toString(36).toUpperCase()}`,
    playerName: String(body.playerName),
    city: String(body.city),
    age: Number(body.age || 0),
    interest: String(body.interest || "Clinic"),
    email: String(body.email),
    phone: String(body.phone),
    level: body.level ? String(body.level) : undefined,
    createdAt: new Date().toISOString(),
  };

  const warnings: string[] = [];
  if (supabaseConfigured()) {
    try {
      await supabaseInsert("waitlist", {
        id: entry.id,
        submitted_at: entry.createdAt,
        player_name: entry.playerName,
        guardian_name: String(body.guardianName || entry.playerName),
        age: String(entry.age || ""),
        city: entry.city,
        category: entry.level || String(body.category || ""),
        interest: entry.interest,
        email: entry.email,
        phone: entry.phone,
        consent: true,
      });
    } catch (e) {
      warnings.push(e instanceof Error ? e.message : "Supabase insert failed");
    }
  } else {
    warnings.push("Supabase not configured");
  }

  const store = await readStore();
  store.waitlist.push(entry);
  await writeStore(store);
  return NextResponse.json({
    ok: true,
    entry,
    warnings,
    message: "Waitlist interest recorded (no payment).",
  });
}
