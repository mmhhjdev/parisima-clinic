import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    // اگر سایت مستقیماً روی دامنه اصلی بالا می آید، '/' درست است.
    // اما اگر روی گیت‌هاب پیجز به صورت ساب‌پوشه ارور داد، آن را روی '/parisima-clinic/' قرار دهید.
    base: '/parisima-clinic/', 
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});