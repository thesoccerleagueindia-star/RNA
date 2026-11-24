import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { isbiCourses, media, whatsappLink } from '../data/content'

export function Isbi() {
  return (
    <>
      <PageHero
        eyebrow="ISBI × Atletas One Foundation"
        title={
          <>
            International <em>sports business</em> institute.
          </>
        }
        support="An upcoming learning platform for people ready to enter the business of sport with curiosity, perspective and ambition."
        image={media.isbiHero}
      />

      <section className="section section--paper">
        <div className="container split">
          <div className="prose">
            <p className="eyebrow">Learning where business meets the game</p>
            <h2>Practical. International. Connected.</h2>
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
          <div className="visual-frame">
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
              A classroom for sport’s next <em>operators.</em>
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
                ISBI is being developed with an outward-looking sports-business
                perspective and planned foreign partnership connections.
              </p>
            </article>
            <article className="feature-item">
              <h3>Ecosystem learning</h3>
              <p>
                Learning is intended to stay connected to the people,
                organisations and questions shaping the modern sports economy.
              </p>
            </article>
            <article className="feature-item">
              <h3>Career-ready curiosity</h3>
              <p>
                Whether you are beginning your journey or extending it, the
                right next step starts with a thoughtful view of where sport can
                take you.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Upcoming learning routes</p>
            <h2>Proposed offering.</h2>
            <p>
              ISBI’s proposed offering spans undergraduate, postgraduate,
              diploma and short-course learning routes. Detailed curriculum,
              eligibility and delivery information will be shared when
              available.
            </p>
          </div>
          <div className="course-list">
            {isbiCourses.map((course) => (
              <article key={course.title}>
                <h3>{course.title}</h3>
                <p>{course.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container split split--reverse">
          <div className="visual-frame">
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
            <h2>Immersive sports learning.</h2>
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
              <a
                className="button"
                href={whatsappLink('/isbi')}
                target="_blank"
                rel="noreferrer"
              >
                Request ISBI updates
              </a>
              <Link to="/contact" className="button button--ghost">
                Contact form
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
