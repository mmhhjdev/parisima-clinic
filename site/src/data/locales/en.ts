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
  '1': { author: 'Dr. Seyed Ali Hejrati', title: 'Everything You Need to Know About Post-Hair Transplant Care', excerpt: 'Natural hair transplantation is one of the safest ways to restore lost hair. Learn the key steps of aftercare.', content: `Natural hair transplants today use advanced techniques with a short recovery period, but following aftercare instructions plays a major role in the final result.\n\n![Natural hair transplant and aftercare](/images/services/hair-transplant.webp)\n\n### Key aftercare tips\n1. **Sleeping position:** For the first few nights, keep your head elevated and sleep on your back to avoid pressure on the transplanted grafts.\n2. **Washing:** Wash only as instructed by your doctor, using a gentle medical shampoo.\n3. **Avoid strain:** Avoid heavy exercise, heavy sweating and bending over for at least two weeks.\n\nPari Sima Clinic supports you through every stage of your hair transplant with an experienced medical team.`, category: 'Hair Transplant', date: '25 Aug 2026', readTime: '4 min' },
  '2': { author: 'Dr. Seyed Ali Hejrati', title: 'Botox vs. Filler: The Key Differences in Facial Rejuvenation', excerpt: 'Botox and fillers are two of the most popular non-surgical rejuvenation options, but they work in very different ways.', content: `Many patients ask whether Botox or filler is better. In reality, they serve different purposes and complement each other rather than replace one another.\n\n![Professional Botox injection](/images/services/botox.webp)\n\n![Lip and facial filler injection](/images/services/filler.webp)\n\n### What is Botox?\nBotox is a muscle relaxant. When forehead lines or crow’s feet form because the muscles contract excessively, Botox temporarily stops that contraction and the skin looks smoother.\n\n### What is filler?\nWith age, the fat under the skin and the volume of some facial areas decline. Hyaluronic acid fillers act as a natural volumizer, filling hollows, shaping lips and defining the jawline.\n\nDuring an in-person consultation, your doctor examines your facial anatomy and determines which areas need Botox and which need filler for a natural, refreshed look.`, category: 'Rejuvenation', date: '19 Aug 2026', readTime: '5 min' },
  '3': { author: 'Dr. Seyed Ali Hejrati', title: 'Proven Methods to Treat Enlarged Pores on the Face', excerpt: 'Enlarged pores are a common concern, and they can be noticeably improved with modern medical treatments such as laser, microneedling and mesotherapy.', content: `Enlarged pores are usually caused by genetics, excess skin oil or loss of elasticity with age.\n\n![Medical facial and deep skin cleansing](/images/services/medical-facial.webp)\n\n![Facial mesotherapy and skin rejuvenation](/images/services/facial-mesotherapy.webp)\n\n### Clinical treatment options\n* **Microneedling and mesotherapy:** stimulate collagen and improve skin texture.\n* **Rejuvenation laser:** controlled resurfacing that helps tighten pores.\n* **Fractional radiofrequency:** stimulates deeper skin layers.\n\nThe Pari Sima team will recommend the most suitable treatment for your skin type after a specialist assessment.`, category: 'Skin Care', date: '6 Aug 2026', readTime: '3 min' },
  '4': { author: 'Dr. Seyed Ali Hejrati', title: 'The Benefits of Hair Mesotherapy for Stopping Hair Loss and Strengthening Roots', excerpt: 'Hair mesotherapy involves injecting nutrients and vitamins into the scalp, which improves circulation and helps control hair shedding.', content: `Hair mesotherapy is a non-surgical treatment in which nutrients, vitamins, amino acids and medications are injected directly into the dermal layer around the hair follicles.\n\n![Hair mesotherapy with nourishing cocktails](/images/services/hair-mesotherapy.webp)\n\nThis improves local blood flow, nourishes weakened follicles and helps neutralize hormones that drive hair loss. It is especially effective for hereditary and hormonal hair thinning.`, category: 'Hair Strengthening', date: '1 Aug 2026', readTime: '4 min' },
  '5': { author: 'Dr. Seyed Ali Hejrati', title: 'HIFU Facial Lifting: Tightening Skin Without Surgery or Downtime', excerpt: 'HIFU stimulates deep collagen and lifts facial and neck skin in a single session using focused ultrasound waves.', content: `HIFU stands for High-Intensity Focused Ultrasound. This advanced technology reaches the deep layers of the skin and activates collagen production without damaging the surface.\n\n![HIFU facial lifting without surgery](/images/services/hifu.webp)\n\n### Key benefits of HIFU\n* Results that last one to two years\n* No surgery and no downtime\n* Skin tightening and reduction of chin sagging`, category: 'Rejuvenation', date: '24 Jul 2026', readTime: '4 min' },
  '7': { author: 'Dr. Seyed Ali Hejrati', title: 'Russian & Natural Lip Filler: Benefits and Aftercare', excerpt: 'The Russian lip style gives lips a full, defined and natural shape and is one of the most popular filler styles.', content: `The Russian lip technique focuses on increasing lip height and defining its shape without making the lips look protruding or unnatural.\n\n![Lip filler with hyaluronic acid](/images/services/filler.webp)\n\n### Aftercare\n* Avoid hot drinks during the first 24 hours\n* Do not apply lip makeup until the next day\n* Avoid massaging the lips randomly`, category: 'Aesthetic Care', date: '9 Jul 2026', readTime: '4 min' },
  '8': { author: 'Dr. Seyed Ali Hejrati', title: 'Who Is a Good Candidate for a Hair Transplant? A Patient Selection Guide', excerpt: 'Not everyone with hair loss is a candidate for transplantation. Learn the criteria and when medication should come first.', content: `Before deciding on a hair transplant, a specialist must carry out a careful assessment, because hair loss has many causes and not all types respond to transplantation in the same way.\n\n![Hair transplant consultation before surgery](/images/services/hair-transplant.webp)\n\n### Who is a good candidate?\n* People with hereditary hair loss in a male or female pattern that has progressed beyond what medication alone can manage.\n* People with healthy follicles and sufficient density in the donor area (the back and sides of the scalp).\n* People with realistic expectations who understand how permanent the result is.\n\n### Who should try other treatment first?\n* Hair loss caused by active scalp conditions such as alopecia areata or infections.\n* Hair loss linked to anemia, vitamin deficiency or thyroid disorders, which should be treated first.\n* Temporary shedding after childbirth or severe stress.\n\nIn these cases, mesotherapy and complementary treatments can help control shedding. Pari Sima Clinic will recommend the most suitable path after a specialist examination.`, category: 'Hair Transplant', date: '6 Nov 2026', readTime: '5 min' },
  '9': { author: 'Dr. Seyed Ali Hejrati', title: 'Fractional Laser for Skin: Uses, Benefits and Recovery', excerpt: 'Fractional laser stimulates collagen through controlled micro-columns and helps improve acne scars, marks and surface pigmentation.', content: `Fractional laser is one of the most modern dermatology techniques. Instead of destroying the entire skin surface, it creates many small, controlled columns of treatment among healthy tissue. As these columns heal, the body produces new collagen.\n\n![Specialised skin laser treatment](/images/services/laser-treatment.webp)\n\n![Scar and dark mark treatment with subcision and laser](/images/services/scar-treatment.webp)\n\n### Main uses\n* Improving acne scars and sunken scars\n* Reducing the appearance of enlarged pores and rough texture\n* Lightening surface spots and pigmentation\n\n### Recovery\nSkin usually stays red and sensitive for 3 to 5 days. Use repairing creams, avoid sun exposure and follow your doctor’s instructions.\n\nThe number of sessions and laser intensity depend on your skin type and goals. Dr. Nakhaei will examine your skin before treatment and recommend the right plan.`, category: 'Dermatology', date: '31 Oct 2026', readTime: '4 min' },
  '11': {
    title: 'GLP-1 Weight-Loss Injections and Anesthesia Risk: Why You Must Tell Your Doctor',
    date: 'Nov 6, 2026',
    readTime: '6 min',
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
    date: 'Nov 6, 2026',
    readTime: '5 min',
    excerpt: 'Yes, plantar warts can spread in locker rooms, showers and around pools, and through shared items. Wearing sandals, using personal equipment and caring for your skin can greatly reduce the risk.',
    keywords: 'plantar warts, gym warts, wart transmission, HPV, wart prevention, locker room, swimming pool, Zafaraniyeh dermatology',
    content: `
      Warts are caused by the human papillomavirus (HPV). Yes, warts can spread in gyms, especially plantar warts on the soles of the feet. However, transmission requires specific conditions, and good hygiene can significantly reduce the risk.

![Professional wart treatment and removal](/images/services/wart-removal.webp)

![Removal of moles and skin lesions](/images/services/mole-removal.webp)

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
  '13': {
    author: 'Dr. Seyed Ali Hejrati',
    title: 'Hair Loss in Women and Men: Causes, Diagnosis and Treatment Options',
    seoTitle: 'Hair Loss Causes and Treatment for Women and Men | Parisima Clinic Zafaraniyeh',
    excerpt: 'Hair loss has many causes, from genetics and hormones to illness and stress. Learn how normal shedding differs from abnormal loss, how it is diagnosed, and which treatments are evidence-based.',
    keywords: 'hair loss, causes of hair loss, alopecia, hair loss treatment women, hair loss treatment men, hair transplant Tehran, Parisima, Pari-Sima, Zafaraniyeh',
    category: 'Skin & Hair',
    imageAlt: 'Hair loss in women and men: causes, diagnosis and treatment',
    date: 'Nov 7, 2026',
    readTime: '7 min',
    content: `
Hair loss is a common concern for both women and men, and it can appear at any age. Finding a few hairs on the pillow or in the shower is not always a sign of disease: hair goes through growth and resting cycles, and some daily shedding is normal. However, when the parting widens gradually, the hairline recedes, a patch becomes visibly thinner, or overall volume drops noticeably, it is worth investigating the cause.

The key point is that hair loss is not a single diagnosis. Heredity, hormonal changes, illness, nutritional deficiencies, physical stress and even hairstyles can produce different patterns. For this reason, choosing a shampoo or supplement based only on advertising is rarely a good solution. Effective treatment starts once the cause has been identified.

### The normal hair growth cycle

![Hair follicle and hair growth cycle illustration](/images/articles/parisima-hair-loss-01.webp)

Each hair grows from a follicle in the scalp and goes through a growth phase, a transition phase and a resting phase. At the end of the cycle the old hair falls out so that a new one can grow. Seeing some hairs while combing or washing is therefore not alarming by itself. What matters is a change compared with your usual pattern. Photographing the top of your head in the same light and from the same angle each month can show gradual changes more clearly.

### The main causes of hair loss

Hereditary (androgenetic) hair loss is one of the most common causes of thinning. In this condition the follicles gradually shrink and the hairs become finer and shorter. In men it often shows as a receding hairline and thinning at the crown; in women it usually appears as a widening parting and reduced density at the centre of the scalp.

![Hair loss in women and men: causes](/images/articles/hair-loss-03.webp)

Temporary diffuse shedding can occur weeks to months after a severe fever or illness, surgery, childbirth, rapid weight loss, or significant physical or emotional stress. More hairs enter the resting phase in this situation. In many cases the hair improves gradually once the trigger is removed, but it must be distinguished from other types of loss.

Iron or other nutrient deficiencies, thyroid disorders, hormonal changes, some medications, inflammatory scalp conditions and infections can also play a role. Constant traction from very tight styles, extensions or heavy braids may cause traction hair loss.

### When should you see a doctor?

Sudden and severe shedding, hair falling out in patches, scalp pain or itching, significant scaling, redness, wounds, or loss of the follicle openings all need evaluation. If hair loss comes with extreme fatigue, weight change, irregular periods or signs of hormonal imbalance, your doctor may request further tests. Do not delay a visit in patchy hair loss or severe inflammation, because some forms can cause permanent damage if treated late.

### How is hair loss diagnosed?

Assessment begins with questions about when the loss started, how fast it is progressing, family history, recent illnesses, medications, diet and hormonal changes. The scalp, pattern of density and hair shafts are then examined. Dermoscopy can show follicle details and signs of miniaturisation more clearly. Blood tests are not the same for everyone; depending on the history, your doctor may check the blood count, iron stores or thyroid function.

![Examining the scalp and hair follicles in a specialist check](/images/articles/parisima-hair-loss-02.webp)

### Medical and specialised treatments

Treatment depends on the type of hair loss, age, sex, general health and pregnancy plans. If an underlying cause such as a thyroid disorder or a proven deficiency exists, treating that cause is the most important step. In some forms of hereditary hair loss, your doctor may consider topical minoxidil or other medications. Results are not immediate and usually take several months; continuing treatment must follow your doctor's instructions.

Drugs such as finasteride or hormonal treatments are not suitable for everyone and have specific limitations and side effects. Caution is essential during pregnancy or when pregnancy is possible. Methods such as injections for certain types of alopecia, PRP, low-level laser or hair transplantation may be discussed in selected cases. None of them is a universal treatment for every type of hair loss.

![Hair mesotherapy treatment at Parisima Clinic](/images/services/hair-mesotherapy.webp)

### Nutrition and daily care

A balanced diet with adequate protein and micronutrients supports healthy hair. However, taking supplements without a clear need is not a reliable solution. Iron, zinc or biotin make sense only when a specific deficiency or need is present, and excessive intake of some nutrients can be harmful. Wet hair is more fragile, so avoid brushing it vigorously, rubbing it roughly with a towel, using high heat, and wearing very tight styles.

### Frequently asked questions

### Is it normal to lose some hair every day?

Yes. A certain amount of daily shedding is part of the natural hair cycle. A clear change from your usual pattern, or visible thinning, needs evaluation.

### Does stress cause hair loss?

Intense physical or emotional stress can trigger widespread shedding in some people a few months later. However, not every type of hair loss should be attributed to stress.

### Does anti-hair-loss shampoo make hair thicker?

A shampoo may help scalp health and reduce breakage, but it is usually not the main treatment for hereditary hair loss or follicle disease.

### Conclusion

Hair loss has many causes, and successful treatment depends on an accurate diagnosis. Early assessment, avoiding unsupervised use of supplements and medications, gentle hair care and regular follow-up help you choose the right path. If thinning is increasing, or if it is accompanied by inflammation, pain or patchy loss, see a dermatologist for an examination.

**Medical note:** This article is for general information and does not replace an examination, diagnosis or prescription by a doctor.

### Reliable sources

- [American Academy of Dermatology: Hair loss diagnosis and treatment](https://www.aad.org/public/diseases/hair-loss/treatment/diagnosis-treat)
- [American Academy of Dermatology: Causes of hair loss](https://www.aad.org/public/diseases/hair-loss/causes/18-causes)
`,
  },
  '14': {
    author: 'Dr. Seyed Ali Hejrati',
    title: 'Adult Acne: Causes, Treatment and How to Prevent Scarring',
    seoTitle: 'Adult Acne Treatment: Causes and Proven Solutions | Parisima Clinic',
    excerpt: 'Adult acne is far from a teenage problem. Learn how hormones, skin care and treatments work together, which active ingredients are effective, and how to prevent dark marks and scars.',
    keywords: 'adult acne, acne treatment, causes of acne, acne scars, acne treatment Tehran, Parisima, Pari-Sima, Zafaraniyeh',
    category: 'Skin & Hair',
    imageAlt: 'Adult acne treatment and prevention of acne scars',
    date: 'Nov 7, 2026',
    readTime: '6 min',
    content: `
Many people believe acne only affects teenagers, but facial breakouts can continue into the twenties, thirties, forties and beyond, or appear for the first time in adulthood. Recurrent breakouts on the chin and jaw, painful deep lesions, blackheads and inflamed cheeks can affect self-confidence and quality of life as well as the appearance of the skin.

Acne is an inflammatory disease of the hair follicles and sebaceous glands. Blocked pores, increased oil production, the activity of normal skin bacteria and inflammation all contribute to it. Over-washing or drying the skin harshly is therefore not a definitive solution and can sometimes worsen irritation. Suitable treatment should match the type of lesion, the severity of the acne and the individual's situation.

### How acne develops

The sebaceous glands in the skin produce an oily substance called sebum. When dead skin cells and oil accumulate at the opening of a follicle, the pore becomes blocked and a blackhead or whitehead forms. If inflammation develops, red, pus-filled or deep painful lesions appear. Acne may be a combination of several types of lesion, and treating a blackhead is not the same as treating nodular or cystic acne.

### Why do adults get acne?

Hormonal fluctuations are one of the main factors in adult acne. In some women, breakouts change around the menstrual cycle, during pregnancy or in the years before menopause. Genetics, stress, certain medications and unsuitable cosmetic or skin care products may also play a role. Heavy, comedogenic products can block pores. The link between diet and acne is not the same for everyone, and cutting out food groups without a clear reason is not recommended.

![Examining follicles and pores in adult acne](/images/articles/parisima-adult-acne-01.webp)

### When might hormones be involved?

Deep, tender breakouts on the lower face, especially if they change with the menstrual cycle, can suggest a hormonal contribution. However, the location of a breakout alone is not a definitive diagnosis. If acne is accompanied by irregular periods, excess facial hair or hormone-pattern hair loss, a medical evaluation is more important. Your doctor will decide, based on your history and examination, whether hormonal testing is needed.

### A daily skin care routine for acne-prone skin

![Specialised skin care at a cosmetic clinic](/images/articles/parisima-adult-acne-02.webp)

In the morning, wash the face with a gentle cleanser, apply a light, non-comedogenic moisturiser and a broad-spectrum sunscreen with at least SPF 30. At night, gently remove make-up and sunscreen. There is no need to scrub the skin with a harsh scrub or a stiff brush. Introduce new products one at a time so that you can identify the cause if irritation occurs.

Using several strong acids, retinoids and anti-acne products at the same time can damage the skin barrier. If the skin becomes stinging, red or very flaky, review your routine with your doctor. Squeezing or picking spots also increases inflammation and the risk of dark marks or scars.

### Active ingredients that help treat acne

Benzoyl peroxide can reduce the bacteria linked to acne and reduce inflammation. Topical retinoids such as adapalene help unclog pores and are used for blackheads, whiteheads and some inflammatory spots. Azelaic acid may also help acne and post-inflammatory marks. The right active ingredient depends on skin type, the severity of the acne and whether you are pregnant or breastfeeding.

![Acne treatment with a dermatology clinic product](/images/services/acne-treatment.webp)

Retinoids should not be used without medical advice during pregnancy, and anyone who is pregnant or planning a pregnancy should consult a doctor before starting any anti-acne treatment. Use topical medicines as directed and avoid combining several active ingredients without a plan.

### When are oral medicines needed?

For moderate to severe acne, deep or widespread lesions, or acne that does not respond to topical treatment, your doctor may consider oral medicines. Some antibiotics are prescribed for a limited period together with topical treatment. In some women, hormonal medicines may be an option, but they are not suitable for everyone and require a review of the medical history.

Isotretinoin is used for some severe or resistant forms of acne. It is a specialised medicine with serious side effects and monitoring requirements. It is extremely dangerous in pregnancy, and it must only be taken on prescription under close specialist supervision.

### Preventing dark marks and scars

![Educational image of skin tissue and acne scarring](/images/articles/parisima-adult-acne-03.webp)

After inflammation settles, red or brown marks may remain. This discolouration is not always a permanent scar and often fades gradually. A true scar usually appears as a depression or raised area in the skin. Squeezing spots, picking scabs and delaying treatment of severe acne all increase the risk of scarring.

Scar treatment depends on the type of scar. Your doctor may consider options such as microneedling, lasers, subcision or peeling in suitable cases. Active acne usually needs to be controlled first, because some invasive procedures on inflamed skin can make the problem worse.

### Common mistakes

Washing the face repeatedly, using alcohol or harsh substances, toothpaste, lemon juice and rough scrubs can irritate the skin. Acne is not caused by "dirty skin", and extreme cleansing does not cure it. Treatments usually need several weeks of consistent use before their effect can be judged; constantly changing products over short periods makes results hard to interpret.

### Frequently asked questions

### Can adult acne be treated?

For many people acne can be controlled well. Choosing the right treatment and maintenance care to prevent recurrence matters.

### Does sunscreen cause acne?

Not all sunscreens do. Choosing a light, non-comedogenic product can reduce the chance of blocked pores.

### When should I see a specialist?

If breakouts are painful, deep, resistant or leaving scars, it is better to be assessed early.

### Conclusion

Adult acne is common and manageable, but treating it is not limited to drying out spots. Identifying the type of acne, choosing suitable active ingredients, protecting the skin from the sun and treating deep lesions early help reduce the risk of dark marks and scars.

**Medical note:** This article is for general information and does not replace an examination or a prescription from a doctor.

### Reliable sources

- [American Academy of Dermatology: Adult acne](https://www.aad.org/public/diseases/acne/really-acne/adult-acne)
- [American Academy of Dermatology: Acne diagnosis and treatment](https://www.aad.org/public/diseases/acne/derm-treat/treat/)
`,
  },
  '15': {
    author: 'Dr. Seyed Ali Hejrati',
    title: 'Melasma and Facial Dark Spots: Causes, Treatment and Preventing Recurrence',
    seoTitle: 'Melasma and Facial Dark Spot Treatment: Causes and Solutions | Parisima Clinic',
    excerpt: 'Brown spots on the face may be melasma, sun damage or post-inflammatory pigmentation. Learn how they differ, which topical treatments and sun protection help, and why sunscreen is essential.',
    keywords: 'melasma, facial dark spots, melasma treatment, brown spots on face, skin pigmentation, laser for melasma Tehran, Parisima, Pari-Sima, Zafaraniyeh',
    category: 'Skin & Hair',
    imageAlt: 'Melasma and facial dark spot treatment',
    date: 'Nov 7, 2026',
    readTime: '6 min',
    content: `
Brown spots on the cheeks, forehead, nose or upper lip are a common cosmetic concern. They can appear after sun exposure, after inflammation from acne, or with hormonal changes. One of the recognised causes of facial pigmentation is melasma: a condition that usually appears as brown or greyish-brown patches, often in a fairly symmetrical pattern.

An important point is that not every facial spot is melasma. Sun spots, dark marks after inflammation and some other lesions can look similar, but their treatment is not the same. An accurate diagnosis before using bleaching creams or laser treatments is important, because an inappropriate treatment can irritate the skin and make the pigmentation worse.

### What is melasma?

Melasma is a pigmentation disorder in which the cells that produce skin colour, the melanocytes, become more active and create darker areas. The patches are mostly seen on the face and may appear on both sides of the cheeks, the forehead, the bridge of the nose or the upper lip. The darkness sometimes becomes more pronounced in sunny seasons. Melasma is usually not dangerous, but it can be chronic and recurrent.

![Brown patches and pigmentation of facial skin](/images/articles/parisima-melasma-01.webp)

### The main causes of spots and melasma

Sunlight is one of the most important triggers of melasma. Ultraviolet rays can increase pigment production and make the spots darker. Visible light may also contribute to pigmentation in some people, especially those with darker skin. Pregnancy and certain hormonal medicines can create or worsen melasma in some individuals. Family history and genetic factors may also play a part.

![Brown spots on the cheek](/images/articles/parisima-melasma-02.webp)

### How melasma differs from post-acne marks and sun spots

Post-inflammatory pigmentation usually appears where a pimple, wound or earlier irritation was. It can be brown, grey or red. Sun spots often appear as separate spots on areas exposed to light. Melasma tends to form broad, fairly symmetrical patches, but a definite diagnosis cannot be made from a photo or a description alone.

![Dark facial spots and different types of pigmentation](/images/articles/parisima-melasma-03.webp)

If a new spot changes size or colour quickly, has an irregular border, has more than one colour or bleeds, it should be examined and should not simply be assumed to be a cosmetic spot.

### How is melasma diagnosed?

A dermatologist will ask about when the spots started, family history, pregnancy, current medicines, skin care products and sun exposure. The location, pattern and colour of the lesions are then examined. In some cases a dermoscope helps assess the pigment pattern. Other causes of darkening sometimes need to be ruled out, which is why starting strong bleaching creams without a diagnosis is not recommended.

### Sunscreen: the foundation of controlling facial spots

Daily sun protection is the core of any melasma plan. Choose a broad-spectrum sunscreen with at least SPF 30 and apply enough of it to all exposed areas. Reapplication matters outdoors, after swimming or sweating. A wide-brimmed hat, shade and avoiding direct sun during the strongest hours also help.

For people with melasma, a tinted sunscreen containing iron oxides may give extra protection against part of the visible light spectrum. The product should suit your skin type and be comfortable to use. Irregular use of sunscreen can limit the results of other treatments.

### Topical bleaching and pigment-lightening ingredients

Depending on the type of spot, your doctor may prescribe ingredients such as azelaic acid, vitamin C, retinoids or prescription lightening agents. Hydroquinone is used in some treatment plans but should be used under medical supervision and for a defined period. The right combination and concentration depend on the condition of the skin and any history of irritation.

![Scar and dark mark treatment at a skin clinic](/images/services/scar-treatment.webp)

During pregnancy or breastfeeding, topical treatment must be chosen carefully. Some ingredients, such as retinoids and hydroquinone, are not suitable in pregnancy. Do not use home-made creams or unlabelled products whose ingredients are unknown.

### Are peels and lasers suitable for melasma?

Chemical peels and some light or laser devices may help improve the appearance of spots in selected cases, but they are not first-line treatment for everyone. In some skin types melasma can become darker after irritation or inflammation, so the choice of device, the energy level and the experience of the practitioner matter greatly.

Before any clinical procedure, the type of spot, skin colour, history of post-inflammatory pigmentation, current medicines and the likelihood of recurrence should be assessed. Be realistic about claims of complete removal in a single session. Sometimes topical treatment and careful sun protection remain the foundation of the plan.

### Maintenance routine and why spots return

A simple, tolerable routine is usually better than using several strong products at once. A gentle cleanser, a suitable moisturiser and regular sunscreen form the basis of care. Avoid harsh scrubs, frequent exfoliation and picking at spots, because skin inflammation can intensify post-inflammatory darkening.

Melasma may return after it has improved, especially if sun exposure continues. For this reason treatment is not limited to a course of cream; maintenance care matters. Once the spots are under control, your doctor may suggest a simpler plan to keep the result.

### Common mistakes in treating spots

Using strong combination creams without supervision, long-term unsupervised use of hydroquinone, frequent peeling and inappropriate laser treatment are important mistakes. Lemon juice, baking soda and other acidic home remedies can also irritate the skin and cause more spots. Pigment improvement is usually gradual and takes several weeks or months.

### Frequently asked questions

### Is melasma dangerous?

Melasma is usually a harmless pigmentation problem, but any new or changing spot should be examined if warning signs are present.

### Can melasma be completely cured?

For many people spots can be lightened and controlled, but recurrence is possible. Continuous sun protection is an important part of keeping the result.

### Is laser the best treatment for spots?

No. The choice of method depends on the type of spot, skin colour and the likelihood of inflammation. In some cases a laser can make melasma worse.

### Conclusion

Facial spots have many causes, and melasma is only one of them. Accurate diagnosis, regular sun protection, suitable topical treatment and caution with clinical procedures are the basis of safe management. If facial pigmentation persists or does not improve with usual treatments, see a dermatologist for an assessment.

**Medical note:** This article is for general information and does not replace an examination or a prescription from a doctor.

### Reliable sources

- [American Academy of Dermatology: Melasma self-care](https://www.aad.org/public/diseases/a-z/melasma-self-care)
- [British Association of Dermatologists: Melasma](https://www.bad.org.uk/pils/melasma)
- [DermNet: Melasma](https://dermnetnz.org/topics/melasma)
`,
  },
  '16': {
    author: 'Dr. Seyed Ali Hejrati',
    title: 'Eczema and Very Dry Sensitive Skin: Symptoms, Causes and How to Control It',
    seoTitle: 'Eczema Symptoms, Causes and Treatment for Dry Sensitive Skin | Parisima Clinic',
    excerpt: 'Dryness, itching and redness can be more than a passing reaction. Learn how eczema (atopic dermatitis) damages the skin barrier, which triggers to avoid, and how daily care and medical treatment control flare-ups.',
    keywords: 'eczema, atopic dermatitis, dry skin, itchy skin, eczema treatment, sensitive skin, dermatitis Tehran, Parisima, Pari-Sima, Zafaraniyeh',
    category: 'Skin & Hair',
    imageAlt: 'Eczema and dry sensitive skin care',
    date: 'Nov 7, 2026',
    readTime: '6 min',
    content: `
Dryness, itching and redness can sometimes be more than a temporary reaction to cold weather or an unsuitable cleanser. Eczema, especially atopic dermatitis, can cause periods of inflammation and itching in which the skin becomes dry, sensitive and prone to cracking. It may affect the face, hands, the creases of the elbows and knees, or other parts of the body, and it can start at any age.

Eczema is not contagious and does not spread through ordinary contact. It usually has several contributing factors and is linked to a disturbed skin barrier, a sensitive immune response and environmental triggers. The goals of treatment are to control inflammation and itching, repair the skin barrier and reduce the frequency of flare-ups. An accurate diagnosis and a suitable care plan can improve quality of life considerably.

### What is eczema and why does it dry out the skin?

In healthy skin, the surface barrier helps retain moisture and keeps irritants from penetrating deeper layers. In eczema this barrier may function less well, so more water escapes from the skin and it becomes more vulnerable to irritating substances. Inflammation also intensifies itching and redness. Scratching then damages the barrier again, and this cycle can make the lesions chronic.

### Common symptoms of eczema

Dryness, itching, redness, scaling, cracks and, sometimes, thickening of the skin are the common signs. In some people the lesions appear as dry, itchy patches, and during severe phases there may be oozing or crusting. The appearance of eczema varies with age, the area affected and skin colour; on darker skin the inflammation may look brown, purple or grey.

![Dry, cracked and itchy skin in eczema](/images/articles/parisima-eczema-02.webp)

If a lesion is painful, hot, pus-filled or accompanied by fever, an infection is possible and it needs prompt assessment. Severe night-time itching can also disturb sleep and quality of life, and it should be discussed with a doctor.

### What makes eczema worse?

Triggers differ from person to person. Harsh soaps, fragranced detergents, perfumes, some skin care products, rough fabrics, sweating, heat, cold dry air and stress can make symptoms flare in some people. Frequent contact with water and cleaning agents can also worsen hand eczema.

![Dry sensitive skin with cracks and irritation](/images/articles/parisima-eczema-01.webp)

Not every trigger affects everyone, so broad elimination of foods or products without a clear reason is not recommended. It helps to note when symptoms occur, new products you use and weather conditions, so you can identify your own pattern. If contact sensitivity is suspected, your doctor may consider patch testing.

### How is eczema diagnosed?

Simple dryness usually improves with a moisturiser and less contact with detergents, but eczema tends to cause repeated inflammation and itching. Conditions such as psoriasis, fungal skin infections and contact dermatitis can look similar. A dermatologist will ask about your personal and family history of allergy, asthma or hay fever, when symptoms started and what makes them worse, and will examine your skin. In some cases tests or a skin sample are needed to rule out similar conditions.

### Moisturiser: the foundation of care

Regular use of a simple, fragrance-free moisturiser helps keep the skin hydrated. Thick creams and ointments are usually more suitable for very dry skin than light lotions. It is best to apply the moisturiser after washing, while the skin is still slightly damp. This should continue regularly, even on days when symptoms are milder.

![Dry sensitive skin that needs regular care](/images/articles/parisima-eczema-03.webp)

If a product causes persistent stinging or worsens inflammation, stop using it and choose a more suitable option with your doctor's guidance. Fragrance and many ingredients in some products can be problematic for sensitive skin.

### Correct bathing and cleansing

A short bath in lukewarm water is usually better than a long shower in hot water. Use a gentle, fragrance-free cleanser and apply soap only where needed. After bathing, pat the skin dry gently with a soft towel and avoid vigorous rubbing. When working with cleaning products, suitable gloves can reduce direct contact; if the gloves cause sweating and irritation, the type and duration of use should be reviewed.

### Medical treatment for eczema

When skin care alone is not enough, your doctor may prescribe anti-inflammatory topical medicines. Topical corticosteroids are used with a strength and duration suited to the site and severity of the lesion. The face and skin folds are more sensitive, and the choice of medicine for these areas must be precise; prolonged unsupervised use can cause side effects.

![Eczema treatment at a dermatology clinic](/images/services/eczema-treatment.webp)

For some people, medicines such as tacrolimus or pimecrolimus are considered as non-steroid options. Moderate to severe eczema that does not respond to standard treatment may need phototherapy, systemic medicines or targeted therapies. Choosing these options should be based on a specialist assessment and careful monitoring of side effects.

### Controlling itch and skin care

Keeping nails short, keeping the environment cool, using a cool compress and moisturising can help reduce itching. Soft cotton clothing may be more tolerable than rough fabrics. During inflammation the skin is more sensitive to exfoliants, retinol, fragrances and some active ingredients, so simplify your routine and avoid unnecessary products.

Peels, cosmetic lasers or invasive procedures on inflamed skin should be postponed until a doctor has assessed the condition. Once the disease is under control, a gradual return to cosmetic products or procedures can be decided together.

### When should you see a specialist?

A specialist examination is needed if the itching is severe, disturbs sleep, the lesions are widespread, the skin is cracking, or usual treatments have not worked. Pus, yellow crusts, increasing pain, warmth of the skin, rapid spreading redness or fever may indicate infection and should be assessed quickly. New eczema in adults, or lesions that do not respond to treatment, also need other diagnoses to be considered.

### Frequently asked questions

### Is eczema contagious?

No. Eczema is not passed on through handshakes or ordinary skin contact.

### Is there a definite cure for eczema?

Atopic dermatitis is usually a chronic condition that may have flare-ups and calm periods. With good care and suitable treatment, symptoms can be controlled.

### Is a moisturiser alone enough?

In mild cases it may help a great deal, but moderate or severe inflammation usually needs prescribed medicine.

### Conclusion

Eczema is not just simple dry skin. It is an inflammatory condition involving barrier damage, itching and periodic flare-ups. Regular moisturising, identifying your personal triggers, gentle cleansing and appropriate medical treatment can control symptoms. If you have severe itching, widespread lesions or signs of infection, do not delay seeing a dermatologist.

**Medical note:** This article is for general information and does not replace medical diagnosis or treatment.

### Reliable sources

- [American Academy of Dermatology: Atopic dermatitis treatment](https://www.aad.org/public/diseases/eczema/types/atopic-dermatitis/treatment)
- [American Academy of Dermatology: Understanding atopic dermatitis](https://www.aad.org/public/diseases/eczema/types/atopic-dermatitis)
`,
  },
  '17': {
    author: 'Dr. Seyed Ali Hejrati',
    title: 'Toenail Fungus: Early Signs, Causes, Diagnosis and Treatment',
    seoTitle: 'Toenail Fungus: Symptoms, Spread and Treatment | Parisima Clinic',
    excerpt: 'Yellowing, thickening and crumbling toenails can be a sign of fungal infection. Learn how to recognise it, how it is diagnosed, which treatments work, and how long recovery takes.',
    keywords: 'toenail fungus, nail fungus, nail fungus symptoms, nail fungus treatment, foot nail infection, onychomycosis, prevent nail fungus, Parisima, Pari-Sima, Zafaraniyeh',
    category: 'Skin & Hair',
    imageAlt: 'Dry, irritated skin in nail fungus care',
    date: 'Nov 7, 2026',
    readTime: '7 min',
    content: `
Changes in the colour or thickness of a toenail can be embarrassing and can make wearing sandals uncomfortable. One common cause of these changes is a fungal nail infection, or onychomycosis. This infection mostly affects the toenails and can gradually cause yellowing, whitening or browning, brittleness and debris building up under the nail.

However, not every yellow or thick nail is fungal. Repeated trauma from shoes, nail psoriasis and some other conditions can look similar. Diagnosis before starting treatment matters, because the wrong medicine can delay finding the real cause. Treating nail fungus usually takes time, because the nail needs to grow to replace the affected part.

### What is nail fungus?

Nail fungus is an infection that can involve the nail plate and the tissue beneath it. Fungi grow best in warm, damp environments and can reach the nail from the skin of the foot or from a contaminated environment. In some people the infection starts in the skin between the toes and then involves the nail. Toenail infection is more common than fingernail infection, because the feet stay for long periods in closed shoes and in damp conditions.

### Early signs of toenail fungus

A change in colour of part of the nail to yellow, white or brown is one of the common signs. The nail may become thicker, its edge may crumble, or crust-like debris may collect under the plate. In some cases the nail separates from the bed or loses its normal shape. A mild infection may not hurt, but in advanced stages pressure from shoes can cause discomfort.

If the nail has become painful, makes walking difficult, or the skin around it is red and swollen, a medical assessment is important. People with diabetes, poor circulation or a weakened immune system should have changes in the nails and skin of the feet checked early.

### How does nail fungus spread?

Fungi can survive in damp places such as public showers, changing rooms, swimming pools and closed shoes. Walking barefoot in these areas, sharing towels or nail tools, and wearing damp shoes can increase the risk of contact with the fungus. Contact with the skin of an infected foot may also help the infection spread.

Heavy foot sweating, nail injury, poor circulation, diabetes, older age or a weak immune system can increase the chance of infection or make treatment harder. Having nail fungus does not necessarily mean poor hygiene; environmental and underlying factors also play a role.

### Is every yellow nail a fungal infection?

No. Injury from tight or sports shoes, psoriasis, eczema, changes linked to ageing and some other problems can also alter the colour and thickness of a nail. A dermatologist will examine the nails and may take a light scraping or a small sample from the affected part. Examining the sample under a microscope or running laboratory tests can confirm whether fungus is present and help choose the right treatment.

### Topical treatment with antifungal medicines

For mild or limited infections, your doctor may recommend a prescribed antifungal solution or nail lacquer. These products must be used as directed and for a long time; topical treatment of toenails can continue for months. Keeping the nail short and carefully thinning the thickened part by a trained person can help the medicine penetrate better.

![Dry, irritated skin that needs restorative care](/images/articles/parisima-eczema-02.webp)

Ordinary antifungal skin creams are not always sufficient to treat an infection inside the nail, because the medicine has difficulty penetrating the nail plate. Using a skin cream without a diagnosis and expecting the nail to be fully treated may therefore not work.

### When are oral medicines needed?

If several nails are involved, the infection is widespread or severe, or topical treatment is not suitable, your doctor may consider an oral antifungal. The choice of medicine depends on the type of fungus, liver health, underlying conditions, other medicines being taken and the possibility of pregnancy. Some oral medicines can interact with other drugs or need laboratory monitoring, so never start one on your own.

### Why does treatment take so long?

Even after the infection is controlled, the discoloured part of the nail does not disappear straight away. The nail has to grow so that healthy nail gradually replaces the damaged section. A big toenail may need a year or more to grow completely. For this reason, success cannot be judged from the appearance of the nail in the first few weeks; regular follow-up and correct use of medicine are important.

### Can laser treat nail fungus?

Some centres advertise lasers to improve the appearance of nails or treat fungus, but the evidence and approvals should be checked carefully. A laser should not be considered a definite replacement for prescribed antifungal treatment. If a laser treatment is suggested, ask your doctor about its exact purpose, the evidence for its effectiveness, its limitations, its cost and the chance of recurrence.

### How to prevent infection and recurrence

Dry your feet thoroughly after bathing, especially between the toes. Wear clean, breathable socks and dry damp shoes before wearing them again. In changing rooms, public baths and around pools, use your own sandals, and do not share towels, nail clippers or files with others. Manicure and pedicure tools must be properly disinfected.

![Foot and nail care that keeps the area clean and dry](/images/articles/parisima-eczema-01.webp)

If athlete's foot is also present, treating it matters, because it can be a source of recurrent nail infection. Avoid picking or deeply cutting the corners of the nail, and if there is pain or inflammation, postpone nail cosmetic services until the nail has been assessed.

### Frequently asked questions

### Is nail fungus contagious?

Fungus can spread through contact with skin, nails, or contaminated surfaces and tools. Good hygiene and not sharing personal items reduce the risk.

### Will filing the nail get rid of the fungus?

No. The fungus can remain in the nail plate and the tissue beneath it, and filing alone does not treat the infection.

### How long does it take for the nail to look normal?

It depends on the severity of the infection and the speed of nail growth. A big toenail may need a year or more to grow completely.

### Conclusion

Toenail fungus can cause discolouration, thickening, crumbling and separation of the nail, but it must be distinguished from similar problems. Testing a nail sample when necessary, choosing a suitable topical or oral treatment, completing the full course and keeping the feet hygienic all help control the infection. If the nail has changed shape, is painful, or several nails are affected, see a dermatologist for an assessment.

**Medical note:** This article does not replace an examination or a prescription from a doctor.

### Reliable sources

- [American Academy of Dermatology: Nail fungus treatment](https://www.aad.org/public/diseases/a-z/nail-fungus-treatment)
- [American Academy of Dermatology: Nail fungus symptoms](https://www.aad.org/public/diseases/a-z/nail-fungus-symptoms)
- [British Association of Dermatologists: Fungal nail infections](https://www.bad.org.uk/pils/fungal-nail-infections)
`,
  },
};

export const EN: LocaleContent = {
  clinic,
  doctors: mergeById(DOCTORS, doctorsOv),
  services: mergeById(SERVICES, servicesOv).map((s) => ({ ...s, doctorName: doctorsOv[s.doctorId]?.name ?? s.doctorName })),
  faqs: mergeById(FAQ_ITEMS, faqOv),
  articles: mergeById(ARTICLES, articlesOv),
};
