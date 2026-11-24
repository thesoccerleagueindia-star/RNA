import { Link } from 'react-router-dom'
import { media, offerings, partners, whatsappLink } from '../data/content'

export function Home() {
  return (
    <>
      <section className="hero" aria-label="Sport in Motion">
        <div className="hero__media">
          <img
            src={media.hero}
            alt="Athletes competing on a football pitch"
            width={1600}
            height={900}
            fetchPriority="high"
          />
        </div>
        <div className="hero__scrim" aria-hidden="true" />
        <div className="hero__content">
          <p className="hero__brand">AISE</p>
          <h1>
            Sport in <em>Motion.</em>
          </h1>
          <p className="hero__support">
            AISET builds the leagues, learning pathways, products and platforms
            that bring sport closer to people.
          </p>
          <div className="cta-row">
            <Link to="/rising-star" className="button">
              Explore RSDL
            </Link>
            <Link to="/contact" className="button button--ghost">
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow eyebrow--light">What we build</p>
            <h2>From participation to platforms.</h2>
            <p>
              We create credible, high-energy sport experiences that begin with
              participation and extend into leagues, learning and technology.
            </p>
          </div>
          <div className="offer-list">
            {offerings.map((item) => (
              <Link key={item.number} to={item.href}>
                <span className="offer-list__num">{item.number}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container split">
          <div className="prose">
            <p className="eyebrow">Official agency</p>
            <h2>
              Rafa Nadal Academy <em>by Movistar</em>
            </h2>
            <p>
              As the official agency in India, AISET helps families, players and
              partners begin conversations around Rafa Nadal Academy by Movistar
              experiences.
            </p>
            <div className="cta-row">
              <Link to="/rafa-nadal-academy" className="button button--dark">
                Discover the partnership
              </Link>
            </div>
          </div>
          <div className="visual-frame">
            <img
              src={media.tennis}
              alt="Tennis training at academy level"
              width={1600}
              height={900}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container split split--reverse">
          <div className="visual-frame">
            <img
              src={media.rsdlLogo}
              alt="Rising Star Development League crest"
              width={640}
              height={640}
              loading="lazy"
              style={{ objectFit: 'contain', padding: '2rem', background: '#0a0a0a' }}
            />
          </div>
          <div className="prose">
            <p className="eyebrow eyebrow--light">League property</p>
            <h2>
              Rising Star <em>Development League</em>
            </h2>
            <p>
              A city-led football platform where players can register, compete
              and build a verified match story — individually, city by city.
            </p>
            <div className="cta-row">
              <Link to="/rising-star" className="button">
                View RSDL cities
              </Link>
              <a
                className="button button--ghost"
                href={whatsappLink('/rising-star')}
                target="_blank"
                rel="noreferrer"
              >
                Ask about registration
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--band">
        <div className="container">
          <p className="quote">
            “The score is only one part of the story. The real win is a
            generation that chooses to keep playing.”
          </p>
          <div className="cta-row">
            <Link to="/programmes" className="button button--dark">
              Explore AISET programmes
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow eyebrow--light">AISET Global Partners</p>
            <h2>Built with organisations that move sport forward.</h2>
            <p>
              AISET is proud to work with organisations spanning sport,
              education, technology, player pathways and international
              opportunity.
            </p>
          </div>
        </div>
        <div className="partner-marquee" aria-hidden="true">
          <div className="partner-track">
            {[...partners, ...partners].map((name, i) => (
              <span key={`${name}-${i}`}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container split">
          <div className="prose">
            <p className="eyebrow">Next conversation</p>
            <h2>Build the next chapter.</h2>
            <p>
              Whether you are exploring a sports programme, league, academy
              pathway, product or partnership, our team is ready to begin.
            </p>
            <div className="cta-row">
              <Link to="/contact" className="button button--dark">
                Contact AISET
              </Link>
              <a
                className="button"
                href={whatsappLink('/contact')}
                target="_blank"
                rel="noreferrer"
                style={{ background: '#1fad4d', color: '#fff' }}
              >
                WhatsApp
              </a>
            </div>
          </div>
          <div className="visual-frame">
            <img
              src={media.exposure}
              alt="Athletes and coaches in a high-energy sport setting"
              width={1600}
              height={1067}
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  )
}
