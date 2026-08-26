import React from 'react';
import { X, MessageCircle, Send } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const whatsappNumber = "989101626504";
  const whatsappDisplay = "0910-1626504";
  const defaultMessage = encodeURIComponent("باسلام، جهت دریافت مشاوره و نوبت‌دهی در کلینیک پری سیما پیام می‌دهم.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-slate-100 text-right animate-in fade-in zoom-in-95 duration-200">
        
        {/* دکمه بستن */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* سربرگ */}
        <div className="mb-6">
          <h3 className="font-header text-xl sm:text-2xl font-black text-slate-900">ثبت درخواست نوبت</h3>
          <p className="font-sans text-xs text-slate-500 mt-1">
            اطلاعات خود را وارد کنید یا مستقیم در واتساپ پیام دهید.
          </p>
        </div>

        {/* گزینه مشاوره مستقیم در واتساپ (بالای فرم) */}
        <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="block font-header text-xs font-bold text-emerald-950">ارتباط فوری در واتساپ</span>
              <span className="text-[11px] text-emerald-700 font-mono" dir="ltr">{whatsappDisplay}</span>
            </div>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 shadow-xs"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>چت واتساپ</span>
          </a>
        </div>

        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <span className="relative bg-white px-3 text-[11px] text-slate-400 font-medium">یا تکمیل فرم زیر</span>
        </div>

        {/* فرم دریافت اطلاعات بیمار */}
        <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">نام و نام خانوادگی</label>
            <input
              type="text"
              required
              placeholder="مثال: علی محمدی"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] text-xs font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">شماره تماس (همراه)</label>
            <input
              type="tel"
              required
              placeholder="09123456789"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] text-xs font-mono text-right"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1E3A8A] hover:bg-[#0F172A] text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs font-header shadow-md mt-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>ثبت نوبت در سیستم</span>
          </button>
        </form>

      </div>
    </div>
  );
};