import React from 'react';
import { Sparkles, ArrowLeft, Tag, MessageSquare, Image as ImageIcon, Calendar } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { brandAlt } from '../i18n/config';
import { assetUrl } from '../lib/assets';

interface DoctorsSectionProps {
  onOpenBooking: () => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({ onOpenBooking }) => {
  const { t } = useI18n();

  return (
    <section id="promotions" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0369A1] bg-[#F0F9FF] px-3.5 py-1.5 rounded-full border border-[#BAE6FD] mb-3 font-header">
            <Sparkles className="w-4 h-4 text-[#0369A1]" />
            <span>{t('promo.badge')}</span>
          </div>
          <h2 className="font-header text-2xl sm:text-3xl font-black text-[#0F172A]">{t('promo.title')}</h2>
          <p className="font-sans text-xs sm:text-sm text-slate-500 mt-2">{t('promo.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-[#0369A1] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="relative w-full aspect-video overflow-hidden bg-slate-900 flex items-center justify-center">
              <img
                src={assetUrl('images/special-offer-hair.webp')}
                alt={brandAlt(t('promo.cardImgAlt'))}
                className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 start-4 bg-[#0369A1] text-white font-header text-xs font-extrabold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md z-10">
                <Tag className="w-3.5 h-3.5" />
                <span>{t('promo.featured')}</span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-header text-lg font-black text-[#0F172A] mb-2">{t('promo.cardTitle')}</h3>
                <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{t('promo.cardText')}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[#0369A1] text-xs font-bold font-header">
                  <MessageSquare className="w-4 h-4" />
                  <span>{t('promo.consult')}</span>
                </div>
                <button
                  onClick={onOpenBooking}
                  className="font-header text-xs font-bold text-slate-800 bg-slate-100 hover:bg-[#0C4A6E] hover:text-white px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t('promo.getConsult')}</span>
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border-2 border-dashed border-slate-300 shadow-sm flex flex-col items-center justify-center p-8 text-center group hover:border-[#0369A1] transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-[#F0F9FF] text-[#0369A1] flex items-center justify-center mb-4 shadow-xs group-hover:scale-110 transition-transform">
              <ImageIcon className="w-7 h-7" />
            </div>
            <h3 className="font-header text-lg font-black text-[#0F172A] mb-2">{t('promo.galleryTitle')}</h3>
            <p className="font-sans text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed mb-6">{t('promo.galleryText')}</p>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-100 px-4 py-2 rounded-xl font-header">
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('promo.soon')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;
