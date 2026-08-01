import { createReader } from '@keystatic/core/reader';
import config from '../../keystatic.config';
import { MAP_EMBED } from '../data';

// One reader, imported anywhere content is needed.
const reader = createReader(process.cwd(), config);

export const getBusiness = () => reader.singletons.business.read();

// ---- Doctors (Care Team) ----
export const getDoctor = (slug: string) => reader.collections.team.read(slug);
export async function getDoctors() {
  const raw = await reader.collections.team.all();
  return raw
    .map((d) => ({ slug: d.slug, ...d.entry }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
// Back-compat alias used by the home Team section.
export const getTeam = () => reader.collections.team.all();

// ---- Services ----
export const getService = (slug: string) => reader.collections.services.read(slug);
export async function getServices() {
  const raw = await reader.collections.services.all();
  return raw
    .map((s) => ({ slug: s.slug, ...s.entry }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

// ---- News ----
export const getArticle = (slug: string) => reader.collections.news.read(slug);
export async function getArticles() {
  const raw = await reader.collections.news.all();
  return raw
    .map((n) => ({ slug: n.slug, ...n.entry }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

// Consultation fee schedule. Managed in Keystatic -> Consultation Fees.
export async function getFees() {
  const data = await reader.singletons.fees.read();
  return data?.rows ?? [];
}

// Opening hours, normalised for display. Managed in Keystatic -> Business details.
export async function getHours() {
  const biz = await getBusiness();
  return (biz?.hours ?? []).map((row) => ({
    day: row.label,
    hours: row.time,
    open: !row.closed,
  }));
}

// Normalised business/site details with fallbacks. One shape for every component.
export async function getSite() {
  const biz = await getBusiness();
  const phone = biz?.phone || '';
  return {
    name: biz?.clinicName || 'Morley General Practice',
    slogan: biz?.slogan || '',
    introduction: biz?.introduction || '',
    logo: biz?.logo || '/logo.png',
    phone,
    phoneHref: phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : '#',
    email: biz?.email || '',
    address: biz?.address || '',
    abn: biz?.abn || '',
    hotdocUrl: biz?.hotdocUrl || '',
    healthengineUrl: biz?.healthengineUrl || '',
    social: {
      facebook: biz?.social?.facebook || '',
      instagram: biz?.social?.instagram || '',
      linkedin: biz?.social?.linkedin || '',
      youtube: biz?.social?.youtube || '',
    },
    seo: {
      title: biz?.seo?.title || '',
      description: biz?.seo?.description || '',
      ogImage: biz?.seo?.ogImage || '/logo.png',
    },
    mapEmbed: MAP_EMBED,
  };
}
