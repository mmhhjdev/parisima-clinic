import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircleQuestion, Stethoscope, User, Send, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { pageT } from '../i18n/pages';
import { fetchPublicQa, submitQuestion, submitUserAnswer, QaQuestion, QaAnswer } from '../lib/supabase';

// فقط نام کوچک نمایش داده می‌شود (نام خانوادگی هرگز نمایش داده نمی‌شود)
const firstNameOnly = (n: string) => n.trim().split(/\s+/)[0] || '';

const fieldCls = 'w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-[#0369A1] focus:ring-1 focus:ring-[#0369A1]';

export const QnASection: React.FC = () => {
  const { lang, content } = useI18n();
  const [questions, setQuestions] = useState<QaQuestion[]>([]);
  const [answers, setAnswers] = useState<QaAnswer[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showAsk, setShowAsk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // فرم پرسش
  const [qFirst, setQFirst] = useState('');
  const [qService, setQService] = useState('');
  const [qText, setQText] = useState('');
  const [qConsent, setQConsent] = useState(false);
  // فرم پاسخ کاربر
  const [aFirst, setAFirst] = useState('');
  const [aText, setAText] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const load = () => fetchPublicQa().then((r) => { setQuestions(r.questions); setAnswers(r.answers); });
  useEffect(() => { load(); }, []);

  const byQuestion = useMemo(() => {
    const m: Record<string, QaAnswer[]> = {};
    answers.forEach((a) => { (m[a.question_id] ||= []).push(a); });
    // پاسخ پزشک اول نمایش داده شود
    Object.values(m).forEach((list) => list.sort((x, y) => (x.author_type === 'doctor' ? -1 : 1) - (y.author_type === 'doctor' ? -1 : 1)));
    return m;
  }, [answers]);

  const serviceOptions = [pageT(lang, 'qaGeneral'), ...content.services.map((s) => s.title)];
  const dateFmt = (iso: string) => new Date(iso).toLocaleDateString(lang === 'fa' ? 'fa-IR' : lang === 'ar' ? 'ar-EG' : 'en-US');

  const onAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (firstNameOnly(qFirst).length < 2 || qText.trim().length < 10 || !qConsent) {
      setMsg({ type: 'err', text: pageT(lang, 'qaInvalid') }); return;
    }
    setBusy(true); setMsg(null);
    const res = await submitQuestion({ firstName: firstNameOnly(qFirst), service: qService || pageT(lang, 'qaGeneral'), question: qText });
    setBusy(false);
    if (res.success) { setMsg({ type: 'ok', text: pageT(lang, 'qaSent') }); setQText(''); setQFirst(''); setQConsent(false); setShowAsk(false); }
    else setMsg({ type: 'err', text: pageT(lang, 'qaError') });
  };

  const onAnswer = async (e: React.FormEvent, questionId: string) => {
    e.preventDefault();
    if (honeypot) return;
    if (firstNameOnly(aFirst).length < 2 || aText.trim().length < 10) {
      setMsg({ type: 'err', text: pageT(lang, 'qaInvalid') }); return;
    }
    setBusy(true); setMsg(null);
    const res = await submitUserAnswer({ questionId, firstName: firstNameOnly(aFirst), body: aText });
    setBusy(false);
    if (res.success) { setMsg({ type: 'ok', text: pageT(lang, 'qaSent') }); setAText(''); setAFirst(''); setOpenId(null); }
    else setMsg({ type: 'err', text: pageT(lang, 'qaError') });
  };

  return (
    <section id="qa" className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <h2 className="font-header text-2xl sm:text-3xl font-black text-[#0F172A]">{pageT(lang, 'qaTitle')}</h2>
            <p className="font-sans text-sm text-slate-500 mt-2 leading-loose">{pageT(lang, 'qaDesc')}</p>
          </div>
          <button onClick={() => setShowAsk((v) => !v)} className="inline-flex items-center gap-2 rounded-xl bg-[#0C4A6E] hover:bg-[#0369A1] text-white px-5 py-2.5 text-sm font-semibold font-header cursor-pointer">
            <MessageCircleQuestion className="h-4 w-4" /> {pageT(lang, 'qaAsk')}
          </button>
        </div>

        {showAsk && (
          <form onSubmit={onAsk} className="rounded-2xl bg-white border border-slate-200 p-6 mb-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-header">{pageT(lang, 'qaFirst')}</label>
                <input className={fieldCls} value={qFirst} onChange={(e) => setQFirst(e.target.value)} maxLength={30} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-header">{pageT(lang, 'qaService')}</label>
                <select className={fieldCls} value={qService} onChange={(e) => setQService(e.target.value)}>
                  <option value="">{pageT(lang, 'qaGeneral')}</option>
                  {serviceOptions.slice(1).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-header">{pageT(lang, 'qaQuestion')}</label>
              <textarea className={fieldCls} rows={3} maxLength={500} value={qText} onChange={(e) => setQText(e.target.value)} />
            </div>
            <label className="flex items-start gap-2 text-xs text-slate-600 font-sans leading-relaxed">
              <input type="checkbox" checked={qConsent} onChange={(e) => setQConsent(e.target.checked)} className="mt-0.5" />
              <span>{pageT(lang, 'qaConsent')}</span>
            </label>
            <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" aria-hidden="true" />
            <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-[#0C4A6E] hover:bg-[#0369A1] disabled:opacity-60 text-white px-6 py-2.5 text-sm font-semibold font-header cursor-pointer">
              <Send className="h-4 w-4" /> {pageT(lang, 'qaSubmit')}
            </button>
          </form>
        )}

        {msg && (
          <p className={`mb-6 flex items-start gap-2 text-sm leading-relaxed ${msg.type === 'ok' ? 'text-emerald-700' : 'text-red-600'}`}>
            {msg.type === 'ok' ? <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" /> : <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />}
            <span>{msg.text}</span>
          </p>
        )}

        {questions.length === 0 && <p className="font-sans text-sm text-slate-500">{pageT(lang, 'qaEmpty')}</p>}

        <div className="space-y-5">
          {questions.map((q) => {
            const list = byQuestion[q.id] || [];
            const open = openId === q.id;
            return (
              <article key={q.id} className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-[#0369A1] bg-sky-50 rounded-full px-2.5 py-0.5 font-header">{q.service}</span>
                  <span className="text-[11px] text-slate-400 font-sans">{firstNameOnly(q.first_name)} · {dateFmt(q.created_at)}</span>
                </div>
                <h3 className="font-header font-bold text-[#0F172A] text-base sm:text-lg mb-4">{q.question}</h3>

                {list.length === 0 && <p className="font-sans text-xs text-slate-400 mb-3">{pageT(lang, 'qaNoAnswer')}</p>}
                <div className="space-y-3 mb-4">
                  {list.map((a) => (
                    <div key={a.id} className={`rounded-xl p-4 ${a.author_type === 'doctor' ? 'bg-sky-50 border border-sky-200' : 'bg-slate-50 border border-slate-200'}`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        {a.author_type === 'doctor' ? <Stethoscope className="h-3.5 w-3.5 text-[#0369A1]" /> : <User className="h-3.5 w-3.5 text-slate-500" />}
                        <span className={`text-[11px] font-semibold font-header ${a.author_type === 'doctor' ? 'text-[#0369A1]' : 'text-slate-500'}`}>
                          {a.author_type === 'doctor' ? `${pageT(lang, 'qaDoctor')}: ${a.author_name}` : `${pageT(lang, 'qaUser')}: ${firstNameOnly(a.author_name)}`}
                        </span>
                      </div>
                      <p className="font-sans text-sm text-slate-700 leading-loose">{a.body}</p>
                    </div>
                  ))}
                </div>

                <button onClick={() => setOpenId(open ? null : q.id)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0369A1] font-header cursor-pointer">
                  {pageT(lang, 'qaAnswerBtn')} <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>

                {open && (
                  <form onSubmit={(e) => onAnswer(e, q.id)} className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                    <input className={fieldCls} placeholder={pageT(lang, 'qaFirst')} value={aFirst} onChange={(e) => setAFirst(e.target.value)} maxLength={30} />
                    <textarea className={fieldCls} rows={3} maxLength={1000} value={aText} onChange={(e) => setAText(e.target.value)} />
                    <p className="text-[11px] text-slate-500 font-sans leading-relaxed">{pageT(lang, 'qaNote')}</p>
                    <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-[#0C4A6E] hover:bg-[#0369A1] disabled:opacity-60 text-white px-5 py-2 text-sm font-semibold font-header cursor-pointer">
                      <Send className="h-4 w-4" /> {pageT(lang, 'qaAnswerSubmit')}
                    </button>
                  </form>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QnASection;
