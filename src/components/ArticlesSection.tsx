import React from 'react';
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { brandAlt, articlePath, articlesIndexPath } from '../i18n/config';
import { assetUrl } from '../lib/assets';

export const ArticlesSection: React.FC = () => {
  const { t, content, lang } = useI18n();
  const latestArticles = [...content.articles].reverse().slice(0, 3);
  const archiveLabel = lang === 'fa' ? 'مشاهده همه مقالات' : lang === 'ar' ? 'عرض جميع المقالات' : 'View all articles';

  return (
    <section id="articles" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0369A1] bg-[#F0F9FF] px-3 py-1 rounded-full border border-[#BAE6FD] mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#0369A1]" />
            <span className="font-header">{t('articles.badge')}</span>
          </div>
          <h2 className="font-header text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">{t('articles.title')}</h2>
          <p className="font-sans text-sm text-slate-500 mt-2">{t('articles.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestArticles.map((article) => (
            <a key={article.id} href={articlePath(lang, article.slug)} className="bg-[#F8FAFC] rounded-2xl overflow-hidden border border-slate-200 hover:border-[#0369A1] hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img src={assetUrl(article.image)} alt={brandAlt(article.imageAlt ?? article.title)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                  <span className="absolute top-3 end-3 bg-[#0369A1] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">{article.category}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 mb-2.5 font-sans">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{t('articles.readTime', { time: article.readTime })}</span>
                  </div>
                  <h3 className="font-header text-base font-black text-[#0F172A] group-hover:text-[#0369A1] transition-colors line-clamp-2">{article.title}</h3>
                  <p className="font-sans text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-3">{article.excerpt}</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-4 flex items-center justify-between border-t border-slate-100 mt-2">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1 font-sans"><User className="w-3.5 h-3.5 text-[#0369A1]" />{article.author}</span>
                <span className="text-xs font-bold text-[#0369A1] flex items-center gap-1 font-header">{t('articles.read')} <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" /></span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a href={articlesIndexPath(lang)} className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-6 py-3 text-sm font-bold text-white hover:bg-[#0369A1] transition-colors">
            {archiveLabel}<ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
