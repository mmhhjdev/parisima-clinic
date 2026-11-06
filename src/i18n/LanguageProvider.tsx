import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { LANGS, LANG_META, DEFAULT_LANG, Lang, parseRoute, homePath, articlePath, absoluteUrl } from './config';
import { STRINGS } from './strings';
import { CONTENT } from '../data/locales';
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
    const hrefFor = (l: Lang) => (article ? articlePath(l, article.slug) : homePath(l));
    return { lang, dir: LANG_META[lang].dir, content, article, t, hrefFor };
  }, []);

  useEffect(() => {
    const { lang, content, article, t, hrefFor } = value;
    const meta = LANG_META[lang];
    document.documentElement.lang = meta.htmlLang;
    document.documentElement.dir = meta.dir;

    const title = article ? `${article.title} | ${content.clinic.shortName}` : t('seo.title');
    const description = article ? article.excerpt : t('seo.description');
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
    setAlternates([
      ...LANGS.map((l) => ({ hreflang: LANG_META[l].htmlLang, href: absoluteUrl(hrefFor(l)) })),
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
