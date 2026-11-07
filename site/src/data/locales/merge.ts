// ادغام ترجمه‌ها با داده‌های پایه بر اساس id؛ فیلدهایی که ترجمه نشده‌اند از فارسی می‌آیند.
export function mergeById<T extends { id: string }>(base: T[], overrides: Record<string, Partial<T>>): T[] {
  return base.map((item) => ({ ...item, ...(overrides[item.id] ?? {}) }));
}
