import React from 'react';
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { articlePath, articlesIndexPath, brandAlt } from '../i18n/config';
import { assetUrl } from '../lib/assets';
import type { Article } from '../types';

interface ArticlesIndexPageProps { page: number; }
const PAGE_SIZE = 6;

export const ArticlesIndexPage: React.FC<ArticlesIndexPageProps> = ({ page }) => {
  const { content, lang } = useI18n();
  const articles = [...content.articles].reverse();
  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page || 1), totalPages);
  const visibleArticles = articles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const labels = lang === 'fa'
    ? { title: 'مقالات پوست، مو و زیبایی', intro: 'راهنماها و پاسخ‌های تخصصی برای آشنایی آگاهانه‌تر با خدمات و مراقبت‌های پوست و مو.', home: 'صفحه اصلی', all: 'مقالات', previous: 'صفحه قبل', next: 'صفحه بعد', page: 'صفحه', read: 'مطالعه مقاله' }
    : lang === 'ar'
      ? { title: 'مقالات الجلد والشعر والتجميل', intro: 'أدلة وإجابات للتعرف بشكل أفضل على العناية بالبشرة والشعر والخدمات الطبية.', home: 'الرئيسية', all: 'المقالات', previous: 'الصفحة السابقة', next: 'الصفحة التالية', page: 'صفحة', read: 'اقرأ المقال' }
      : { title: 'Skin, Hair & Aesthetic Articles', intro: 'Practical guides and expert-reviewed information about skin, hair and clinic services.', home: 'Home', all: 'Articles', previous: 'Previous page', next: 'Next page', page: 'Page', read: 'Read article' };

  const Card = ({ article }: { article: Article }) => (
    <a href={articlePath(lang, article.slug)} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:border-[#0369A1] hover:shadow-lg">
      <div className="aspect-video overflow-hidden bg-slate-100">
        <img src={assetUrl(article.image)} alt={brandAlt(article.imageAlt ?? article.title)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-[11px] text-slate-500">
          <span className="rounded-full bg-sky-50 px-3 py-1 font-bold text-sky-800">{article.category}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{article.readTime}</span>
        </div>
        <h2 className="line-clamp-2 text-base font-black leading-7 text-slate-900 group-hover:text-[#0369A1]">{article.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-600">{article.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0369A1]">{labels.read}<ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" /></span>
      </div>
    </a>
  );

  return (
    <main className="flex-1 bg-[#FAF9F6]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <nav aria-label="breadcrumb" className="mb-5 flex items-center gap-2 text-xs text-slate-500">
            <a href={lang === 'fa' ? '/' : `/${lang}/`} className="hover:text-[#0369A1]">{labels.home}</a>
            <span>/</span><span className="font-semibold text-slate-700">{labels.all}</span>
          </nav>
          <div className="flex items-center gap-3 text-[#0369A1]"><BookOpen className="h-6 w-6" /><span className="text-xs font-bold">{labels.all}</span></div>
          <h1 className="mt-3 text-2xl font-black leading-relaxed text-slate-950 sm:text-4xl">{labels.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-8 text-slate-600">{labels.intro}</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">{articles.length} {lang === 'fa' ? 'مقاله' : lang === 'ar' ? 'مقالة' : 'articles'}</p>
          <p className="text-xs font-semibold text-slate-500">{labels.page} {currentPage} / {totalPages}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{visibleArticles.map((article) => <div key={article.id} className="h-full"><Card article={article} /></div>)}</div>
        {totalPages > 1 && (
          <nav aria-label={lang === 'fa' ? 'صفحه‌بندی مقالات' : lang === 'ar' ? 'ترقيم صفحات المقالات' : 'Article pagination'} className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <a href={articlesIndexPath(lang, Math.max(1, currentPage - 1))} aria-label={labels.previous} aria-disabled={currentPage === 1} className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${currentPage === 1 ? 'pointer-events-none opacity-40' : 'hover:border-[#0369A1]'} border-slate-200 bg-white text-slate-700`}><ChevronRight className="h-4 w-4" /></a>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <a key={number} href={articlesIndexPath(lang, number)} aria-current={currentPage === number ? 'page' : undefined} className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-bold ${currentPage === number ? 'border-[#0369A1] bg-[#0369A1] text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-[#0369A1]'}`}>{number}</a>
            ))}
            <a href={articlesIndexPath(lang, Math.min(totalPages, currentPage + 1))} aria-label={labels.next} aria-disabled={currentPage === totalPages} className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${currentPage === totalPages ? 'pointer-events-none opacity-40' : 'hover:border-[#0369A1]'} border-slate-200 bg-white text-slate-700`}><ChevronLeft className="h-4 w-4" /></a>
          </nav>
        )}
      </section>
    </main>
  );
};

export default ArticlesIndexPage;
