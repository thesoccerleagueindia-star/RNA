import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { eventConfig, formatInr, paymentMode } from "@/lib/config";

export default function HomePage() {
  const mode = paymentMode();
  return (
    <>
      <div className="bg-[#5c1a24] px-3 py-2 text-center text-sm text-[#ffe8ec]">
        <strong className="text-white">Payment: {mode.toUpperCase()}</strong>
        {mode === "demo" ? " — no live charges until Razorpay env secrets are set." : " — live Razorpay mode."}
      </div>
      <SiteHeader />
      <main>
        <section className="relative flex min-h-[88vh] items-end overflow-hidden text-white">
          <Image
            src="/assets/images/d8d01ff2-4a4c-41dd-86ce-82e393327009.jpg"
            alt=""
            fill
            priority
            className="object-cover object-[60%_25%] brightness-90 saturate-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(4,27,53,0.96)] via-[rgba(4,27,53,0.8)] to-[rgba(4,27,53,0.5)]" />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-24">
            <p className="font-display text-xs uppercase tracking-[0.16em] text-[var(--gold)]">Five-city India Tour · 2027</p>
            <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl">
              RAFA NADAL ACADEMY
              <span className="mt-1 block text-[var(--gold)]">CLINIC INDIA TOUR 2027</span>
            </h1>
            <p className="mt-4 text-lg text-[var(--gold-soft)]">{eventConfig.tagline}</p>
            <p className="mt-3 max-w-xl text-white/90">
              Organised by {eventConfig.organiserLegalName}. Clinic registration {formatInr(eventConfig.feeInr)}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/#cities" className="inline-flex min-h-11 items-center bg-[var(--gold)] px-5 font-semibold text-[var(--navy)]">Explore Cities</Link>
              <Link href="/register" className="inline-flex min-h-11 items-center border border-white/50 px-5 font-semibold">Register · {formatInr(eventConfig.feeInr)}</Link>
            </div>
          </div>
        </section>

        <section id="cities" className="bg-[var(--mist)] px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <p className="font-display text-xs uppercase tracking-[0.16em] text-[var(--gold)]">City editions</p>
            <h2 className="font-display mt-2 text-3xl">Five cities · provisional 300 slots each</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {eventConfig.cities.map((city) => {
                const open = city.status === "registration_open";
                return (
                  <article key={city.id} className={`border-l-[3px] bg-white p-5 shadow-sm ${open ? "border-[var(--gold)]" : "border-[var(--red)]"}`}>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg">{city.name}</h3>
                      <span className={`text-xs font-bold uppercase tracking-wide ${open ? "text-[var(--gold)]" : "text-[var(--red)]"}`}>
                        {open ? "Registration Open" : "Waitlist"}
                      </span>
                    </div>
                    <p className="mt-2 text-lg font-semibold">{city.datesLabel}</p>
                    <p className="text-sm text-black/60">Venue: {city.venue}</p>
                    {city.days.length > 0 && (
                      <ul className="mt-3 space-y-1 text-sm">
                        {city.days.map((d) => (
                          <li key={d.date}><strong>{d.label}</strong> — {d.category}</li>
                        ))}
                      </ul>
                    )}
                    {open && <p className="mt-3 font-bold">{formatInr(eventConfig.feeInr)}</p>}
                    <Link
                      href={open ? `/register?city=${encodeURIComponent(city.name)}` : `/waitlist?city=${encodeURIComponent(city.name)}`}
                      className={`mt-4 inline-flex min-h-10 w-full items-center justify-center px-4 font-semibold ${open ? "bg-[var(--gold)] text-[var(--navy)]" : "bg-[var(--navy)] text-white"}`}
                    >
                      {open ? "Register" : `Join ${city.name} Waitlist`}
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[var(--navy)] px-4 py-16 text-center text-white">
          <p className="font-display text-xs uppercase tracking-[0.16em] text-[var(--gold)]">Next step</p>
          <h2 className="font-display mt-2 text-3xl">Your Game. Your Journey. Your Opportunity.</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="inline-flex min-h-11 items-center bg-[var(--gold)] px-5 font-semibold text-[var(--navy)]">Register · {formatInr(eventConfig.feeInr)}</Link>
            <Link href="/waitlist" className="inline-flex min-h-11 items-center border border-white/40 px-5 font-semibold">Waitlist</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
