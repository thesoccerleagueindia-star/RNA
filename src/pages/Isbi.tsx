import { Link } from 'react-router-dom'
import { isbiCourses, media, whatsappLink } from '../data/content'

export function Isbi() {
  const wa = whatsappLink('/isbi')

  return (
    <>
      <section className="isbi-hero" aria-label="International Sports Business Institute">
        <div className="isbi-hero__media">
          <img
            src={media.isbiHero}
            alt="Contemporary sports-business learning campus"
            width={1600}
            height={900}
            fetchPriority="high"
          />
        </div>
        <div className="isbi-hero__scrim" aria-hidden="true" />
        <div className="isbi-hero__content container">
          <p className="eyebrow eyebrow--light">ISBI × Atletas One Foundation</p>
          <h1>
            International <em>sports business</em> institute.
          </h1>
          <p className="isbi-hero__support">
            An upcoming learning platform for people ready to enter the business
            of sport with curiosity, perspective and ambition.
          </p>
          <div className="cta-row">
            <a className="button" href={wa} target="_blank" rel="noreferrer">
              WhatsApp ISBI
            </a>
            <a className="button button--ghost" href="#programmes">
              View programmes
            </a>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container split">
          <div className="prose">
            <p className="eyebrow">Learning where business meets the game</p>
            <h2>
              Practical. International. <em>Connected.</em>
            </h2>
            <p>
              International Sports Business Institute is being developed in
              association with Atletas One Foundation to bring practical
              learning, an international outlook and a deeper connection to the
              sports ecosystem into one academic experience.
            </p>
            <p>
              Course, intake, partner and campus details will be announced as
              they are confirmed. For now, ISBI is an invitation to begin the
              right conversation about a career in sport.
            </p>
          </div>
          <div className="visual-frame visual-frame--sharp">
            <img
              src={media.isbiSeminar}
              alt="Students collaborating in a sports-business learning seminar"
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
            <p className="eyebrow eyebrow--light">Built around the ecosystem</p>
            <h2>
              A classroom for sport’s next <em>leaders.</em>
            </h2>
            <p>
              World sport is shaped across teams, leagues, agencies, media,
              data, commerce and communities. ISBI is being designed around this
              wider field, for learners who want to understand how these worlds
              connect.
            </p>
          </div>
          <div className="feature-grid">
            <article className="feature-item">
              <h3>International outlook</h3>
              <p>
                An outward-looking sports-business perspective with planned
                foreign partnership connections.
              </p>
            </article>
            <article className="feature-item">
              <h3>Ecosystem learning</h3>
              <p>
                Learning stays connected to the people, organisations and
                questions shaping the modern sports economy.
              </p>
            </article>
            <article className="feature-item">
              <h3>Career-ready curiosity</h3>
              <p>
                Whether you are beginning or extending your journey, the right
                next step starts with a thoughtful view of where sport can take
                you.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--paper" id="programmes">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Programme portfolio</p>
            <h2>
              Pathways into the business of <em>sport.</em>
            </h2>
            <p>
              ISBI’s proposed offering spans diploma, postgraduate, executive and
              international leadership routes. Detailed curriculum, eligibility
              and delivery information will be shared when available.
            </p>
          </div>
          <div className="isbi-programmes">
            {isbiCourses.map((course) => (
              <article key={course.title} className="isbi-programme">
                <div className="isbi-programme__meta">
                  <span className="isbi-programme__num">{course.number}</span>
                  <span className="isbi-programme__duration">{course.duration}</span>
                </div>
                <h3>{course.title}</h3>
                <p>{course.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container split split--reverse">
          <div className="visual-frame visual-frame--sharp">
            <img
              src={media.isbiInfra}
              alt="Contemporary multi-sport campus and training infrastructure"
              width={1600}
              height={900}
              loading="lazy"
            />
          </div>
          <div className="prose">
            <p className="eyebrow eyebrow--light">A setting to match the ambition</p>
            <h2>
              Immersive sports <em>learning.</em>
            </h2>
            <p>
              ISBI is being shaped around an immersive sports-learning
              environment, where contemporary learning spaces and the energy of
              performance sport can sit side by side.
            </p>
            <p>
              Images on this page are illustrative of the intended learning
              experience. Final campus and facility information will be
              announced.
            </p>
            <div className="cta-row">
              <a className="button" href={wa} target="_blank" rel="noreferrer">
                Request ISBI updates
              </a>
              <Link to="/contact" className="button button--ghost">
                Contact form
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--band">
        <div className="container split">
          <div>
            <h2>Begin your sports management story.</h2>
            <p style={{ marginTop: '0.85rem', maxWidth: '36rem' }}>
              Register your interest to receive future ISBI course, partnership
              and intake updates from AISET.
            </p>
          </div>
          <div className="cta-row">
            <a
              className="button button--dark"
              href={wa}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp ISBI
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
