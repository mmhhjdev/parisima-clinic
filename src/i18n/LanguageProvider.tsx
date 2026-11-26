import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { LANGS, LANG_META, DEFAULT_LANG, Lang, parseRoute, homePath, articlePath, articlesIndexPath, servicesPath, servicePath, aboutPath, contactPath, faqPath, absoluteUrl } from './config';
import { STRINGS } from './strings';
import { CONTENT } from '../data/locales';
import { pageT } from './pages';
import type { Article, LocaleContent } from '../types';

export interface I18nValue {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  content: LocaleContent;
  article?: Article;
  t: (key: string, params?: Record<string, string | number>) => string;
  hrefFor: (lang: Lang) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const format = (str: string, params?: Record<string, string | number>) =>
  params ? str.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? '')) : str;

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

// hreflang: به موتورهای جستجو می‌گوید همین صفحه در چه زبان‌های دیگری وجود دارد
function setAlternates(links: { hreflang: string; href: string }[]) {
  document.head.querySelectorAll('link[data-i18n-alt]').forEach((node) => node.remove());
  links.forEach(({ hreflang, href }) => {
    const el = document.createElement('link');
    el.rel = 'alternate';
    el.hreflang = hreflang;
    el.href = href;
    el.setAttribute('data-i18n-alt', '');
    document.head.appendChild(el);
  });
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // زبان از آدرس صفحه خوانده می‌شود (/، /ar/، /en/) تا هر زبان آدرس و سئوی مستقل داشته باشد
  const value = useMemo<I18nValue>(() => {
    const route = parseRoute(window.location.pathname);
    const lang = route.lang;
    const content = CONTENT[lang];
    const article = route.articleSlug ? content.articles.find((a) => a.slug === route.articleSlug) : undefined;
    const t = (key: string, params?: Record<string, string | number>) =>
      format(STRINGS[lang][key] ?? STRINGS[DEFAULT_LANG][key] ?? key, params);
    const hrefFor = (l: Lang) => {
      if (article) return article.langs && !article.langs.includes(l) ? articlePath(lang, article.slug) : articlePath(l, article.slug);
      switch (route.page) {
        case 'articles': return articlesIndexPath(l, route.articlesPage ?? 1);
        case 'services': return servicesPath(l);
        case 'service': return route.serviceSlug ? servicePath(l, route.serviceSlug) : servicesPath(l);
        case 'about': return aboutPath(l);
        case 'contact': return contactPath(l);
        case 'faq': return faqPath(l);
        default: return homePath(l);
      }
    };
    return { lang, dir: LANG_META[lang].dir, content, article, t, hrefFor };
  }, []);

  useEffect(() => {
    const { lang, content, article, t, hrefFor } = value;
    const meta = LANG_META[lang];
    document.documentElement.lang = meta.htmlLang;
    document.documentElement.dir = meta.dir;

    // Keep client metadata aligned with the route-specific static HTML generated at build time.
    // Previously all non-article routes were overwritten with homepage metadata after hydration.
    const route = parseRoute(window.location.pathname);
    const service = route.page === 'service'
      ? content.services.find((item) => item.slug === route.serviceSlug)
      : undefined;
    const pageMeta = (() => {
      switch (route.page) {
        case 'articles': {
          const archiveTitle = lang === 'fa' ? 'مقالات پوست، مو و زیبایی' : lang === 'ar' ? 'مقالات الجلد والشعر والتجميل' : 'Skin, Hair & Aesthetic Articles';
          const archiveDesc = lang === 'fa'
            ? 'راهنماها و پاسخ‌های تخصصی درباره سلامت پوست، مو و خدمات زیبایی؛ با هدف آگاهی‌رسانی و تصمیم‌گیری آگاهانه.'
            : lang === 'ar'
              ? 'أدلة ومعلومات حول صحة البشرة والشعر والخدمات التجميلية لاتخاذ قرارات أكثر وعياً.'
              : 'Guides and practical information about skin, hair and aesthetic services to support informed decisions.';
          return { title: `${archiveTitle}${(route.articlesPage ?? 1) > 1 ? ` – ${route.articlesPage}` : ''} | ${content.clinic.shortName}`, description: archiveDesc };
        }
        case 'services':
          return { title: `${pageT(lang, 'servicesTitle')} | ${content.clinic.shortName}`, description: pageT(lang, 'servicesDesc') };
        case 'service':
          return service
            ? { title: `${service.title} | ${content.clinic.shortName}`, description: service.shortDescription }
            : { title: t('seo.title'), description: t('seo.description') };
        case 'about':
          return { title: `${pageT(lang, 'aboutTitle')} | ${content.clinic.shortName}`, description: pageT(lang, 'aboutDesc') };
        case 'contact':
          return { title: `${pageT(lang, 'contactTitle')} | ${content.clinic.shortName}`, description: pageT(lang, 'contactDesc') };
        case 'faq':
          return { title: `${pageT(lang, 'faqTitle')} | ${content.clinic.shortName}`, description: pageT(lang, 'faqDesc') };
        default:
          return { title: t('seo.title'), description: t('seo.description') };
      }
    })();
    const title = article ? (article.seoTitle ?? `${article.title} | ${content.clinic.shortName}`) : pageMeta.title;
    const description = article ? (article.metaDescription ?? article.excerpt) : pageMeta.description;
    const canonical = absoluteUrl(hrefFor(lang));

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', t('seo.keywords'));
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:locale', meta.ogLocale);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setCanonical(canonical);
    const currentRoute = parseRoute(window.location.pathname);
    const alternateLangs = article?.langs ?? (currentRoute.page === 'articles'
      ? LANGS.filter((l) => Math.ceil(CONTENT[l].articles.length / 6) >= (currentRoute.articlesPage ?? 1))
      : LANGS);
    setAlternates([
      ...alternateLangs.map((l) => ({ hreflang: LANG_META[l].htmlLang, href: absoluteUrl(hrefFor(l)) })),
      { hreflang: 'x-default', href: absoluteUrl(hrefFor(DEFAULT_LANG)) },
    ]);
  }, [value]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
