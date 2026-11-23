import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { paymentMode } from "@/lib/config";
import { readStore, writeStore } from "@/lib/store";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.registrationId) return NextResponse.json({ error: "registrationId required" }, { status: 400 });

  const store = await readStore();
  const reg = store.registrations.find((r) => r.id === body.registrationId);
  if (!reg) return NextResponse.json({ error: "Registration not found" }, { status: 404 });

  const mode = paymentMode();

  if (mode === "demo" || body.provider === "demo") {
    reg.status = "confirmed";
    reg.paymentStatus = "paid";
    reg.paymentProvider = "demo";
    reg.paymentId = body.paymentId || `demo_${Date.now()}`;
    reg.confirmedAt = new Date().toISOString();
    if (reg.promoCode) {
      store.promoRedemptions.push({
        code: reg.promoCode,
        registrationId: reg.id,
        discount: reg.discount,
        feePayable: reg.feePayable,
        at: reg.confirmedAt,
        mode: "demo",
      });
    }
    await writeStore(store);
    return NextResponse.json({ ok: true, mock: true, registration: reg });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return NextResponse.json({ error: "RAZORPAY_KEY_SECRET not configured" }, { status: 500 });

  const payload = `${body.razorpay_order_id}|${body.razorpay_payment_id}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  if (expected !== body.razorpay_signature) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  reg.status = "confirmed";
  reg.paymentStatus = "paid";
  reg.paymentProvider = "razorpay";
  reg.paymentId = body.razorpay_payment_id;
  reg.confirmedAt = new Date().toISOString();
  if (reg.promoCode) {
    store.promoRedemptions.push({
      code: reg.promoCode,
      registrationId: reg.id,
      discount: reg.discount,
      feePayable: reg.feePayable,
      at: reg.confirmedAt,
      mode: "live",
    });
  }
  await writeStore(store);
  return NextResponse.json({ ok: true, mock: false, registration: reg });
}
