import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, User, ArrowRight, X, ExternalLink } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { assetUrl } from '../lib/assets';
import { articlePath } from '../i18n/config';
import { ArticleBody } from './ArticleBody';
import type { Article } from '../types';

export const ArticlesSection: React.FC = () => {
  const { t, content, lang, article: routeArticle } = useI18n();
  // اگر آدرس مستقیم یک مقاله باز شده باشد، همان مقاله در پنجره نمایش داده می‌شود
  const [selected, setSelected] = useState<Article | null>(routeArticle ?? null);

  return (
    <section id="articles" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] bg-[#F0F9FF] px-3 py-1 rounded-full border border-[#BAE6FD] mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#0284C7]" />
            <span className="font-header">{t('articles.badge')}</span>
          </div>
          <h2 className="font-header text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">{t('articles.title')}</h2>
          <p className="font-sans text-sm text-slate-500 mt-2">{t('articles.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.articles.map((article) => (
            <div
              key={article.id}
              className="bg-[#F8FAFC] rounded-2xl overflow-hidden border border-slate-200 hover:border-[#0284C7] hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => setSelected(article)}
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img src={assetUrl(article.image)} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <span className="absolute top-3 end-3 bg-[#0284C7] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">{article.category}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 mb-2.5 font-sans">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{article.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{t('articles.readTime', { time: article.readTime })}</span>
                  </div>
                  <h3 className="font-header text-base font-black text-[#0F172A] group-hover:text-[#0284C7] transition-colors line-clamp-2">{article.title}</h3>
                  <p className="font-sans text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-3">{article.excerpt}</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-4 flex items-center justify-between border-t border-slate-100 mt-2">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1 font-sans">
                  <User className="w-3.5 h-3.5 text-[#0284C7]" />
                  {article.author}
                </span>
                <span className="text-xs font-bold text-[#0284C7] flex items-center gap-1 font-header">
                  {t('articles.read')} <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              aria-label={t('articles.close')}
              className="absolute top-6 end-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="inline-block bg-[#F0F9FF] text-[#0284C7] text-xs font-bold px-3 py-1 rounded-md border border-[#BAE6FD] mb-3 font-header">{selected.category}</span>
            <h2 className="font-header text-xl sm:text-2xl font-black text-[#0F172A] leading-snug pe-10">{selected.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 my-4 font-sans border-y border-slate-100 py-3">
              <span className="flex items-center gap-1 font-semibold text-slate-700"><User className="w-4 h-4 text-[#0284C7]" />{selected.author}</span>
              <span>•</span>
              <span>{selected.date}</span>
              <span>•</span>
              <span>{t('articles.readTime', { time: selected.readTime })}</span>
            </div>
            <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6">
              <img src={assetUrl(selected.image)} alt={selected.title} className="w-full h-full object-cover" />
            </div>
            <ArticleBody content={selected.content} />
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <a href={articlePath(lang, selected.slug)} className="font-header inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:underline">
                <ExternalLink className="w-3.5 h-3.5" />
                {t('articles.openPage')}
              </a>
              <button onClick={() => setSelected(null)} className="font-header bg-[#0284C7] text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-[#0284C7]/90 transition-colors">
                {t('articles.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ArticlesSection;
