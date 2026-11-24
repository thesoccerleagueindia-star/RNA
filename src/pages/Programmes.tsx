import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { media, whatsappLink } from '../data/content'

export function Programmes() {
  return (
    <>
      <PageHero
        eyebrow="In-school + after-school"
        title={
          <>
            Sport belongs in a child’s week — not as an extra, but as a{' '}
            <em>foundation.</em>
          </>
        }
        support="Structured sports experiences designed with schools and families who want children to keep discovering what play can become."
        image={media.programmes}
      />

      <section className="section section--paper">
        <div className="container prose">
          <p className="eyebrow">Programme design</p>
          <h2>Physical literacy first.</h2>
          <p>
            AISET supports programme design that starts with physical literacy,
            develops confidence through sport and gives each school the
            flexibility to shape delivery around its community. Specific age
            bands, sports and schedules are agreed with each partner school.
          </p>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow eyebrow--light">What grows</p>
            <h2>Movement into mindset.</h2>
          </div>
          <div className="feature-grid">
            <article className="feature-item">
              <h3>Physical literacy</h3>
              <p>
                Movement, balance, coordination and confidence form the early
                building blocks of a positive sporting relationship.
              </p>
            </article>
            <article className="feature-item">
              <h3>Sport progression</h3>
              <p>
                Progression pathways help participants translate foundational
                movement into sport-specific learning and enjoyment.
              </p>
            </article>
            <article className="feature-item">
              <h3>Character through play</h3>
              <p>
                Teamwork, resilience, respect and self-belief are developed
                through practical, engaging experiences.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">How we begin</p>
            <h2>Start with your context.</h2>
          </div>
          <div className="steps">
            <article>
              <h3>Tell us about your school</h3>
              <p>
                Share your students, facilities, sport ambitions and preferred
                delivery model.
              </p>
            </article>
            <article>
              <h3>Shape the experience</h3>
              <p>
                AISET helps map a sports experience around the priorities of
                your community.
              </p>
            </article>
            <article>
              <h3>Deliver and review</h3>
              <p>
                Work with our team to prepare, deliver and review a sustainable
                programme.
              </p>
            </article>
          </div>
          <div className="cta-row">
            <a
              className="button button--dark"
              href={whatsappLink('/programmes')}
              target="_blank"
              rel="noreferrer"
            >
              Discuss a programme
            </a>
            <Link to="/contact" className="button">
              Contact form
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
