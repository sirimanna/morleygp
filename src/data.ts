// ============================================================
// SITE CONTENT — Morley GP
// Managed in Keystatic: Business details, Care Team (doctors),
// Services, and News. Read via src/lib/content.ts helpers.
// This file holds only small static bits used across the site.
// ============================================================

// Google Maps embed for the location/contact sections (static).
export const MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3385.4!2d115.9028!3d-31.8897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32bad8b38bdd2b%3A0x504f0b535df4f90!2s26%20McGilvray%20Ave%2C%20Morley%20WA%206062!5e0!3m2!1sen!2sau!4v1';

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Our Care Team', href: '/care-team' },
  { label: 'News', href: '/news' },
  { label: 'Patient Info & Fees', href: '/patient-info' },
  { label: 'Contact Us', href: '/contact' },
];

// Patient testimonials shown on the home page (static).
export const REVIEWS = [
  { name: 'Sarah M.', rating: 5, text: 'Absolutely wonderful practice. The doctors are thorough, caring and genuinely listen. I always leave feeling well looked after. The online booking through HotDoc is so convenient!', date: 'June 2025' },
  { name: 'James K.', rating: 5, text: 'Dr Botros has been my GP for years. He is incredibly knowledgeable and takes the time to explain everything clearly. The staff at reception are always friendly and welcoming.', date: 'May 2025' },
  { name: 'Priya R.', rating: 5, text: 'Best GP clinic in Morley by far. Dr Ganepola has been amazing managing my ongoing health needs. They always manage to fit me in when I need urgent appointments. Highly recommend!', date: 'July 2025' },
];
