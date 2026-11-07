import React from 'react';
import { Calendar, Clock, User, ArrowLeft, MessageSquare } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { ArticleBody } from './ArticleBody';
import { assetUrl } from '../lib/assets';
import { articlePath, brandAlt, homePath } from '../i18n/config';
import type { Article } from '../types';

interface ArticlePageProps {
  article: Article;
  onOpenBooking: () => void;
}

// صفحه‌ی مستقل هر مقاله (هم در مرورگر و هم در صفحه‌ی استاتیک سئو)
export const ArticlePage: React.FC<ArticlePageProps> = ({ article, onOpenBooking }) => {
  const { t, lang, content, dir } = useI18n();
  const related = content.articles.filter((a) => a.slug !== article.slug).slice(0, 3);
  const home = homePath(lang);

  return (
    <main className="flex-1 bg-white">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-sans mb-6">
          <a href={home} className="hover:text-[#0284C7]">{t('article.home')}</a>
          <span>/</span>
          <a href={`${home}#articles`} className="hover:text-[#0284C7]">{t('article.allArticles')}</a>
          <span>/</span>
          <span className="text-slate-700 line-clamp-1">{article.title}</span>
        </nav>

        <span className="inline-block bg-[#F0F9FF] text-[#0284C7] text-xs font-bold px-3 py-1 rounded-md border border-[#BAE6FD] font-header">
          {article.category}
        </span>
        <h1 className="font-header text-2xl sm:text-4xl font-black text-[#0F172A] leading-snug mt-4">{article.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 my-5 font-sans border-y border-slate-100 py-3">
          <span className="flex items-center gap-1 font-semibold text-slate-700"><User className="w-4 h-4 text-[#0284C7]" />{article.author}</span>
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-[#0284C7]" />{article.date}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-[#0284C7]" />{t('articles.readTime', { time: article.readTime })}</span>
        </div>

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 bg-slate-100">
          <img src={assetUrl(article.image)} alt={article.imageAlt ?? brandAlt(article.title)} className="w-full h-full object-cover" />
        </div>

        <p className={`font-sans text-base sm:text-lg text-slate-600 leading-relaxed mb-8 bg-[#F8FAFC] rounded-xl p-5 ${dir === 'rtl' ? 'border-r-4' : 'border-l-4'} border-[#0284C7]`}>
          {article.excerpt}
        </p>

        <ArticleBody content={article.content} />

        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#0F172A] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-header text-base sm:text-lg font-black">{t('article.ctaTitle')}</h2>
            <p className="font-sans text-xs text-slate-300 mt-1">{t('article.ctaText')}</p>
          </div>
          <button
            type="button"
            onClick={onOpenBooking}
            className="font-header px-6 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('article.ctaBtn')}</span>
          </button>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-header text-lg font-black text-[#0F172A] mb-4">{t('article.related')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <a key={r.id} href={articlePath(lang, r.slug)} className="group rounded-2xl border border-slate-200 hover:border-[#0284C7] overflow-hidden transition-all">
                  <img src={assetUrl(r.image)} alt={r.imageAlt ?? brandAlt(r.title)} className="w-full h-28 object-cover" loading="lazy" />
                  <div className="p-4">
                    <span className="text-[11px] font-bold text-[#0284C7]">{r.category}</span>
                    <h3 className="font-header text-sm font-bold text-[#0F172A] group-hover:text-[#0284C7] line-clamp-2 mt-1">{r.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        <a href={`${home}#articles`} className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-[#0284C7] font-header hover:underline">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t('article.backToArticles')}
        </a>
      </article>
    </main>
  );
};

export default ArticlePage;
