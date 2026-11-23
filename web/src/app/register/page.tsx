"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { eventConfig, formatInr } from "@/lib/config";

type Draft = {
  id: string;
  feePayable: number;
  discount: number;
  playerName: string;
  city: string;
  interest: string;
};

export default function RegisterPage() {
  const params = useSearchParams();
  const [status, setStatus] = useState("");
  const [promoMsg, setPromoMsg] = useState("");
  const [feePreview, setFeePreview] = useState({ base: eventConfig.feeInr, discount: 0, payable: eventConfig.feeInr });
  const [draft, setDraft] = useState<Draft | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const initialCity = params.get("city") || "";
  const initialInterest = params.get("interest") || "Clinic";

  const demoCodes = useMemo(() => eventConfig.promoCodes.map((p) => p.code).join(" · "), []);

  async function validatePromo(code: string) {
    const res = await fetch("/api/promo/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok) {
      setPromoMsg(data.message || "Invalid code");
      setFeePreview({ base: eventConfig.feeInr, discount: 0, payable: eventConfig.feeInr });
      return null;
    }
    setPromoMsg(data.label);
    setFeePreview({ base: data.feeBase, discount: data.discount, payable: data.feePayable });
    return data;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("");
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    const res = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Could not create registration");
      return;
    }
    setDraft({
      id: data.registration.id,
      feePayable: data.registration.feePayable,
      discount: data.registration.discount,
      playerName: data.registration.playerName,
      city: data.registration.city,
      interest: data.registration.interest,
    });
  }

  async function demoPay() {
    if (!draft) return;
    const orderRes = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationId: draft.id }),
    });
    const order = await orderRes.json();
    const verify = await fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationId: draft.id, provider: "demo", paymentId: order.orderId }),
    });
    const result = await verify.json();
    if (!verify.ok) {
      setStatus(result.error || "Payment failed");
      return;
    }
    setDone(result.registration.id);
  }

  return (
    <>
      <div className="bg-[#5c1a24] px-3 py-2 text-center text-sm text-[#ffe8ec]">
        Form → server fee calc → payment. Demo pay does not charge a card.
      </div>
      <SiteHeader />
      <section className="bg-[var(--navy)] px-4 py-10 text-white">
        <div className="mx-auto max-w-xl">
          <p className="font-display text-xs uppercase tracking-[0.16em] text-[var(--gold)]">Registration</p>
          <h1 className="font-display mt-2 text-3xl">Register · {formatInr(eventConfig.feeInr)}</h1>
        </div>
      </section>
      <section className="bg-[var(--mist)] px-4 py-10">
        <div className="mx-auto max-w-xl">
          {done ? (
            <div className="border-t-[3px] border-[var(--gold)] bg-white p-6">
              <h2 className="font-display text-2xl">Confirmed (demo)</h2>
              <p className="mt-2">Reference <strong>{done}</strong></p>
              <Link href="/" className="mt-4 inline-flex bg-[var(--gold)] px-4 py-2 font-semibold text-[var(--navy)]">Back home</Link>
            </div>
          ) : !draft ? (
            <form onSubmit={onSubmit} className="border-t-[3px] border-[var(--gold)] bg-white p-6 shadow-sm">
              <label className="mb-3 block text-sm font-medium">Player full name *
                <input name="playerName" required className="mt-1 w-full border border-black/15 px-3 py-2" />
              </label>
              <div className="mb-3 grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-medium">City *
                  <select name="city" required defaultValue={initialCity} className="mt-1 w-full border border-black/15 px-3 py-2">
                    <option value="">Select</option>
                    {eventConfig.cities.map((c) => <option key={c.id}>{c.name}</option>)}
                  </select>
                </label>
                <label className="block text-sm font-medium">Age *
                  <input name="age" type="number" min={5} max={25} required className="mt-1 w-full border border-black/15 px-3 py-2" />
                </label>
              </div>
              <div className="mb-3 grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-medium">Category *
                  <select name="category" required className="mt-1 w-full border border-black/15 px-3 py-2">
                    <option value="">Select</option>
                    <option>Juniors</option>
                    <option>Mid-level</option>
                    <option>High Performance / Elite</option>
                  </select>
                </label>
                <label className="block text-sm font-medium">Interested in *
                  <select name="interest" required defaultValue={initialInterest} className="mt-1 w-full border border-black/15 px-3 py-2">
                    <option>Clinic</option>
                    <option>Camp</option>
                  </select>
                </label>
              </div>
              <label className="mb-3 block text-sm font-medium">Parent / guardian name *
                <input name="guardianName" required className="mt-1 w-full border border-black/15 px-3 py-2" />
              </label>
              <div className="mb-3 grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-medium">Guardian contact *
                  <input name="guardianContact" required className="mt-1 w-full border border-black/15 px-3 py-2" placeholder="+91 …" />
                </label>
                <label className="block text-sm font-medium">Player contact (optional)
                  <input name="playerContact" className="mt-1 w-full border border-black/15 px-3 py-2" />
                </label>
              </div>
              <label className="mb-1 block text-sm font-medium">Promo code
                <div className="mt-1 flex gap-2">
                  <input name="promoCode" id="promoCode" className="w-full border border-black/15 px-3 py-2" placeholder="INAUGURAL10" />
                  <button type="button" className="bg-[var(--navy)] px-3 text-white" onClick={() => {
                    const el = document.querySelector<HTMLInputElement>("#promoCode");
                    if (el) void validatePromo(el.value);
                  }}>Apply</button>
                </div>
              </label>
              <p className="mb-3 text-xs text-black/55">Demo codes: {demoCodes}. {promoMsg}</p>
              <div className="mb-4 border-l-[3px] border-[var(--gold)] bg-[var(--mist)] p-3 text-sm">
                <div>Base: {formatInr(feePreview.base)}</div>
                <div>Discount: {feePreview.discount ? `−${formatInr(feePreview.discount)}` : "—"}</div>
                <div className="text-lg font-bold">Payable: {formatInr(feePreview.payable)}</div>
              </div>
              <label className="mb-2 flex gap-2 text-sm"><input type="checkbox" required name="consent" /> Guardian consent *</label>
              <label className="mb-4 flex gap-2 text-sm"><input type="checkbox" required name="privacy" /> Privacy acknowledgement *</label>
              <button type="submit" className="w-full bg-[var(--gold)] py-3 font-semibold text-[var(--navy)]">Continue to payment</button>
              {status && <p className="mt-2 font-semibold text-red-700">{status}</p>}
            </form>
          ) : (
            <div className="border-t-[3px] border-[var(--gold)] bg-white p-6">
              <h2 className="font-display text-2xl">Payment</h2>
              <p className="mt-2 text-black/70">{draft.playerName} · {draft.city} · {draft.interest}</p>
              <p>Reference <strong>{draft.id}</strong></p>
              <p className="mt-2 text-xl font-bold">{formatInr(draft.feePayable)}</p>
              {draft.discount > 0 && <p className="text-sm">Discount applied: {formatInr(draft.discount)}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => void demoPay()} className="bg-[var(--gold)] px-4 py-2 font-semibold text-[var(--navy)]">Demo Pay (no charge)</button>
                <button type="button" onClick={() => setStatus("Live Razorpay: set PAYMENT_MODE=live + RAZORPAY_KEY_ID/SECRET, then use create-order + Checkout.js.")} className="bg-[var(--navy)] px-4 py-2 font-semibold text-white">Razorpay live hook</button>
              </div>
              {status && <p className="mt-2 text-sm font-semibold text-red-700">{status}</p>}
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
