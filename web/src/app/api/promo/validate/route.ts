import { NextResponse } from "next/server";

/** Discount / promo codes have been removed from this tour. */
export async function POST() {
  return NextResponse.json(
    { ok: false, message: "Discount codes are not available for this registration." },
    { status: 410 }
  );
}
