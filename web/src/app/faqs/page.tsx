import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { eventConfig, formatInr } from "@/lib/config";

export default function FaqsPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-[var(--navy)] px-4 py-10 text-white"><div className="mx-auto max-w-2xl"><h1 className="font-display text-3xl">FAQs</h1></div></section>
      <section className="mx-auto max-w-2xl space-y-4 px-4 py-10 text-sm">
        <details open>
          <summary className="font-semibold">How much is registration?</summary>
          <p>Clinic fee is {formatInr(eventConfig.feeInr)} {eventConfig.feeNote}. Camp pricing TBA.</p>
        </details>
        <details>
          <summary className="font-semibold">How do I pay?</summary>
          <p>Register Now opens the form, then Pay Now via Razorpay (razorpay.me/@rnaclinicindia2027).</p>
        </details>
        <details>
          <summary className="font-semibold">Who organises the tour?</summary>
          <p>{eventConfig.organiserLegalName}</p>
        </details>
        <details>
          <summary className="font-semibold">Contact</summary>
          <p>{eventConfig.contact.phoneDisplay} · {eventConfig.contact.email} · {eventConfig.contact.web}</p>
        </details>
        <p><Link href="/" className="text-[var(--navy)] underline">← Brochure</Link></p>
      </section>
      <SiteFooter />
    </>
  );
}
