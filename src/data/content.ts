export const WHATSAPP_NUMBER = '918013166131'
export const WHATSAPP_DISPLAY = '+91 80131 66131'
export const CONTACT_EMAIL = 'contact@aiseorg.info'
export const SITE_URL = 'https://www.aiseorg.info'

export type NavItem = { label: string; href: string }

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'RSDL', href: '/rising-star' },
  { label: 'Rafa Nadal Academy', href: '/rafa-nadal-academy' },
  { label: 'Athlexna', href: '/athlexna' },
  { label: 'ISBI', href: '/isbi' },
  { label: 'Programmes', href: '/programmes' },
  { label: 'Sports Tours', href: '/sports-tours' },
  { label: 'About', href: '/about' },
]

export const whatsappMessages: Record<string, string> = {
  '/rising-star':
    "Hello AISET, I'd like to ask about Rising Star Development League registration.",
  '/rafa-nadal-academy':
    "Hello AISET, I'd like to ask about Rafa Nadal Academy by Movistar programmes.",
  '/athlexna':
    "Hello AISET, I'd like to discuss Athlexna for my sports organisation.",
  '/isbi':
    "Hello AISET, I'd like to receive updates about International Sports Business Institute courses.",
  '/programmes':
    "Hello AISET, I'd like to discuss an in-school or after-school sports programme.",
  '/sports-tours': "Hello AISET, I'd like to discuss a bespoke sports tour.",
  '/about': "Hello AISET, I'd like to explore working with your team.",
  '/contact': "Hello AISET, I'd like to make an enquiry.",
}

export function whatsappLink(path = '/'): string {
  const text =
    whatsappMessages[path] ?? "Hello AISET, I'd like to make an enquiry."
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

export const offerings = [
  {
    number: '01',
    title: 'Rising Star Development League',
    copy: 'A city-led football platform designed for player discovery, match experience and modern league engagement.',
    href: '/rising-star',
  },
  {
    number: '02',
    title: 'Sports IP',
    copy: 'Original sports concepts built for participation, partnerships and lasting community value.',
    href: '/contact',
  },
  {
    number: '03',
    title: 'Training Programmes',
    copy: 'School, after-school and development experiences that make sport part of everyday learning.',
    href: '/programmes',
  },
  {
    number: '04',
    title: 'Rafa Nadal Academy',
    copy: 'AISET is the official agency of Rafa Nadal Academy by Movistar in India.',
    href: '/rafa-nadal-academy',
  },
  {
    number: '05',
    title: 'Athlexna',
    copy: 'Our flagship sports development and engagement SaaS platform.',
    href: '/athlexna',
  },
  {
    number: '06',
    title: 'Sports Tours',
    copy: 'Bespoke sport-led travel experiences that combine exposure, learning and culture.',
    href: '/sports-tours',
  },
  {
    number: '07',
    title: 'International Sports Business Institute',
    copy: 'An upcoming learning platform, in association with Atletas One Foundation, for people ready to enter the business of sport.',
    href: '/isbi',
  },
]

export const partners = [
  'USF.sport',
  'The Edge in Sports',
  'Panesar Sports Agency',
  'FIFA Agents',
  'NexGen Sports Group',
  'Rafa Nadal Academy',
  'FCV International',
  'Spain Rush SPF',
  'Cricket Scotland',
  'ISSA',
  'EREPS',
  'First Point USA',
  'Thane Football Association',
  'Madhya Pradesh Football Association',
  'All Manipur Football Association',
  'Karnataka State Football Association',
  'Indian Football Association',
  'Daryse',
  'Skouted',
  'Iker Casillas Academy',
]

export const rsdlCities = [
  {
    city: 'Mumbai',
    landmark: 'Gateway of India',
    status: 'RSDL is coming soon',
    image: '/media/rsdl-city-mumbai.jpg',
  },
  {
    city: 'Thane',
    landmark: 'Lakeside cityscape',
    status: 'RSDL is coming soon',
    image: '/media/rsdl-city-thane.jpg',
  },
  {
    city: 'Bangalore',
    landmark: 'Vidhana Soudha',
    status: 'RSDL is coming soon',
    image: '/media/rsdl-city-bangalore.jpg',
  },
  {
    city: 'Kolkata',
    landmark: 'Howrah Bridge',
    status: 'RSDL is coming soon',
    image: '/media/rsdl-city-kolkata.jpg',
  },
  {
    city: 'Goa',
    landmark: 'Coastline',
    status: 'RSDL is coming soon',
    image: '/media/rsdl-city-goa.jpg',
  },
  {
    city: 'Chennai',
    landmark: 'Marina Beach',
    status: 'RSDL is coming soon',
    image: '/media/rsdl-city-chennai.jpg',
  },
  {
    city: 'Hyderabad',
    landmark: 'Charminar',
    status: 'RSDL is coming soon',
    image: '/media/rsdl-city-hyderabad.jpg',
  },
  {
    city: 'Kerala',
    landmark: 'Backwaters',
    status: 'RSDL is coming soon',
    image: '/media/rsdl-city-kerala.jpg',
  },
  {
    city: 'Manipur',
    landmark: 'Loktak Lake',
    status: 'RSDL is coming soon',
    image: '/media/rsdl-city-manipur.jpg',
  },
  {
    city: 'Meghalaya',
    landmark: 'Living root bridges',
    status: 'RSDL is coming soon',
    image: '/media/rsdl-city-meghalaya.jpg',
  },
]

export const rsdlYouthGallery = [
  {
    src: '/media/rsdl-youth-play-1.jpg',
    alt: 'Students playing football on a school ground',
  },
  {
    src: '/media/rsdl-youth-play-2.jpg',
    alt: 'Youth footballers training with drills',
  },
  {
    src: '/media/rsdl-youth-play-3.jpg',
    alt: 'Teenage players competing in a football match',
  },
]

export const isbiCourses = [
  {
    title: 'BBA',
    copy: 'An upcoming undergraduate route for people seeking a business foundation through the lens of sport.',
  },
  {
    title: 'MBA',
    copy: 'An upcoming postgraduate pathway for emerging professionals ready to explore sport, business and leadership.',
  },
  {
    title: 'DBA',
    copy: 'An upcoming advanced business programme for professionals interested in deeper inquiry and sport-sector leadership.',
  },
  {
    title: 'PGDSM',
    copy: 'An upcoming postgraduate diploma pathway focused on the changing practice of sports management.',
  },
  {
    title: 'Diploma',
    copy: 'An upcoming focused route designed to help learners build sector-relevant foundations and confidence.',
  },
  {
    title: 'Crash courses',
    copy: 'Short upcoming learning experiences for people taking their first informed steps into sports management.',
  },
]

export const teamCredentials = [
  'Sports Management MBA — IISWBM Kolkata',
  'Marketing Management MBA — IMI Delhi',
  'M.Tech — IIT',
  'PhD Law — Vinoba Bhave University',
]

export const INSTAGRAM_URL = 'https://www.instagram.com/tsl_india2026'

export const media = {
  logo: '/media/aise-atletas-logo.png',
  logoHeader: '/media/aise-atletas-logo-header.png',
  logoHero: '/media/aise-atletas-logo.png',
  logoLegacy: '/media/aiset-logo.png',
  rsdlLogo: '/media/rising-star-development-league-logo.png',
  rsdlHero: '/media/rsdl-hero-football.jpg',
  hero: '/media/hero-aise-light.jpg',
  heroLegacy: '/media/hero-football.jpg',
  tennis: '/media/tennis-partnership.jpg',
  programmes: '/media/school-program.jpg',
  tours: '/media/sports-tour.jpg',
  development: '/media/aiset-development-lead.jpg',
  data: '/media/aiset-data-community.jpg',
  exposure: '/media/aiset-global-exposure.jpg',
  isbiHero: '/media/isbi-hero-campus.jpg',
  isbiSeminar: '/media/isbi-sports-business-seminar.jpg',
  isbiInfra: '/media/isbi-performance-infrastructure.jpg',
} as const
