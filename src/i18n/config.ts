// تنظیمات مشترک زبان‌ها؛ هم در مرورگر و هم در اسکریپت تولید صفحات سئو استفاده می‌شود.
export type Lang = 'fa' | 'ar' | 'en';

export const LANGS: Lang[] = ['fa', 'ar', 'en'];
export const DEFAULT_LANG: Lang = 'fa';
export const SITE_URL = 'https://parisima-clinic.ir';

export const LANG_META: Record<Lang, { htmlLang: string; dir: 'rtl' | 'ltr'; ogLocale: string; label: string; prefix: string }> = {
  fa: { htmlLang: 'fa', dir: 'rtl', ogLocale: 'fa_IR', label: 'فارسی', prefix: '' },
  ar: { htmlLang: 'ar', dir: 'rtl', ogLocale: 'ar_AR', label: 'العربية', prefix: '/ar' },
  en: { htmlLang: 'en', dir: 'ltr', ogLocale: 'en_US', label: 'English', prefix: '/en' },
};

export const homePath = (lang: Lang) => `${LANG_META[lang].prefix}/`;
export const articlePath = (lang: Lang, slug: string) => `${LANG_META[lang].prefix}/articles/${slug}/`;
export const absoluteUrl = (path: string) => `${SITE_URL}${path}`;
export const servicesPath = (lang: Lang) => `${LANG_META[lang].prefix}/services/`;
export const servicePath = (lang: Lang, slug: string) => `${LANG_META[lang].prefix}/services/${slug}/`;
export const aboutPath = (lang: Lang) => `${LANG_META[lang].prefix}/about/`;
export const contactPath = (lang: Lang) => `${LANG_META[lang].prefix}/contact/`;

// آدرس ساختاریافته کلینیک برای داده‌های ساختاریافته (JSON-LD) و سئوی محلی.
export const CLINIC_POSTAL = {
  streetAddress: 'Valiasr Street, above Vey Park, Zafaraniyeh Crossroad, Zafaraniyeh Physicians Building, 2nd Floor, Unit 8',
  addressLocality: 'Zafaraniyeh',
  addressRegion: 'Tehran',
  addressCountry: 'IR',
  telephone: '+982122753592',
};

// مختصات دقیق کلینیک (عرض و طول جغرافیایی) را از Google Maps بگیرید و اینجا قرار دهید.
// تا وقتی مقدار داده نشده، فیلد geo در JSON-LD اضافه نمی‌شود.
export const CLINIC_GEO: { latitude: number; longitude: number } | null = null;

export const CLINIC_HOURS = [
  { days: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'], opens: '07:00', closes: '20:00' },
];

export interface Route {
  lang: Lang;
  articleSlug?: string;
  page?: 'services' | 'service' | 'about' | 'contact';
  serviceSlug?: string;
}

export function parseRoute(pathname: string): Route {
  const segs = pathname.split('/').filter(Boolean);
  let lang: Lang = DEFAULT_LANG;
  if (segs[0] === 'ar' || segs[0] === 'en') {
    lang = segs[0];
    segs.shift();
  }
  if (segs[0] === 'articles' && segs[1]) {
    return { lang, articleSlug: decodeURIComponent(segs[1]) };
  }
  if (segs[0] === 'services' && segs[1]) return { lang, page: 'service', serviceSlug: decodeURIComponent(segs[1]) };
  if (segs[0] === 'services') return { lang, page: 'services' };
  if (segs[0] === 'about') return { lang, page: 'about' };
  if (segs[0] === 'contact') return { lang, page: 'contact' };
  return { lang };
}

// برند تصویری: هر تصویر سایت با این عبارت تگ می‌شود تا با هر دو املای «پریسیما» و «پری-سیما» قابل جستجو باشد
export const BRAND_TAG = 'کلینیک زیبایی پریسیما (پری-سیما) زعفرانیه تهران';
export const brandAlt = (text: string) => `${text} | ${BRAND_TAG}`;
