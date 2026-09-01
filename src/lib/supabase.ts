import { createClient } from '@supabase/supabase-js';
import { Consultation } from '../types';

// خواندن متغیرهای محیطی (باید در فایل .env تنظیم شده باشند)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('تنظیمات Supabase در فایل .env یافت نشد!');
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);

/**
 * دریافت تمامی نوبت‌ها مستقیماً از Supabase
 */
export async function fetchConsultations(): Promise<{ data: Consultation[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return { data: (data || []) as Consultation[] };
  } catch (err: any) {
    console.error('Supabase fetch error:', err?.message);
    return { data: [], error: err?.message };
  }
}

/**
 * ثبت نوبت جدید مستقیماً در Supabase
 */
export async function submitConsultation(entry: {
  patient_name: string;
  phone: string;
  doctor_name: string;
  service_type: string;
  notes?: string;
}): Promise<{ success: boolean; id: string; error?: string }> {
  const trackingId = `PRS-${Math.floor(10000 + Math.random() * 90000)}`;
  const newRecord = {
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
    const { data, error } = await supabase
      .from('consultations')
      .insert([newRecord])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, id: data?.[0]?.id || trackingId };
  } catch (err: any) {
    console.error('Supabase insert error:', err?.message);
    return { success: false, id: '', error: err?.message };
  }
}

/**
 * تغییر وضعیت نوبت در Supabase
 */
export async function updateConsultationStatus(
  id: string,
  newStatus: 'pending' | 'called' | 'completed'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('consultations')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase update status error:', err);
    return false;
  }
}

/**
 * ویرایش یادداشت نوبت در Supabase
 */
export async function updateConsultationNotes(
  id: string,
  notes: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('consultations')
      .update({ notes })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase update notes error:', err);
    return false;
  }
}

/**
 * حذف نوبت از Supabase
 */
export async function deleteConsultation(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('consultations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase delete error:', err);
    return false;
  }
}