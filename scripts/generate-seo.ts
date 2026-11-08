// تولید صفحات استاتیک سئو برای هر مقاله و صفحه اصلی در هر سه زبان.
// خروجی: dist/<prefix>/articles/<slug>/index.html  +  sitemap.xml  +  robots.txt
// هر صفحه شامل متن کامل مقاله (برای خزنده‌ها) و همان برنامه React است، پس برای کاربر هم کار می‌کند.
import fs from 'fs';
import path from 'path';
import {
  BRAND_TAG,
  brandAlt,
  CLINIC_GEO,
  CLINIC_HOURS,
  CLINIC_POSTAL,
  LANGS,
  LANG_META,
  DEFAULT_LANG,
  SITE_URL,
  articlePath,
  homePath,
  absoluteUrl,
  type Lang,
  servicesPath,
  servicePath,
  aboutPath,
  contactPath,
} from '../src/i18n/config';
import { pageT } from '../src/i18n/pages';
import { CONTENT } from '../src/data/locales';
import { STRINGS } from '../src/i18n/strings';
import { parseBlocks, type Block } from '../src/lib/markdown';

const DIST = path.resolve(process.cwd(), 'dist');
const TEMPLATE_PATH = path.join(DIST, 'index.html');
const ROOT_PLACEHOLDER = '<div id="root"></div>';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const inline = (s: string) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

const blocksToHtml = (blocks: Block[]) =>
  blocks
    .map((b) => {
      if (b.type === 'h3') return `<h2 class="font-header text-base font-black text-[#0F172A] pt-2">${inline(b.text)}</h2>`;
      if (b.type === 'p') return `<p>${inline(b.text)}</p>`;
      if (b.type === 'img') return `<figure class="my-6"><img src="${esc(absoluteUrl(b.src))}" alt="${esc(brandAlt(b.alt))}" width="1200" height="675" loading="lazy" class="w-full rounded-2xl" /></figure>`;
      const tag = b.type === 'ol' ? 'ol' : 'ul';
      return `<${tag}>${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${tag}>`;
    })
    .join('\n');

const t = (lang: Lang, key: string, params?: Record<string, string>) => {
  let str = STRINGS[lang][key] ?? STRINGS[DEFAULT_LANG][key] ?? key;
  if (params) str = str.replace(/\{(\w+)\}/g, (_, k: string) => params[k] ?? '');
  return str;
};

// پاک‌سازی تگ‌های head که قرار است دوباره ساخته شوند (از قالب vite)
function stripHead(html: string) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+(name|property)="(description|keywords|robots|og:[^"]+|twitter:[^"]+)"[^>]*>\s*/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<link\s+rel="alternate"[^>]*>\s*/gi, '');
}

// محتوای قابل خزش صفحه اصلی: نام، آدرس، تلفن، ساعت کاری و لینک مستقیم به مقالات.
function homeBody(lang: Lang, home: string): string {
  const c = CONTENT[lang].clinic;
  const tel = `+98${c.phone1.replace(/^0/, '')}`;
  const articles = CONTENT[lang].articles
    .map((a) => `<li><a href="${articlePath(lang, a.slug)}">${esc(a.title)}</a></li>`)
    .join('');
  const sections = [
    ['#services', t(lang, 'nav.services')],
    ['#articles', t(lang, 'nav.articles')],
    ['#faq', t(lang, 'footer.faq')],
    ['#contact', t(lang, 'nav.contact')],
  ]
    .map(([hash, label]) => `<li><a href="${home}${hash}">${esc(label)}</a></li>`)
    .join('');
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.addressShort + ' ' + c.name)}`;
  return `<main class="flex-1"><section class="max-w-3xl mx-auto px-4 py-10 font-sans text-sm leading-loose text-slate-700">
<h1 class="font-header text-2xl font-black text-[#0F172A] mb-4">${esc(c.name)}</h1>
<p>${esc(t(lang, 'seo.description'))}</p>
<nav aria-label="${esc(t(lang, 'nav.menu'))}"><ul class="flex flex-wrap gap-3 my-4">${sections}</ul></nav>
<address class="not-italic mt-4">
<div>${esc(c.address)}</div>
<div><a href="tel:${tel}">${esc(c.phone1Display)}</a> · <a href="tel:+98${c.mobile1.replace(/^0/, '')}">${esc(c.mobile1Display)}</a></div>
<div>${esc(c.workingHours)}</div>
<div><a href="${mapUrl}" rel="noopener">${esc(t(lang, 'contact.maps'))}</a></div>
</address>
<h2 class="font-header text-lg font-black text-[#0F172A] mt-8 mb-2">${esc(t(lang, 'nav.services'))}</h2>
<ul class="list-disc pr-5">${CONTENT[lang].services.map((sv) => `<li><a href="${servicePath(lang, sv.slug)}">${esc(sv.title)}</a></li>`).join('')}</ul>
<p><a href="${servicesPath(lang)}">${esc(pageT(lang, 'allServices'))}</a> · <a href="${aboutPath(lang)}">${esc(pageT(lang, 'about'))}</a> · <a href="${contactPath(lang)}">${esc(pageT(lang, 'contact'))}</a></p>
<h2 class="font-header text-lg font-black text-[#0F172A] mt-8 mb-2">${esc(t(lang, 'nav.articles'))}</h2>
<ul class="list-disc pr-5">${articles}</ul>
</section></main>`;
}

interface PageMeta {
  lang: Lang;
  urlPath: string;
  altPaths: Record<Lang, string>;
  title: string;
  description: string;
  keywords: string;
  image: string; // مسیر مطلق
  ogType: 'website' | 'article';
  jsonLd: object[];
  bodyHtml: string;
}

// آدرس معادل هر صفحه داخلی در زبان‌های دیگر (برای hreflang و نقشه‌ی سایت)
function subPathFor(l: Lang, key: string): string {
  if (key === 'services') return servicesPath(l);
  if (key === 'about') return aboutPath(l);
  if (key === 'contact') return contactPath(l);
  return servicePath(l, key.replace(/^service:/, ''));
}
function subAlts(key: string): Record<Lang, string> {
  return Object.fromEntries(LANGS.map((l) => [l, subPathFor(l, key)])) as Record<Lang, string>;
}

function renderPage(template: string, m: PageMeta): string {
  const meta = LANG_META[m.lang];
  const canonical = absoluteUrl(m.urlPath);
  const alternates = [
    ...LANGS.filter((l) => m.altPaths[l]).map((l) => `<link rel="alternate" hreflang="${LANG_META[l].htmlLang}" href="${absoluteUrl(m.altPaths[l])}" />`),
    `<link rel="alternate" hreflang="x-default" href="${absoluteUrl(m.altPaths[DEFAULT_LANG])}" />`,
  ];
  const head = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="keywords" content="${esc(m.keywords)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
    `<meta name="geo.region" content="IR-07" />`,
    `<meta name="geo.placename" content="زعفرانیه، تهران، ایران" />`,
    `<link rel="canonical" href="${canonical}" />`,
    ...alternates,
    `<meta property="og:type" content="${m.ogType}" />`,
    `<meta property="og:locale" content="${meta.ogLocale}" />`,
    `<meta property="og:site_name" content="${esc(CONTENT[m.lang].clinic.shortName)}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${esc(m.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${esc(m.image)}" />`,
    ...m.jsonLd.map(
      (j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`,
    ),
  ].join('\n    ');

  let html = stripHead(template);
  if (!html.includes('</head>')) throw new Error('template has no </head>');
  html = html.replace('</head>', `    ${head}\n  </head>`);
  html = html.replace(/<html[^>]*>/i, `<html lang="${meta.htmlLang}" dir="${meta.dir}">`);
  html = html.replace(ROOT_PLACEHOLDER, `<div id="root">${m.bodyHtml}</div>`);
  return html;
}

// پرسش و پاسخ‌های بخش «پرسش‌های متداول» برای FAQPage
function faqFromBlocks(blocks: Block[]): { q: string; a: string }[] {
  const plain = (t: string) => t.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  const out: { q: string; a: string }[] = [];
  let inFaq = false;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === 'h3') {
      if (/پرسش|سوالات|Frequently|الأسئلة/.test(b.text)) { inFaq = true; continue; }
      if (inFaq && /[؟?]$/.test(b.text.trim())) {
        const next = blocks[i + 1];
        if (next && next.type === 'p') out.push({ q: plain(b.text), a: plain(next.text) });
        continue;
      }
      inFaq = false;
    }
  }
  return out;
}

// آدرس‌های قدیمی که دیگر مقاله ندارند به مقالهٔ جایگزین منتقل می‌شوند (کانونیکال + ریدایرکت)
const REDIRECTS: { lang: Lang; from: string; to: string | null }[] = [
  { lang: 'fa', from: 'adult-acne-causes-and-treatment', to: 'adult-acne-causes-treatment' },
  { lang: 'ar', from: 'adult-acne-causes-and-treatment', to: null },
  { lang: 'en', from: 'adult-acne-causes-and-treatment', to: null },
];

function writeFileSafe(urlPath: string, content: string) {
  const file = path.join(DIST, urlPath, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  return file;
}

function main() {
  if (!fs.existsSync(TEMPLATE_PATH)) throw new Error('dist/index.html not found: run "vite build" first');
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  if (!template.includes(ROOT_PLACEHOLDER)) throw new Error('root placeholder not found in dist/index.html');

  const sitemapEntries: { loc: string; alts: Record<Lang, string>; lastmod?: string; images?: { loc: string; title: string; caption: string }[] }[] = [];
  const written: string[] = [];

  for (const lang of LANGS) {
    const content = CONTENT[lang];
    const meta = LANG_META[lang];
    const home = homePath(lang);
    const homeAlts = Object.fromEntries(LANGS.map((l) => [l, homePath(l)])) as Record<Lang, string>;

    // صفحه اصلی هر زبان
    const homeDesc = t(lang, 'seo.description');
    const homeHtml = renderPage(template, {
      lang,
      urlPath: home,
      altPaths: homeAlts,
      title: t(lang, 'seo.title'),
      description: homeDesc,
      keywords: t(lang, 'seo.keywords'),
      image: absoluteUrl('/logo.png'),
      ogType: 'website',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'SiteNavigationElement',
          name: [t(lang, 'nav.services'), t(lang, 'nav.articles'), t(lang, 'footer.faq'), t(lang, 'nav.contact')],
          url: [`${absoluteUrl(home)}#services`, `${absoluteUrl(home)}#articles`, `${absoluteUrl(home)}#faq`, `${absoluteUrl(home)}#contact`],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'MedicalClinic',
          '@id': `${absoluteUrl(home)}#clinic`,
          name: content.clinic.name,
          alternateName: ['پریسیما', 'پری-سیما', 'پری سیما', 'Parisima', 'Pari-Sima', content.clinic.shortName],
          disambiguatingDescription: t(lang, 'seo.disambiguation'),
          areaServed: [{ '@type': 'Place', name: 'Zafaraniyeh, Tehran' }, { '@type': 'Place', name: 'Zafaraniyeh' }],
          url: absoluteUrl(home),
          logo: absoluteUrl('/logo.png'),
          image: absoluteUrl('/logo.png'),
          description: homeDesc,
          inLanguage: meta.htmlLang,
          medicalSpecialty: ['Dermatology', 'HairRestoration'],
          telephone: CLINIC_POSTAL.telephone,
          hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.clinic.addressShort + ' ' + content.clinic.name)}`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: CLINIC_POSTAL.streetAddress,
            addressLocality: CLINIC_POSTAL.addressLocality,
            addressRegion: CLINIC_POSTAL.addressRegion,
            addressCountry: CLINIC_POSTAL.addressCountry,
          },
          ...(CLINIC_GEO
            ? { geo: { '@type': 'GeoCoordinates', latitude: CLINIC_GEO.latitude, longitude: CLINIC_GEO.longitude } }
            : {}),
          openingHoursSpecification: CLINIC_HOURS.map((h) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: h.days,
            opens: h.opens,
            closes: h.closes,
          })),
          employee: content.doctors.map((d) => ({ '@type': 'Physician', name: d.name, jobTitle: d.title })),
        },
      ],
      bodyHtml: homeBody(lang, home),
    });
    written.push(writeFileSafe(home, homeHtml));
    const homeImages = content.services
      .filter((s) => s.image)
      .map((s) => ({ loc: absoluteUrl(`/${s.image.replace(/^\//, '')}`), title: s.title, caption: brandAlt(s.imageAlt || s.title) }));
    sitemapEntries.push({ loc: absoluteUrl(home), alts: homeAlts, images: homeImages });

    // صفحات داخلی: خدمات، جزئیات هر خدمت، درباره ما، تماس
    const subPages: { key: string; path: string; title: string; desc: string; body: string; crumbs: [string, string][]; ld: object[]; image: string }[] = [];
    const crumbHtml = (items: [string, string][]) =>
      `<nav aria-label="breadcrumb" class="text-xs text-slate-500 mb-4"><ol class="flex flex-wrap gap-1.5">${items
        .map(([label, href], i) => (href && i < items.length - 1 ? `<li><a href="${href}">${esc(label)}</a> ›</li>` : `<li>${esc(label)}</li>`))
        .join('')}</ol></nav>`;
    const homeCrumb: [string, string] = [pageT(lang, 'back'), home];
    const c0 = content.clinic;
    const mapQ = encodeURIComponent(c0.addressShort + ' ' + c0.name);
    const mapHref = `https://www.google.com/maps/search/?api=1&query=${mapQ}`;

    // فهرست خدمات
    subPages.push({
      key: 'services',
      path: servicesPath(lang),
      title: `${pageT(lang, 'servicesTitle')} | ${c0.shortName}`,
      desc: pageT(lang, 'servicesDesc'),
      image: absoluteUrl('/logo.png'),
      crumbs: [homeCrumb, [pageT(lang, 'services'), servicesPath(lang)]],
      body: `${crumbHtml([homeCrumb, [pageT(lang, 'services'), servicesPath(lang)]])}<h1>${esc(pageT(lang, 'servicesTitle'))}</h1><p>${esc(pageT(lang, 'servicesDesc'))}</p><ul>${content.services
        .map((s) => `<li><a href="${servicePath(lang, s.slug)}">${esc(s.title)}</a> — ${esc(s.shortDescription)}</li>`)
        .join('')}</ul>`,
      ld: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: pageT(lang, 'servicesTitle'), url: absoluteUrl(servicesPath(lang)), inLanguage: meta.htmlLang }],
    });

    // صفحه‌ی هر خدمت
    for (const sv of content.services) {
      const p = servicePath(lang, sv.slug);
      const crumbs: [string, string][] = [homeCrumb, [pageT(lang, 'services'), servicesPath(lang)], [sv.title, p]];
      subPages.push({
        key: `service:${sv.slug}`,
        path: p,
        title: `${sv.title} | ${c0.shortName}`,
        desc: sv.shortDescription,
        image: absoluteUrl(`/${sv.image.replace(/^\//, '')}`),
        crumbs,
        body: `${crumbHtml(crumbs)}<h1>${esc(sv.title)}</h1><p>${esc(sv.fullDescription)}</p>
<img src="${absoluteUrl(`/${sv.image.replace(/^\//, '')}`)}" alt="${esc(brandAlt(sv.imageAlt || sv.title))}" width="1200" height="675" />
${sv.benefits?.length ? `<h2>${esc(pageT(lang, 'benefits'))}</h2><ul>${sv.benefits.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
<ul><li>${esc(pageT(lang, 'duration'))}: ${esc(sv.duration)}</li><li>${esc(pageT(lang, 'sessions'))}: ${esc(sv.sessions)}</li><li>${esc(pageT(lang, 'recovery'))}: ${esc(sv.recoveryTime)}</li><li>${esc(pageT(lang, 'doctor'))}: <a href="${aboutPath(lang)}">${esc(sv.doctorName)}</a></li></ul>
<p><a href="${servicesPath(lang)}">${esc(pageT(lang, 'allServices'))}</a></p>`,
        ld: [
          {
            '@context': 'https://schema.org',
            '@type': 'MedicalProcedure',
            name: sv.title,
            description: sv.shortDescription,
            url: absoluteUrl(p),
            image: absoluteUrl(`/${sv.image.replace(/^\//, '')}`),
            inLanguage: meta.htmlLang,
            procedureType: sv.categoryLabel,
            provider: { '@id': `${absoluteUrl(home)}#clinic` },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: crumbs.map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name, item: absoluteUrl(href) })),
          },
        ],
      });
    }

    // درباره ما (پزشکان)
    subPages.push({
      key: 'about',
      path: aboutPath(lang),
      title: `${pageT(lang, 'aboutTitle')} | ${c0.shortName}`,
      desc: pageT(lang, 'aboutDesc'),
      image: absoluteUrl('/logo.png'),
      crumbs: [homeCrumb, [pageT(lang, 'about'), aboutPath(lang)]],
      body: `${crumbHtml([homeCrumb, [pageT(lang, 'about'), aboutPath(lang)]])}<h1>${esc(pageT(lang, 'aboutTitle'))}</h1><p>${esc(pageT(lang, 'aboutDesc'))}</p>${content.doctors
        .map((d) => `<article><h2>${esc(d.name)}</h2><p>${esc(d.title)}</p><p>${esc(d.bio)}</p><p>${esc(pageT(lang, 'medicalCode'))}: ${esc(d.medicalCode)}</p><h3>${esc(pageT(lang, 'specialties'))}</h3><ul>${d.specialties.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></article>`)
        .join('')}`,
      ld: [
        {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: pageT(lang, 'aboutTitle'),
          url: absoluteUrl(aboutPath(lang)),
          inLanguage: meta.htmlLang,
          about: { '@id': `${absoluteUrl(home)}#clinic` },
        },
        ...content.doctors.map((d) => ({ '@context': 'https://schema.org', '@type': 'Physician', name: d.name, jobTitle: d.title, medicalSpecialty: d.specialties, worksFor: { '@id': `${absoluteUrl(home)}#clinic` } })),
      ],
    });

    // تماس و نشانی
    subPages.push({
      key: 'contact',
      path: contactPath(lang),
      title: `${pageT(lang, 'contactTitle')} | ${c0.shortName}`,
      desc: pageT(lang, 'contactDesc'),
      image: absoluteUrl('/logo.png'),
      crumbs: [homeCrumb, [pageT(lang, 'contact'), contactPath(lang)]],
      body: `${crumbHtml([homeCrumb, [pageT(lang, 'contact'), contactPath(lang)]])}<h1>${esc(pageT(lang, 'contactTitle'))}</h1><p>${esc(pageT(lang, 'contactDesc'))}</p>
<address>${esc(pageT(lang, 'address'))}: ${esc(c0.address)}<br/>${esc(pageT(lang, 'phone'))}: <a href="tel:${c0.phone1}">${esc(c0.phone1Display)}</a> · <a href="tel:${c0.mobile1}">${esc(c0.mobile1Display)}</a><br/>${esc(pageT(lang, 'hours'))}: ${esc(c0.workingHours)}<br/><a href="${mapHref}" rel="noopener">${esc(pageT(lang, 'map'))}</a></address>`,
      ld: [{ '@context': 'https://schema.org', '@type': 'ContactPage', name: pageT(lang, 'contactTitle'), url: absoluteUrl(contactPath(lang)), inLanguage: meta.htmlLang, about: { '@id': `${absoluteUrl(home)}#clinic` } }],
    });

    for (const sp of subPages) {
      const html = renderPage(template, {
        lang,
        urlPath: sp.path,
        altPaths: subAlts(sp.key),
        title: sp.title,
        description: sp.desc,
        keywords: t(lang, 'seo.keywords'),
        image: sp.image,
        ogType: 'website',
        jsonLd: sp.ld,
        bodyHtml: `<main class="flex-1"><section class="max-w-4xl mx-auto px-5 py-10 font-sans text-sm leading-loose text-slate-700">${sp.body}</section></main>`,
      } as PageMeta);
      written.push(writeFileSafe(sp.path, html));
      sitemapEntries.push({ loc: absoluteUrl(sp.path), alts: subAlts(sp.key), lastmod: '2026-11-08' });
    }

    // صفحه هر مقاله
    for (const a of content.articles) {
      const urlPath = articlePath(lang, a.slug);
      const availLangs = a.langs ?? LANGS;
      const altPaths = Object.fromEntries(availLangs.map((l) => [l, articlePath(l, a.slug)])) as Record<Lang, string>;
      const canonical = absoluteUrl(urlPath);
      const imageUrl = absoluteUrl(`/${a.image.replace(/^\//, '')}`);
      const heroAlt = brandAlt(a.imageAlt ?? a.title);
      const title = a.seoTitle ?? `${a.title} | ${content.clinic.shortName}`;
      const keywords = a.keywords ?? `${a.category}, ${t(lang, 'seo.keywords')}`;
      const blocks = parseBlocks(a.content);

      const bodyHtml = `<main class="flex-1 bg-white"><article class="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
<nav aria-label="breadcrumb" class="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-sans mb-6"><a href="${home}">${esc(t(lang, 'article.home'))}</a><span>/</span><a href="${home}#articles">${esc(t(lang, 'article.allArticles'))}</a><span>/</span><span class="text-slate-700">${esc(a.title)}</span></nav>
<span class="inline-block bg-[#F0F9FF] text-[#0284C7] text-xs font-bold px-3 py-1 rounded-md border border-[#BAE6FD]">${esc(a.category)}</span>
<h1 class="font-header text-2xl sm:text-4xl font-black text-[#0F172A] leading-snug mt-4">${esc(a.title)}</h1>
<div class="flex flex-wrap items-center gap-4 text-xs text-slate-500 my-5 font-sans border-y border-slate-100 py-3"><span class="font-semibold text-slate-700">${esc(a.author)}</span><span>${esc(a.date)}</span><span>${esc(t(lang, 'articles.readTime', { time: a.readTime }))}</span></div>
<img src="${imageUrl}" alt="${esc(heroAlt)}" width="1600" height="900" class="w-full rounded-2xl mb-8" />
<p class="font-sans text-base sm:text-lg text-slate-600 leading-relaxed mb-8">${esc(a.excerpt)}</p>
<div class="font-sans text-sm text-slate-700 leading-loose space-y-4">
${blocksToHtml(blocks)}
</div>
</article></main>`;

      const faq = faqFromBlocks(blocks);
      const jsonLd: object[] = [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: a.title,
          description: a.excerpt,
          image: [
            { '@type': 'ImageObject', url: imageUrl, caption: heroAlt, name: a.title, creator: { '@type': 'Organization', name: content.clinic.name }, copyrightHolder: { '@type': 'Organization', name: content.clinic.name } },
          ],
          inLanguage: meta.htmlLang,
          articleSection: a.category,
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
          author: { '@type': 'Person', name: a.author, worksFor: { '@id': `${absoluteUrl(home)}#clinic` } },
          publisher: {
            '@type': 'Organization',
            name: content.clinic.name,
            logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.png') },
          },
          ...(a.publishedAt ? { datePublished: a.publishedAt, dateModified: a.publishedAt } : {}),
        },
        ...(faq.length
          ? [
              {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faq.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              },
            ]
          : []),
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t(lang, 'article.home'), item: absoluteUrl(home) },
            { '@type': 'ListItem', position: 2, name: t(lang, 'article.allArticles'), item: absoluteUrl(`${home}#articles`) },
            { '@type': 'ListItem', position: 3, name: a.title, item: canonical },
          ],
        },
      ];

      const html = renderPage(template, {
        lang,
        urlPath,
        altPaths,
        title,
        description: a.excerpt,
        keywords,
        image: imageUrl,
        ogType: 'article',
        jsonLd,
        bodyHtml,
      });
      written.push(writeFileSafe(urlPath, html));
      const bodyImages = blocks.flatMap((b) => (b.type === 'img' ? [{ loc: absoluteUrl(b.src), title: brandAlt(b.alt), caption: brandAlt(b.alt) }] : []));
      sitemapEntries.push({
        loc: canonical,
        alts: altPaths,
        lastmod: a.publishedAt,
        images: [{ loc: imageUrl, title: a.title, caption: heroAlt }, ...bodyImages],
      });
    }
  }

  for (const r of REDIRECTS) {
    const from = articlePath(r.lang, r.from);
    const target = r.to ? articlePath(r.lang, r.to) : homePath(r.lang) + '#articles';
    const html = `<!doctype html><html lang="${LANG_META[r.lang].htmlLang}"><head><meta charset="utf-8" /><title>انتقال به مقاله جدید</title><link rel="canonical" href="${absoluteUrl(target)}" /><meta http-equiv="refresh" content="0; url=${target}" /></head><body><a href="${target}">${esc(target)}</a><script>location.replace(${JSON.stringify(target)});</script></body></html>`;
    written.push(writeFileSafe(from, html));
  }

  // sitemap.xml با hreflang برای هر آدرس
  const xmlEsc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const urlXml = sitemapEntries
    .map((e) => {
      const alts = LANGS.filter((l) => e.alts[l]).map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${LANG_META[l].htmlLang}" href="${absoluteUrl(e.alts[l])}" />`,
      ).join('\n');
      const images = (e.images ?? []).map(
        (img) => `    <image:image>\n      <image:loc>${xmlEsc(img.loc)}</image:loc>\n      <image:title>${xmlEsc(img.title)}</image:title>\n      <image:caption>${xmlEsc(img.caption)}</image:caption>\n    </image:image>`,
      ).join('\n');
      return `  <url>\n    <loc>${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}\n${alts}${images ? `\n${images}` : ''}\n  </url>`;
    })
    .join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urlXml}\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');

  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(DIST, 'robots.txt'), robots, 'utf8');

  console.log(`SEO: ${written.length} HTML pages + sitemap.xml + robots.txt written to dist/`);
}

main();
