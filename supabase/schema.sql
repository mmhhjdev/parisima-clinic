-- ============================================================
-- پاری سیما | ساختار دیتابیس نوبت‌ها در Supabase
-- این فایل را در SQL Editor پروژه Supabase اجرا کنید.
-- ============================================================

-- 1) جدول نوبت‌ها
create table if not exists public.consultations (
  id           text primary key,                      -- شناسه پیگیری مثل PRS-12345
  patient_name text        not null,
  phone        text        not null,
  doctor_name  text        not null default 'تعیین نشده',
  service_type text        not null default 'تعیین نشده',
  status       text        not null default 'pending'
               check (status in ('pending', 'called', 'completed')),
  notes        text        not null default '',
  created_at   timestamptz not null default now()
);

create index if not exists consultations_created_at_idx
  on public.consultations (created_at desc);

-- 2) قفل امنیتی سطر (RLS) — بدون این خط، هر کسی با کلید عمومی به داده‌ها دسترسی دارد
alter table public.consultations enable row level security;

-- 3) بیمار (کاربر عمومی سایت) فقط می‌تواند نوبت جدید ثبت کند؛ نمی‌تواند بخواند یا ویرایش کند
drop policy if exists "public can submit consultation" on public.consultations;
create policy "public can submit consultation"
  on public.consultations
  for insert
  to anon, authenticated
  with check (
    char_length(patient_name) between 2 and 100
    and phone ~ '^09[0-9]{9}$'
    and status = 'pending'
  );

-- 4) فقط مدیر وارد‌شده (Supabase Auth) می‌تواند نوبت‌ها را ببیند و مدیریت کند
drop policy if exists "admin read consultations" on public.consultations;
create policy "admin read consultations"
  on public.consultations for select to authenticated using (true);

drop policy if exists "admin update consultations" on public.consultations;
create policy "admin update consultations"
  on public.consultations for update to authenticated using (true) with check (true);

drop policy if exists "admin delete consultations" on public.consultations;
create policy "admin delete consultations"
  on public.consultations for delete to authenticated using (true);

-- ============================================================
-- مدیر: در Dashboard → Authentication → Users روی Add user بزنید
-- (ایمیل و رمز عبور مدیر). سپس در Authentication → Sign In / Providers
-- گزینه "Allow new users to sign up" را خاموش کنید تا کسی بتواند خودش ثبت‌نام کند.
-- ============================================================
