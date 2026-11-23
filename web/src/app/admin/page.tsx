"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { formatInr } from "@/lib/config";

type Summary = {
  mock?: boolean;
  warning?: string | null;
  stats: { registrations: number; paid: number; waitlist: number; promoRedemptions: number; demoRevenueInr: number };
  promoRedemptions: { code: string; registrationId: string; discount: number; feePayable: number; at: string }[];
  registrations: { id: string; playerName: string; city: string; interest: string; feePayable: number; status: string; paymentStatus: string; promoCode?: string | null }[];
};

export default function AdminPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/summary");
      const json = await res.json();
      if (!res.ok) setError(json.error || "Failed");
      else setData(json);
    })();
  }, []);

  return (
    <>
      <div className="bg-[#5c1a24] px-3 py-2 text-center text-sm text-[#ffe8ec]">
        DEMO ADMIN — file-backed mock store. Set ADMIN_PASSWORD to lock the API.
      </div>
      <SiteHeader />
      <section className="bg-[var(--navy)] px-4 py-10 text-white">
        <div className="mx-auto max-w-5xl"><h1 className="font-display text-3xl">Admin</h1></div>
      </section>
      <section className="bg-[var(--mist)] px-4 py-10">
        <div className="mx-auto max-w-5xl">
          {error && <p className="font-semibold text-red-700">{error}</p>}
          {data && (
            <>
              {data.warning && <p className="mb-4 text-sm text-amber-800">{data.warning}</p>}
              <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="border-t-[3px] border-[var(--gold)] bg-white p-4"><strong className="block text-2xl">{data.stats.registrations}</strong>Registrations</div>
                <div className="border-t-[3px] border-[var(--gold)] bg-white p-4"><strong className="block text-2xl">{data.stats.paid}</strong>Paid</div>
                <div className="border-t-[3px] border-[var(--gold)] bg-white p-4"><strong className="block text-2xl">{data.stats.waitlist}</strong>Waitlist</div>
                <div className="border-t-[3px] border-[var(--gold)] bg-white p-4"><strong className="block text-2xl">{formatInr(data.stats.demoRevenueInr)}</strong>Revenue</div>
              </div>
              <h2 className="font-display text-xl">Promo redemptions</h2>
              <div className="mb-8 overflow-auto bg-white">
                <table className="w-full text-left text-sm">
                  <thead><tr className="border-b text-xs uppercase text-black/50"><th className="p-2">Code</th><th className="p-2">Reg</th><th className="p-2">Discount</th><th className="p-2">Payable</th><th className="p-2">When</th></tr></thead>
                  <tbody>
                    {data.promoRedemptions.length === 0 && <tr><td className="p-2" colSpan={5}>None yet</td></tr>}
                    {data.promoRedemptions.map((p) => (
                      <tr key={`${p.registrationId}-${p.at}`} className="border-b"><td className="p-2">{p.code}</td><td className="p-2">{p.registrationId}</td><td className="p-2">{formatInr(p.discount)}</td><td className="p-2">{formatInr(p.feePayable)}</td><td className="p-2">{new Date(p.at).toLocaleString()}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h2 className="font-display text-xl">Registrations</h2>
              <div className="overflow-auto bg-white">
                <table className="w-full text-left text-sm">
                  <thead><tr className="border-b text-xs uppercase text-black/50"><th className="p-2">ID</th><th className="p-2">Player</th><th className="p-2">City</th><th className="p-2">Pathway</th><th className="p-2">Fee</th><th className="p-2">Status</th><th className="p-2">Promo</th></tr></thead>
                  <tbody>
                    {data.registrations.map((r) => (
                      <tr key={r.id} className="border-b"><td className="p-2">{r.id}</td><td className="p-2">{r.playerName}</td><td className="p-2">{r.city}</td><td className="p-2">{r.interest}</td><td className="p-2">{formatInr(r.feePayable)}</td><td className="p-2">{r.status}/{r.paymentStatus}</td><td className="p-2">{r.promoCode || "—"}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
