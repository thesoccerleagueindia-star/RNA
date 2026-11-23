import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { eventConfig } from "@/lib/config";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-[var(--navy)] px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl"><h1 className="font-display text-3xl">Privacy Policy</h1></div>
      </section>
      <section className="mx-auto max-w-2xl space-y-4 px-4 py-10 text-sm">
        <p><strong>{eventConfig.organiserLegalName}</strong> collects player and guardian details submitted for registration or waitlist interest.</p>
        <p><strong>What we collect:</strong> name, age, city, category, contacts, guardian details, and payment references.</p>
        <p><strong>Why:</strong> process places, communicate updates, and meet legal obligations.</p>
        <p><strong>Sharing:</strong> operational partners and payment processors only as needed — we do not sell personal data.</p>
        <p>Contact: {eventConfig.contact.email} · {eventConfig.contact.phoneDisplay} · {eventConfig.contact.web}</p>
      </section>
      <SiteFooter />
    </>
  );
}
