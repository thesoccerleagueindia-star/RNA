import { NextResponse } from "next/server";
import { paymentMode } from "@/lib/config";
import { readStore } from "@/lib/store";

/**
 * Razorpay order creation.
 * Live: requires RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET.
 * Demo: returns a mock order — never charges.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const registrationId = body?.registrationId;
  if (!registrationId) return NextResponse.json({ error: "registrationId required" }, { status: 400 });

  const store = await readStore();
  const reg = store.registrations.find((r) => r.id === registrationId);
  if (!reg) return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  if (reg.status === "confirmed") return NextResponse.json({ error: "Already confirmed" }, { status: 400 });

  const amountPaise = Math.round(reg.feePayable * 100);
  const mode = paymentMode();

  if (mode === "demo" || !process.env.RAZORPAY_KEY_SECRET || !process.env.RAZORPAY_KEY_ID) {
    return NextResponse.json({
      mode: "demo",
      mock: true,
      orderId: `order_demo_${Date.now()}`,
      amount: amountPaise,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || null,
      registrationId: reg.id,
      message: "DEMO order — no live charge. Set PAYMENT_MODE=live and Razorpay env secrets for production.",
    });
  }

  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt: reg.id,
      notes: { registrationId: reg.id, city: reg.city, promo: reg.promoCode || "" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: "Razorpay order failed", detail: err }, { status: 502 });
  }

  const order = await res.json();
  return NextResponse.json({
    mode: "live",
    mock: false,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    registrationId: reg.id,
  });
}
