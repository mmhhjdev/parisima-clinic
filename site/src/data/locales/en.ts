import type { LocaleContent, ClinicInfo, Doctor, Service, FaqItem, Article } from '../../types';
import { DOCTORS, SERVICES, FAQ_ITEMS } from '../clinicData';
import { ARTICLES } from '../articlesData';
import { mergeById } from './merge';

const clinic: ClinicInfo = {
  name: 'Pari Sima Cosmetic & Dermatology Clinic',
  shortName: 'Pari Sima Clinic',
  subTitle: 'Skin, Hair, Aesthetics & Specialized Dermatology',
  doctor1: 'Dr. Seyed Ali Hejrati',
  doctor1Specialty: 'Hair Transplant, Mesotherapy & Rejuvenation Specialist',
  doctor1Code: '83525',
  doctor2: 'Dr. Mohammad Javad Nakhaei',
  doctor2Specialty: 'Dermatology & Skin Disease Specialist',
  doctor2Code: '42171',
  address: 'Valiasr Street, above Vey Park, Zafaraniyeh Crossroad, Zafaraniyeh Physicians Building, 2nd Floor, Unit 8, Tehran, Iran',
  addressShort: 'Zafaraniyeh Crossroad, Zafaraniyeh Physicians Building, 2nd Floor, Unit 8, Tehran',
  phone1: '02122753592', phone1Display: '+98 21 22753592',
  phone2: '02122729078', phone2Display: '+98 21 22729078',
  mobile1: '09101646504', mobile1Display: '+98 910 164 6504',
  mobile2: '09223224310', mobile2Display: '+98 922 322 4310',
  workingHours: 'Saturday to Wednesday: 7:00 AM – 8:00 PM (closed Thursdays & Fridays)',
};

const doctorsOv: Record<string, Partial<Doctor>> = {
  'dr-hejrati': {
    name: 'Dr. Seyed Ali Hejrati', title: 'Hair Transplant, Mesotherapy & Rejuvenation Specialist',
    role: 'Skin, hair & natural hair restoration', medicalCode: 'Medical System Code: 83525',
    schedule: 'Saturday to Wednesday (7:00–20:00) – by appointment',
    bio: 'Dr. Seyed Ali Hejrati has extensive clinical experience in natural hair transplantation at the highest density, root mesotherapy for skin and hair, filler and Botox injections, and non-surgical rejuvenation of the face and body at Pari Sima Clinic.',
    specialties: ['Natural hair transplant with maximum density and a natural hairline', 'Specialized mesotherapy against hair loss and for hair strengthening', 'Facial rejuvenation, HIFU and skin lifting', 'Expert filler and Botox injections with certified brands'],
    featuredServices: ['Natural hair transplant', 'Specialized hair mesotherapy', 'Botox injections', 'Dermal filler injections'],
  },
  'dr-nakhaei': {
    name: 'Dr. Mohammad Javad Nakhaei', title: 'Dermatology & Skin Disease Specialist',
    role: 'Skin, hair & laser specialist', medicalCode: 'Medical System Code: 42171',
    schedule: 'Saturday to Wednesday (7:00–20:00) – by appointment',
    bio: 'Dr. Mohammad Javad Nakhaei is a board-certified dermatologist who applies modern diagnostic and treatment methods to a wide range of skin conditions, including acne, eczema, psoriasis, stubborn pigmentation and deep scars.',
    specialties: ['Root-cause diagnosis and treatment of acne and eczema', 'Specialized removal of moles, warts and skin lesions', 'Treatment of acne scars and stubborn pigmentation', 'Specialized medical laser (fractional CO2 and Q-switched)'],
    featuredServices: ['Mole & skin lesion removal', 'Wart removal', 'Acne & facial pimple treatment', 'Scar & acne mark treatment'],
  },
};

const servicesOv: Record<string, Partial<Service>> = {
  'hair-transplant': { title: 'Natural Hair Transplant (Micro-FIT)', categoryLabel: 'Hair Transplant', imageAlt: 'Natural Micro-FIT hair transplant at Pari Sima Clinic, Zafaraniyeh', shortDescription: 'Natural hair transplant at the highest possible density, with a natural hairline design and precise, minimally invasive techniques.', fullDescription: 'Hair transplantation performed under the direct supervision of Dr. Seyed Ali Hejrati, using very fine micromotor tools without a visible surgical incision, to achieve maximum density with a natural growth angle.', benefits: ['Hairline design tailored to your facial features', 'Painless and stitch-free under local anesthesia', 'Highest graft survival rate and follicle density', 'Very short recovery period'], duration: 'One session of 6–8 hours', sessions: '1 session', recoveryTime: '2 to 3 days' },
  'mesotherapy-hair': { title: 'Specialized Hair Mesotherapy', categoryLabel: 'Hair Strengthening & Mesotherapy', imageAlt: 'Hair mesotherapy and injection of strengthening solutions into hair roots', shortDescription: 'Specialized solutions and growth factors injected to stop hair loss and stimulate new growth.', fullDescription: 'Direct nourishment of hair roots with micronutrients, vitamins and active enzymes to stop shedding and thicken fine hair.', benefits: ['Fast control of hereditary and hormonal hair loss', 'Improved circulation and revival of weak follicles', 'Stronger follicles and thicker hair'], duration: '30 minutes', sessions: '4 to 6 sessions', recoveryTime: 'No downtime' },
  'mesotherapy-face': { title: 'Facial Mesotherapy & Skin Rejuvenation', categoryLabel: 'Mesotherapy & Hydration', imageAlt: 'Facial mesotherapy for skin hydration and rejuvenation', shortDescription: 'Vitamins and antioxidants injected into the dermis to hydrate, brighten and even out the skin tone.', fullDescription: 'A specialized method of nourishing facial skin with nutrients to increase radiance, reduce superficial spots and restore a fresh, healthy glow.', benefits: ['Deep hydration and brighter skin', 'Reduction of superficial spots and pigmentation', 'Improved elasticity and skin glow'], duration: '30 to 40 minutes', sessions: '3 to 5 sessions', recoveryTime: 'Mild redness for a few hours' },
  'facial-rejuvenation': { title: 'Facial Rejuvenation & HIFU', categoryLabel: 'Rejuvenation & Lifting', imageAlt: 'HIFU facial treatment and non-surgical lifting at Pari Sima Clinic', shortDescription: 'Non-surgical facial lifting, jawline definition and collagen stimulation with focused ultrasound waves.', fullDescription: 'HIFU targets the deep muscular layer SMAS to tighten skin, define the jawline and reduce sagging, with no incisions and no downtime.', benefits: ['Noticeable skin lifting in a single session', 'Long-lasting results of 12 to 18 months', 'Natural stimulation of collagen production'], duration: '45 minutes', sessions: '1 session per year', recoveryTime: 'No downtime' },
  'botox': { title: 'Specialized Botox Injections', categoryLabel: 'Aesthetic Injections', imageAlt: 'Botox injections for forehead and crow’s feet, specialized treatment', shortDescription: 'Treatment of expression lines on the forehead, between the brows and around the eyes (crow’s feet) with authentic brands.', fullDescription: 'Controlled and safe relaxation of the muscles that cause wrinkles, smoothing forehead, frown and eye-area lines with certified products.', benefits: ['Treats forehead, frown and crow’s-feet lines', 'Prevents deeper static wrinkles from forming', 'Keeps your natural facial expression'], duration: '15 to 20 minutes', sessions: '1 session (every 4 to 6 months)', recoveryTime: 'No downtime' },
  'filler': { title: 'Dermal Filler Injections', categoryLabel: 'Aesthetic Injections', imageAlt: 'Lip filler and jawline contouring with hyaluronic acid', shortDescription: 'Balanced volume, facial contouring, jawline definition and smile-line filling with hyaluronic acid.', fullDescription: 'Professional injection of high-quality, certified hyaluronic acid fillers to shape lips, cheeks and chin and to soften smile lines and under-eye hollows naturally.', benefits: ['Natural volume for lips and cheeks', 'Jawline definition and balanced facial proportions', 'Only certified hyaluronic acid products are used'], duration: '20 to 30 minutes', sessions: '1 session', recoveryTime: '1 to 2 days of mild swelling' },
  'mole-removal': { title: 'Mole Removal', categoryLabel: 'Skin Treatments', imageAlt: 'Removal of moles from the face and body with advanced techniques at Pari Sima Clinic', shortDescription: 'Removal of raised, flat and hanging moles from the face and body with the lowest risk of scarring.', fullDescription: 'Removal of benign skin lesions and moles with certified equipment under the supervision of a dermatologist, with pathology testing available when needed.', benefits: ['Complete mole removal without damaging surrounding tissue', 'Minimized risk of a lasting scar', 'Careful expert examination before the procedure'], duration: '20 to 30 minutes', sessions: '1 session', recoveryTime: '3 to 5 days' },
  'wart-removal': { title: 'Wart Removal', categoryLabel: 'Skin Treatments', imageAlt: 'Specialized treatment and removal of skin warts', shortDescription: 'Root-cause treatment and removal of warts and viral skin lesions with modern, safe methods.', fullDescription: 'Accurate diagnosis and specialized treatment of common, plantar and flat warts using standard clinical methods to prevent spreading.', benefits: ['Eliminates the viral tissue of the wart', 'Prevents recurrence and spread', 'Quick, minimally invasive methods'], duration: '15 to 30 minutes', sessions: 'Depends on the number and type of lesions', recoveryTime: 'A few days' },
  'acne-treatment': { title: 'Specialized Acne Treatment', categoryLabel: 'Skin Conditions', imageAlt: 'Specialized treatment of acne and active pimples', shortDescription: 'Root-cause diagnosis and treatment of inflammatory, cystic acne and blackheads.', fullDescription: 'Clinical assessment by a dermatologist to prescribe a medication protocol and controlled cleansing to regulate excess oil and clear acne.', benefits: ['Controls active and inflamed pimples', 'Regulates sebum production', 'Prevents acne scars and marks'], duration: 'Consultation and specialist examination', sessions: 'According to the treatment protocol', recoveryTime: 'No downtime' },
  'eczema-treatment': { title: 'Eczema & Skin Sensitivity Treatment', categoryLabel: 'Skin Conditions', imageAlt: 'Treatment of eczema, skin sensitivity and dermatitis', shortDescription: 'Fast relief from itching, control of chronic eczema and treatment of contact dermatitis.', fullDescription: 'A personalized care and medication plan to rebuild the damaged skin barrier and relieve itching, redness and flaking.', benefits: ['Fast relief from severe inflammation and itching', 'Rebuilds and strengthens the skin barrier', 'Personalized home-care program'], duration: 'Specialist consultation', sessions: 'Based on the doctor’s diagnosis', recoveryTime: 'No downtime' },
  'scar-treatment': { title: 'Scar, Acne Mark & Pigmentation Treatment', categoryLabel: 'Repair & Skin Renewal', imageAlt: 'Treatment of acne scars and pigmentation with subcision and laser', shortDescription: 'Improvement of sunken scars, acne marks and stubborn pigmentation with subcision and laser combined.', fullDescription: 'Releasing the tethered tissue of the scar and smoothing the skin surface with modern treatment protocols under Dr. Nakhaei’s supervision.', benefits: ['Noticeable improvement in acne-scar texture', 'Lightening of skin spots and melasma', 'More even skin tone and clarity'], duration: '45 minutes', sessions: '3 to 4 sessions', recoveryTime: '2 to 3 days' },
  'laser-treatment': { title: 'Specialized Skin Laser Treatment', categoryLabel: 'Medical Laser', imageAlt: 'Specialized skin laser treatment and fractional resurfacing', shortDescription: 'Fractional resurfacing, closing enlarged pores, freckle removal and skin renewal with advanced laser devices.', fullDescription: 'Medical laser technologies to improve skin texture, clear surface lesions and stimulate fibroblasts under a dermatologist’s supervision.', benefits: ['Closes enlarged pores', 'Removes surface lesions and pigmentation', 'Layer-by-layer rejuvenation and brightening'], duration: '30 to 45 minutes', sessions: '2 to 3 sessions', recoveryTime: '3 to 5 days' },
  'medical-facial': { title: 'Medical Facial & Deep Skin Cleansing', categoryLabel: 'Clinical Treatments', imageAlt: 'Deep skin cleansing and medical facial at the clinic', shortDescription: 'Deep pore cleansing, sebum control and hydration with specialized therapeutic serums.', fullDescription: 'Therapeutic skin care in a sterile clinical setting using layered cleansing, blackhead extraction and antioxidant nourishment.', benefits: ['Restores skin radiance and freshness', 'Removes blackheads', 'Instant hydration for dehydrated skin'], duration: '60 minutes', sessions: 'Periodic / monthly', recoveryTime: 'No downtime' },
};

const faqOv: Record<string, Partial<FaqItem>> = {
  'faq-1': { question: 'Do hair transplants, filler or Botox injections hurt?', answer: 'No. All procedures use advanced local anesthesia, so you should not feel significant pain during treatment. Mild stinging or tightness may occur once the anesthesia wears off, which is easily tolerable.', category: 'Aesthetic Services' },
  'faq-2': { question: 'How long do Botox and filler last?', answer: 'Botox usually lasts 4 to 6 months, depending on the product and your metabolism. Hyaluronic acid fillers last from about 6 months to over a year, depending on the treated area and brand.', category: 'Injections' },
  'faq-3': { question: 'How long is the recovery after a hair transplant, and when can I return to work?', answer: 'The initial recovery after a hair transplant is about 5 to 7 days. After 3 to 5 days you can resume light daily and office activities. Small scabs in the donor area usually disappear within 10 to 14 days.', category: 'Hair Transplant' },
  'faq-4': { question: 'What is the best way to permanently treat open pores and acne scars?', answer: 'The right treatment depends on scar depth and skin type. The best results usually come from combining modern methods such as fractional laser, subcision and mesotherapy, performed by our specialists.', category: 'Skin Treatment' },
  'faq-5': { question: 'How do I book an appointment at Pari Sima Clinic?', answer: 'You can submit a request online through the booking form on this website, or call the clinic directly. Our team will contact you as soon as possible to confirm the exact visit time.', category: 'Booking' },
};

const articlesOv: Record<string, Partial<Article>> = {
  '1': { author: 'Dr. Seyed Ali Hejrati', title: 'Everything You Need to Know About Post-Hair Transplant Care', excerpt: 'Natural hair transplantation is one of the safest ways to restore lost hair. Learn the key steps of aftercare.', content: `Natural hair transplants today use advanced techniques with a short recovery period, but following aftercare instructions plays a major role in the final result.\n\n### Key aftercare tips\n1. **Sleeping position:** For the first few nights, keep your head elevated and sleep on your back to avoid pressure on the transplanted grafts.\n2. **Washing:** Wash only as instructed by your doctor, using a gentle medical shampoo.\n3. **Avoid strain:** Avoid heavy exercise, heavy sweating and bending over for at least two weeks.\n\nPari Sima Clinic supports you through every stage of your hair transplant with an experienced medical team.`, category: 'Hair Transplant', date: '25 Aug 2026', readTime: '4 min' },
  '2': { author: 'Dr. Seyed Ali Hejrati', title: 'Botox vs. Filler: The Key Differences in Facial Rejuvenation', excerpt: 'Botox and fillers are two of the most popular non-surgical rejuvenation options, but they work in very different ways.', content: `Many patients ask whether Botox or filler is better. In reality, they serve different purposes and complement each other rather than replace one another.\n\n### What is Botox?\nBotox is a muscle relaxant. When forehead lines or crow’s feet form because the muscles contract excessively, Botox temporarily stops that contraction and the skin looks smoother.\n\n### What is filler?\nWith age, the fat under the skin and the volume of some facial areas decline. Hyaluronic acid fillers act as a natural volumizer, filling hollows, shaping lips and defining the jawline.\n\nDuring an in-person consultation, your doctor examines your facial anatomy and determines which areas need Botox and which need filler for a natural, refreshed look.`, category: 'Rejuvenation', date: '19 Aug 2026', readTime: '5 min' },
  '3': { author: 'Dr. Seyed Ali Hejrati', title: 'Proven Methods to Treat Enlarged Pores on the Face', excerpt: 'Enlarged pores are a common concern, and they can be noticeably improved with modern medical treatments such as laser, microneedling and mesotherapy.', content: `Enlarged pores are usually caused by genetics, excess skin oil or loss of elasticity with age.\n\n### Clinical treatment options\n* **Microneedling and mesotherapy:** stimulate collagen and improve skin texture.\n* **Rejuvenation laser:** controlled resurfacing that helps tighten pores.\n* **Fractional radiofrequency:** stimulates deeper skin layers.\n\nThe Pari Sima team will recommend the most suitable treatment for your skin type after a specialist assessment.`, category: 'Skin Care', date: '6 Aug 2026', readTime: '3 min' },
  '4': { author: 'Dr. Seyed Ali Hejrati', title: 'The Benefits of Hair Mesotherapy for Stopping Hair Loss and Strengthening Roots', excerpt: 'Hair mesotherapy involves injecting nutrients and vitamins into the scalp, which improves circulation and helps control hair shedding.', content: `Hair mesotherapy is a non-surgical treatment in which nutrients, vitamins, amino acids and medications are injected directly into the dermal layer around the hair follicles.\n\nThis improves local blood flow, nourishes weakened follicles and helps neutralize hormones that drive hair loss. It is especially effective for hereditary and hormonal hair thinning.`, category: 'Hair Strengthening', date: '1 Aug 2026', readTime: '4 min' },
  '5': { author: 'Dr. Seyed Ali Hejrati', title: 'HIFU Facial Lifting: Tightening Skin Without Surgery or Downtime', excerpt: 'HIFU stimulates deep collagen and lifts facial and neck skin in a single session using focused ultrasound waves.', content: `HIFU stands for High-Intensity Focused Ultrasound. This advanced technology reaches the deep layers of the skin and activates collagen production without damaging the surface.\n\n### Key benefits of HIFU\n* Results that last one to two years\n* No surgery and no downtime\n* Skin tightening and reduction of chin sagging`, category: 'Rejuvenation', date: '24 Jul 2026', readTime: '4 min' },
  '7': { author: 'Dr. Seyed Ali Hejrati', title: 'Russian & Natural Lip Filler: Benefits and Aftercare', excerpt: 'The Russian lip style gives lips a full, defined and natural shape and is one of the most popular filler styles.', content: `The Russian lip technique focuses on increasing lip height and defining its shape without making the lips look protruding or unnatural.\n\n### Aftercare\n* Avoid hot drinks during the first 24 hours\n* Do not apply lip makeup until the next day\n* Avoid massaging the lips randomly`, category: 'Aesthetic Care', date: '9 Jul 2026', readTime: '4 min' },
  '8': { author: 'Dr. Seyed Ali Hejrati', title: 'Who Is a Good Candidate for a Hair Transplant? A Patient Selection Guide', excerpt: 'Not everyone with hair loss is a candidate for transplantation. Learn the criteria and when medication should come first.', content: `Before deciding on a hair transplant, a specialist must carry out a careful assessment, because hair loss has many causes and not all types respond to transplantation in the same way.\n\n### Who is a good candidate?\n* People with hereditary hair loss in a male or female pattern that has progressed beyond what medication alone can manage.\n* People with healthy follicles and sufficient density in the donor area (the back and sides of the scalp).\n* People with realistic expectations who understand how permanent the result is.\n\n### Who should try other treatment first?\n* Hair loss caused by active scalp conditions such as alopecia areata or infections.\n* Hair loss linked to anemia, vitamin deficiency or thyroid disorders, which should be treated first.\n* Temporary shedding after childbirth or severe stress.\n\nIn these cases, mesotherapy and complementary treatments can help control shedding. Pari Sima Clinic will recommend the most suitable path after a specialist examination.`, category: 'Hair Transplant', date: '6 Nov 2026', readTime: '5 min' },
  '9': { author: 'Dr. Seyed Ali Hejrati', title: 'Fractional Laser for Skin: Uses, Benefits and Recovery', excerpt: 'Fractional laser stimulates collagen through controlled micro-columns and helps improve acne scars, marks and surface pigmentation.', content: `Fractional laser is one of the most modern dermatology techniques. Instead of destroying the entire skin surface, it creates many small, controlled columns of treatment among healthy tissue. As these columns heal, the body produces new collagen.\n\n### Main uses\n* Improving acne scars and sunken scars\n* Reducing the appearance of enlarged pores and rough texture\n* Lightening surface spots and pigmentation\n\n### Recovery\nSkin usually stays red and sensitive for 3 to 5 days. Use repairing creams, avoid sun exposure and follow your doctor’s instructions.\n\nThe number of sessions and laser intensity depend on your skin type and goals. Dr. Nakhaei will examine your skin before treatment and recommend the right plan.`, category: 'Dermatology', date: '31 Oct 2026', readTime: '4 min' },
  '11': {
    title: 'GLP-1 Weight-Loss Injections and Anesthesia Risk: Why You Must Tell Your Doctor',
    excerpt: 'Weekly GLP-1 injections such as Ozempic, Wegovy and Mounjaro can slow stomach emptying and raise the risk of aspiration during anesthesia. Disclosing their use before surgery is essential.',
    keywords: 'GLP-1, Ozempic, Wegovy, Mounjaro, anesthesia risk, aspiration, gastric emptying, pre-surgery fasting, patient safety',
    content: `
      Recently, a case was brought before the forensic medicine authority in which an anesthesiologist was found guilty. A patient was scheduled for a surgical procedure requiring general anesthesia. Before surgery, the patient was stable, all laboratory tests were normal, and both the internist and the anesthesiologist had confirmed that the patient was medically fit for the operation.

      ### The question that came too late
      Before the procedure began, the anesthesiologist asked the patient how many hours they had fasted. The patient replied that they had followed the instructions fully and had fasted for a full 10 hours. Once anesthesia was started, the patient developed aspiration (stomach contents entering the lungs) and a severe drop in blood oxygen. Resuscitation efforts were unsuccessful and the patient died.

      That is when the situation became critical, because the patient's condition before surgery had been stable and the operation itself was not considered high-risk. A closer review of the patient's circumstances revealed what had happened.

      ### The weight-loss drug the patient did not consider a medication
      The patient was using a weekly injectable weight-loss medication from the GLP-1 receptor agonist group, such as Ozempic, Wegovy or Mounjaro. The patient had not mentioned it to the doctor, believing it was simply a slimming product rather than a medication for a chronic condition. The doctor, for their part, had not recorded its use in the medication history and had not asked about it.

      The patient was still in the dose-escalation phase and was experiencing delayed gastric emptying, a side effect that is common in the early stages of these drugs. The medication had not been stopped before surgery. When anesthesia began and the stomach had not fully emptied, its contents moved upward, were aspirated into the lungs, and led to falling oxygen levels, acute respiratory failure and, ultimately, death.

      ### What should have been done before surgery
      Since this medication was used for weight loss rather than diabetes, stopping it one to two weeks before surgery should have been recommended. The patient should also have been advised to avoid eating for 24 hours before the procedure, while clear fluids could be permitted up to at least 6 hours before the usual fasting period.

      Most importantly, a gastric ultrasound should have been performed to assess stomach contents and emptying. If residual food was present, the surgery should have been postponed, unless it was an emergency. In that case, the anesthesiologist must take the special precautions required for such situations.

      ### An important message for patients and clinicians
      These medications are now widely prescribed, and patients sometimes start them on their own. For this reason, anesthesia providers should ask every patient, whether male or female, about the use of these drugs, even if the patient has not mentioned them.

      If you use GLP-1 medications, tell your doctor and anesthesia team before any procedure or anesthesia. Decisions about stopping or continuing the medication should only be made on your doctor's instructions, and you should never stop it on your own. As use of these drugs continues to grow, this case is unlikely to be the last.
    `,
    category: 'Anesthesia & Patient Safety',
    author: 'Dr. Seyed Ali Hejrati',
  },
  '12': {
    title: 'Can Warts Spread at the Gym? A Guide to Preventing Plantar Warts',
    excerpt: 'Yes, plantar warts can spread in locker rooms, showers and around pools, and through shared items. Wearing sandals, using personal equipment and caring for your skin can greatly reduce the risk.',
    keywords: 'plantar warts, gym warts, wart transmission, HPV, wart prevention, locker room, swimming pool, Zafaraniyeh dermatology',
    content: `
      Warts are caused by the human papillomavirus (HPV). Yes, warts can spread in gyms, especially plantar warts on the soles of the feet. However, transmission requires specific conditions, and good hygiene can significantly reduce the risk.

      ### The virus and warm, damp environments
      The HPV types that cause plantar warts are not highly contagious, but the virus can survive for some time in warm, damp environments such as locker rooms, showers and the areas around pools.

      ### Main transmission routes at the gym
      Transmission usually happens through direct skin contact with a contaminated surface. In a gym, the following surfaces can carry the virus:
      * Locker room and shower floors
      * Shared exercise mats, such as yoga mats
      * Gym equipment

      If your skin, especially on the soles of your feet, has a scratch or cut, the virus can enter the body through it and cause a wart.

      ### Risk factors
      * **Walking barefoot:** the most common route of plantar wart transmission, particularly in locker rooms, showers and around pools.
      * **Sharing personal items:** towels, sandals or exercise mats used without proper protection.
      * **Damaged skin:** cuts, scratches or cracks in the skin provide an entry point for the virus.

      ### How to prevent warts
      1. Always wear sandals. Never walk barefoot in locker rooms, showers or around pools.
      2. Use your own items. Bring your own exercise mat, towel and sandals to the gym.
      3. Clean surfaces. Before and after using shared equipment and mats, wipe them down with a damp cloth or a disinfectant spray.
      4. Protect your skin. If you have a cut or scratch, cover it with a waterproof plaster before exercising.
      5. Keep your feet dry. After exercising, dry your feet thoroughly and wear clean socks.
      6. Avoid contact with other people's warts. Never touch a wart on someone else's skin.

      ### About HPV types
      Common skin warts, including plantar warts, are caused by low-risk HPV types. These are different from high-risk HPV types, which are spread sexually and can cause cancer, and the two should not be confused.

      ### In summary
      Wart transmission at the gym is possible, but by practicing good personal hygiene, wearing sandals and using your own equipment, you can greatly reduce your risk. If a wart is spreading or does not improve with home care, see a dermatologist for assessment and treatment.
    `,
    category: 'Dermatology',
    author: 'Dr. Seyed Ali Hejrati',
  },
};

export const EN: LocaleContent = {
  clinic,
  doctors: mergeById(DOCTORS, doctorsOv),
  services: mergeById(SERVICES, servicesOv).map((s) => ({ ...s, doctorName: doctorsOv[s.doctorId]?.name ?? s.doctorName })),
  faqs: mergeById(FAQ_ITEMS, faqOv),
  articles: mergeById(ARTICLES, articlesOv),
};
