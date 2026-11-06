// تولید صفحات استاتیک سئو برای هر مقاله و صفحه اصلی در هر سه زبان.
// خروجی: dist/<prefix>/articles/<slug>/index.html  +  sitemap.xml  +  robots.txt
// هر صفحه شامل متن کامل مقاله (برای خزنده‌ها) و همان برنامه React است، پس برای کاربر هم کار می‌کند.
import fs from 'fs';
import path from 'path';
import {
  LANGS,
  LANG_META,
  DEFAULT_LANG,
  SITE_URL,
  articlePath,
  homePath,
  absoluteUrl,
  type Lang,
} from '../src/i18n/config';
import { CONTENT } from '../src/data/locales';
import { STRINGS } from '../src/i18n/strings';
import { parseBlocks, type Block } from '../src/lib/markdown';

const DIST = path.resolve(process.cwd(), 'dist');
const TEMPLATE_PATH = path.join(DIST, 'index.html');
const ROOT_PLACEHOLDER = '<div id="root"></div>';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

const blocksToHtml = (blocks: Block[]) =>
  blocks
    .map((b) => {
      if (b.type === 'h3') return `<h2 class="font-header text-base font-black text-[#0F172A] pt-2">${inline(b.text)}</h2>`;
      if (b.type === 'p') return `<p>${inline(b.text)}</p>`;
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

function renderPage(template: string, m: PageMeta): string {
  const meta = LANG_META[m.lang];
  const canonical = absoluteUrl(m.urlPath);
  const alternates = [
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${LANG_META[l].htmlLang}" href="${absoluteUrl(m.altPaths[l])}" />`),
    `<link rel="alternate" hreflang="x-default" href="${absoluteUrl(m.altPaths[DEFAULT_LANG])}" />`,
  ];
  const head = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="keywords" content="${esc(m.keywords)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
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

  const sitemapEntries: { loc: string; alts: Record<Lang, string>; lastmod?: string }[] = [];
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
          '@type': 'MedicalClinic',
          name: content.clinic.name,
          url: absoluteUrl(home),
          description: homeDesc,
          inLanguage: meta.htmlLang,
          address: content.clinic.address,
        },
      ],
      bodyHtml: '',
    });
    written.push(writeFileSafe(home, homeHtml));
    sitemapEntries.push({ loc: absoluteUrl(home), alts: homeAlts });

    // صفحه هر مقاله
    for (const a of content.articles) {
      const urlPath = articlePath(lang, a.slug);
      const altPaths = Object.fromEntries(LANGS.map((l) => [l, articlePath(l, a.slug)])) as Record<Lang, string>;
      const canonical = absoluteUrl(urlPath);
      const imageUrl = absoluteUrl(`/${a.image.replace(/^\//, '')}`);
      const title = `${a.title} | ${content.clinic.shortName}`;
      const keywords = a.keywords ?? `${a.category}, ${t(lang, 'seo.keywords')}`;
      const blocks = parseBlocks(a.content);

      const bodyHtml = `<main class="flex-1 bg-white"><article class="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
<nav aria-label="breadcrumb" class="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-sans mb-6"><a href="${home}">${esc(t(lang, 'article.home'))}</a><span>/</span><a href="${home}#articles">${esc(t(lang, 'article.allArticles'))}</a><span>/</span><span class="text-slate-700">${esc(a.title)}</span></nav>
<span class="inline-block bg-[#F0F9FF] text-[#0284C7] text-xs font-bold px-3 py-1 rounded-md border border-[#BAE6FD]">${esc(a.category)}</span>
<h1 class="font-header text-2xl sm:text-4xl font-black text-[#0F172A] leading-snug mt-4">${esc(a.title)}</h1>
<div class="flex flex-wrap items-center gap-4 text-xs text-slate-500 my-5 font-sans border-y border-slate-100 py-3"><span class="font-semibold text-slate-700">${esc(a.author)}</span><span>${esc(a.date)}</span><span>${esc(t(lang, 'articles.readTime', { time: a.readTime }))}</span></div>
<img src="${imageUrl}" alt="${esc(a.title)}" width="1200" height="675" class="w-full rounded-2xl mb-8" />
<p class="font-sans text-base sm:text-lg text-slate-600 leading-relaxed mb-8">${esc(a.excerpt)}</p>
<div class="font-sans text-sm text-slate-700 leading-loose space-y-4">
${blocksToHtml(blocks)}
</div>
</article></main>`;

      const jsonLd: object[] = [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: a.title,
          description: a.excerpt,
          image: [imageUrl],
          inLanguage: meta.htmlLang,
          articleSection: a.category,
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
          author: { '@type': 'Person', name: a.author },
          publisher: {
            '@type': 'Organization',
            name: content.clinic.name,
            logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.png') },
          },
          ...(a.publishedAt ? { datePublished: a.publishedAt, dateModified: a.publishedAt } : {}),
        },
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
      sitemapEntries.push({ loc: canonical, alts: altPaths, lastmod: a.publishedAt });
    }
  }

  // sitemap.xml با hreflang برای هر آدرس
  const urlXml = sitemapEntries
    .map((e) => {
      const alts = LANGS.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${LANG_META[l].htmlLang}" href="${absoluteUrl(e.alts[l])}" />`,
      ).join('\n');
      return `  <url>\n    <loc>${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}\n${alts}\n  </url>`;
    })
    .join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlXml}\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');

  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(DIST, 'robots.txt'), robots, 'utf8');

  console.log(`SEO: ${written.length} HTML pages + sitemap.xml + robots.txt written to dist/`);
}

main();
