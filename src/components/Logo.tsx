import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  textColor?: 'dark' | 'light';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  textColor = 'dark',
  showSubtitle = true,
}) => {
  const isDark = textColor === 'dark';

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl',
  };

  const subtitleSizes = {
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  };

  // اصلاح مسیر لوگو برای سازگاری با گیت‌هاب پیج
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`;

  return (
    <div className="flex items-center gap-2.5 select-none">
      <img 
        src={logoSrc} 
        alt="لوگو کلینیک پری سیما" 
        className={`${iconSizes[size]} object-contain flex-shrink-0`}
      />

      <div className="flex flex-col text-right">
        <span
          className={`font-header font-black leading-tight ${titleSizes[size]} ${
            isDark ? 'text-[#0F172A]' : 'text-white'
          }`}
        >
          کلینیک زیبایی{' '}
          <span className="font-header font-black text-[#0284C7]">
            پری سیما
          </span>
        </span>

        {showSubtitle && (
          <span
            className={`font-header font-bold ${subtitleSizes[size]} ${
              isDark ? 'text-slate-500' : 'text-slate-300'
            } mt-0.5`}
          >
            پوست، مو و جوانسازی
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;