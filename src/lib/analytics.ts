// رویدادهای نیت تماس و تبدیل برای GA4.
// باز شدن واتساپ یا تماس، نشانه‌ی نیت است و به معنای نوبت تکمیل‌شده نیست.
type GtagFn = (...args: unknown[]) => void;

export const trackEvent = (name: string, params: Record<string, string | number | undefined> = {}) => {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: GtagFn }).gtag;
  if (typeof gtag === 'function') gtag('event', name, params);
};
