import React from 'react';
import { Sparkles, Percent, ArrowLeft, ShieldCheck, Tag, MessageSquare } from 'lucide-react';

interface DoctorsSectionProps {
  onOpenBooking: () => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="promotions" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] bg-[#F0F9FF] px-3.5 py-1.5 rounded-full border border-[#BAE6FD] mb-3 font-header">
            <Sparkles className="w-4 h-4 text-[#0284C7]" />
            <span>فرصت‌های ویژه کلینیک</span>
          </div>
          <h2 className="font-header text-2xl sm:text-3xl font-black text-[#0F172A]">
            پیشنهادات و جشنواره تخفیفات
          </h2>
          <p className="font-sans text-xs sm:text-sm text-slate-500 mt-2">
            از جدیدترین تخفیف‌های درمانی و بسته‌های تخصصی زیبایی کلینیک پری سیما بهره‌مند شوید
          </p>
        </div>

        {/* Promotion Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Special Discount Banner */}
          <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-[#0284C7] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="relative h-56 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800"
                alt="جشنواره جوانسازی و پاکسازی"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent" />
              <div className="absolute top-4 right-4 bg-rose-500 text-white font-header text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <Percent className="w-3.5 h-3.5" />
                <span>تخفیف ویژه جشنواره</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-header text-lg font-black text-[#0F172A] mb-2">
                  پکیج جامع جوانسازی و فیشیال تخصصی
                </h3>
                <p className="font-sans text-xs text-slate-600 leading-relaxed mb-4">
                  شامل هایفوتراپی صورت، پاکسازی مدیکال و آبرسانی عمیق پوست با تخفیف محدود. مناسب جهت بهبود بافت، لیفت غیرتهاجمی و بازیابی شفافیت طبیعی چهره.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold font-header">
                  <ShieldCheck className="w-4 h-4" />
                  <span>تضمین کیفیت و مواد استاندارد</span>
                </div>
                <button
                  onClick={onOpenBooking}
                  className="font-header text-xs font-bold text-white bg-[#1E3A8A] hover:bg-[#0284C7] px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>رزرو با تخفیف</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Featured Service Banner */}
          <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-[#0284C7] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="relative h-56 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800"
                alt="کاشت و تقویت تخصصی مو"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent" />
              <div className="absolute top-4 right-4 bg-[#0284C7] text-white font-header text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <Tag className="w-3.5 h-3.5" />
                <span>خدمت ویژه</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-header text-lg font-black text-[#0F172A] mb-2">
                  کلینیک تخصصی پیوند و تقویت موی طبیعی
                </h3>
                <p className="font-sans text-xs text-slate-600 leading-relaxed mb-4">
                  ارائه خدمات تخصصی کاشت مو با متد Micro-FIT، مزوتراپی ریشه‌ای و کنترل ریزش با بهره‌گیری از بروزترین تجهیزات و آنالیز دقیق تراکم فولیکول‌ها.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#0284C7] text-xs font-bold font-header">
                  <MessageSquare className="w-4 h-4" />
                  <span>مشاوره تخصصی قبل از اقدام</span>
                </div>
                <button
                  onClick={onOpenBooking}
                  className="font-header text-xs font-bold text-slate-800 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>دریافت مشاوره</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;