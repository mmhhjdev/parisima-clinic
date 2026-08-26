import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Consultation } from '../types';

// خواندن اطلاعات امن از متغیرهای محیطی
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const LOCAL_STORAGE_KEY = 'parisima_clinic_consultations';

// داده‌های نمونه اولیه خالی شدند
const INITIAL_DEMO_CONSULTATIONS: Consultation[] = [];

export function getLocalConsultations(): Consultation[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_CONSULTATIONS));
      return INITIAL_DEMO_CONSULTATIONS;
    }
    return JSON.parse(saved);
  } catch {
    return INITIAL_DEMO_CONSULTATIONS;
  }
}

function saveLocalConsultations(items: Consultation[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error writing to local storage:', err);
  }
}

export function saveLocalConsultation(entry: {
  fullName: string;
  phone: string;
  doctorId?: string;
  serviceId?: string;
  createdAt?: string;
  status?: 'pending' | 'called' | 'completed';
}) {
  return submitConsultation({
    patient_name: entry.fullName,
    phone: entry.phone,
    doctor_name: entry.doctorId || 'تعیین نشده',
    service_type: entry.serviceId || 'تعیین نشده',
  });
}

/**
 * دریافت تمامی نوبت‌ها
 */
export async function fetchConsultations(): Promise<{ data: Consultation[]; isLiveSupabase: boolean; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error, falling back to local:', error.message);
        return { data: getLocalConsultations(), isLiveSupabase: false, error: error.message };
      }

      return { data: (data || []) as Consultation[], isLiveSupabase: true };
    } catch (err: any) {
      console.warn('Supabase fetch exception, falling back to local:', err?.message);
      return { data: getLocalConsultations(), isLiveSupabase: false, error: err?.message };
    }
  }

  return { data: getLocalConsultations(), isLiveSupabase: false };
}

/**
 * ثبت نوبت جدید
 */
export async function submitConsultation(entry: {
  patient_name: string;
  phone: string;
  doctor_name: string;
  service_type: string;
  notes?: string;
}): Promise<{ success: boolean; id: string; isLiveSupabase: boolean; error?: string }> {
  const trackingId = `PRS-${Math.floor(10000 + Math.random() * 90000)}`;
  const newRecord: Consultation = {
    id: trackingId,
    patient_name: entry.patient_name.trim(),
    phone: entry.phone.trim(),
    doctor_name: entry.doctor_name,
    service_type: entry.service_type,
    status: 'pending',
    notes: entry.notes || '',
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .insert([newRecord])
        .select();

      if (error) {
        console.warn('Supabase insert warning (saved locally):', error.message);
        const localList = getLocalConsultations();
        saveLocalConsultations([newRecord, ...localList]);
        return { success: true, id: newRecord.id, isLiveSupabase: false, error: error.message };
      }

      return { success: true, id: data?.[0]?.id || newRecord.id, isLiveSupabase: true };
    } catch (err: any) {
      console.warn('Supabase insert exception (saved locally):', err?.message);
      const localList = getLocalConsultations();
      saveLocalConsultations([newRecord, ...localList]);
      return { success: true, id: newRecord.id, isLiveSupabase: false, error: err?.message };
    }
  }

  const localList = getLocalConsultations();
  saveLocalConsultations([newRecord, ...localList]);
  return { success: true, id: newRecord.id, isLiveSupabase: false };
}

/**
 * تغییر وضعیت نوبت
 */
export async function updateConsultationStatus(
  id: string,
  newStatus: 'pending' | 'called' | 'completed'
): Promise<boolean> {
  let success = true;

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Supabase update status error:', error.message);
        success = false;
      }
    } catch (err) {
      console.error('Supabase update status exception:', err);
      success = false;
    }
  }

  const current = getLocalConsultations();
  const updated = current.map(item => item.id === id ? { ...item, status: newStatus } : item);
  saveLocalConsultations(updated);

  return success;
}

/**
 * ویرایش یادداشت نوبت
 */
export async function updateConsultationNotes(
  id: string,
  notes: string
): Promise<boolean> {
  let success = true;

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ notes })
        .eq('id', id);

      if (error) {
        console.error('Supabase update notes error:', error.message);
        success = false;
      }
    } catch (err) {
      console.error('Supabase update notes exception:', err);
      success = false;
    }
  }

  const current = getLocalConsultations();
  const updated = current.map(item => item.id === id ? { ...item, notes } : item);
  saveLocalConsultations(updated);

  return success;
}

/**
 * حذف نوبت
 */
export async function deleteConsultation(id: string): Promise<boolean> {
  let success = true;

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('consultations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error.message);
        success = false;
      }
    } catch (err) {
      console.error('Supabase delete exception:', err);
      success = false;
    }
  }

  const current = getLocalConsultations();
  const updated = current.filter(item => item.id !== id);
  saveLocalConsultations(updated);

  return success;
}