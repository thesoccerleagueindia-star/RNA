import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { eventConfig } from "@/lib/config";

export default function CookiePage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-[var(--navy)] px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl"><h1 className="font-display text-3xl">Cookie Policy</h1></div>
      </section>
      <section className="mx-auto max-w-2xl space-y-4 px-4 py-10 text-sm">
        <p>This site may use cookies and similar storage to keep registration flows working, remember demo confirmations on this device, and measure traffic if analytics are enabled later.</p>
        <p>Essential cookies are required for core flows. Clear site data anytime in your browser. Optional analytics (if added) will show a consent choice.</p>
        <p>Questions: {eventConfig.contact.email} · {eventConfig.contact.phoneDisplay}</p>
      </section>
      <SiteFooter />
    </>
  );
}
