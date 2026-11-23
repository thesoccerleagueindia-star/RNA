import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { formatInr, eventConfig } from "@/lib/config";

export default function RefundPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-[var(--navy)] px-4 py-10 text-white"><div className="mx-auto max-w-2xl"><h1 className="font-display text-3xl">Refund Policy</h1><p className="mt-2 text-white/80">Approved commercial terms — TBA</p></div></section>
      <section className="mx-auto max-w-2xl px-4 py-10 text-sm"><p>Clinic fee {formatInr(eventConfig.feeInr)}. Publish refund timelines only after approval. Do not enable live payment until terms are live.</p></section>
      <SiteFooter />
    </>
  );
}
