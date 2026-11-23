import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { formatInr, eventConfig } from "@/lib/config";

export default function RefundPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-[var(--navy)] px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-3xl">Refund Policy — No Refunds</h1>
        </div>
      </section>
      <section className="mx-auto max-w-2xl space-y-4 px-4 py-10 text-sm">
        <p>
          Clinic registration fees for the Rafa Nadal Academy Clinic India Tour 2027 (base {formatInr(eventConfig.feeInr)},
          or the discounted amount after a valid promo) are <strong>non-refundable</strong>.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>No refunds for change of mind, scheduling conflicts, illness, travel disruption, or non-attendance.</li>
          <li>No cash refunds for unused discount codes or partial sessions.</li>
          <li>If the organiser cancels a city edition entirely, a transfer or credit may be offered at our discretion — not an automatic cash refund.</li>
          <li>Waitlist interest does not involve payment.</li>
        </ul>
        <p>Contact: {eventConfig.contact.email} · {eventConfig.contact.phoneDisplay}</p>
      </section>
      <SiteFooter />
    </>
  );
}
