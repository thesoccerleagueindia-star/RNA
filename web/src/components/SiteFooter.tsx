import Link from "next/link";
import Image from "next/image";
import { eventConfig } from "@/lib/config";

export function SiteFooter() {
  const c = eventConfig.contact;
  return (
    <footer className="bg-[var(--navy)] px-4 py-10 text-sm text-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 items-center bg-white px-2">
              <Image src="/assets/logos/atletas-india-logo.jpg" alt="" width={100} height={28} className="h-6 w-auto" />
            </span>
            <span className="flex h-9 items-center bg-black px-2">
              <Image src="/assets/logos/rafa-nadal-academy-white.png" alt="" width={100} height={28} className="h-6 w-auto" />
            </span>
          </div>
          <p className="font-display text-white">{eventConfig.title}</p>
          <p className="mt-2">
            Organised by <span className="text-[var(--gold-soft)]">{eventConfig.organiserLegalName}</span>
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Contact Us</p>
          <p><a href={`tel:${c.phone}`}>{c.phoneDisplay}</a></p>
          <p><a href={`mailto:${c.email}`}>{c.email}</a></p>
          <p><a href={c.webUrl} rel="noopener noreferrer">{c.web}</a></p>
        </div>
        <div>
          <p className="font-semibold text-white">Legal</p>
          <p><Link href="/privacy-policy">Privacy Policy</Link></p>
          <p><Link href="/refund-policy">Refund Policy (No Refunds)</Link></p>
          <p><Link href="/cookie-policy">Cookie Policy</Link></p>
          <p><Link href="/terms">Terms &amp; Conditions</Link></p>
          <p className="mt-2"><Link href="/admin">Admin</Link></p>
        </div>
      </div>
    </footer>
  );
}
