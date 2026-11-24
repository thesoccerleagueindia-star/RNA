import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { media, partners } from '../data/content'

export function About() {
  return (
    <>
      <PageHero
        eyebrow="About AISET"
        title={
          <>
            Sport experiences from India to the <em>world.</em>
          </>
        }
        support="Atletas India Sports and Entertainment Technology builds leagues, programmes, pathways and platforms that bring sport closer to people."
        image={media.exposure}
      />

      <section className="section section--paper">
        <div className="container prose">
          <p className="eyebrow">Who we are</p>
          <h2>Multi-disciplinary sport delivery.</h2>
          <p>
            From leagues and sports IP to school programmes, international
            exposure and technology, AISET brings a multi-disciplinary team
            together to plan, operate and deliver sport at scale.
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
            <p className="eyebrow eyebrow--light">How we work</p>
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
            <Link to="/contact" className="button">
              Explore working with us
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Partners</p>
            <h2>Organisations we are proud to work alongside.</h2>
          </div>
          <div className="offer-list" style={{ borderColor: 'rgba(10,10,10,0.12)' }}>
            {partners.map((name, i) => (
              <div
                key={name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '1rem',
                  padding: '0.9rem 0',
                  borderBottom: '1px solid rgba(10,10,10,0.12)',
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
