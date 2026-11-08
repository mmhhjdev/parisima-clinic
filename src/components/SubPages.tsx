import React from 'react';
import { Calendar, Clock, MapPin, Phone, ChevronLeft, Award } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { assetUrl } from '../lib/assets';
import { brandAlt, homePath, servicePath, servicesPath, aboutPath, contactPath } from '../i18n/config';
import { pageT } from '../i18n/pages';

// نوار مسیر (Breadcrumb) برای صفحات داخلی
const Crumbs: React.FC<{ items: { label: string; href?: string }[] }> = ({ items }) => (
  <nav aria-label="breadcrumb" className="text-xs sm:text-sm text-slate-500 mb-5 font-sans">
    <ol className="flex flex-wrap items-center gap-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-1.5">
          {it.href ? <a href={it.href} className="hover:text-[#0369A1]">{it.label}</a> : <span className="text-slate-700">{it.label}</span>}
          {i < items.length - 1 && <ChevronLeft className="h-3 w-3 opacity-60" />}
        </li>
      ))}
    </ol>
  </nav>
);

const PageShell: React.FC<{ title: string; desc: string; crumbs: { label: string; href?: string }[]; children: React.ReactNode }> = ({ title, desc, crumbs, children }) => (
  <main className="flex-1 bg-[#FAF9F6]">
    <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <Crumbs items={crumbs} />
      <h1 className="font-header font-bold text-[#0F172A] text-2xl sm:text-3xl leading-snug mb-3">{title}</h1>
      <p className="font-sans text-sm sm:text-base text-slate-600 leading-loose max-w-3xl mb-10">{desc}</p>
      {children}
    </section>
  </main>
);

const BookButton: React.FC<{ onClick: () => void; label: string }> = ({ onClick, label }) => (
  <button onClick={onClick} className="inline-flex items-center gap-2 rounded-xl bg-[#0C4A6E] hover:bg-[#0369A1] text-white px-6 py-3 text-sm font-semibold font-header transition-colors cursor-pointer">
    <Calendar className="h-4 w-4" /> {label}
  </button>
);

export const ServicesIndexPage: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const { lang, content } = useI18n();
  const home = homePath(lang);
  return (
    <PageShell title={pageT(lang, 'servicesTitle')} desc={pageT(lang, 'servicesDesc')} crumbs={[{ label: pageT(lang, 'back'), href: home }, { label: pageT(lang, 'services') }]}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {content.services.map((s) => (
          <a key={s.id} href={servicePath(lang, s.slug)} className="group flex flex-col rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[16/10] overflow-hidden bg-slate-100">
              <img src={assetUrl(s.image)} alt={brandAlt(s.imageAlt || s.title)} loading="lazy" width={800} height={500} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <span className="text-[11px] font-semibold text-[#0369A1] font-header mb-1">{s.categoryLabel}</span>
              <h2 className="font-header font-bold text-[#0F172A] text-base sm:text-lg mb-2">{s.title}</h2>
              <p className="font-sans text-sm text-slate-600 leading-relaxed flex-1">{s.shortDescription}</p>
            </div>
          </a>
        ))}
      </div>
      <div className="mt-10"><BookButton onClick={onOpenBooking} label={pageT(lang, 'bookNow')} /></div>
    </PageShell>
  );
};

export const ServicePage: React.FC<{ slug: string; onOpenBooking: () => void }> = ({ slug, onOpenBooking }) => {
  const { lang, content } = useI18n();
  const s = content.services.find((x) => x.slug === slug);
  if (!s) return null;
  const home = homePath(lang);
  return (
    <PageShell title={s.title} desc={s.shortDescription} crumbs={[{ label: pageT(lang, 'back'), href: home }, { label: pageT(lang, 'services'), href: servicesPath(lang) }, { label: s.title }]}>
      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
            <img src={assetUrl(s.image)} alt={brandAlt(s.imageAlt || s.title)} width={1200} height={675} className="w-full h-auto object-cover" />
          </div>
          <div>
            <h2 className="font-header font-bold text-lg text-[#0F172A] mb-3">{s.categoryLabel}</h2>
            <p className="font-sans text-sm sm:text-base text-slate-700 leading-loose">{s.fullDescription}</p>
          </div>
          {s.benefits?.length > 0 && (
            <div>
              <h2 className="font-header font-bold text-lg text-[#0F172A] mb-3">{pageT(lang, 'benefits')}</h2>
              <ul className="space-y-2 font-sans text-sm text-slate-700">
                {s.benefits.map((b, i) => (
                  <li key={i} className="flex gap-2"><Award className="h-4 w-4 mt-0.5 shrink-0 text-[#0369A1]" /><span>{b}</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <aside className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 font-sans text-sm">
            <div><div className="text-xs text-slate-500">{pageT(lang, 'duration')}</div><div className="font-semibold text-[#0F172A]">{s.duration}</div></div>
            <div><div className="text-xs text-slate-500">{pageT(lang, 'sessions')}</div><div className="font-semibold text-[#0F172A]">{s.sessions}</div></div>
            <div><div className="text-xs text-slate-500">{pageT(lang, 'recovery')}</div><div className="font-semibold text-[#0F172A]">{s.recoveryTime}</div></div>
            <div><div className="text-xs text-slate-500">{pageT(lang, 'doctor')}</div><a href={aboutPath(lang)} className="font-semibold text-[#0369A1] hover:underline">{s.doctorName}</a></div>
            <BookButton onClick={onOpenBooking} label={pageT(lang, 'bookNow')} />
          </div>
          <a href={servicesPath(lang)} className="block text-center text-sm text-[#0369A1] hover:underline font-header">{pageT(lang, 'allServices')}</a>
        </aside>
      </div>
    </PageShell>
  );
};

export const AboutPage: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const { lang, content } = useI18n();
  return (
    <PageShell title={pageT(lang, 'aboutTitle')} desc={pageT(lang, 'aboutDesc')} crumbs={[{ label: pageT(lang, 'back'), href: homePath(lang) }, { label: pageT(lang, 'about') }]}>
      <div className="grid md:grid-cols-2 gap-6">
        {content.doctors.map((d) => (
          <article key={d.id} className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3">
            <h2 className="font-header font-bold text-lg text-[#0F172A]">{d.name}</h2>
            <p className="font-header text-sm text-[#0369A1]">{d.title}</p>
            <p className="font-sans text-sm text-slate-700 leading-loose">{d.bio}</p>
            <div className="font-sans text-xs text-slate-500">{pageT(lang, 'medicalCode')}: {d.medicalCode}</div>
            <div>
              <h3 className="font-header font-semibold text-sm text-[#0F172A] mb-1">{pageT(lang, 'specialties')}</h3>
              <ul className="list-disc ps-5 font-sans text-sm text-slate-700 space-y-1">{d.specialties.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>
            <div className="font-sans text-xs text-slate-500 flex gap-1.5"><Clock className="h-3.5 w-3.5 mt-0.5" /> {d.schedule}</div>
          </article>
        ))}
      </div>
      <div className="mt-10"><BookButton onClick={onOpenBooking} label={pageT(lang, 'bookNow')} /></div>
    </PageShell>
  );
};

export const ContactPage: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const { lang, content } = useI18n();
  const c = content.clinic;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.addressShort + ' ' + c.name)}`;
  return (
    <PageShell title={pageT(lang, 'contactTitle')} desc={pageT(lang, 'contactDesc')} crumbs={[{ label: pageT(lang, 'back'), href: homePath(lang) }, { label: pageT(lang, 'contact') }]}>
      <div className="grid md:grid-cols-2 gap-6 font-sans text-sm">
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-5">
          <div className="flex gap-3"><MapPin className="h-5 w-5 text-[#0369A1] shrink-0" /><div><div className="text-xs text-slate-500 mb-0.5">{pageT(lang, 'address')}</div><div className="text-[#0F172A]">{c.address}</div></div></div>
          <div className="flex gap-3"><Phone className="h-5 w-5 text-[#0369A1] shrink-0" /><div><div className="text-xs text-slate-500 mb-0.5">{pageT(lang, 'phone')}</div><div className="flex flex-wrap gap-3"><a href={`tel:${c.phone1}`} className="text-[#0369A1] font-semibold" dir="ltr">{c.phone1Display}</a><a href={`tel:${c.mobile1}`} className="text-[#0369A1] font-semibold" dir="ltr">{c.mobile1Display}</a></div></div></div>
          <div className="flex gap-3"><Clock className="h-5 w-5 text-[#0369A1] shrink-0" /><div><div className="text-xs text-slate-500 mb-0.5">{pageT(lang, 'hours')}</div><div className="text-[#0F172A]">{c.workingHours}</div></div></div>
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#0369A1] font-semibold hover:underline"><MapPin className="h-4 w-4" />{pageT(lang, 'map')}</a>
        </div>
        <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between gap-6">
          <p className="text-slate-600 leading-loose">{c.addressShort}</p>
          <BookButton onClick={onOpenBooking} label={pageT(lang, 'bookNow')} />
        </div>
      </div>
    </PageShell>
  );
};

export { homePath };
