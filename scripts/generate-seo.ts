// تولید صفحات سئوی استاتیک برای هر زبان پس از vite build.
// خروجی: صفحه اصلی fa/ar/en با متادیتا و JSON-LD مخصوص همان زبان،
// صفحه هر مقاله در هر زبان (با متن کامل برای خزنده‌ها)، و sitemap.xml با hreflang.
import fs from 'node:fs';
import path from 'node:path';
import { LANGS, LANG_META, DEFAULT_LANG, SITE_URL, Lang, homePath, articlePath, absoluteUrl } from '../src/i18n/config';
import { STRINGS } from '../src/i18n/strings';
import { CONTENT } from '../src/data/locales';
import { parseBlocks } from '../src/lib/markdown';
import type { Article } from '../src/types';

const DIST = path.resolve('dist');
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const TODAY = '2026-11-06';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
const tr = (lang: Lang, key: string) => STRINGS[lang][key] ?? STRINGS[DEFAULT_LANG][key];
const phoneIntl = (p: string) => `+98${p.replace(/^0/, '')}`;
const digits = (s: string) => (s.match(/\d+/) || [''])[0];

function bodyHtml(content: string): string {
  return parseBlocks(content)
    .map((b) => {
      if (b.type === 'h3') return `<h3>${inline(b.text)}</h3>`;
      if (b.type === 'p') return `<p>${inline(b.text)}</p>`;
      const tag = b.type;
      return `<${tag}>${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${tag}>`;
    })
    .join('\n');
}

// حذف متادیتای قالب اصلی تا هر صفحه متادیتای خودش را داشته باشد (GA و فونت‌ها دست‌نخورده می‌مانند)
function stripHead(html: string): string {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta\s+(name|property)="(description|keywords|og:[^"]+|twitter:[^"]+)"[^>]*>\s*/g, '')
    .replace(/<link rel="canonical"[^>]*>\s*/, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, '');
}

interface PageSpec {
  lang: Lang;
  title: string;
  description: string;
  keywords: string;
  ogType: 'website' | 'article';
  pathFor: (l: Lang) => string;
  jsonLd: object[];
  bodyHtml?: string;
}

function renderPage(spec: PageSpec): string {
  const meta = LANG_META[spec.lang];
  const canonical = absoluteUrl(spec.pathFor(spec.lang));
  const clinicName = CONTENT[spec.lang].clinic.name;
  const alternates = LANGS.map(
    (l) => `<link rel="alternate" hreflang="${LANG_META[l].htmlLang}" href="${absoluteUrl(spec.pathFor(l))}" />`,
  ).join('\n    ');
  const ld = spec.jsonLd
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ');

  const head = `
    <title>${esc(spec.title)}</title>
    <meta name="description" content="${esc(spec.description)}" />
    <meta name="keywords" content="${esc(spec.keywords)}" />
    <link rel="canonical" href="${canonical}" />
    ${alternates}
    <link rel="alternate" hreflang="x-default" href="${absoluteUrl(spec.pathFor(DEFAULT_LANG))}" />
    <meta property="og:type" content="${spec.ogType}" />
    <meta property="og:locale" content="${meta.ogLocale}" />
    <meta property="og:site_name" content="${esc(clinicName)}" />
    <meta property="og:title" content="${esc(spec.title)}" />
    <meta property="og:description" content="${esc(spec.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE_URL}/logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(spec.title)}" />
    <meta name="twitter:description" content="${esc(spec.description)}" />
    <meta name="twitter:image" content="${SITE_URL}/logo.png" />
    ${ld}
  </head>`;

  let html = stripHead(template)
    .replace(/<html[^>]*>/, `<html lang="${meta.htmlLang}" dir="${meta.dir}">`)
    .replace('</head>', head);
  if (spec.bodyHtml) html = html.replace('<div id="root"></div>', `<div id="root">${spec.bodyHtml}</div>`);
  return html;
}

function homeSpec(lang: Lang): PageSpec {
  const c = CONTENT[lang].clinic;
  const home = absoluteUrl(homePath(lang));
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['MedicalBusiness', 'MedicalClinic'],
          '@id': `${home}#clinic`,
          name: c.name,
          alternateName: c.shortName,
          url: home,
          logo: `${SITE_URL}/logo.png`,
          image: `${SITE_URL}/logo.png`,
          description: tr(lang, 'seo.description'),
          telephone: [phoneIntl(c.phone1), phoneIntl(c.phone2), phoneIntl(c.mobile1)],
          priceRange: '$$',
          address: { '@type': 'PostalAddress', streetAddress: c.address, addressLocality: lang === 'en' ? 'Tehran' : 'تهران', addressCountry: 'IR' },
          geo: { '@type': 'GeoCoordinates', latitude: 35.80345, longitude: 51.42035 },
          openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'], opens: '07:00', closes: '20:00' }],
          medicalSpecialty: ['Dermatology', 'PlasticSurgery'],
          employee: CONTENT[lang].doctors.map((d) => ({ '@type': 'Physician', name: d.name, jobTitle: d.title, identifier: digits(d.medicalCode), worksFor: { '@id': `${home}#clinic` } })),
        },
        {
          '@type': 'FAQPage',
          mainEntity: CONTENT[lang].faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
        },
        {
          '@type': 'ItemList',
          itemListElement: CONTENT[lang].services.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.title, description: s.shortDescription, url: `${home}#services` })),
        },
      ],
    },
  ];
  return {
    lang,
    title: tr(lang, 'seo.title'),
    description: tr(lang, 'seo.description'),
    keywords: tr(lang, 'seo.keywords'),
    ogType: 'website',
    pathFor: homePath,
    jsonLd,
  };
}

function articleSpec(lang: Lang, a: Article): PageSpec {
  const c = CONTENT[lang].clinic;
  const pathFor = (l: Lang) => articlePath(l, a.slug);
  const canonical = absoluteUrl(pathFor(lang));
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: a.title,
      description: a.excerpt,
      image: `${SITE_URL}${a.image}`,
      author: { '@type': 'Person', name: a.author },
      publisher: { '@type': 'Organization', name: c.name, logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` } },
      mainEntityOfPage: canonical,
      inLanguage: LANG_META[lang].htmlLang,
      articleSection: a.category,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: c.shortName, item: absoluteUrl(homePath(lang)) },
        { '@type': 'ListItem', position: 2, name: a.title, item: canonical },
      ],
    },
  ];
  const staticBody = `
<article style="max-width:780px;margin:0 auto;padding:24px;font-family:sans-serif;line-height:1.9">
  <p><a href="${homePath(lang)}">${esc(c.shortName)}</a></p>
  <p>${esc(a.category)} · ${esc(a.date)} · ${esc(a.author)}</p>
  <h1>${esc(a.title)}</h1>
  <img src="${a.image}" alt="${esc(a.title)}" style="max-width:100%;height:auto;border-radius:16px" />
  <p>${inline(a.excerpt)}</p>
  ${bodyHtml(a.content)}
  <p><a href="${homePath(lang)}#articles">${esc(tr(lang, 'articles.badge'))}</a></p>
</article>`;
  return {
    lang,
    title: `${a.title} | ${c.shortName}`,
    description: a.excerpt,
    keywords: tr(lang, 'seo.keywords'),
    ogType: 'article',
    pathFor,
    jsonLd,
    bodyHtml: staticBody,
  };
}

function writePage(relDir: string, html: string) {
  const dir = path.join(DIST, relDir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

// ---- تولید صفحات ----
const pageCount: Record<string, number> = {};
for (const lang of LANGS) {
  const prefix = LANG_META[lang].prefix.replace(/^\//, '');
  writePage(prefix, renderPage(homeSpec(lang)));
  for (const a of CONTENT[lang].articles) {
    writePage(path.join(prefix, 'articles', a.slug), renderPage(articleSpec(lang, a)));
  }
  pageCount[lang] = 1 + CONTENT[lang].articles.length;
}
// صفحه اصلی فارسی همان index.html ریشه است
fs.writeFileSync(path.join(DIST, 'index.html'), renderPage(homeSpec(DEFAULT_LANG)), 'utf8');

// ---- sitemap با hreflang ----
const slugs = CONTENT[DEFAULT_LANG].articles.map((a) => a.slug);
const urlEntry = (pathFor: (l: Lang) => string) => {
  const alts = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${LANG_META[l].htmlLang}" href="${absoluteUrl(pathFor(l))}"/>`).join('\n');
  const xdef = `    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(pathFor(DEFAULT_LANG))}"/>`;
  return LANGS.map(
    (lang) => `  <url>
    <loc>${absoluteUrl(pathFor(lang))}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${pathFor(lang) === homePath(lang) ? '1.0' : '0.8'}</priority>
${alts}
${xdef}
  </url>`,
  ).join('\n');
};
const urls = [
  urlEntry(homePath),
  ...slugs.map((slug) => urlEntry((l) => articlePath(l, slug))),
].join('\n');
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`,
  'utf8',
);
console.log('SEO pages generated:', pageCount, '| sitemap written');
