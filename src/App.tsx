import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DoctorsSection as PromotionsSection } from './components/DoctorsSection';
import { ServicesSection } from './components/ServicesSection';
import { ArticlesSection } from './components/ArticlesSection';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { AppointmentModal } from './components/AppointmentModal';
import { AdminPanel } from './components/AdminPanel';
import { Service } from './types';
import { getLocalConsultations } from './lib/supabase';
import { useI18n } from './i18n/LanguageProvider';

export function App() {
  const { dir, lang } = useI18n();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const refreshPendingCount = useCallback(() => {
    try {
      const list = getLocalConsultations() || [];
      setPendingCount(Array.isArray(list) ? list.filter((item) => item && item.status === 'pending').length : 0);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setPendingCount(0);
    }
  }, []);

  useEffect(() => {
    refreshPendingCount();
  }, [refreshPendingCount]);

  // میانبر کیبورد پنل مدیریت: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isAKey = e.key.toLowerCase() === 'a' || e.key === 'ش' || e.code === 'KeyA';
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && isAKey) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // کلیک مخفی ۴ باره روی فوتر برای ورود به پنل
  const handleSecretTripleClick = (e: React.MouseEvent) => {
    if (e.detail === 4) setIsAdminOpen(true);
  };

  const handleOpenBooking = (serviceId?: string) => {
    setSelectedServiceId(typeof serviceId === 'string' ? serviceId : undefined);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedServiceId(undefined);
  };

  const handleSelectServiceForBooking = (service: Service) => {
    if (service) {
      setSelectedServiceId(service.id);
      setIsBookingOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0F172A] flex flex-col font-sans selection:bg-[#0284C7] selection:text-white" dir={dir} lang={lang}>
      <Navbar onOpenBooking={() => handleOpenBooking()} onOpenAdmin={() => setIsAdminOpen(true)} pendingCount={pendingCount} />

      <main className="flex-1">
        <Hero onOpenBooking={() => handleOpenBooking()} />
        <PromotionsSection onOpenBooking={() => handleOpenBooking()} />
        <ServicesSection onSelectServiceForBooking={handleSelectServiceForBooking} />
        <ArticlesSection />
        <ContactSection onOpenBooking={() => handleOpenBooking()} />
        <FaqSection />
      </main>

      <div onClick={handleSecretTripleClick} className="cursor-default select-none">
        <Footer onOpenBooking={() => handleOpenBooking()} onOpenAdmin={() => setIsAdminOpen(true)} />
      </div>

      <FloatingActions onOpenBooking={() => handleOpenBooking()} />

      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        initialServiceId={selectedServiceId}
        onConsultationSubmitted={refreshPendingCount}
      />

      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} onRefreshStats={refreshPendingCount} />
    </div>
  );
}

export default App;
