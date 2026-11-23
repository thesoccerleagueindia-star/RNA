import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-[var(--navy)] px-4 py-10 text-white"><div className="mx-auto max-w-2xl"><h1 className="font-display text-3xl">Terms &amp; Conditions</h1><p className="mt-2 text-white/80">Approved copy — TBA</p></div></section>
      <section className="mx-auto max-w-2xl px-4 py-10 text-sm"><p>Placeholder for eligibility, consent, liability and schedule terms.</p></section>
      <SiteFooter />
    </>
  );
}
