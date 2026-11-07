import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';
import { saveLocalConsultation } from '../lib/supabase';
import { useI18n } from '../i18n/LanguageProvider';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  onConsultationSubmitted?: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, initialServiceId, onConsultationSubmitted }) => {
  const { t, content } = useI18n();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedService, setSelectedService] = useState(initialServiceId || '');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const whatsappNumber = content.clinic.mobile1.replace(/^0/, '98');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(t('float.waMsg'))}`;

  useEffect(() => {
    if (isOpen) {
      setSelectedService(initialServiceId || '');
      setIsSubmitted(false);
      setError('');
    }
  }, [isOpen, initialServiceId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setError(t('modal.errRequired'));
      return;
    }
    if (!/^09\d{9}$/.test(phone.trim())) {
      setError(t('modal.errPhone'));
      return;
    }
    try {
      const service = content.services.find((s) => s.id === selectedService);
      const res = await saveLocalConsultation({
        fullName: fullName.trim(),
        phone: phone.trim(),
        serviceId: service ? service.title : t('modal.serviceNone'),
      });
      if (!res.success) {
        console.error('Booking not stored:', res.error);
        setError(t('modal.errGeneric'));
        return;
      }
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'generate_lead', { service_id: selectedService || 'general', event_category: 'consultation_form' });
      }
      setIsSubmitted(true);
      onConsultationSubmitted?.();
    } catch (err) {
      console.error(err);
      setError(t('modal.errGeneric'));
    }
  };

  const handleClose = () => {
    setFullName('');
    setPhone('');
    setIsSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 font-sans">
        <div className="bg-[#0F172A] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0369A1]/20 text-[#38BDF8]">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-header text-lg font-black">{t('modal.title')}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{t('modal.sub')}</p>
            </div>
          </div>
          <button onClick={handleClose} aria-label={t('modal.close')} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-header text-xl font-bold text-slate-800">{t('modal.okTitle')}</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">{t('modal.okText')}</p>
              <button onClick={handleClose} className="mt-4 px-6 py-2.5 rounded-xl bg-[#0C4A6E] text-white text-xs font-bold font-header hover:bg-[#0F172A] transition-colors cursor-pointer">
                {t('modal.close')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-header text-xs font-bold text-emerald-950">{t('modal.waTitle')}</span>
                    <span className="text-[11px] text-emerald-700 font-mono" dir="ltr">{content.clinic.mobile1Display}</span>
                  </div>
                </div>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center gap-1.5 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                  <span>{t('modal.waBtn')}</span>
                </a>
              </div>

              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <span className="relative bg-white px-3 text-[11px] text-slate-400 font-medium">{t('modal.or')}</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold">{error}</div>}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-header">{t('modal.name')}</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t('modal.namePh')}
                      className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0369A1] focus:ring-1 focus:ring-[#0369A1]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-header">{t('modal.phone')}</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09123456789"
                      maxLength={11}
                      dir="ltr"
                      className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0369A1] focus:ring-1 focus:ring-[#0369A1] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-header">{t('modal.service')}</label>
                  <div className="relative">
                    <Sparkles className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0369A1] bg-white cursor-pointer"
                    >
                      <option value="">{t('modal.serviceNone')}</option>
                      {content.services.map((srv) => (
                        <option key={srv.id} value={srv.id}>{srv.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full py-3 mt-2 rounded-xl bg-[#0C4A6E] hover:bg-[#0F172A] text-white text-xs font-bold font-header transition-all shadow-md shadow-blue-900/20 active:scale-95 cursor-pointer">
                  {t('modal.submit')}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
