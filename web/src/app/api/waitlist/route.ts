import { NextResponse } from "next/server";
import { readStore, writeStore, type WaitlistEntry } from "@/lib/store";

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
  const store = await readStore();
  store.waitlist.push(entry);
  await writeStore(store);
  return NextResponse.json({ ok: true, entry, message: "Waitlist interest recorded (no payment)." });
}
