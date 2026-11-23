import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(4,27,53,0.94)] text-white backdrop-blur">
      <div className="mx-auto flex min-h-[4.5rem] max-w-6xl items-center gap-3 px-4 py-2">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 items-center bg-white px-2">
            <Image src="/assets/logos/atletas-india-orange.jpg" alt="Atletas India" width={110} height={32} className="h-7 w-auto" />
          </span>
          <span className="text-[var(--gold)]">×</span>
          <span className="flex h-9 items-center bg-black px-2">
            <Image src="/assets/logos/rafa-nadal-academy-white.png" alt="Rafa Nadal Academy" width={120} height={32} className="h-7 w-auto" />
          </span>
        </Link>
        <nav className="ml-auto hidden gap-4 text-sm font-medium md:flex">
          <Link href="/#cities" className="opacity-85 hover:text-[var(--gold-soft)]">Cities</Link>
          <Link href="/register" className="opacity-85 hover:text-[var(--gold-soft)]">Register</Link>
          <Link href="/waitlist" className="opacity-85 hover:text-[var(--gold-soft)]">Waitlist</Link>
          <Link href="/faqs" className="opacity-85 hover:text-[var(--gold-soft)]">FAQ</Link>
        </nav>
        <Link href="/register" className="ml-2 inline-flex min-h-10 items-center bg-[var(--gold)] px-4 text-sm font-semibold text-[var(--navy)]">
          Register
        </Link>
      </div>
    </header>
  );
}
