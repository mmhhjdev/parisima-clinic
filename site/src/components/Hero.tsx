import React from 'react';
import { Calendar, Phone, MessageSquare, MapPin, ShieldCheck, Award } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { assetUrl } from '../lib/assets';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const { t, content } = useI18n();
  const clinic = content.clinic;

  return (
    <section id="home" className="relative pt-16 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div role="img" aria-label={t('hero.imgAlt')} className="w-full h-full bg-cover bg-center scale-105" style={{ backgroundImage: `url(${assetUrl('images/hero-bg.svg')})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F0F9FF]/95 via-[#FFFFFF]/90 to-[#FFFFFF]/95" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-[#BAE6FD] shadow-xs text-xs font-semibold text-[#0284C7] font-header">
            <Award className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>{t('hero.pill')}</span>
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-5">
          <h1 className="font-header text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
            {t('hero.title')} <span className="font-header font-black text-[#0284C7]">{t('hero.titleAccent')}</span>
          </h1>

          <p className="font-sans text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 font-header">
            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-[#1E3A8A] hover:bg-[#0284C7] active:scale-95 transition-all shadow-md shadow-blue-950/20 flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <Calendar className="w-4 h-4 text-sky-300 group-hover:text-white transition-colors" />
              <span>{t('hero.book')}</span>
            </button>

            <a
              href={`tel:${clinic.phone1}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-[#1E3A8A] bg-white border border-[#CBD5E1] hover:border-[#0284C7] hover:bg-[#F0F9FF] transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <Phone className="w-4 h-4 text-[#0284C7]" />
              <span>{t('hero.callPrefix')} <strong className="font-mono" dir="ltr">{clinic.phone1Display}</strong></span>
            </a>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-500 font-sans">
            <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>{clinic.addressShort}</span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-6 border-t border-slate-200/80 font-header text-xs sm:text-sm text-slate-700">
          <div className="flex items-center justify-center gap-2 bg-white/90 py-2.5 px-4 rounded-xl border border-slate-200 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            <span>{t('hero.f1')}</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white/90 py-2.5 px-4 rounded-xl border border-slate-200 shadow-xs">
            <Award className="w-4 h-4 text-[#0284C7]" />
            <span>{t('hero.f2')}</span>
          </div>
          <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 bg-white/90 py-2.5 px-4 rounded-xl border border-slate-200 shadow-xs">
            <MessageSquare className="w-4 h-4 text-[#0284C7]" />
            <span>{t('hero.f3')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
