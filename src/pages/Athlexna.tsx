import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { media, whatsappLink } from '../data/content'

export function Athlexna() {
  return (
    <>
      <PageHero
        eyebrow="AISET technology"
        title={
          <>
            Sport, <em>connected.</em>
          </>
        }
        support="Athlexna is built for sports organisations that want a more connected development and engagement experience."
        image={media.data}
      />

      <section className="section section--paper">
        <div className="container split">
          <div className="prose">
            <p className="eyebrow">Flagship SaaS</p>
            <h2>From delivery moments to meaningful engagement.</h2>
            <p>
              From delivery moments to meaningful engagement, the right
              information helps organisations turn activity into a stronger next
              conversation.
            </p>
            <p>
              Visit Athlexna to explore its current product offering and talk to
              AISET about the right application for your organisation.
            </p>
            <div className="cta-row">
              <a
                className="button button--dark"
                href="https://www.athlexna.com"
                target="_blank"
                rel="noreferrer"
              >
                Visit Athlexna
              </a>
              <a
                className="button"
                href={whatsappLink('/athlexna')}
                target="_blank"
                rel="noreferrer"
              >
                Talk to AISET
              </a>
            </div>
          </div>
          <div className="visual-frame">
            <img
              src={media.data}
              alt="Sports development data and community engagement"
              width={1600}
              height={1067}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow eyebrow--light">What it supports</p>
            <h2>Organised programme view. Clearer conversations.</h2>
          </div>
          <div className="feature-grid">
            <article className="feature-item">
              <h3>Connected development</h3>
              <p>
                Bring the moving parts of sports development activity into a
                more organised programme view.
              </p>
            </article>
            <article className="feature-item">
              <h3>Participant engagement</h3>
              <p>
                Create a clearer connection between the people who deliver sport
                and the people who experience it.
              </p>
            </article>
            <article className="feature-item">
              <h3>Stronger next steps</h3>
              <p>
                Support stronger conversations around progress, participation
                and opportunity.
              </p>
            </article>
          </div>
          <div className="cta-row">
            <Link to="/contact" className="button button--ghost">
              Contact form
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
