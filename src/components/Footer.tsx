import React from 'react';
import { Phone, MapPin, Calendar, Clock } from 'lucide-react';
import Logo from './Logo';
import { useI18n } from '../i18n/LanguageProvider';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking }) => {
  const { t, content } = useI18n();
  const clinic = content.clinic;

  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          <div className="lg:col-span-5 space-y-4">
            <Logo size="md" textColor="light" />
            <p className="font-sans text-xs text-slate-400 leading-relaxed font-light mt-3">{t('footer.about')}</p>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-header text-sm font-bold text-white border-b border-[#0284C7] pb-2 inline-block">{t('footer.quick')}</h4>
            <ul className="font-sans space-y-2 text-xs text-slate-400 font-light">
              <li><a href="#home" className="hover:text-[#38BDF8] transition-colors">{t('footer.home')}</a></li>
              <li><a href="#promotions" className="hover:text-[#38BDF8] transition-colors">{t('footer.doctors')}</a></li>
              <li><a href="#services" className="hover:text-[#38BDF8] transition-colors">{t('footer.services')}</a></li>
              <li><a href="#faq" className="hover:text-[#38BDF8] transition-colors">{t('footer.faq')}</a></li>
              <li><a href="#contact" className="hover:text-[#38BDF8] transition-colors">{t('footer.contact')}</a></li>
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-header text-sm font-bold text-white border-b border-[#0284C7] pb-2 inline-block">{t('footer.info')}</h4>
            <div className="font-sans space-y-2.5 text-xs text-slate-400 font-light">
              <div className="flex items-center gap-2 flex-wrap" dir="ltr">
                <Phone className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>{t('footer.landlines')}</span>
                <span className="font-mono text-white">{clinic.phone1Display}</span>
                <span>-</span>
                <span className="font-mono text-white">{clinic.phone2Display}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap" dir="ltr">
                <Phone className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>{t('footer.mobiles')}</span>
                <span className="font-mono text-white">{clinic.mobile1Display}</span>
                <span>-</span>
                <span className="font-mono text-white">{clinic.mobile2Display}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                <span>{clinic.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{clinic.workingHours}</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="font-header w-full py-2.5 px-4 rounded-xl bg-[#1E3A8A] hover:bg-[#0284C7] text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>{t('footer.book')}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-start font-light font-sans">
          <div>{t('footer.rights', { name: clinic.name })}</div>
          <div className="text-slate-500 text-[11px]">
            {content.doctors.map((d) => `${d.name} • ${d.medicalCode}`).join('  •  ')}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
