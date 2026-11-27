import React, { useEffect, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { Star, Send, CheckCircle2, AlertCircle, Quote } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { pageT } from '../i18n/pages';
import { fetchApprovedReviews, submitReview, Review } from '../lib/supabase';

const Stars: React.FC<{ value: number; onChange?: (v: number) => void }> = ({ value, onChange }) => (
  <div className="flex gap-1" dir="ltr" role={onChange ? 'radiogroup' : 'img'} aria-label={`${value}/5`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        disabled={!onChange}
        onClick={() => onChange?.(n)}
        aria-label={`${n}`}
        className={onChange ? 'cursor-pointer' : 'cursor-default'}
      >
        <Star className={`h-5 w-5 ${n <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
      </button>
    ))}
  </div>
);

export const ReviewsSection: React.FC = () => {
  const { lang } = useI18n();
  const [items, setItems] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // فیلد مخفی ضد ربات
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    fetchApprovedReviews().then(setItems);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // ربات
    if (name.trim().length < 2 || comment.trim().length < 10 || !consent) {
      setMsg({ type: 'err', text: pageT(lang, 'rvInvalid') });
      return;
    }
    setBusy(true);
    setMsg(null);
    const res = await submitReview({ name, rating, comment });
    setBusy(false);
    if (res.success) {
      trackEvent('review_submit');
      setMsg({ type: 'ok', text: pageT(lang, 'rvSent') });
      setName(''); setComment(''); setRating(5); setConsent(false);
    } else {
      // خطای فنی برای عیب‌یابی نمایش داده می‌شود؛ بعد از رفع مشکل حذف شود
      setMsg({ type: 'err', text: `${pageT(lang, 'rvError')}${res.error ? ` [${res.error}]` : ''}` });
    }
  };

  const fieldCls = 'w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-[#0369A1] focus:ring-1 focus:ring-[#0369A1]';
  const dateFmt = (iso: string) => new Date(iso).toLocaleDateString(lang === 'fa' ? 'fa-IR' : lang === 'ar' ? 'ar-EG' : 'en-US');

  return (
    <section id="reviews" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-10">
          <h2 className="font-header text-2xl sm:text-3xl font-black text-[#0F172A]">{pageT(lang, 'rvTitle')}</h2>
          <p className="font-sans text-sm text-slate-500 mt-2 leading-loose">{pageT(lang, 'rvDesc')}</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4 content-start">
            {items.length === 0 && <p className="font-sans text-sm text-slate-500 sm:col-span-2">{pageT(lang, 'rvEmpty')}</p>}
            {items.map((r) => (
              <article key={r.id} className="rounded-2xl border border-slate-200 bg-[#FAF9F6] p-5 flex flex-col gap-3">
                <Quote className="h-5 w-5 text-[#0369A1]" />
                <p className="font-sans text-sm text-slate-700 leading-loose flex-1">{r.comment}</p>
                <div className="flex items-center justify-between gap-2">
                  <div className="font-header text-sm font-semibold text-[#0F172A]">{r.name}</div>
                  <Stars value={r.rating} />
                </div>
                <div className="font-sans text-[11px] text-slate-400">{dateFmt(r.created_at)}</div>
              </article>
            ))}
          </div>

          <form onSubmit={onSubmit} className="lg:col-span-2 rounded-2xl border border-slate-200 bg-[#FAF9F6] p-6 space-y-4 h-fit">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-header">{pageT(lang, 'rvName')}</label>
              <input className={fieldCls} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoComplete="name" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-header">{pageT(lang, 'rvRating')}</label>
              <Stars value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-header">{pageT(lang, 'rvComment')}</label>
              <textarea className={fieldCls} rows={4} value={comment} onChange={(e) => setComment(e.target.value)} maxLength={800} />
            </div>
            <label className="flex items-start gap-2 text-xs text-slate-600 font-sans leading-relaxed">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
              <span>{pageT(lang, 'rvConsent')}</span>
            </label>
            {/* فیلد مخفی: فقط ربات‌ها پرش می‌کنند */}
            <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" aria-hidden="true" />
            <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0C4A6E] hover:bg-[#0369A1] disabled:opacity-60 text-white px-6 py-3 text-sm font-semibold font-header transition-colors cursor-pointer">
              <Send className="h-4 w-4" /> {pageT(lang, 'rvSubmit')}
            </button>
            {msg && (
              <p className={`flex items-start gap-2 text-xs leading-relaxed ${msg.type === 'ok' ? 'text-emerald-700' : 'text-red-600'}`}>
                {msg.type === 'ok' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                <span>{msg.text}</span>
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
