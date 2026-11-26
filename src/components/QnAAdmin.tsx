import React, { useCallback, useEffect, useState } from 'react';
import { Check, X, Trash2, RefreshCw, Stethoscope } from 'lucide-react';
import { DOCTORS } from '../data/clinicData';
import { fetchAdminQa, setQaStatus, deleteQa, addDoctorAnswer, QaQuestion, QaAnswer, QaStatus } from '../lib/supabase';

// مدیریت پرسش و پاسخ: تایید، رد، حذف و ثبت پاسخ پزشک
export const QnAAdmin: React.FC = () => {
  const [questions, setQuestions] = useState<QaQuestion[]>([]);
  const [answers, setAnswers] = useState<QaAnswer[]>([]);
  const [filter, setFilter] = useState<QaStatus | 'all'>('pending');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [docQ, setDocQ] = useState<string | null>(null);
  const [docName, setDocName] = useState(DOCTORS[0]?.name ?? '');
  const [docText, setDocText] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetchAdminQa();
    setQuestions(r.questions); setAnswers(r.answers); setError(r.error ?? '');
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const setQ = async (id: string, status: QaStatus) => {
    if (await setQaStatus('qa_questions', id, status)) setQuestions((p) => p.map((q) => (q.id === id ? { ...q, status } : q)));
  };
  const setA = async (id: string, status: QaStatus) => {
    if (await setQaStatus('qa_answers', id, status)) setAnswers((p) => p.map((a) => (a.id === id ? { ...a, status } : a)));
  };
  const removeQ = async (id: string) => {
    if (window.confirm('این پرسش و همه‌ی پاسخ‌هایش حذف شود؟') && (await deleteQa('qa_questions', id))) {
      setQuestions((p) => p.filter((q) => q.id !== id)); setAnswers((p) => p.filter((a) => a.question_id !== id));
    }
  };
  const removeA = async (id: string) => {
    if (window.confirm('این پاسخ حذف شود؟') && (await deleteQa('qa_answers', id))) setAnswers((p) => p.filter((a) => a.id !== id));
  };
  const submitDoctor = async (qid: string) => {
    if (docText.trim().length < 5) return;
    if (await addDoctorAnswer({ questionId: qid, doctorName: docName, body: docText })) {
      setDocQ(null); setDocText(''); load();
    }
  };

  const tabCls = (on: boolean) => `px-3 py-1.5 rounded-lg text-xs font-semibold font-header ${on ? 'bg-[#0C4A6E] text-white' : 'bg-white text-slate-600 border border-slate-200'}`;
  const count = (list: { status: QaStatus }[], s: QaStatus) => list.filter((x) => x.status === s).length;
  const shownQ = questions.filter((q) => filter === 'all' || q.status === filter);
  const badge = (s: QaStatus) => s === 'approved' ? 'bg-emerald-50 text-emerald-700' : s === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700';
  const label = (s: QaStatus) => s === 'approved' ? 'تاییدشده' : s === 'rejected' ? 'ردشده' : 'در انتظار';

  return (
    <div className="mx-4 mt-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-200">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-bold text-[#0F172A] font-header ml-2">پرسش و پاسخ</span>
          <button className={tabCls(filter === 'pending')} onClick={() => setFilter('pending')}>در انتظار ({count(questions, 'pending')}) / پاسخ‌ها: {count(answers, 'pending')}</button>
          <button className={tabCls(filter === 'approved')} onClick={() => setFilter('approved')}>تاییدشده</button>
          <button className={tabCls(filter === 'rejected')} onClick={() => setFilter('rejected')}>ردشده</button>
          <button className={tabCls(filter === 'all')} onClick={() => setFilter('all')}>همه</button>
        </div>
        <button onClick={load} className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#0369A1]">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> بروزرسانی
        </button>
      </div>
      {error && <div className="m-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">خطا: {error}</div>}

      <div className="divide-y divide-slate-100">
        {shownQ.length === 0 && <p className="p-6 text-sm text-slate-500 text-center">موردی در این بخش نیست.</p>}
        {shownQ.map((q) => {
          const list = answers.filter((a) => a.question_id === q.id && (filter === 'all' || a.status === filter || filter === 'pending'));
          return (
            <div key={q.id} className="p-4 space-y-3">
              <div className="flex flex-col md:flex-row md:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-semibold text-[#0F172A]">{q.first_name}</span>
                    <span className="text-slate-500">· {q.service}</span>
                    <span className={`px-2 py-0.5 rounded-full ${badge(q.status)}`}>{label(q.status)}</span>
                    <span className="text-slate-400" dir="ltr">{new Date(q.created_at).toLocaleString('fa-IR')}</span>
                  </div>
                  <p className="text-sm text-slate-800 mt-1.5 leading-relaxed">{q.question}</p>
                </div>
                <div className="flex gap-2 shrink-0 flex-wrap">
                  {q.status !== 'approved' && <button onClick={() => setQ(q.id, 'approved')} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold"><Check className="h-3.5 w-3.5" /> تایید</button>}
                  {q.status !== 'rejected' && <button onClick={() => setQ(q.id, 'rejected')} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-semibold"><X className="h-3.5 w-3.5" /> رد</button>}
                  <button onClick={() => setDocQ(docQ === q.id ? null : q.id)} className="inline-flex items-center gap-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0369A1] px-3 py-1.5 text-xs font-semibold"><Stethoscope className="h-3.5 w-3.5" /> پاسخ پزشک</button>
                  <button onClick={() => removeQ(q.id)} className="inline-flex items-center gap-1 rounded-lg text-red-600 hover:bg-red-50 px-3 py-1.5 text-xs font-semibold"><Trash2 className="h-3.5 w-3.5" /> حذف</button>
                </div>
              </div>

              {docQ === q.id && (
                <div className="rounded-xl bg-sky-50 border border-sky-200 p-3 space-y-2">
                  <select value={docName} onChange={(e) => setDocName(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
                    {DOCTORS.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                  <textarea rows={3} value={docText} onChange={(e) => setDocText(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" placeholder="پاسخ پزشک" />
                  <button onClick={() => submitDoctor(q.id)} className="rounded-lg bg-[#0C4A6E] text-white px-4 py-2 text-xs font-semibold">ثبت پاسخ پزشک (منتشر می‌شود)</button>
                </div>
              )}

              {list.length > 0 && (
                <div className="mr-4 md:mr-10 space-y-2">
                  {list.map((a) => (
                    <div key={a.id} className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex flex-col md:flex-row md:items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{a.author_type === 'doctor' ? `پزشک: ${a.author_name}` : `کاربر: ${a.author_name}`}</span>
                          <span className={`px-2 py-0.5 rounded-full ${badge(a.status)}`}>{label(a.status)}</span>
                        </div>
                        <p className="text-sm text-slate-700 mt-1 leading-relaxed">{a.body}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {a.status !== 'approved' && <button onClick={() => setA(a.id, 'approved')} className="rounded-lg bg-emerald-600 text-white px-2.5 py-1 text-xs font-semibold">تایید</button>}
                        {a.status !== 'rejected' && <button onClick={() => setA(a.id, 'rejected')} className="rounded-lg bg-slate-200 text-slate-700 px-2.5 py-1 text-xs font-semibold">رد</button>}
                        <button onClick={() => removeA(a.id)} className="rounded-lg text-red-600 px-2.5 py-1 text-xs font-semibold">حذف</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QnAAdmin;
