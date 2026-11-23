"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { eventConfig } from "@/lib/config";

function WaitlistForm() {
  const params = useSearchParams();
  const [msg, setMsg] = useState("");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setMsg(res.ok ? `Saved ${data.entry.id} (no payment).` : data.error || "Failed");
    if (res.ok) e.currentTarget.reset();
  }
  return (
    <form onSubmit={onSubmit} className="border-t-[3px] border-[var(--gold)] bg-white p-6">
      <label className="mb-3 block text-sm font-medium">Player name *<input name="playerName" required className="mt-1 w-full border px-3 py-2" /></label>
      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium">City *
          <select name="city" required defaultValue={params.get("city") || ""} className="mt-1 w-full border px-3 py-2">
            <option value="">Select</option>
            {eventConfig.cities.map((c) => <option key={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium">Interest *
          <select name="interest" className="mt-1 w-full border px-3 py-2"><option>Clinic</option><option>Camp</option></select>
        </label>
      </div>
      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium">Age *<input name="age" type="number" required className="mt-1 w-full border px-3 py-2" /></label>
        <label className="block text-sm font-medium">Email *<input name="email" type="email" required className="mt-1 w-full border px-3 py-2" /></label>
      </div>
      <label className="mb-3 block text-sm font-medium">Phone *<input name="phone" required className="mt-1 w-full border px-3 py-2" /></label>
      <label className="mb-4 flex gap-2 text-sm"><input type="checkbox" required /> Consent to contact *</label>
      <button className="w-full bg-[var(--gold)] py-3 font-semibold text-[var(--navy)]">Join waitlist</button>
      {msg && <p className="mt-2 font-semibold text-emerald-700">{msg}</p>}
    </form>
  );
}

export default function WaitlistPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-[var(--navy)] px-4 py-10 text-white">
        <div className="mx-auto max-w-xl"><h1 className="font-display text-3xl">Join waitlist</h1></div>
      </section>
      <section className="bg-[var(--mist)] px-4 py-10">
        <div className="mx-auto max-w-xl">
          <Suspense fallback={<p>Loading…</p>}><WaitlistForm /></Suspense>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
