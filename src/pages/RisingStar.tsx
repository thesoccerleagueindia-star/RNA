import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { media, rsdlCities, whatsappLink } from '../data/content'

export function RisingStar() {
  return (
    <>
      <PageHero
        eyebrow="AISET league property"
        title={
          <>
            Rising Star <em>Development League.</em>
          </>
        }
        support="A city-led football platform where players can register, compete and build a verified match story."
        image={media.development}
      />

      <section className="section section--ink">
        <div className="container split">
          <div className="prose">
            <img
              className="rsdl-mark"
              src={media.rsdlLogo}
              alt="Rising Star Development League logo"
              width={220}
              height={220}
            />
            <p className="eyebrow eyebrow--light">RSDL</p>
            <h2>Built for discovery and match experience.</h2>
            <p>
              Players can register individually by selecting their city, even
              without an existing team. Each match contributes to a player
              report card designed to make performance and participation more
              visible.
            </p>
            <p>
              Local league moments make the competition feel connected to the
              communities where players train and grow.
            </p>
          </div>
          <div className="visual-frame">
            <img
              src={media.hero}
              alt="Footballers competing in a city league match"
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
            <p className="eyebrow">2026 city information</p>
            <h2>Cities where RSDL opens the door.</h2>
            <p>
              Details below are transcribed from AISET-approved league
              materials. Please contact AISET for the latest availability and
              format information.
            </p>
          </div>
          <div className="city-grid">
            {rsdlCities.map((city) => (
              <a
                key={city.city}
                className="city-link"
                href={whatsappLink('/rising-star')}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={city.image}
                  alt={`${city.city} Rising Star Development League registration`}
                  width={540}
                  height={675}
                  loading="lazy"
                />
                <div>
                  <h3>{city.city}</h3>
                  <p>{city.dates}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--band">
        <div className="container split">
          <div>
            <h2>Individual registration</h2>
            <p style={{ marginTop: '0.85rem', maxWidth: '34rem' }}>
              Choose your city, register your interest and let the league guide
              the next step. Players do not need an existing team to begin.
            </p>
          </div>
          <div className="cta-row">
            <a
              className="button button--dark"
              href={whatsappLink('/rising-star')}
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
