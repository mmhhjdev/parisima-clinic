# تنظیمات GitHub Pages و Secrets

## Secrets (Settings → Secrets and variables → Actions → New repository secret)

| نام | مقدار | نکته |
|---|---|---|
| `VITE_SUPABASE_URL` | آدرس پروژه‌ی Supabase مثل `https://xxxx.supabase.co` | از Supabase → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | کلید anon / publishable | هرگز کلید `service_role` را اینجا نگذارید |

## Pages

Settings → Pages → Build and deployment → Source: **GitHub Actions**

## نکات
- Environment به‌صورت خودکار با نام `github-pages` ساخته می‌شود؛ نیازی به ساختن دستی آن در صفحه‌ی Environments نیست.
- اگر Secrets تنظیم نشود، بیلد انجام می‌شود اما بخش‌های Supabase (نظرات، پرسش و پاسخ، پنل ادمین) کار نمی‌کنند.
- بعد از اضافه کردن Secrets، workflow را از تب Actions با `Run workflow` اجرا کنید.
