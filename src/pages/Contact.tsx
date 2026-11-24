import { useState, type FormEvent } from 'react'
import { PageHero } from '../components/PageHero'
import {
  CONTACT_EMAIL,
  WHATSAPP_DISPLAY,
  media,
  whatsappLink,
} from '../data/content'

export function Contact() {
  const [sentHint, setSentHint] = useState(false)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const interest = String(data.get('interest') || '').trim()
    const message = String(data.get('message') || '').trim()

    const subject = encodeURIComponent(`AISET enquiry — ${interest || 'General'}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nInterest: ${interest}\n\n${message}`,
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setSentHint(true)
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let’s start the <em>conversation.</em>
          </>
        }
        support="Whether you are exploring a sports programme, league, academy pathway, product or partnership, our team is ready to begin."
        image={media.development}
      />

      <section className="section section--ink">
        <div className="container contact-layout">
          <div className="contact-details">
            <p className="eyebrow eyebrow--light">Direct channels</p>
            <h2>Reach the AISET team.</h2>
            <p>
              Connect directly with the AISET team on WhatsApp. Share your
              interest, your location and the sport opportunity you would like
              to explore.
            </p>
            <p>
              <strong>Email</strong>
              <br />
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
            <p>
              <strong>WhatsApp</strong>
              <br />
              <a href={whatsappLink('/contact')} target="_blank" rel="noreferrer">
                {WHATSAPP_DISPLAY}
              </a>
            </p>
            <p>
              <strong>Regions</strong>
              <br />
              India · Australia
            </p>
            <p>
              <strong>Available by WhatsApp</strong>
              <br />
              Messages are welcome anytime. Our team typically replies during
              business hours in India Standard Time.
            </p>
            <div className="cta-row">
              <a
                className="button"
                href={whatsappLink('/contact')}
                target="_blank"
                rel="noreferrer"
                style={{ background: '#1fad4d', color: '#fff' }}
              >
                Send a WhatsApp message
              </a>
            </div>
          </div>

          <form className="contact-form" onSubmit={onSubmit} noValidate={false}>
            <p className="eyebrow eyebrow--light">Enquiry form</p>
            <h3>Tell us what you need</h3>
            <label>
              Name
              <input name="name" type="text" autoComplete="name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Interest
              <select name="interest" defaultValue="Rising Star Development League">
                <option>Rising Star Development League</option>
                <option>Rafa Nadal Academy</option>
                <option>Athlexna</option>
                <option>ISBI</option>
                <option>Training programmes</option>
                <option>Sports tours</option>
                <option>Partnership / other</option>
              </select>
            </label>
            <label>
              Message
              <textarea
                name="message"
                required
                placeholder="Share your interest, location and the opportunity you want to explore."
              />
            </label>
            <button type="submit" className="button">
              Open email draft
            </button>
            <p className="form-note">
              This form opens your email client with a draft to {CONTACT_EMAIL}.
              No backend submission is stored on this site.
              {sentHint ? ' If nothing opened, email us directly.' : ''}
            </p>
          </form>
        </div>
      </section>
    </>
  )
}
