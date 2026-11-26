import React, { useCallback, useEffect, useState } from 'react';
import { Check, X, Trash2, Star, RefreshCw } from 'lucide-react';
import { fetchAllReviews, setReviewStatus, deleteReview, Review, ReviewStatus } from '../lib/supabase';

// مدیریت نظرها در پنل ادمین: تایید، رد یا حذف
export const ReviewsAdmin: React.FC = () => {
  const [items, setItems] = useState<Review[]>([]);
  const [filter, setFilter] = useState<ReviewStatus | 'all'>('pending');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchAllReviews();
    setItems(res.data);
    setError(res.error ?? '');
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const act = async (id: string, status: ReviewStatus) => {
    const ok = await setReviewStatus(id, status);
    if (ok) setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };
  const remove = async (id: string) => {
    if (!window.confirm('این نظر حذف شود؟')) return;
    if (await deleteReview(id)) setItems((prev) => prev.filter((r) => r.id !== id));
  };

  const shown = items.filter((r) => filter === 'all' || r.status === filter);
  const count = (s: ReviewStatus) => items.filter((r) => r.status === s).length;
  const tabCls = (on: boolean) => `px-3 py-1.5 rounded-lg text-xs font-semibold font-header ${on ? 'bg-[#0C4A6E] text-white' : 'bg-white text-slate-600 border border-slate-200'}`;

  return (
    <div className="mx-4 mt-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-200">
        <div className="flex flex-wrap gap-2">
          <button className={tabCls(filter === 'pending')} onClick={() => setFilter('pending')}>در انتظار تایید ({count('pending')})</button>
          <button className={tabCls(filter === 'approved')} onClick={() => setFilter('approved')}>تاییدشده ({count('approved')})</button>
          <button className={tabCls(filter === 'rejected')} onClick={() => setFilter('rejected')}>ردشده ({count('rejected')})</button>
          <button className={tabCls(filter === 'all')} onClick={() => setFilter('all')}>همه</button>
        </div>
        <button onClick={load} className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#0369A1]">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> بروزرسانی
        </button>
      </div>

      {error && <div className="m-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">خطا: {error}</div>}

      <div className="divide-y divide-slate-100">
        {shown.length === 0 && <p className="p-6 text-sm text-slate-500 text-center">نظری در این بخش نیست.</p>}
        {shown.map((r) => (
          <div key={r.id} className="p-4 flex flex-col md:flex-row md:items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-[#0F172A]">{r.name}</span>
                <span className="flex" dir="ltr">{[1,2,3,4,5].map((n) => <Star key={n} className={`h-3.5 w-3.5 ${n <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />)}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${r.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : r.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>
                  {r.status === 'approved' ? 'تاییدشده' : r.status === 'rejected' ? 'ردشده' : 'در انتظار'}
                </span>
                <span className="text-[11px] text-slate-400" dir="ltr">{new Date(r.created_at).toLocaleString('fa-IR')}</span>
              </div>
              <p className="text-sm text-slate-700 mt-2 leading-relaxed whitespace-pre-line">{r.comment}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              {r.status !== 'approved' && (
                <button onClick={() => act(r.id, 'approved')} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold"><Check className="h-3.5 w-3.5" /> تایید</button>
              )}
              {r.status !== 'rejected' && (
                <button onClick={() => act(r.id, 'rejected')} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-semibold"><X className="h-3.5 w-3.5" /> رد</button>
              )}
              <button onClick={() => remove(r.id)} className="inline-flex items-center gap-1 rounded-lg text-red-600 hover:bg-red-50 px-3 py-1.5 text-xs font-semibold"><Trash2 className="h-3.5 w-3.5" /> حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsAdmin;
