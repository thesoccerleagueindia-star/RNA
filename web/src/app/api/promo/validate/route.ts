import { NextResponse } from "next/server";
import { applyPromo, eventConfig } from "@/lib/config";
import { readStore } from "@/lib/store";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const code = String(body.code || "");
  const result = applyPromo(eventConfig.feeInr, code);
  if (!result.ok || !result.promo) {
    return NextResponse.json({ ok: false, message: result.message || "Invalid code" }, { status: 400 });
  }
  const store = await readStore();
  const used = store.promoRedemptions.filter((r) => r.code === result.promo!.code).length;
  if (used >= result.promo.maxRedemptions) {
    return NextResponse.json({ ok: false, message: "Promo code fully redeemed" }, { status: 400 });
  }
  return NextResponse.json({
    ok: true,
    code: result.promo.code,
    label: result.promo.label,
    discount: result.discount,
    feePayable: result.fee,
    feeBase: eventConfig.feeInr,
    redemptions: used,
    maxRedemptions: result.promo.maxRedemptions,
  });
}
