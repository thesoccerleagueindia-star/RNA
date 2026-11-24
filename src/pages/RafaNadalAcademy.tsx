import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { media, whatsappLink } from '../data/content'

const pathways = [
  'Junior camps and development experiences',
  'Adult tennis camps for a range of levels',
  'Annual and semester programmes',
  'Competition and international programme pathways',
]

export function RafaNadalAcademy() {
  return (
    <>
      <PageHero
        eyebrow="AISET × Rafa Nadal Academy by Movistar"
        title={
          <>
            A pathway shaped by <em>method, values and ambition.</em>
          </>
        }
        support="AISET is the official agency of Rafa Nadal Academy by Movistar in India, supporting partnership and programme enquiries across India and Australia."
        image={media.tennis}
        className="page-hero--tennis"
      />

      <section className="section section--paper">
        <div className="container split">
          <div className="prose">
            <p className="eyebrow">Official academy context</p>
            <h2>Begin the right conversation.</h2>
            <p>
              The official academy presents a broad tennis and education
              ecosystem, with camps, longer-term programmes, competition and
              international options. AISET is here to help begin the right
              conversation for your goals.
            </p>
            <p>
              Programme categories are summarized from the official academy
              website. Detailed dates, availability, eligibility and enrolment
              are confirmed directly with the academy.
            </p>
          </div>
          <div className="visual-frame">
            <img
              src={media.tennis}
              alt="Tennis players training on clay courts"
              width={1600}
              height={900}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow eyebrow--light">Programme pathways</p>
            <h2>What families typically explore.</h2>
          </div>
          <div className="offer-list">
            {pathways.map((item, i) => (
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
          <div className="cta-row">
            <a
              className="button"
              href={whatsappLink('/rafa-nadal-academy')}
              target="_blank"
              rel="noreferrer"
            >
              Ask AISET
            </a>
            <a
              className="button button--ghost"
              href="https://www.rafanadalacademy.com/"
              target="_blank"
              rel="noreferrer"
            >
              Visit the official academy
            </a>
            <Link to="/contact" className="button button--ghost">
              Contact form
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
