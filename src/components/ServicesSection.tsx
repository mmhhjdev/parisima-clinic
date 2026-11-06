import React from 'react';
import { Layers, Calendar, Check, Star } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { assetUrl } from '../lib/assets';
import { Service } from '../types';

interface ServicesSectionProps {
  onSelectServiceForBooking: (service: Service) => void;
}

// فهرست خدمات با Schema در صفحات استاتیک هر زبان تولید می‌شود (scripts/generate-seo.ts)
export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForBooking }) => {
  const { t, content } = useI18n();

  return (
    <section id="services" className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] bg-[#F0F9FF] px-3 py-1 rounded-full border border-[#BAE6FD] mb-3">
            <Layers className="w-3.5 h-3.5 text-[#0284C7]" />
            <span className="font-header">{t('services.badge')}</span>
          </div>
          <h2 className="font-header text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">{t('services.title')}</h2>
          <p className="font-sans text-sm text-slate-500 mt-2">{t('services.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.services.map((service) => (
            <article key={service.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-[#0284C7] hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                {service.image && (
                  <div className="relative h-52 w-full overflow-hidden bg-slate-900/5 border-b border-slate-100 flex items-center justify-center">
                    <img
                      src={assetUrl(service.image)}
                      alt={service.imageAlt || service.title}
                      className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    {service.popular && (
                      <div className="absolute top-3 start-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 z-10">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{t('services.popular')}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
                    <span className="font-header text-[11px] font-bold text-[#0284C7] bg-[#F0F9FF] px-2.5 py-0.5 rounded-md border border-[#BAE6FD]">
                      {service.categoryLabel}
                    </span>
                    <span className="font-sans text-[11px] text-slate-500 font-medium truncate">{t('services.clinic')}</span>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-header text-lg font-black text-[#0F172A] line-clamp-1">{service.title}</h3>
                    <p className="font-sans text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">{service.shortDescription}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    {service.benefits?.slice(0, 3).map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 font-sans">
                        <Check className="w-3.5 h-3.5 text-[#0284C7] flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 bg-[#F8FAFC] rounded-xl p-2.5 grid grid-cols-2 gap-2 text-center text-[11px] border border-slate-100 font-sans">
                    <div>
                      <span className="text-slate-400 block">{t('services.duration')}</span>
                      <strong className="text-slate-700 font-semibold">{service.duration}</strong>
                    </div>
                    <div className="border-s border-slate-200">
                      <span className="text-slate-400 block">{t('services.recovery')}</span>
                      <strong className="text-slate-700 font-semibold">{service.recoveryTime}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectServiceForBooking(service)}
                  className="group font-header w-full py-2.5 px-3 rounded-xl text-xs font-bold text-[#1E3A8A] bg-[#F0F9FF] hover:bg-[#1E3A8A] hover:text-white border border-[#BAE6FD] hover:border-[#1E3A8A] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#0284C7] group-hover:text-white transition-colors" />
                  <span>{t('services.book')}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
