import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Consultation } from '../types';

// خواندن کلیدهای عمومی (publishable/anon) از متغیرهای محیطی ساخت پروژه (.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    })
  : null;

export type ConsultationStatus = 'pending' | 'called' | 'completed';

/**
 * نوبت‌ها فقط در Supabase ذخیره می‌شوند.
 * هیچ ذخیره‌سازی محلی (localStorage) برای نوبت بیمار وجود ندارد تا درخواستی گم نشود.
 */
const NOT_CONFIGURED = 'اتصال به Supabase تنظیم نشده است (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).';

/* ---------- احراز هویت مدیر (Supabase Auth) ---------- */

export async function getAdminSession(): Promise<boolean> {
  if (!supabase) return false;
  const { data } = await supabase.auth.getSession();
  return Boolean(data.session);
}

export async function signInAdmin(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: NOT_CONFIGURED };
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function signOutAdmin(): Promise<void> {
  if (supabase) await supabase.auth.signOut();
}

/* ---------- نوبت‌ها ---------- */

/** دریافت نوبت‌ها؛ فقط برای مدیر احرازشده (RLS) */
export async function fetchConsultations(): Promise<{ data: Consultation[]; isLiveSupabase: boolean; error?: string }> {
  if (!supabase) return { data: [], isLiveSupabase: false, error: NOT_CONFIGURED };
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return { data: [], isLiveSupabase: false, error: error.message };
    return { data: (data || []) as Consultation[], isLiveSupabase: true };
  } catch (err: any) {
    return { data: [], isLiveSupabase: false, error: err?.message || 'unknown error' };
  }
}

export async function updateConsultationStatus(id: string, status: ConsultationStatus): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('consultations').update({ status }).eq('id', id);
  if (error) console.error('Supabase update status error:', error.message);
  return !error;
}

export async function updateConsultationNotes(id: string, notes: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('consultations').update({ notes }).eq('id', id);
  if (error) console.error('Supabase update notes error:', error.message);
  return !error;
}

export async function deleteConsultation(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('consultations').delete().eq('id', id);
  if (error) console.error('Supabase delete error:', error.message);
  return !error;
}

/* ---------- نظرات بیماران ---------- */

export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  created_at: string;
}

/** ثبت نظر جدید؛ بعد از تایید مدیر نمایش داده می‌شود */
export async function submitReview(entry: { name: string; rating: number; comment: string }): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: NOT_CONFIGURED };
  const { error } = await supabase.from('reviews').insert([{
    name: entry.name.trim(),
    rating: entry.rating,
    comment: entry.comment.trim(),
    status: 'pending',
  }]);
  if (error) {
    console.error('Supabase review insert error:', error.message);
    return { success: false, error: error.message };
  }
  return { success: true };
}

/** نظرهای تاییدشده برای نمایش عمومی */
export async function fetchApprovedReviews(): Promise<Review[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('reviews')
    .select('id,name,rating,comment,status,created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) { console.error('Supabase reviews read error:', error.message); return []; }
  return (data || []) as Review[];
}

/** همه‌ی نظرها برای پنل مدیر */
export async function fetchAllReviews(): Promise<{ data: Review[]; error?: string }> {
  if (!supabase) return { data: [], error: NOT_CONFIGURED };
  const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
  if (error) return { data: [], error: error.message };
  return { data: (data || []) as Review[] };
}

export async function setReviewStatus(id: string, status: ReviewStatus): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('reviews').update({ status }).eq('id', id);
  if (error) console.error('Supabase review status error:', error.message);
  return !error;
}

export async function deleteReview(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) console.error('Supabase review delete error:', error.message);
  return !error;
}

/* ---------- پرسش و پاسخ ---------- */

export type QaStatus = 'pending' | 'approved' | 'rejected';
export interface QaQuestion { id: string; first_name: string; service: string; question: string; status: QaStatus; created_at: string; }
export interface QaAnswer { id: string; question_id: string; author_type: 'doctor' | 'user'; author_name: string; body: string; status: QaStatus; created_at: string; }

export async function submitQuestion(entry: { firstName: string; service: string; question: string }): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: NOT_CONFIGURED };
  const { error } = await supabase.from('qa_questions').insert([{ first_name: entry.firstName.trim(), service: entry.service, question: entry.question.trim(), status: 'pending' }]);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function submitUserAnswer(entry: { questionId: string; firstName: string; body: string }): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: NOT_CONFIGURED };
  const { error } = await supabase.from('qa_answers').insert([{ question_id: entry.questionId, author_type: 'user', author_name: entry.firstName.trim(), body: entry.body.trim(), status: 'pending' }]);
  return error ? { success: false, error: error.message } : { success: true };
}

/** پرسش‌ها و پاسخ‌های تاییدشده برای نمایش عمومی */
export async function fetchPublicQa(): Promise<{ questions: QaQuestion[]; answers: QaAnswer[] }> {
  if (!supabase) return { questions: [], answers: [] };
  const [q, a] = await Promise.all([
    supabase.from('qa_questions').select('*').eq('status', 'approved').order('created_at', { ascending: false }).limit(50),
    supabase.from('qa_answers').select('*').eq('status', 'approved').order('created_at', { ascending: true }),
  ]);
  return { questions: (q.data || []) as QaQuestion[], answers: (a.data || []) as QaAnswer[] };
}

/** همه‌ی پرسش‌ها و پاسخ‌ها برای پنل مدیر */
export async function fetchAdminQa(): Promise<{ questions: QaQuestion[]; answers: QaAnswer[]; error?: string }> {
  if (!supabase) return { questions: [], answers: [], error: NOT_CONFIGURED };
  const [q, a] = await Promise.all([
    supabase.from('qa_questions').select('*').order('created_at', { ascending: false }),
    supabase.from('qa_answers').select('*').order('created_at', { ascending: false }),
  ]);
  const error = q.error?.message || a.error?.message;
  return { questions: (q.data || []) as QaQuestion[], answers: (a.data || []) as QaAnswer[], error };
}

export async function setQaStatus(table: 'qa_questions' | 'qa_answers', id: string, status: QaStatus): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from(table).update({ status }).eq('id', id);
  return !error;
}

export async function deleteQa(table: 'qa_questions' | 'qa_answers', id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from(table).delete().eq('id', id);
  return !error;
}

/** پاسخ پزشک؛ مستقیماً تاییدشده ثبت می‌شود */
export async function addDoctorAnswer(entry: { questionId: string; doctorName: string; body: string }): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('qa_answers').insert([{ question_id: entry.questionId, author_type: 'doctor', author_name: entry.doctorName, body: entry.body.trim(), status: 'approved' }]);
  return !error;
}
