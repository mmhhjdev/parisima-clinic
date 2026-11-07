import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, ExternalLink, Calendar } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';

interface ContactSectionProps {
  onOpenBooking: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenBooking }) => {
  const { t, content, lang } = useI18n();
  const clinic = content.clinic;
  const lat = 35.80345;
  const lng = 51.42035;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const waMessage = encodeURIComponent(t('float.waMsg'));
  const whatsappUrl1 = `https://wa.me/${clinic.mobile1.replace(/^0/, '98')}?text=${waMessage}`;

  return (
    <section id="contact" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0369A1] bg-[#F0F9FF] px-3 py-1 rounded-full border border-[#BAE6FD] mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#0369A1]" />
            <span className="font-header">{t('contact.badge')}</span>
          </div>
          <h2 className="font-header text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">{t('contact.title')}</h2>
          <p className="font-sans text-sm text-slate-500 mt-2">{t('contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0C4A6E] text-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#38BDF8]" />
                </div>
                <div>
                  <h3 className="font-header text-sm font-black text-[#0F172A]">{t('contact.landTitle')}</h3>
                  <p className="font-sans text-[11px] text-slate-500 mt-0.5">{t('contact.landSub')}</p>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-200 text-xs font-bold">
                <a href={`tel:${clinic.phone1}`} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#0369A1] transition-all">
                  <span className="font-sans text-slate-500 text-[11px]">{t('contact.line1')}</span>
                  <span className="font-sans font-extrabold tracking-wide text-slate-800" dir="ltr">{clinic.phone1Display}</span>
                </a>
                <a href={`tel:${clinic.phone2}`} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#0369A1] transition-all">
                  <span className="font-sans text-slate-500 text-[11px]">{t('contact.line2')}</span>
                  <span className="font-sans font-extrabold tracking-wide text-slate-800" dir="ltr">{clinic.phone2Display}</span>
                </a>
              </div>
            </div>

            <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-header text-sm font-black text-[#0F172A]">{t('contact.mobTitle')}</h3>
                  <p className="font-sans text-[11px] text-slate-500 mt-0.5">{t('contact.mobSub')}</p>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-200 text-xs font-bold">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2">
                  <a href={`tel:${clinic.mobile1}`} className="flex items-center gap-2 hover:text-[#0369A1]">
                    <span className="font-sans text-[11px] text-slate-500">{t('contact.mob1')}</span>
                    <span className="font-sans font-extrabold tracking-wide text-slate-800" dir="ltr">{clinic.mobile1Display}</span>
                  </a>
                  <a href={whatsappUrl1} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-bold rounded-lg transition-colors">
                    {t('contact.wa')}
                  </a>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2">
                  <a href={`tel:${clinic.mobile2}`} className="flex items-center gap-2 hover:text-[#0369A1]">
                    <span className="font-sans text-[11px] text-slate-500">{t('contact.mob2')}</span>
                    <span className="font-sans font-extrabold tracking-wide text-slate-800" dir="ltr">{clinic.mobile2Display}</span>
                  </a>
                  <a href={`tel:${clinic.mobile2}`} className="px-2.5 py-1 bg-[#0C4A6E] hover:bg-[#0F172A] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{t('contact.call')}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#38BDF8]" />
                </div>
                <div>
                  <h3 className="font-header text-sm font-black text-[#0F172A]">{t('contact.addrTitle')}</h3>
                  <p className="font-sans text-xs text-slate-600 mt-0.5 leading-relaxed">{clinic.address}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600 font-sans">
                <Clock className="w-4 h-4 text-[#0369A1] shrink-0" />
                <span>{clinic.workingHours}</span>
              </div>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#F8FAFC] border border-slate-200 hover:border-[#0369A1] hover:bg-[#F0F9FF] rounded-xl text-slate-700 font-header font-bold text-xs transition-all shadow-xs"
            >
              <MapPin className="w-4 h-4 text-[#0369A1]" />
              <span>{t('contact.maps')}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          <div className="lg:col-span-7 h-[420px] lg:h-[580px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative bg-slate-100">
            <iframe
              title={t('contact.mapTitle')}
              src={`https://maps.google.com/maps?q=${lat},${lng}&hl=${lang}&z=18&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>

        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-[#0C4A6E] to-[#0F172A] text-white max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-950/10">
          <div>
            <h4 className="font-header text-base sm:text-lg font-black">{t('contact.ctaTitle')}</h4>
            <p className="font-sans text-xs text-slate-300 mt-1">{t('contact.ctaText')}</p>
          </div>
          <button
            type="button"
            onClick={onOpenBooking}
            className="font-header px-6 py-3 rounded-xl bg-[#0369A1] hover:bg-[#0369A1] text-white text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>{t('contact.ctaBtn')}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
