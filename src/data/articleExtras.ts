import type { Lang } from '../i18n/config';

// بخش‌های تکمیلی مقالات: به انتهای متن اصلی هر مقاله (در هر زبان) اضافه می‌شوند.
export const ARTICLE_EXTRAS: Record<Lang, Record<string, string>> = {
  fa: {
    'hair-transplant-aftercare-guide': `### روز به روز: آنچه در هفته اول انتظار می‌رود
در ۴۸ ساعت اول ممکن است کمی تورم در پیشانی یا اطراف چشم دیده شود؛ این تورم طبیعی است و معمولاً ظرف چند روز کاهش می‌یابد. گرافت‌های کاشته‌شده در روزهای اول بسیار حساس هستند، پس از دست زدن به ناحیه کاشت، مالش دادن یا خاراندن آن خودداری کنید. از روز سوم یا چهارم ممکن است پوسته‌های ریز روی پوست بنشیند؛ این پوسته‌ها را با ناخن جدا نکنید و فقط با شامپوی توصیه‌شده و با ملایمت پاک کنید.

### بازگشت به زندگی روزمره و نتیجه نهایی
پس از دو هفته معمولاً می‌توانید به بیشتر فعالیت‌های عادی برگردید، اما استفاده از کلاه تنگ و قرار گرفتن طولانی زیر آفتاب را تا ماه‌ها محدود کنید. رشد موهای جدید معمولاً از حدود سه تا چهار ماه پس از عمل آغاز می‌شود و نتیجه کامل را باید بین ۹ تا ۱۲ ماه انتظار داشت. صبر و پیگیری ویزیت‌های کنترلی در این دوره، بخش مهمی از موفقیت درمان است.`,
    'difference-between-botox-and-filler': `### چه زمانی بوتاکس بهتر است و چه زمانی فیلر؟
بوتاکس برای خطوطی مناسب است که با حرکت عضلات ظاهر می‌شوند، مانند چین پیشانی، خطوط اخم میان ابروها و خطوط دور چشم. فیلر در جایی بهتر عمل می‌کند که کمبود حجم یا افتادگی داریم، مانند شیارهای بینی‌لب، گونه‌های تخت، زیر چشم و لب. بسیاری از افراد با ترکیب این دو روش به نتیجه‌ای متعادل و طبیعی‌تر می‌رسند؛ زیرا بوتاکس بیشتر خطوط را نرم می‌کند و فیلر حجم را بازمی‌گرداند.

### عوارض و مراقبت‌های پس از تزریق
هر دو روش نسبتاً ایمن هستند، اما عوارض جزئی مانند کبودی خفیف، تورم یا حساسیت موضعی ممکن است رخ دهد. پس از تزریق بوتاکس تا چند ساعت از دراز کشیدن و ماساژ دادن ناحیه خودداری کنید تا ماده در عضلات مورد نظر بماند. پس از فیلر نیز توصیه می‌شود از فشار شدید روی ناحیه، سونا و درمان‌های لیزری تهاجمی تا چند هفته دوری کنید.`,
    'open-pores-treatment-methods': `### نقش نوع پوست در انتخاب درمان
پوست چرب معمولاً منافذ بازتری دارد و بیشتر در معرض جوش و سیاه‌سر قرار می‌گیرد، در حالی که پوست خشک‌تر بیشتر دچار ناهمواری ناشی از کاهش کلاژن می‌شود. بنابراین پیش از انتخاب روش درمان، شناخت نوع پوست و علت اصلی اتساع منافذ ضروری است. درمان‌های ترکیبی معمولاً نتایج پایدارتری دارند، برای مثال تنظیم چربی پوست در کنار افزایش کلاژن.

### مراقبت خانگی برای حفظ نتیجه
استفاده روزانه از ضدآفتاب با SPF مناسب مهم‌ترین عامل حفظ نتیجه است، چون آفتاب باعث تخریب کلاژن و بزرگ‌تر شدن منافذ می‌شود. شوینده ملایم با pH متعادل، استفاده از محصولات حاوی ریتینوئید یا نیاسین‌آمید طبق نظر متخصص، و پرهیز از فشردن منافذ در خانه از دیگر توصیه‌هاست.`,
    'mesotherapy-benefits-for-hair-loss': `### چه کسانی بیشترین بهره را می‌برند؟
مزوتراپی مو برای ریزش در مراحل اولیه، نازک شدن تدریجی فرق سر، ریزش پس از استرس شدید یا تغییرات هورمونی بسیار مؤثر است. هرچه درمان زودتر آغاز شود، بصیلات ضعیف‌تر فرصت بیشتری برای بازیابی دارند. در مقابل، در طاسی کامل و قدیمی ممکن است نتیجه محدودتر باشد و نیاز به ترکیب با روش‌های دیگر وجود داشته باشد.

### برنامه درمانی و انتظارات واقع‌بینانه
معمولاً ۴ تا ۶ جلسه با فاصله حدود دو تا چهار هفته توصیه می‌شود. بهبود ابتدا به صورت کاهش ریزش و سپس مشاهده موهای نازک جدید ظاهر می‌شود، و معمولاً ۳ تا ۴ ماه طول می‌کشد تا تغییرات واضح شود. ادامه مراقبت‌های نگهدارنده پس از پایان دوره، که پزشک تعیین می‌کند، برای حفظ نتیجه ضروری است.`,
    'hifu-facial-lifting-guide': `### مراحل انجام یک جلسه هایفو
ابتدا ژل مخصوص روی پوست زده می‌شود و سپس دستگاه با دقت روی لایه‌های مورد نظر حرکت می‌کند. بیشتر افراد گرمای ملایمی را احساس می‌کنند و در صورت نیاز از بی‌حسی موضعی استفاده می‌شود. جلسه معمولاً حدود ۴۵ تا ۶۰ دقیقه طول می‌کشد و بلافاصله پس از آن می‌توانید به فعالیت روزمره بازگردید.

### انتظارات و ترکیب با درمان‌های دیگر
نتیجه هایفو تدریجی است و معمولاً ۲ تا ۳ ماه پس از جلسه به حداکثر می‌رسد. برای افرادی که افتادگی شدید دارند ممکن است چند جلسه یا ترکیب با تزریقات لازم باشد. هایفو با بوتاکس و فیلر قابل ترکیب است، اما زمان‌بندی آن را پزشک تعیین می‌کند.`,
    'russian-lip-filler-guide': `### انتخاب اندازه و شکل مناسب
نمای روسی الزاماً به معنی لب بسیار بزرگ نیست. پزشک با توجه به اندازه دهان، نسبت لب بالا و پایین و تقارن چهره، مقدار و محل تزریق را تعیین می‌کند. هدف، ایجاد فرم منظم، لبه‌های مشخص و حجمی متناسب با صورت است. در جلسه مشاوره انتظارات خود را مطرح کنید تا نتیجه با سلیقه‌تان هماهنگ شود.

### نشانه‌هایی که باید جدی گرفته شوند
تورم بیش از حد، درد شدید، تغییر رنگ لب یا احساس سفتی غیرعادی پس از تزریق، نیاز به مراجعه فوری به پزشک دارد. اگر پس از چند روز سفتی یا کبودی باقی ماند، به مطب اطلاع دهید.`,
    'who-is-a-candidate-for-hair-transplant': `### نقش معاینه و آزمایش‌ها
پیش از عمل، پزشک وضعیت پوست سر، تراکم موهای منطقه دهنده و الگوی ریزش را بررسی می‌کند. در صورت نیاز آزمایش‌هایی مانند بررسی کم‌خونی، ویتامین D، هورمون‌ها و کارکرد تیروئید درخواست می‌شود. این ارزیابی به تعیین زمان مناسب عمل و پیش‌بینی نتیجه کمک می‌کند.

### آیا سن مهم است؟
زراعت مو معمولاً پس از ثبات ریزش انجام می‌شود. برای افراد جوان که ریزش هنوز در حال پیشرفت است، تصمیم‌گیری محتاطانه‌تری لازم است تا گزینه‌های درمانی در آینده حفظ شوند. بهترین زمان را پزشک بر اساس وضعیت فعلی و سرعت ریزش تعیین می‌کند.`,
    'fractional-laser-skin-guide': `### تفاوت لیزر فرکشنال با لیزرهای سطحی
لیزرهای سطحی بیشتر لایه بیرونی را هدف می‌گیرند، در حالی که لیزر فرکشنال با ایجاد ستون‌های میکروسکوپی به لایه‌های عمیق‌تر می‌رسد و ترمیم بیشتری را تحریک می‌کند. به همین دلیل برای بهبود بافت و اسکارهای عمیق‌تر مناسب‌تر است. انتخاب نوع لیزر و شدت آن باید توسط متخصص و با توجه به رنگ و ضخامت پوست انجام شود.

### نکات پس از جلسه
از قرار گرفتن زیر آفتاب تا چند هفته اجتناب کنید و از ضدآفتاب با SPF بالا استفاده کنید. ممکن است پوسته‌های ریز یا خشکی موقت ظاهر شود؛ آن‌ها را نکنید. اگر تاول، عفونت یا درد شدید مشاهده کردید، با مطب تماس بگیرید.`,
    'adult-acne-causes-and-treatment': `### رژیم غذایی و آکنه بزرگسالان
برخی مطالعات نشان داده‌اند که مصرف زیاد قندهای ساده و لبنیات پرچرب در بعضی افراد با افزایش جوش همراه است، هرچند این تأثیر در همه یکسان نیست. کاهش شیرینی‌ها و افزایش سبزیجات و پروتئین‌های سالم می‌تواند کمک کند، اما تغییر رژیم جایگزین درمان دارویی نیست.

### زمان‌بندی درمان و صبر
درمان آکنه معمولاً ۶ تا ۸ هفته طول می‌کشد تا نتیجه دیده شود، و حتی پس از بهبود، ادامه نگهدارنده لازم است تا جوش برنگردد. قطع زودهنگام داروها یکی از دلایل اصلی بازگشت جوش است، بنابراین برنامه‌ای که پزشک تعیین می‌کند را کامل دنبال کنید.`,
  },
  ar: {
    'hair-transplant-aftercare-guide': `### ماذا تتوقعين في الأسبوع الأول؟
خلال 48 ساعة الأولى قد يظهر بعض التورم حول الجبهة والعينين، وهو طبيعي ويزول تدريجياً. يجب تجنب لمس منطقة الزراعة أو حكها، وقد تظهر قشور دقيقة بعد اليوم الثالث، فأزيليها بلطف بالشامبو الموصى به دون انتزاعها.

### العودة إلى الحياة اليومية والنتيجة النهائية
بعد أسبوعين يمكن العودة لمعظم الأنشطة، مع تجنب القبعات الضيقة والتعرض الطويل للشمس لعدة أشهر. تبدأ الشعيرات الجديدة بالنمو عادة بعد 3 إلى 4 أشهر، وتظهر النتيجة الكاملة خلال 9 إلى 12 شهراً، لذلك فالصبر والمتابعة الدورية جزء أساسي من النجاح.`,
    'difference-between-botox-and-filler': `### متى يكون البوتوكس أنسب ومتى الفيلر؟
يناسب البوتوكس الخطوط التي تظهر مع حركة العضلات، مثل تجاعيد الجبهة وخطوط التجهم بين الحاجبين وحول العينين. أما الفيلر فيعالج نقص الحجم والترهل، كخطوط الأنف والشفاه والخدود المسطحة والهالات تحت العين. ويجمع كثيرون بين الاثنين للحصول على نتيجة متوازنة وأكثر طبيعية.

### المضاعفات والعناية بعد الحقن
الإجراءان آمنان نسبياً، لكن قد تحدث كدمات خفيفة أو تورم مؤقت. تجنبي تدليك المنطقة بعد البوتوكس لعدة ساعات، وتجنبي الضغط الشديد والساونا والليزر العميق لبضعة أسابيع بعد الفيلر.`,
    'open-pores-treatment-methods': `### دور نوع البشرة في اختيار العلاج
البشرة الدهنية غالباً ما تكون مساماتها أوسع وأكثر عرضة للحبوب والرؤوس السوداء، بينما تظهر على البشرة الجافة تضاريس ناتجة عن نقص الكولاجين. لذلك يبدأ العلاج الناجح بتحديد نوع البشرة والسبب الرئيسي لاتساع المسام.

### العناية المنزلية للحفاظ على النتيجة
الواقي الشمسي اليومي من أهم عوامل الحفاظ على النتيجة، لأن أشعة الشمس تدمر الكولاجين وتوسع المسام. استخدمي منظفاً لطيفاً متوازن الحموضة، وتجنبي عصر المسام في المنزل، واتبعي توصيات الطبيب بشأن المنتجات الفعالة.`,
    'mesotherapy-benefits-for-hair-loss': `### من يستفيد أكثر؟
تنفع الميزوثيرابي في التساقط المبكر وترقق خط الشعر تدريجياً والتساقط بعد التوتر أو التغيرات الهرمونية. وكلما بدأ العلاج مبكراً كانت البصيلات أكثر قابلية للتعافي، أما في حالات الصلع القديمة فقد تكون النتائج محدودة ويحتاج الأمر إلى دمج العلاجات.

### الخطة العلاجية والتوقعات الواقعية
يُنصح عادة بـ 4 إلى 6 جلسات تفصل بينها من أسبوعين إلى أربعة أسابيع. يبدأ التحسن بانخفاض التساقط ثم ظهور شعيرات جديدة ناعمة، وتتضح التغيرات عادة خلال 3 إلى 4 أشهر، مع أهمية جلسات الصيانة التي يحددها الطبيب.`,
    'hifu-facial-lifting-guide': `### خطوات الجلسة
يوضع جل خاص على البشرة ثم يتحرك الجهاز بدقة على الطبقات المستهدفة. يشعر معظم المراجعين بدفء خفيف، ويمكن استخدام تخدير موضعي عند الحاجة. تستغرق الجلسة نحو 45 إلى 60 دقيقة، ويمكن العودة للنشاط اليومي فوراً.

### التوقعات والجمع مع علاجات أخرى
تظهر النتيجة تدريجياً وتبلغ ذروتها بعد 2 إلى 3 أشهر. قد تحتاج الحالات الأشد ترهلاً إلى أكثر من جلسة، ويمكن دمج الهايفو مع البوتوكس أو الفيلر وفق خطة يحددها الطبيب.`,
    'russian-lip-filler-guide': `### اختيار الحجم والشكل المناسبين
النمط الروسي لا يعني شفاهاً كبيرة بالضرورة؛ يحدد الطبيب الكمية والموضع حسب حجم الفم ونسبة الشفة العليا والسفلى وتناسق الوجه. الهدف شكل منظم وحواف واضحة وحجم متناسب مع الملامح.

### علامات تستدعي المراجعة الفورية
التورم الشديد، أو الألم الحاد، أو تغير لون الشفاه، أو شعور بتصلب غير طبيعي بعد الحقن يستوجب التواصل الفوري مع العيادة. وإذا استمرت الكدمات أو التصلب لأيام، أبلغي الطبيب.`,
    'who-is-a-candidate-for-hair-transplant': `### دور الفحص والتحاليل
يفحص الطبيب قبل العملية حالة فروة الرأس وكثافة الشعر في منطقة المانح ونمط التساقط، وقد يطلب تحاليل لفحص فقر الدم وفيتامين D والهرمونات ووظيفة الغدة الدرقية. يساعد ذلك على تحديد التوقيت المناسب وتوقع النتيجة.

### هل العمر عامل مهم؟
تُجرى الزراعة عادة بعد استقرار التساقط. أما الشباب الذين لا يزال تساقطهم في تطور، فيحتاجون تقييماً أكثر حذراً حتى تبقى خيارات العلاج متاحة مستقبلاً. ويحدد الطبيب الوقت المناسب بناءً على الحالة الحالية وسرعة التساقط.`,
    'fractional-laser-skin-guide': `### الفرق بين الليزر الكسري والسطحي
الليزر السطحي يعالج الطبقة الخارجية، بينما ينشئ الليزر الكسري أعمدة مجهرية تصل إلى طبقات أعمق فتحفز ترميماً أكبر. لذلك هو الأنسب للندبات العميقة وتحسين النسيج. يختار المختص نوع الليزر وشدته بحسب لون البشرة وسماكتها.

### نصائح بعد الجلسة
تجنبي الشمس لعدة أسابيع واستخدمي واقياً شمسياً عالي الحماية. قد تظهر قشور دقيقة أو جفاف مؤقت، فلا تنتزعيها. وإذا لاحظت بثوراً أو التهاباً أو ألماً شديداً فاتصلي بالعيادة.`,
    'adult-acne-causes-and-treatment': `### النظام الغذائي وحب الشباب
أظهرت بعض الدراسات أن الإكثار من السكريات البسيطة ومنتجات الألبان الدسمة قد يرتبط بزيادة الحبوب لدى بعض الأشخاص، وإن كان التأثير يختلف من شخص لآخر. تقليل السكريات وزيادة الخضروات والبروتينات الصحية قد يساعد، لكنه لا يغني عن العلاج الطبي.

### مدة العلاج والصبر
يحتاج العلاج عادة من 6 إلى 8 أسابيع لتظهر النتيجة، ويلزم الاستمرار بجلسات صيانة لمنع العودة. إيقاف الأدوية مبكراً من أكثر أسباب عودة الحبوب، لذلك التزمي بالخطة التي يحددها الطبيب.`,
  },
  en: {
    'hair-transplant-aftercare-guide': `### What to expect in the first week
Mild swelling around the forehead and eyes is common during the first 48 hours and fades within days. Avoid touching or scratching the treated area. Fine crusts may form after day three; gently remove them with the recommended shampoo rather than picking at them.

### Returning to normal life and final results
Most daily activities can resume after about two weeks, while tight hats and long sun exposure should be limited for several months. New hair usually starts to grow three to four months after surgery, and the full result typically appears between nine and twelve months. Patience and follow-up visits are key to success.`,
    'difference-between-botox-and-filler': `### When Botox works best and when filler works best
Botox targets lines that appear with muscle movement, such as forehead lines, frown lines and crow’s feet. Filler restores volume and smooths folds such as nasolabial lines, lip contours and under-eye hollows. Many patients combine both for a balanced, natural result.

### Side effects and aftercare
Both treatments are generally safe, though mild bruising or temporary swelling can occur. Avoid rubbing the area after Botox, and avoid heavy pressure, saunas and deep laser treatments for a few weeks after filler.`,
    'open-pores-treatment-methods': `### Why skin type matters
Oily skin tends to have larger, more visible pores and is prone to blackheads, while dry or mature skin often shows texture changes caused by collagen loss. Identifying your skin type and the main cause of enlarged pores is the first step to effective treatment.

### Home care that protects your results
Daily sunscreen is essential because UV exposure breaks down collagen and makes pores look larger. Use a gentle pH-balanced cleanser, follow your doctor’s advice on active ingredients, and avoid squeezing pores at home.`,
    'mesotherapy-benefits-for-hair-loss': `### Who benefits most
Hair mesotherapy works best for early thinning, gradual widening of the part, and shedding after stress or hormonal changes. The earlier treatment starts, the more follicles have a chance to recover. In long-standing baldness, results are more limited and combined treatments may be needed.

### Treatment plan and realistic expectations
Four to six sessions spaced two to four weeks apart are usually recommended. Improvement typically begins with reduced shedding and fine new hairs, with visible change over three to four months. Maintenance sessions chosen by your doctor help sustain results.`,
    'hifu-facial-lifting-guide': `### What happens during a session
A special gel is applied and the device moves carefully across the targeted layers. Most patients feel mild warmth, and local anesthetic can be used if needed. A session usually takes 45 to 60 minutes, and you can return to daily activities right away.

### Expectations and combining treatments
Results develop gradually and usually peak around two to three months after treatment. Patients with more advanced laxity may need more than one session. HIFU can be combined with Botox or filler in a plan designed by your doctor.`,
    'russian-lip-filler-guide': `### Choosing the right size and shape
The Russian lip style does not necessarily mean very large lips. Your doctor decides the amount and placement based on mouth size, the balance between upper and lower lips, and facial symmetry. The goal is a defined shape, clear edges and volume proportionate to your features.

### Signs that need prompt attention
Severe swelling, sharp pain, color changes in the lips or unusual hardness after injection should be reported to the clinic immediately. If bruising or firmness persists for several days, contact your doctor.`,
    'who-is-a-candidate-for-hair-transplant': `### The role of examination and blood tests
Before surgery, your doctor assesses scalp condition, donor-area density and the pattern of hair loss. Blood tests may be requested to check for anemia, vitamin D levels, hormones and thyroid function. This evaluation helps determine the right timing and predicts the likely outcome.

### Does age matter?
Transplantation is usually performed once hair loss has stabilized. Younger patients whose loss is still progressing need a more cautious plan so that future treatment options remain available. Your doctor will recommend timing based on your current status and the speed of hair loss.`,
    'fractional-laser-skin-guide': `### How fractional differs from superficial lasers
Superficial lasers mainly target the outer layer, while fractional lasers create microscopic columns that reach deeper layers and trigger more repair. This makes them especially suitable for deeper scars and texture improvement. The specialist chooses the laser type and intensity based on skin tone and thickness.

### Aftercare tips
Avoid sun exposure for several weeks and use a high-SPF sunscreen. Fine flaking or temporary dryness may occur; do not pick at it. Contact the clinic if you notice blistering, infection or severe pain.`,
    'adult-acne-causes-and-treatment': `### Diet and adult acne
Some studies link high intake of refined sugars and full-fat dairy with more breakouts in certain people, although the effect varies. Reducing sugar and increasing vegetables and healthy proteins may help, but diet does not replace medical treatment.

### Treatment duration and patience
Acne treatment usually needs six to eight weeks before results appear, and maintenance is often needed after clearing to prevent recurrence. Stopping medication early is a common cause of relapse, so follow your doctor’s plan closely.`,
  },
};
