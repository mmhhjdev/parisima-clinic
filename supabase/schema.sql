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


-- ============================================================
-- نظرات بیماران (با تایید مدیر نمایش داده می‌شوند)
-- ============================================================
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  rating      smallint    not null check (rating between 1 and 5),
  comment     text        not null,
  status      text        not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at  timestamptz not null default now()
);
create index if not exists reviews_status_created_idx on public.reviews (status, created_at desc);
alter table public.reviews enable row level security;

-- عمومی: فقط ثبت نظر جدید با وضعیت pending؛ خواندن فقط نظرهای تاییدشده
drop policy if exists "public submit review" on public.reviews;
create policy "public submit review" on public.reviews for insert to anon, authenticated
  with check (
    status = 'pending'
    and char_length(name) between 2 and 60
    and char_length(comment) between 10 and 800
    and rating between 1 and 5
  );
drop policy if exists "public read approved reviews" on public.reviews;
create policy "public read approved reviews" on public.reviews for select to anon, authenticated
  using (status = 'approved');

-- مدیر: دیدن همه، تایید/رد و حذف
drop policy if exists "admin read reviews" on public.reviews;
create policy "admin read reviews" on public.reviews for select to authenticated using (true);
drop policy if exists "admin update reviews" on public.reviews;
create policy "admin update reviews" on public.reviews for update to authenticated using (true) with check (true);
drop policy if exists "admin delete reviews" on public.reviews;
create policy "admin delete reviews" on public.reviews for delete to authenticated using (true);


-- ============================================================
-- پرسش و پاسخ: پرسش‌ها و پاسخ‌های کاربران و پزشکان (با تایید مدیر)
-- ============================================================
create table if not exists public.qa_questions (
  id          uuid primary key default gen_random_uuid(),
  first_name  text        not null check (char_length(first_name) between 2 and 30),
  service     text        not null default 'عمومی',
  question    text        not null check (char_length(question) between 10 and 500),
  status      text        not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at  timestamptz not null default now()
);
create table if not exists public.qa_answers (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid        not null references public.qa_questions(id) on delete cascade,
  author_type  text        not null check (author_type in ('doctor','user')),
  author_name  text        not null check (char_length(author_name) between 2 and 60),
  body         text        not null check (char_length(body) between 5 and 1000),
  status       text        not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at   timestamptz not null default now()
);
create index if not exists qa_questions_status_idx on public.qa_questions (status, created_at desc);
create index if not exists qa_answers_question_idx on public.qa_answers (question_id, status, created_at);
alter table public.qa_questions enable row level security;
alter table public.qa_answers enable row level security;

-- عمومی: ثبت پرسش و پاسخ کاربر فقط با وضعیت pending؛ خواندن فقط موارد تاییدشده
drop policy if exists "public submit question" on public.qa_questions;
create policy "public submit question" on public.qa_questions for insert to anon, authenticated
  with check (status = 'pending');
drop policy if exists "public read approved questions" on public.qa_questions;
create policy "public read approved questions" on public.qa_questions for select to anon, authenticated
  using (status = 'approved');

drop policy if exists "public submit user answer" on public.qa_answers;
create policy "public submit user answer" on public.qa_answers for insert to anon, authenticated
  with check (author_type = 'user' and status = 'pending');
drop policy if exists "public read approved answers" on public.qa_answers;
create policy "public read approved answers" on public.qa_answers for select to anon, authenticated
  using (status = 'approved');

-- مدیر: دیدن همه، ثبت پاسخ پزشک (تاییدشده)، تایید/رد و حذف
drop policy if exists "admin all questions" on public.qa_questions;
create policy "admin all questions" on public.qa_questions for all to authenticated using (true) with check (true);
drop policy if exists "admin all answers" on public.qa_answers;
create policy "admin all answers" on public.qa_answers for all to authenticated using (true) with check (true);
