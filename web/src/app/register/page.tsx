"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
  const [promoMsg, setPromoMsg] = useState("Inaugural 10% for the first 40 confirmed registrations only.");
  const [feePreview, setFeePreview] = useState({ base: eventConfig.feeInr, discount: 0, payable: eventConfig.feeInr });
  const [draft, setDraft] = useState<Draft | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [promo, setPromo] = useState("");

  const initialCity = params.get("city") || "";

  async function validatePromo(code: string) {
    if (!code.trim()) {
      setPromoMsg("Inaugural 10% for the first 40 confirmed registrations only.");
      setFeePreview({ base: eventConfig.feeInr, discount: 0, payable: eventConfig.feeInr });
      return null;
    }
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
    const left = data.maxRedemptions - data.redemptions;
    setPromoMsg(`${data.label} · ${left} places left`);
    setFeePreview({ base: data.feeBase, discount: data.discount, payable: data.feePayable });
    return data;
  }

  useEffect(() => {
    const t = setTimeout(() => {
      void validatePromo(promo);
    }, 250);
    return () => clearTimeout(t);
  }, [promo]);

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
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(4,27,53,0.94)] text-white backdrop-blur">
        <div className="mx-auto flex min-h-[4.5rem] max-w-xl items-center gap-3 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 items-center bg-white px-2">
              <Image src="/assets/logos/atletas-india-logo.jpg" alt="Atletas India" width={110} height={32} className="h-7 w-auto" />
            </span>
            <span className="text-[var(--gold)]">×</span>
            <span className="flex h-9 items-center bg-black px-2">
              <Image src="/assets/logos/rafa-nadal-academy-white.png" alt="Rafa Nadal Academy" width={110} height={32} className="h-7 w-auto" />
            </span>
          </Link>
          <Link href="/" className="ml-auto text-sm font-semibold text-[var(--gold-soft)]">Brochure</Link>
        </div>
      </header>

      <section className="bg-[var(--navy)] px-4 py-10 text-white">
        <div className="mx-auto max-w-xl">
          <p className="font-display text-xs uppercase tracking-[0.16em] text-[var(--gold)]">Registration</p>
          <h1 className="font-display mt-2 text-3xl">Register for the Clinic</h1>
          <p className="mt-2 text-white/85">Form, inaugural discount, and payable amount update together.</p>
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
                  <select name="interest" required defaultValue="Clinic" className="mt-1 w-full border border-black/15 px-3 py-2">
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
                <label className="block text-sm font-medium">Email *
                  <input name="email" type="email" required className="mt-1 w-full border border-black/15 px-3 py-2" />
                </label>
              </div>
              <label className="mb-1 block text-sm font-medium">Discount code
                <input
                  name="promoCode"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  className="mt-1 w-full border border-black/15 px-3 py-2"
                  placeholder="INAUGURAL10"
                  autoComplete="off"
                />
              </label>
              <p className="mb-3 text-xs text-black/60">{promoMsg}</p>
              <div className="mb-4 border-l-[3px] border-[var(--gold)] bg-[var(--mist)] p-3 text-sm">
                <div>Base: {formatInr(feePreview.base)}</div>
                <div>Discount: {feePreview.discount ? `−${formatInr(feePreview.discount)}` : "—"}</div>
                <div className="text-lg font-bold">
                  Payable:{" "}
                  {feePreview.discount > 0 && (
                    <span className="mr-2 text-base font-normal line-through opacity-55">{formatInr(feePreview.base)}</span>
                  )}
                  {formatInr(feePreview.payable)}
                </div>
              </div>
              <label className="mb-2 flex gap-2 text-sm"><input type="checkbox" required name="consent" /> Guardian consent *</label>
              <label className="mb-4 flex gap-2 text-sm"><input type="checkbox" required name="privacy" /> I agree to Privacy &amp; no-refund policy *</label>
              <button type="submit" className="w-full bg-[var(--gold)] py-3 font-semibold text-[var(--navy)]">
                Continue · {formatInr(feePreview.payable)}
              </button>
              {status && <p className="mt-2 font-semibold text-red-700">{status}</p>}
            </form>
          ) : (
            <div className="border-t-[3px] border-[var(--gold)] bg-white p-6">
              <h2 className="font-display text-2xl">Payment</h2>
              <p className="mt-2 text-black/70">{draft.playerName} · {draft.city} · {draft.interest}</p>
              <p>Reference <strong>{draft.id}</strong></p>
              <p className="mt-2 text-xl font-bold">{formatInr(draft.feePayable)}</p>
              {draft.discount > 0 && <p className="text-sm">Discount applied: {formatInr(draft.discount)}</p>}
              <button type="button" onClick={() => void demoPay()} className="mt-4 bg-[var(--gold)] px-4 py-2 font-semibold text-[var(--navy)]">
                Pay {formatInr(draft.feePayable)} (Demo)
              </button>
              {status && <p className="mt-2 text-sm font-semibold text-red-700">{status}</p>}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
