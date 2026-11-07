import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Menu, X, Flame, MapPin, BookOpen } from 'lucide-react';
import Logo from './Logo';
import { useI18n } from '../i18n/LanguageProvider';
import { LANGS, LANG_META, homePath } from '../i18n/config';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  pendingCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenAdmin }) => {
  const { t, lang, content, hrefFor } = useI18n();
  const homeHref = homePath(lang);
  const clinic = content.clinic;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // میانبر مخفی کیبورد (Ctrl + Alt + M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        onOpenAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenAdmin]);

  // انتخاب زبان: هر زبان آدرس مستقل دارد تا برای موتورهای جستجو قابل ایندکس باشد
  const langSwitch = (
    <div className="flex items-center gap-1" role="navigation" aria-label={t('nav.language')}>
      {LANGS.map((l) => (
        <a
          key={l}
          href={hrefFor(l)}
          hrefLang={LANG_META[l].htmlLang}
          lang={LANG_META[l].htmlLang}
          aria-current={l === lang ? 'true' : undefined}
          className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
            l === lang ? 'bg-[#0369A1] text-white' : 'text-slate-300 hover:text-white'
          }`}
        >
          {LANG_META[l].label}
        </a>
      ))}
    </div>
  );

  const navLinkClass = 'hover:text-[#0369A1] transition-colors py-1';

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Info Bar */}
      <div className="bg-[#0F172A] text-slate-300 text-xs py-2 px-4 border-b border-slate-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold">
              <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{t('top.address')}</span>
            </div>
            <div className="flex items-center gap-3 font-mono font-bold text-slate-300" dir="ltr">
              <a href={`tel:${clinic.phone1}`} className="flex items-center gap-1 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#0369A1]" />
                {clinic.phone1Display}
              </a>
              <span>&bull;</span>
              <a href={`tel:${clinic.phone2}`} className="hover:text-white transition-colors">{clinic.phone2Display}</a>
            </div>
          </div>
          {langSwitch}
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md shadow-slate-900/5 border-b border-slate-200 py-3'
            : 'bg-white border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href={`${homeHref}#home`} className="flex items-center gap-3 shrink-0 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg">
            <Logo size="md" textColor="dark" />
          </a>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold text-slate-800 font-header">
            <a href={`${homeHref}#promotions`} className="hover:text-[#0369A1] transition-colors py-1 flex items-center gap-1.5 text-sky-700">
              <Flame className="w-4 h-4 text-sky-600 animate-pulse" />
              <span>{t('nav.promotions')}</span>
            </a>
            <a href={`${homeHref}#services`} className={navLinkClass}>{t('nav.services')}</a>
            <a href={`${homeHref}#articles`} className="hover:text-[#0369A1] transition-colors py-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#0369A1]" />
              <span>{t('nav.articles')}</span>
            </a>
            <a href={`${homeHref}#contact`} className={navLinkClass}>{t('nav.contact')}</a>
          </div>

          <div className="hidden sm:flex items-center gap-3 font-header shrink-0">
            <a
              href={`tel:${clinic.phone1}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#0C4A6E] bg-[#F0F9FF] border border-[#BAE6FD] hover:bg-[#E0F2FE] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#0369A1]" />
              <span className="font-mono" dir="ltr">{clinic.phone1Display}</span>
            </a>
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0C4A6E] hover:bg-[#0F172A] active:scale-95 transition-all shadow-sm shadow-blue-900/20 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#38BDF8]" />
              <span>{t('nav.book')}</span>
            </button>
          </div>

          <div className="flex sm:hidden items-center gap-2 font-header">
            <button onClick={onOpenBooking} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0C4A6E]">
              {t('nav.bookShort')}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label={t('nav.menu')}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 mt-3 font-header">
            <a href={`${homeHref}#promotions`} onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm font-bold text-sky-700 border-b border-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-sky-600" />
              <span>{t('nav.promotions')}</span>
            </a>
            <a href={`${homeHref}#services`} onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-slate-800 border-b border-slate-100">{t('nav.services')}</a>
            <a href={`${homeHref}#articles`} onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm font-bold text-slate-800 border-b border-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#0369A1]" />
              <span>{t('nav.articles')}</span>
            </a>
            <a href={`${homeHref}#contact`} onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-slate-800 border-b border-slate-100">{t('nav.contact')}</a>
            <div className="py-2 border-b border-slate-100">{langSwitch}</div>
            <div className="pt-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-[#0C4A6E] flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#38BDF8]" />
                <span>{t('nav.bookMobile')}</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
