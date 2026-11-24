import { Link } from 'react-router-dom'
import {
  media,
  rsdlCities,
  rsdlYouthGallery,
  whatsappLink,
} from '../data/content'

export function RisingStar() {
  const wa = whatsappLink('/rising-star')

  return (
    <>
      <section className="rsdl-hero" aria-label="Rising Star Development League">
        <div className="rsdl-hero__media">
          <img
            src={media.rsdlHero}
            alt="Footballers competing in a premium league match"
            width={1800}
            height={1012}
            fetchPriority="high"
          />
        </div>
        <div className="rsdl-hero__scrim" aria-hidden="true" />
        <div className="rsdl-hero__content container">
          <img
            className="rsdl-hero__crest"
            src={media.rsdlLogo}
            alt="Rising Star Development League crest"
            width={140}
            height={140}
          />
          <p className="eyebrow eyebrow--light">AISET league property</p>
          <h1>
            Rising Star <em>Development League.</em>
          </h1>
          <p className="rsdl-hero__support">
            A city-led football platform where players can register, compete and
            build a verified match story — one city at a time.
          </p>
          <div className="cta-row">
            <a className="button" href={wa} target="_blank" rel="noreferrer">
              WhatsApp RSDL
            </a>
            <a className="button button--ghost" href="#cities">
              View cities
            </a>
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container split">
          <div className="prose">
            <p className="eyebrow eyebrow--light">The league difference</p>
            <h2>
              Built for more than the <em>final score.</em>
            </h2>
            <p>
              Players can register individually by selecting their city, even
              without an existing team. Each match contributes to a player
              report card designed to make performance and participation more
              visible.
            </p>
            <p>
              Local league moments keep the competition connected to the
              communities where players train and grow.
            </p>
          </div>
          <div className="feature-grid rsdl-pillars">
            <article className="feature-item">
              <h3>Individual entry</h3>
              <p>Join by city — no existing team required to begin.</p>
            </article>
            <article className="feature-item">
              <h3>Match story</h3>
              <p>Every fixture feeds a clearer player report card.</p>
            </article>
            <article className="feature-item">
              <h3>City-led play</h3>
              <p>Competition rooted in local training communities.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">On the pitch</p>
            <h2>
              Youth football in <em>motion.</em>
            </h2>
            <p>
              RSDL is built around real match moments — students and young
              players discovering confidence through the game.
            </p>
          </div>
          <div className="rsdl-gallery">
            {rsdlYouthGallery.map((shot) => (
              <figure key={shot.src} className="rsdl-gallery__item">
                <img
                  src={shot.src}
                  alt={shot.alt}
                  width={1600}
                  height={900}
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ink" id="cities">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow eyebrow--light">City network</p>
            <h2>
              RSDL is coming <em>soon.</em>
            </h2>
            <p>
              Landmark cities across India where Rising Star Development League
              is preparing to open play. Register your interest on WhatsApp.
            </p>
          </div>
          <div className="rsdl-city-grid">
            {rsdlCities.map((city) => (
              <a
                key={city.city}
                className="rsdl-city-card"
                href={wa}
                target="_blank"
                rel="noreferrer"
              >
                <div className="rsdl-city-card__media">
                  <img
                    src={city.image}
                    alt={`${city.city} — ${city.landmark}`}
                    width={900}
                    height={675}
                    loading="lazy"
                  />
                </div>
                <div className="rsdl-city-card__body">
                  <p className="rsdl-city-card__status">{city.status}</p>
                  <h3>{city.city}</h3>
                  <p>{city.landmark}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--band">
        <div className="container split">
          <div>
            <h2>Find your city. Join the league.</h2>
            <p style={{ marginTop: '0.85rem', maxWidth: '36rem' }}>
              Tell us your city, age group and football goals. The RSDL team
              will guide the next step on WhatsApp.
            </p>
          </div>
          <div className="cta-row">
            <a
              className="button button--dark"
              href={wa}
              target="_blank"
              rel="noreferrer"
            >
              Ask about registration
            </a>
            <Link to="/contact" className="button">
              Contact AISET
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
