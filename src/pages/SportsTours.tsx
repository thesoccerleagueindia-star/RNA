import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { media, whatsappLink } from '../data/content'

export function SportsTours() {
  return (
    <>
      <PageHero
        eyebrow="Sport beyond familiar ground"
        title={
          <>
            Travel with <em>purpose.</em>
          </>
        }
        support="AISET creates bespoke sport-led tours for groups that want to learn, compete, connect and see the world differently."
        image={media.tours}
      />

      <section className="section section--paper">
        <div className="container prose">
          <p className="eyebrow">01 / The tour mindset</p>
          <h2>
            Exposure into <em>growth.</em>
          </h2>
          <p>
            A great sports tour is not simply a trip. It is a shared experience
            that turns exposure into growth. Every AISET tour enquiry starts
            with your sporting ambitions, group profile and desired experience.
          </p>
          <p>
            Destinations, duration, match opportunities and inclusions are
            shaped around the brief and confirmed before booking.
          </p>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow eyebrow--light">Designed around your group</p>
            <h2>What every itinerary balances.</h2>
          </div>
          <div className="feature-grid">
            <article className="feature-item">
              <h3>Competition + coaching</h3>
              <p>
                Build a sport-focused itinerary around appropriate training,
                play and learning opportunities.
              </p>
            </article>
            <article className="feature-item">
              <h3>Shared experience</h3>
              <p>
                Bring students, teams and families together through a structured
                shared experience.
              </p>
            </article>
            <article className="feature-item">
              <h3>Place and culture</h3>
              <p>
                Create room for the destination, local context and the moments
                between the sporting highlights.
              </p>
            </article>
          </div>
          <div className="cta-row">
            <a
              className="button"
              href={whatsappLink('/sports-tours')}
              target="_blank"
              rel="noreferrer"
            >
              Discuss a tour
            </a>
            <Link to="/contact" className="button button--ghost">
              Contact AISET
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
