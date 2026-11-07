import type { Lang } from '../../i18n/config';
import type { LocaleContent } from '../../types';
import { FA } from './fa';
import { AR } from './ar';
import { EN } from './en';
import { ARTICLE_EXTRAS } from '../articleExtras';

// افزودن بخش‌های تکمیلی به متن هر مقاله
const withExtras = (lang: Lang, content: LocaleContent): LocaleContent => ({
  ...content,
  articles: content.articles.filter((a) => !a.langs || a.langs.includes(lang)).map((a) => {
    const extra = ARTICLE_EXTRAS[lang][a.slug];
    return { ...a, content: extra ? `${a.content.trim()}\n\n${extra}` : a.content.trim() };
  }),
});

export const CONTENT: Record<Lang, LocaleContent> = {
  fa: withExtras('fa', FA),
  ar: withExtras('ar', AR),
  en: withExtras('en', EN),
};
