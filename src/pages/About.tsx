import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { media, partners, teamCredentials } from '../data/content'

export function About() {
  return (
    <>
      <PageHero
        eyebrow="About AISET"
        title={
          <>
            Built by people who believe in <em>sport.</em>
          </>
        }
        support="AISET is a sports management and technology organisation focused on operating, managing and delivering meaningful sport experiences."
        image={media.exposure}
      />

      <section className="section section--paper">
        <div className="container prose">
          <p className="eyebrow">01 / Our mission</p>
          <h2>
            Make sport more accessible, organised and <em>inspiring.</em>
          </h2>
          <p>
            To make sport more accessible, organised and inspiring for every
            community we serve. We work across leagues, sports IP, products,
            training programmes, tours and technology—bringing practical
            operations together with a long-term view of participation and
            potential.
          </p>
          <p>
            Publicly known as AISE, we create credible, high-energy sport
            experiences that begin with participation and extend into lasting
            pathways for players, schools, partners and communities.
          </p>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow eyebrow--light">A multi-disciplinary team</p>
            <h2>
              Different disciplines. <em>One sporting intent.</em>
            </h2>
          </div>
          <div className="offer-list">
            {teamCredentials.map((item, i) => (
              <div
                key={item}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '1rem',
                  padding: '1.1rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <span className="offer-list__num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 style={{ textTransform: 'none', letterSpacing: 0 }}>
                  {item}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">How we work</p>
            <h2>Leagues. Learning. Technology. Tours.</h2>
          </div>
          <div className="feature-grid">
            <article className="feature-item">
              <h3>League properties</h3>
              <p>
                City-led competition formats like Rising Star Development League
                that make discovery and match experience visible.
              </p>
            </article>
            <article className="feature-item">
              <h3>Academy pathways</h3>
              <p>
                Official agency support for Rafa Nadal Academy by Movistar
                conversations across India and Australia.
              </p>
            </article>
            <article className="feature-item">
              <h3>Sport technology</h3>
              <p>
                Athlexna connects development activity into a clearer programme
                and engagement experience.
              </p>
            </article>
          </div>
          <div className="cta-row">
            <Link to="/contact" className="button button--dark">
              Bring your next sporting idea to life
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow eyebrow--light">Partners</p>
            <h2>Organisations we are proud to work alongside.</h2>
          </div>
          <div className="offer-list">
            {partners.map((name, i) => (
              <div
                key={name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '1rem',
                  padding: '0.9rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <span className="offer-list__num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 style={{ textTransform: 'none', letterSpacing: 0 }}>
                  {name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
