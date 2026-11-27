import React, { useEffect } from 'react';
import { trackEvent } from '../lib/analytics';
import { X, Phone, MessageCircle, Clock } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { pageT } from '../i18n/pages';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  onConsultationSubmitted?: () => void;
}

// رزرو نوبت: بدون ذخیره‌سازی در پایگاه داده؛ بیمار مستقیم با کلینیک تماس می‌گیرد یا پیام می‌دهد
export const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose }) => {
  const { lang, content } = useI18n();
  const c = content.clinic;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const waNumber = `98${c.mobile1.replace(/^0/, '')}`;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-header text-xl font-bold text-[#0F172A]">{pageT(lang, 'bkTitle')}</h2>
          <button onClick={onClose} aria-label={pageT(lang, 'bkClose')} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <p className="font-sans text-sm text-slate-600 leading-loose">{pageT(lang, 'bkDesc')}</p>
        <div className="space-y-3">
          <a onClick={() => trackEvent('phone_click', { location: 'booking_dialog' })} href={`tel:${c.phone1}`} className="flex items-center justify-center gap-2 rounded-xl bg-[#0C4A6E] hover:bg-[#0369A1] text-white px-5 py-3 text-sm font-semibold font-header" dir="ltr">
            <Phone className="h-4 w-4" /> {c.phone1Display}
          </a>
          <a onClick={() => trackEvent('phone_click', { location: 'booking_dialog' })} href={`tel:${c.mobile1}`} className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 text-[#0F172A] px-5 py-3 text-sm font-semibold font-header" dir="ltr">
            <Phone className="h-4 w-4" /> {c.mobile1Display}
          </a>
          <a onClick={() => trackEvent('whatsapp_click', { location: 'booking_dialog' })} href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500 text-emerald-700 px-5 py-3 text-sm font-semibold font-header">
            <MessageCircle className="h-4 w-4" /> {pageT(lang, 'bkWa')}
          </a>
        </div>
        <div className="flex items-start gap-2 text-xs text-slate-500 font-sans leading-relaxed">
          <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>{pageT(lang, 'bkWorking')}: {c.workingHours}</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
