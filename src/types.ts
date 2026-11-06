export interface Doctor {
  id: string;
  name: string;
  title: string;
  role: string;
  medicalCode: string;
  schedule: string;
  bio: string;
  specialties: string[];
  featuredServices: string[];
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  doctorId: string;
  doctorName: string;
  category: 'hair' | 'rejuvenation' | 'injection' | 'skin_disease' | 'laser';
  categoryLabel: string;
  image: string;
  imageAlt: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  duration: string;
  sessions: string;
  recoveryTime: string;
  popular?: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

export interface ClinicInfo {
  name: string;
  shortName: string;
  subTitle: string;
  doctor1: string;
  doctor1Specialty: string;
  doctor1Code: string;
  doctor2: string;
  doctor2Specialty: string;
  doctor2Code: string;
  address: string;
  addressShort: string;
  phone1: string;
  phone1Display: string;
  phone2: string;
  phone2Display: string;
  mobile1: string;
  mobile1Display: string;
  mobile2: string;
  mobile2Display: string;
  workingHours: string;
}

export interface LocaleContent {
  clinic: ClinicInfo;
  doctors: Doctor[];
  services: Service[];
  faqs: FaqItem[];
  articles: Article[];
}

export interface Consultation {
  id: string;
  patient_name: string;
  phone: string;
  doctor_name: string;
  service_type: string;
  status: 'pending' | 'called' | 'completed';
  notes?: string;
  created_at: string;
}
