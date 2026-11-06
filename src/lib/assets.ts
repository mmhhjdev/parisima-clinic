// ساخت آدرس فایل‌های public با احترام به base (برای GitHub Pages و دامنه اصلی)
export const assetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return `${base}${path.replace(/^\//, '')}`;
};
