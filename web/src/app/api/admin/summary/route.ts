import { NextResponse } from "next/server";
import { readStore } from "@/lib/store";

/** Demo admin summary — protect with ADMIN_PASSWORD when set. */
export async function GET(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminPassword) {
    const header = req.headers.get("x-admin-password");
    if (header !== adminPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const store = await readStore();
  const paid = store.registrations.filter((r) => r.paymentStatus === "paid");
  return NextResponse.json({
    mock: !adminPassword,
    warning: adminPassword ? null : "ADMIN_PASSWORD unset — endpoint is open for local demo only.",
    stats: {
      registrations: store.registrations.length,
      paid: paid.length,
      waitlist: store.waitlist.length,
      promoRedemptions: store.promoRedemptions.length,
      demoRevenueInr: paid.reduce((s, r) => s + r.feePayable, 0),
    },
    promoRedemptions: store.promoRedemptions,
    registrations: store.registrations,
    waitlist: store.waitlist,
  });
}
