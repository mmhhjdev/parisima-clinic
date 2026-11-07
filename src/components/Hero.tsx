import React, { useEffect, useState } from 'react';
import { Calendar, Phone, MapPin, ShieldCheck, Award, MessageSquare } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { assetUrl } from '../lib/assets';
import { BRAND_TAG } from '../i18n/config';

interface HeroProps {
  onOpenBooking: () => void;
}

// بنر تمام‌عرض (Full-width hero banner): تصویر پس‌زمینه کامل، متن در سمت شروع (راست در RTL)
export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const { t, content, lang } = useI18n();
  const isLtr = lang === 'en';
  // انگلیسی: تصویر و جهت متن چپ‌به‌راست؛ فارسی و عربی: راست‌به‌چپ
  const heroImg = isLtr ? 'images/hero-clinic-serene.webp' : 'images/hero-clinic-blue.webp';
  const dirAttr = isLtr ? 'ltr' : 'rtl';
  const clinic = content.clinic;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const reveal = (delay: string) =>
    `transition-all duration-700 ease-out ${delay} ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;

  return (
    <section id="home" dir={dirAttr} className="relative isolate overflow-hidden min-h-[560px] sm:min-h-[600px] lg:min-h-[680px] flex items-center bg-[#082F49]">
      {/* تصویر پس‌زمینه */}
      <img
        src={assetUrl(heroImg)}
        alt={`${t('hero.imgAlt')} | ${BRAND_TAG}`}
        width={1829}
        height={860}
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover saturate-150 object-[60%_center] ltr:object-[40%_center]"
      />
      {/* لایه‌ی تیره‌ی شفاف از سمت راست: متن سفید خوانا و تصویر پررنگ و شفاف در سمت چپ */}
      <div className={`absolute inset-0 -z-10 ${isLtr ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-[#082F49]/92 via-[#0C4A6E]/70 to-[#0C4A6E]/15`} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#082F49]/60 via-transparent to-transparent" />
      {/* درخشش ظریف */}
      <div className="pointer-events-none absolute -top-24 -left-24 -z-10 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 py-16 lg:py-24">
        <div className="max-w-xl lg:max-w-2xl text-start space-y-6">
          <div className={`inline-flex items-center gap-2 rounded-full border border-sky-200/40 bg-white/10 px-3.5 py-1 text-[11px] sm:text-xs font-medium text-sky-100 backdrop-blur-sm font-header ${reveal('')}`}>
            <Award className="h-3.5 w-3.5 text-sky-200" />
            <span>{t('hero.pill')}</span>
          </div>

          <h1 className={`font-header font-bold text-white leading-[1.35] tracking-normal text-2xl sm:text-3xl lg:text-4xl ${reveal('delay-100')}`}>
            {t('hero.title')}{' '}
            <span className="block mt-1.5 font-semibold text-sky-200">{t('hero.titleAccent')}</span>
          </h1>

          <p className={`font-sans font-light text-xs sm:text-sm text-sky-50/90 leading-loose max-w-md ${reveal('delay-200')}`}>
            {t('hero.subtitle')}
          </p>

          <div className={`pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 sm:gap-4 font-header ${reveal('delay-300')}`}>
            <button
              onClick={() => onOpenBooking()}
              className="group flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-[#0C4A6E] shadow-lg shadow-sky-950/30 transition-all hover:bg-sky-100 active:scale-95 cursor-pointer"
            >
              <Calendar className="h-4 w-4 text-[#0369A1] group-hover:scale-110 transition-transform" />
              <span>{t('hero.book')}</span>
            </button>

            <a
              href={`tel:${clinic.phone1}`}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-xs sm:text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <Phone className="h-4 w-4 text-sky-200" />
              <span>
                {t('hero.callPrefix')} <strong className="font-mono" dir="ltr">{clinic.phone1Display}</strong>
              </span>
            </a>
          </div>

          <div className={`flex items-center justify-start gap-2 text-[11px] sm:text-xs font-light text-sky-100/90 font-sans ${reveal('delay-300')}`}>
            <MapPin className="h-3.5 w-3.5 text-sky-200 shrink-0" />
            <span>{clinic.addressShort}</span>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-4 max-w-2xl font-header text-[11px] sm:text-xs font-normal text-white ${reveal('delay-400')}`}>
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 shrink-0 text-sky-200" />
              <span>{t('hero.f1')}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 backdrop-blur-sm">
              <Award className="h-4 w-4 shrink-0 text-sky-200" />
              <span>{t('hero.f2')}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 backdrop-blur-sm">
              <MessageSquare className="h-4 w-4 shrink-0 text-sky-200" />
              <span>{t('hero.f3')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
