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

/** ثبت نوبت جدید (عمومی؛ فقط INSERT مجاز است) */
export async function submitConsultation(entry: {
  patient_name: string;
  phone: string;
  doctor_name: string;
  service_type: string;
  notes?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!supabase) return { success: false, error: NOT_CONFIGURED };

  const trackingId = `PRS-${Math.floor(10000 + Math.random() * 90000)}`;
  const record: Consultation = {
    id: trackingId,
    patient_name: entry.patient_name.trim(),
    phone: entry.phone.trim(),
    doctor_name: entry.doctor_name,
    service_type: entry.service_type,
    status: 'pending',
    notes: entry.notes || '',
    created_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabase.from('consultations').insert([record]);
    if (error) {
      console.error('Supabase insert error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, id: trackingId };
  } catch (err: any) {
    console.error('Supabase insert exception:', err?.message);
    return { success: false, error: err?.message || 'unknown error' };
  }
}

/** ثبت نوبت از فرم رزرو (نام تابع قبلی برای سازگاری با کامپوننت‌ها حفظ شده است) */
export async function saveLocalConsultation(entry: {
  fullName: string;
  phone: string;
  serviceId?: string;
}) {
  return submitConsultation({
    patient_name: entry.fullName,
    phone: entry.phone,
    doctor_name: 'تعیین نشده',
    service_type: entry.serviceId || 'تعیین نشده',
  });
}

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
