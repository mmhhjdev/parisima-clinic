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

export interface Route {
  lang: Lang;
  articleSlug?: string;
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
  return { lang };
}
