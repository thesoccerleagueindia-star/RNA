import { NextResponse } from "next/server";
import { applyPromo, eventConfig } from "@/lib/config";
import { readStore, writeStore, type Registration } from "@/lib/store";

export async function GET() {
  const store = await readStore();
  return NextResponse.json({
    mock: true,
    count: store.registrations.length,
    registrations: store.registrations,
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const required = ["playerName", "city", "age", "category", "interest", "guardianName", "guardianContact"];
  for (const key of required) {
    if (!body[key]) return NextResponse.json({ error: `Missing ${key}` }, { status: 400 });
  }

  const feeResult = applyPromo(eventConfig.feeInr, body.promoCode);
  if (body.promoCode && !feeResult.ok) {
    return NextResponse.json({ error: feeResult.message }, { status: 400 });
  }

  const store = await readStore();
  if (feeResult.promo) {
    const used = store.promoRedemptions.filter((r) => r.code === feeResult.promo!.code).length;
    if (used >= feeResult.promo.maxRedemptions) {
      return NextResponse.json({ error: "Promo code fully redeemed" }, { status: 400 });
    }
  }

  const city = eventConfig.cities.find((c) => c.name === body.city);
  if (!city) return NextResponse.json({ error: "Unknown city" }, { status: 400 });
  const confirmedCount = store.registrations.filter(
    (r) => r.city === body.city && r.status === "confirmed"
  ).length;
  if (confirmedCount >= (city.capacity || eventConfig.capacityPerCityDefault)) {
    return NextResponse.json({ error: "City at capacity — join waitlist" }, { status: 409 });
  }

  const reg: Registration = {
    id: `REG-${Date.now().toString(36).toUpperCase()}`,
    playerName: String(body.playerName),
    city: String(body.city),
    age: Number(body.age),
    category: String(body.category),
    interest: body.interest === "Camp" ? "Camp" : "Clinic",
    guardianName: String(body.guardianName),
    guardianContact: String(body.guardianContact),
    playerContact: body.playerContact ? String(body.playerContact) : undefined,
    promoCode: feeResult.promo?.code || null,
    feeBase: eventConfig.feeInr,
    discount: feeResult.discount,
    feePayable: feeResult.fee,
    status: "pending_payment",
    paymentStatus: "unpaid",
    createdAt: new Date().toISOString(),
  };

  store.registrations.push(reg);
  await writeStore(store);

  return NextResponse.json({
    ok: true,
    registration: reg,
    paymentMode: (process.env.PAYMENT_MODE || "demo").toLowerCase() === "live" ? "live" : "demo",
    message: "Registration draft created. Complete payment to confirm.",
  });
}
