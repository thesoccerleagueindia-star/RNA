import type { ReactNode } from 'react'

type PageHeroProps = {
  eyebrow: string
  title: ReactNode
  support: string
  image: string
  className?: string
}

export function PageHero({
  eyebrow,
  title,
  support,
  image,
  className = '',
}: PageHeroProps) {
  return (
    <section
      className={`page-hero ${className}`.trim()}
      style={{ backgroundImage: `url(${image})` }}
      aria-label={eyebrow}
    >
      <div className="container">
        <p className="eyebrow eyebrow--light">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{support}</p>
      </div>
    </section>
  )
}
