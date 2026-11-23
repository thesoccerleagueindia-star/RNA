import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WaitlistForm } from "@/components/WaitlistForm";
import { eventConfig, formatInr, paymentMode } from "@/lib/config";

export default function HomePage() {
  const mode = paymentMode();
  return (
    <>
      {mode === "demo" && (
        <div className="bg-[#5c1a24] px-3 py-2 text-center text-sm text-[#ffe8ec]">
          Demo payment mode — Register Now opens a separate window. No live card charges until Razorpay is configured.
        </div>
      )}
      <SiteHeader />
      <main>
        <section className="relative flex min-h-[90vh] items-end overflow-hidden text-white">
          <Image
            src="/assets/images/d8d01ff2-4a4c-41dd-86ce-82e393327009.jpg"
            alt=""
            fill
            priority
            className="object-cover object-[60%_25%] brightness-90 saturate-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(4,27,53,0.96)] via-[rgba(4,27,53,0.82)] to-[rgba(4,27,53,0.45)]" />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-24">
            <p className="font-display text-xs uppercase tracking-[0.16em] text-[var(--gold)]">
              Atletas India × Rafa Nadal Academy
            </p>
            <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl">
              RAFA NADAL ACADEMY
              <span className="mt-1 block text-[var(--gold)]">CLINIC INDIA TOUR 2027</span>
            </h1>
            <p className="mt-4 text-lg text-[var(--gold-soft)]">{eventConfig.tagline}</p>
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-white/92">
              This is more than a clinic — it is India’s chance to step onto a court shaped by Rafa Nadal Academy standards.
              Across five cities, players train in a focused 1.5-hour session with coaches travelling from Spain — sharper
              footwork, cleaner technique, and the competitive mindset that wins tight points. Limited slots. Provisional
              300 places per city. Clinic fee {formatInr(eventConfig.feeInr)}. If you are serious about the next level, this
              is where the season begins.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="/register" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center bg-[var(--gold)] px-5 font-semibold text-[var(--navy)]">
                Register Now · {formatInr(eventConfig.feeInr)}
              </a>
              <Link href="#waitlist" className="inline-flex min-h-11 items-center border border-white/50 px-5 font-semibold">
                Join Waitlist
              </Link>
            </div>
          </div>
        </section>

        <section id="cities" className="bg-[var(--mist)] px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <p className="font-display text-xs uppercase tracking-[0.16em] text-[var(--gold)]">City editions</p>
            <h2 className="font-display mt-2 text-3xl">Five cities. Limited slots.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {eventConfig.cities.map((city) => {
                const open = city.status === "registration_open";
                return (
                  <article key={city.id} className={`border-l-[3px] bg-white p-5 shadow-sm ${open ? "border-[var(--gold)]" : "border-[var(--red)]"}`}>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg">{city.name}</h3>
                      <span className={`text-xs font-bold uppercase tracking-wide ${open ? "text-[var(--gold)]" : "text-[var(--red)]"}`}>
                        {open ? "Open" : "Waitlist"}
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
                    {open ? (
                      <a
                        href={`/register?city=${encodeURIComponent(city.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex min-h-10 w-full items-center justify-center bg-[var(--gold)] px-4 font-semibold text-[var(--navy)]"
                      >
                        Register Now · {formatInr(eventConfig.feeInr)}
                      </a>
                    ) : (
                      <Link href="#waitlist" className="mt-4 inline-flex min-h-10 w-full items-center justify-center bg-[var(--navy)] px-4 font-semibold text-white">
                        Join {city.name} Waitlist
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="waitlist" className="px-4 py-16">
          <div className="mx-auto max-w-xl">
            <p className="font-display text-xs uppercase tracking-[0.16em] text-[var(--gold)]">Stay in the loop</p>
            <h2 className="font-display mt-2 text-3xl">Join the waitlist</h2>
            <p className="mt-2 text-black/65">No payment required. We’ll contact you when places or dates open.</p>
            <div className="mt-6">
              <WaitlistForm />
            </div>
            <p className="mt-4 text-sm">
              Ready for Mumbai or Bangalore?{" "}
              <a href="/register" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                Register Now
              </a>{" "}
              opens in a new window with fee and inaugural discount.
            </p>
          </div>
        </section>

        <section id="contact" className="bg-[var(--navy)] px-4 py-16 text-center text-white">
          <p className="font-display text-xs uppercase tracking-[0.16em] text-[var(--gold)]">Contact Us</p>
          <h2 className="font-display mt-2 text-3xl">Talk to the organiser</h2>
          <p className="mt-3 text-white/85">{eventConfig.organiserLegalName}</p>
          <p className="mt-4 text-lg"><a className="text-[var(--gold-soft)]" href={`tel:${eventConfig.contact.phone}`}>{eventConfig.contact.phoneDisplay}</a></p>
          <p><a className="text-[var(--gold-soft)]" href={`mailto:${eventConfig.contact.email}`}>{eventConfig.contact.email}</a></p>
          <p><a className="text-[var(--gold-soft)]" href={eventConfig.contact.webUrl} rel="noopener noreferrer">{eventConfig.contact.web}</a></p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
