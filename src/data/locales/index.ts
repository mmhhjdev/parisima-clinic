import type { Lang } from '../../i18n/config';
import type { LocaleContent } from '../../types';
import { FA } from './fa';
import { AR } from './ar';
import { EN } from './en';

export const CONTENT: Record<Lang, LocaleContent> = { fa: FA, ar: AR, en: EN };
