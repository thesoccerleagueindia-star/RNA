import { Link } from 'react-router-dom'
import { media, offerings, partners, whatsappLink } from '../data/content'

export function Home() {
  return (
    <>
      <section
        className="hero hero--home hero--bleed"
        aria-label="Sport has the power to move us"
      >
        <div className="hero__media">
          <img
            src={media.hero}
            alt="Epic night stadium from above — lit pitch, floodlight beams and orange horizon glow"
            width={1920}
            height={1080}
            fetchPriority="high"
          />
        </div>
        <div className="hero__veil" aria-hidden="true" />
        <div className="hero__content">
          <p className="hero__brand">AISE</p>
          <h1>
            Sport has the power
            <br />
            to <em>move</em> us.
          </h1>
          <p className="hero__support">
            AISET builds the leagues, learning pathways, products and platforms
            that bring sport closer to people.
          </p>
          <div className="cta-row">
            <Link to="/contact" className="button">
              Start a conversation
            </Link>
            <Link to="/programmes" className="button button--ghost">
              Explore programmes
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--ink" id="intro">
        <div className="container split">
          <div className="prose">
            <p className="eyebrow eyebrow--light">01 / Our purpose</p>
            <h2>
              Credible sport experiences that turn into <em>opportunity.</em>
            </h2>
            <p>
              From leagues and sports IP to school programmes, international
              exposure and technology, AISET brings a multi-disciplinary team
              together to plan, operate and deliver sport at scale.
            </p>
            <div className="cta-row">
              <Link to="/about" className="button button--ghost">
                Meet AISET
              </Link>
            </div>
          </div>
          <div className="visual-frame visual-frame--sharp">
            <img
              src={media.development}
              alt="Athletes training under floodlights"
              width={1600}
              height={900}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">What we build</p>
            <h2>
              One organisation. <em>Many ways to play.</em>
            </h2>
            <p>
              We create credible, high-energy sport experiences that begin with
              participation and extend into leagues, learning and technology.
            </p>
          </div>
          <div className="offer-list offer-list--paper">
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

      <section className="section section--ink feature-band">
        <div className="feature-band__media" aria-hidden="true">
          <img
            src={media.tennis}
            alt=""
            width={1600}
            height={900}
            loading="lazy"
          />
        </div>
        <div className="feature-band__scrim" aria-hidden="true" />
        <div className="container feature-band__content">
          <p className="eyebrow eyebrow--light">A global pathway</p>
          <h2>
            Rafa Nadal Academy <em>by Movistar.</em>
          </h2>
          <p>
            As the official agency in India, AISET helps families, players and
            partners begin conversations around Rafa Nadal Academy by Movistar
            experiences.
          </p>
          <div className="cta-row">
            <Link to="/rafa-nadal-academy" className="button">
              Discover the partnership
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container split split--reverse">
          <div className="visual-frame visual-frame--sharp">
            <img
              src={media.development}
              alt="City-led football competition in action"
              width={1600}
              height={900}
              loading="lazy"
            />
          </div>
          <div className="prose">
            <p className="eyebrow">League property</p>
            <h2>
              Rising Star <em>Development League</em>
            </h2>
            <p>
              A city-led football platform where players can register, compete
              and build a verified match story — individually, city by city.
            </p>
            <div className="cta-row">
              <Link to="/rising-star" className="button button--dark">
                View RSDL cities
              </Link>
              <a
                className="button"
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
            <p className="eyebrow eyebrow--light">Global partners</p>
            <h2>
              Building sport <em>together.</em>
            </h2>
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
            <p className="eyebrow">Build the next chapter</p>
            <h2>
              Ready to put <em>sport in motion?</em>
            </h2>
            <p>
              Whether you are exploring a sports programme, league, academy
              pathway, product or partnership, our team is ready to begin.
            </p>
            <div className="cta-row">
              <Link to="/contact" className="button button--dark">
                Make an enquiry
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
          <div className="visual-frame visual-frame--sharp">
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
