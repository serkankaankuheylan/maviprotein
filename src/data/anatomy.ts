/**
 * Machine anatomy: numbered hotspots on each studio image + the matching parts list.
 *
 * Coordinates are percentages of the studio image (design-assets/master/<asset>.png, same
 * aspect as the served WebP). They are keyed by ASSET, because several models share one image
 * (DKX3/DKX5, OKX3/OKX5, SPK-398/520/720). A model with richer catalogue facts can override
 * its image's points in ANATOMY_BY_MODEL (SP85-II).
 *
 * Sources:
 * - SP85-II / SP95-II and the twin-screw parts: catalogue p.40–41 and the old "Makine Sistemleri" page.
 * - Dryers, frying/flavouring, mills, packaging: the family intros and feature lists in machines.json
 *   (catalogue p.43–51), plus the model's own spec table where a number is quoted.
 * - TASLAK: for the other parts the catalogue gives only a photo, so the part was identified from
 *   the catalogue photo / studio image and described functionally, without new technical figures.
 */
type L = { tr: string; en: string; ar: string };
export interface AnatomyPoint { x: number; y: number; name: L; d?: L }

const p = (x: number, y: number, name: [string, string, string], d?: [string, string, string]): AnatomyPoint => ({
  x, y,
  name: { tr: name[0], en: name[1], ar: name[2] },
  ...(d ? { d: { tr: d[0], en: d[1], ar: d[2] } } : {}),
});

/* Shared parts, worded once. */
const CONTROL_PANEL: [string, string, string] = ['Kontrol paneli', 'Control panel', 'لوحة التحكم'];
const BARREL: [string, string, string] = ['Ekstrüzyon kovanı', 'Extrusion barrel', 'أسطوانة البثق'];
const FEED_HOPPER: [string, string, string] = ['Besleme silosu', 'Feed hopper', 'قادوس التغذية'];
const FEEDER_DRIVE: [string, string, string] = ['Besleyici motoru', 'Feeder drive', 'محرك المغذّي'];
const FEEDER_DRIVE_D: [string, string, string] = [
  'Besleme hızı frekans kontrolüyle ayarlanır.',
  'Feed rate is set by frequency speed control.',
  'يُضبط معدل التغذية بالتحكم في التردد.',
];
const TWIN_BARREL_D: [string, string, string] = [
  'İkiz vidalı kovan, havalandırmalı paslanmaz muhafazanın içindedir.',
  'The twin-screw barrel runs inside the vented stainless housing.',
  'تقع الأسطوانة ثنائية اللولب داخل غلاف فولاذي مهوّى.',
];
const CHAMBER: [string, string, string] = ['Çok katmanlı kurutma odası', 'Multi-layer drying chamber', 'حجرة التجفيف متعددة الطبقات'];
const OUTLET_CHUTE: [string, string, string] = ['Ürün çıkışı', 'Product outlet', 'مخرج المنتج'];
const OUTLET_CHUTE_D: [string, string, string] = [
  'Kuruyan ürün bu oluktan çıkar.',
  'Dried product leaves through this chute.',
  'يخرج المنتج المجفف من هذا المزلق.',
];
const STIRRER: [string, string, string] = ['Karıştırıcı motoru', 'Agitator motor', 'محرك الخلاط'];
const CART: [string, string, string] = ['Tekerlekli şasi', 'Mobile frame', 'هيكل متنقل'];
const CART_D: [string, string, string] = [
  'İtme kolu ve tekerlekler, ünitenin hat boyunca taşınmasını sağlar.',
  'Push handle and castors let the unit be moved along the line.',
  'يتيح مقبض الدفع والعجلات نقل الوحدة على امتداد الخط.',
];
const VFFS: [string, string, string] = ['Dikey paketleme ünitesi', 'Vertical form-fill-seal unit', 'وحدة التعبئة العمودية'];
const MILL_BEARING = p(0, 0, ['Rotor yatağı', 'Rotor bearing', 'محمل الدوّار'], [
  'Rotor milini taşıyan yatak gövdesi.',
  'Bearing housing that carries the rotor shaft.',
  'مبيت المحمل الذي يحمل عمود الدوّار.',
]);
const at = (pt: AnatomyPoint, x: number, y: number): AnatomyPoint => ({ ...pt, x, y });

export const ANATOMY: Record<string, AnatomyPoint[]> = {
  /* ── Extruders ───────────────────────────────────────────── */
  // SP95-II: catalogue p.40 (twin-screw text) + line texts (preconditioning).
  'm-sp95-ii': [
    p(12, 66, ['Kesme sistemi', 'Cutting system', 'نظام القطع'], [
      'Kalıp ürüne şekil, döner bıçak boy verir.',
      'The die shapes the product and the rotary knife sets its length.',
      'يشكّل القالب المنتج وتحدد السكين الدوّارة طوله.',
    ]),
    p(33, 54, ['Buhar enjektörleri', 'Steam injectors', 'حاقنات البخار'], [
      'Akış yönünde açılı enjektörler buharı ürüne karıştırır.',
      'Injectors angled in the direction of flow mix steam into the product.',
      'حاقنات مائلة باتجاه التدفق تمزج البخار بالمنتج.',
    ]),
    p(38, 67, BARREL, [
      'Vidanın çok küçük açıklıkla döndüğü, aşınmaya karşı sertleştirilmiş silindir.',
      'Hardened cylinder in which the screw turns with a very small clearance.',
      'أسطوانة مقسّاة يدور فيها اللولب بخلوص صغير جدًا.',
    ]),
    p(62, 38, ['Ön şartlandırıcı', 'Preconditioner', 'جهاز التكييف المسبق'], [
      'Karışım ekstrudere girmeden önce burada ısıtılır.',
      'The mix is heated here before it enters the extruder.',
      'يُسخَّن الخليط هنا قبل دخوله إلى الباثقة.',
    ]),
    p(63, 65, ['Dişli kutusu', 'Gearbox', 'علبة التروس'], [
      'Motorun hareketini yüksek torkta bile en yüksek verimle vidaya aktarır.',
      'Transfers motor power to the screw at maximum efficiency, even under high torque.',
      'تنقل حركة المحرك إلى اللولب بأعلى كفاءة حتى تحت عزم دوران عالٍ.',
    ]),
    p(78, 21, FEED_HOPPER, [
      'Hammadde besleyici üzerinden sisteme verilir.',
      'Raw material enters the system through the feeder.',
      'تدخل المادة الخام إلى النظام عبر المغذّي.',
    ]),
    p(88, 40, CONTROL_PANEL, [
      'Ekstruder bağımsız bir kontrol panelinden yönetilir.',
      'The extruder is run from an independent control panel.',
      'تُدار الباثقة من لوحة تحكم مستقلة.',
    ]),
  ],
  // TASLAK (görselden): SP65-III, SP70-II, SP100, SP130, SP-TFX, SP76.
  'm-sp65-iii': [
    p(11, 52, ['Kesme ünitesi', 'Cutter unit', 'وحدة القطع'], [
      'Kalıp ucundaki kesici, eğimli koruma kapağının altındadır.',
      'The cutter at the die end sits under the sloped guard.',
      'يقع القاطع عند طرف القالب تحت الغطاء الواقي المائل.',
    ]),
    p(33, 44, BARREL, TWIN_BARREL_D),
    p(43, 14, FEED_HOPPER, [
      'Hammadde bu siloya doldurulur.',
      'Raw material is loaded into this hopper.',
      'تُعبّأ المادة الخام في هذا القادوس.',
    ]),
    p(59, 24, FEEDER_DRIVE, FEEDER_DRIVE_D),
    p(86, 26, CONTROL_PANEL, [
      'Üç sıcaklık göstergesi ve kumandalar ayrı dolapta.',
      'Three temperature displays and the controls in a separate cabinet.',
      'ثلاثة مؤشرات لدرجة الحرارة وأزرار التحكم في خزانة منفصلة.',
    ]),
  ],
  'm-sp70-ii': [
    p(12, 42, ['Kesme ünitesi', 'Cutter unit', 'وحدة القطع'], [
      'Motorlu kesici, kalıp çıkışında ürüne boy verir.',
      'The motor-driven cutter at the die exit sets the product length.',
      'يحدد القاطع المزوّد بمحرك عند مخرج القالب طول المنتج.',
    ]),
    p(40, 41, BARREL, TWIN_BARREL_D),
    p(53, 14, FEED_HOPPER, [
      'Hammadde bu siloya doldurulur.',
      'Raw material is loaded into this hopper.',
      'تُعبّأ المادة الخام في هذا القادوس.',
    ]),
    p(61, 21, FEEDER_DRIVE, FEEDER_DRIVE_D),
    p(89, 27, CONTROL_PANEL, [
      'Üç sıcaklık göstergesi ve kumandalar ayrı dolapta.',
      'Three temperature displays and the controls in a separate cabinet.',
      'ثلاثة مؤشرات لدرجة الحرارة وأزرار التحكم في خزانة منفصلة.',
    ]),
  ],
  'm-sp100': [
    p(15, 44, ['Kalıp ve kesici', 'Die and cutter', 'القالب والقاطع'], [
      'Kalıp ürüne şekil verir, motorlu kesici boyunu belirler.',
      'The die shapes the product; the motor-driven cutter sets its length.',
      'يشكّل القالب المنتج، ويحدد القاطع المزوّد بمحرك طوله.',
    ]),
    p(40, 40, BARREL, [
      'Tek vidalı kovan paslanmaz muhafazanın içindedir; vida çapı 100 mm.',
      'The single-screw barrel runs inside the stainless housing; screw diameter 100 mm.',
      'تقع الأسطوانة أحادية اللولب داخل الغلاف الفولاذي؛ قطر اللولب 100 mm.',
    ]),
    p(62, 14, FEED_HOPPER, [
      'Hammadde bu siloya doldurulur.',
      'Raw material is loaded into this hopper.',
      'تُعبّأ المادة الخام في هذا القادوس.',
    ]),
    p(72, 26, FEEDER_DRIVE, FEEDER_DRIVE_D),
    p(89, 30, CONTROL_PANEL, [
      'Üç sıcaklık göstergesi ve kumandalar ayrı dolapta.',
      'Three temperature displays and the controls in a separate cabinet.',
      'ثلاثة مؤشرات لدرجة الحرارة وأزرار التحكم في خزانة منفصلة.',
    ]),
  ],
  'm-sp130': [
    p(6, 25, ['Kalıp çıkışı', 'Die outlet', 'مخرج القالب'], [
      'Ürün kovanın ucundaki kalıptan şekil alarak çıkar.',
      'The product leaves through the die at the barrel end, taking its shape.',
      'يخرج المنتج من القالب في طرف الأسطوانة متخذًا شكله.',
    ]),
    p(24, 25, BARREL, [
      'Tek vidalı kovan; vida çapı 130 mm.',
      'Single-screw barrel; screw diameter 130 mm.',
      'أسطوانة أحادية اللولب؛ قطر اللولب 130 mm.',
    ]),
    p(37, 14, ['Besleme ağzı', 'Feed inlet', 'فتحة التغذية'], [
      'Hammadde kovana bu ağızdan girer.',
      'Raw material enters the barrel here.',
      'تدخل المادة الخام إلى الأسطوانة من هنا.',
    ]),
    p(53, 26, ['Dişli kutusu', 'Gearbox', 'علبة التروس'], [
      '60 kW ana motorun hareketini vidaya aktarır.',
      'Transfers the drive of the 60 kW main motor to the screw.',
      'تنقل حركة المحرك الرئيسي بقدرة 60 kW إلى اللولب.',
    ]),
    p(86, 30, CONTROL_PANEL, [
      'Göstergeler ve kumandalar ayrı dolapta.',
      'Displays and controls in a separate cabinet.',
      'المؤشرات وأزرار التحكم في خزانة منفصلة.',
    ]),
  ],
  'm-sp-tfx': [
    p(36, 28, ['Karıştırma tekneleri', 'Mixing troughs', 'أحواض الخلط'], [
      'Hamurun hazırlandığı iki tekne.',
      'Two troughs in which the dough is prepared.',
      'حوضان يُحضَّر فيهما العجين.',
    ]),
    p(55, 57, ['Kumanda paneli', 'Control panel', 'لوحة التحكم'], [
      'Acil stop ve çalıştırma düğmeleri makinenin önünde.',
      'Emergency stop and start buttons on the front.',
      'زر الإيقاف الطارئ وأزرار التشغيل في الواجهة.',
    ]),
    p(67, 24, ['Izgaralı emniyet kapakları', 'Grid safety lids', 'أغطية أمان شبكية'], [
      'Teknelerin üstünü kapatan ızgaralı kapaklar.',
      'Grid lids that cover the troughs.',
      'أغطية شبكية تغطي الأحواض.',
    ]),
    p(83, 57, ['Kalıp başlığı ve kesici', 'Die head and cutter', 'رأس القالب والقاطع'], [
      'Makarna hamuru kalıptan şekil alarak çıkar ve kesilir.',
      'The pasta dough is shaped through the die and cut.',
      'يتشكل عجين المعكرونة عبر القالب ثم يُقطَّع.',
    ]),
  ],
  // SP76: rotary-head text from the crispy-snack line (machines.json description).
  'm-sp76': [
    p(13, 58, ['Döner başlık', 'Rotary head', 'الرأس الدوّار'], [
      'Mısır irmiği pirinçten iki döner plaka arasında sıkışıp dönerek kıvrık form alır.',
      'Corn grits are pressed and twisted between two rotating brass plates into a curled form.',
      'تُضغط جريشة الذرة وتُلفّ بين لوحين دوّارين من النحاس فتتخذ شكلًا ملتفًا.',
    ]),
    p(48, 14, ['Besleme hunisi', 'Feed hopper', 'قادوس التغذية'], [
      'Nemlendirilmiş mısır irmiği bu huniden beslenir.',
      'Moistened corn grits are fed through this hopper.',
      'تُغذّى جريشة الذرة المرطّبة عبر هذا القادوس.',
    ]),
    p(71, 42, ['Ana motor ve redüktör', 'Main motor and gear reducer', 'المحرك الرئيسي ومخفّض السرعة'], [
      '15 kW ana motor, redüktör üzerinden tahrik eder.',
      'The 15 kW main motor drives through a gear reducer.',
      'يدير المحرك الرئيسي بقدرة 15 kW الآلة عبر مخفّض للسرعة.',
    ]),
    p(84, 72, ['Kumanda kutusu', 'Control box', 'صندوق التحكم'], [
      'Çalıştırma ve ayar düğmeleri ayrı kutuda.',
      'Start and adjustment controls in a separate box.',
      'أزرار التشغيل والضبط في صندوق منفصل.',
    ]),
  ],

  /* ── Dryers (family intro: layers, adjustable speed, thermostat) ── */
  'm-dryer': [
    p(8, 64, OUTLET_CHUTE, OUTLET_CHUTE_D),
    p(25, 38, CHAMBER, [
      'Elektrikle ısıtılan odada ürün, hızı ayarlanabilen katmanlar boyunca ilerleyerek kurur.',
      'In the electrically heated chamber the product dries as it travels along layers with adjustable speed.',
      'في الحجرة المسخّنة كهربائيًا يجفّ المنتج أثناء تحرّكه عبر طبقات قابلة لضبط السرعة.',
    ]),
    p(40, 9, ['Egzoz bacası', 'Exhaust stack', 'مدخنة العادم'], [
      'Nemli hava bacalardan dışarı atılır.',
      'Moist air is vented through the stacks.',
      'يُطرد الهواء الرطب عبر المداخن.',
    ]),
    p(67, 58, ['Kumanda panosu', 'Control cabinet', 'خزانة التحكم'], [
      'Kurutma sıcaklığı termostatla ayarlanır.',
      'Drying temperature is set by thermostat.',
      'تُضبط درجة حرارة التجفيف بواسطة الترموستات.',
    ]),
    p(86, 10, ['Besleme hunisi', 'Feed hopper', 'قادوس التغذية'], [
      'Ürün fırına bu huniden girer.',
      'Product enters the dryer through this hopper.',
      'يدخل المنتج إلى المجفف عبر هذا القادوس.',
    ]),
    p(88, 66, ['Bant tahriki', 'Belt drive', 'محرك السيور'], [
      'Katmanlardaki bantları motor ve redüktör çevirir.',
      'A motor and gear reducer drive the belts.',
      'يدير محرك ومخفّض للسرعة السيور.',
    ]),
  ],
  'm-dryer-okx': [
    p(28, 52, CHAMBER, [
      'Ürün, hızı ayarlanabilen katmanlar boyunca ilerleyerek kurur.',
      'The product dries as it travels along layers with adjustable speed.',
      'يجفّ المنتج أثناء تحرّكه عبر طبقات قابلة لضبط السرعة.',
    ]),
    p(45, 17, ['Sıcak hava kanalı', 'Hot-air duct', 'مجرى الهواء الساخن'], [
      'Isıtılan havayı fırın boyunca taşır.',
      'Carries the heated air along the dryer.',
      'ينقل الهواء المسخَّن على امتداد المجفف.',
    ]),
    p(70, 73, ['Yanma odası', 'Combustion chamber', 'حجرة الاحتراق'], [
      'Dizel ya da gazla çalışan ısı kaynağı.',
      'Diesel- or gas-fired heat source.',
      'مصدر حراري يعمل بالديزل أو الغاز.',
    ]),
    p(75, 20, ['Besleme hunisi', 'Feed hopper', 'قادوس التغذية'], [
      'Ürün fırına bu huniden girer.',
      'Product enters the dryer through this hopper.',
      'يدخل المنتج إلى المجفف عبر هذا القادوس.',
    ]),
    p(83, 58, ['Fan', 'Fan', 'المروحة'], [
      'Isınan havayı kanala basar.',
      'Blows the heated air into the duct.',
      'تدفع الهواء المسخَّن إلى المجرى.',
    ]),
  ],
  'm-dryer-steam': [
    p(6, 78, OUTLET_CHUTE, OUTLET_CHUTE_D),
    p(31, 20, ['Sirkülasyon fanları', 'Circulation fans', 'مراوح التدوير'], [
      'Çatıdaki fanlar sıcak havayı oda içinde dolaştırır.',
      'Roof fans circulate the hot air through the chamber.',
      'تدوّر المراوح العلوية الهواء الساخن داخل الحجرة.',
    ]),
    p(40, 56, CHAMBER, [
      'Buharla ısıtılan odada ürün katmanlar boyunca ilerleyerek kurur.',
      'In the steam-heated chamber the product dries as it travels through the layers.',
      'في الحجرة المسخّنة بالبخار يجفّ المنتج أثناء تحرّكه عبر الطبقات.',
    ]),
  ],

  /* ── Frying / flavouring (family intro: two drums, oil tank, dosing pump) ── */
  'm-fryer-lxy': [
    p(13, 76, ['Yağ pompası', 'Oil pump', 'مضخة الزيت'], [
      'Kızartma yağını dolaştıran pompa.',
      'Pump that circulates the frying oil.',
      'مضخة تدوّر زيت القلي.',
    ]),
    p(27, 33, ['Kapak kaldırma kolonları', 'Hood-lift columns', 'أعمدة رفع الغطاء'], [
      'Üst kapağı temizlik ve bakım için kaldıran kolonlar.',
      'Columns that raise the hood for cleaning and maintenance.',
      'أعمدة ترفع الغطاء العلوي للتنظيف والصيانة.',
    ]),
    p(36, 66, ['Kızartma teknesi', 'Frying pan', 'حوض القلي'], [
      'Ürün sıcak yağın içinde ilerleyerek kızarır.',
      'The product fries as it moves through the hot oil.',
      'يُقلى المنتج أثناء تحرّكه داخل الزيت الساخن.',
    ]),
    p(56, 66, ['Kumanda panosu', 'Control cabinet', 'خزانة التحكم'], [
      'Çalıştırma ve ayar düğmeleri.',
      'Start and adjustment controls.',
      'أزرار التشغيل والضبط.',
    ]),
    p(86, 42, ['Çıkış konveyörü', 'Discharge conveyor', 'ناقل التفريغ'], [
      'Kızaran ürünü yağdan çıkaran eğimli bant.',
      'Inclined belt that lifts the fried product out of the oil.',
      'سير مائل يُخرج المنتج المقلي من الزيت.',
    ]),
  ],
  'm-flavoring-drum': [
    p(27, 46, ['Tatlandırma tamburları', 'Flavouring drums', 'أسطوانات التنكيه'], [
      'Dönüş hızı ayarlanabilen ardışık iki tambur, ürünü yağ, toz veya aromayla homojen karıştırır.',
      'Two consecutive drums with adjustable rotation speed mix the product evenly with oil, powder or aroma.',
      'أسطوانتان متتاليتان بسرعة دوران قابلة للضبط تخلطان المنتج بالزيت أو المسحوق أو المنكّه بشكل متجانس.',
    ]),
    p(42, 12, ['Kumanda panosu', 'Control box', 'صندوق التحكم'], [
      'Tamburların çalıştırma ve ayar düğmeleri.',
      'Start and adjustment controls for the drums.',
      'أزرار تشغيل الأسطوانات وضبطها.',
    ]),
    p(52, 68, ['Yağ tankı', 'Oil tank', 'خزان الزيت'], [
      'Sıcaklığı ayarlanabilen yağ tankı.',
      'Temperature-controlled oil tank.',
      'خزان زيت يُتحكم في درجة حرارته.',
    ]),
    p(61, 80, ['Dozaj pompası', 'Dosing pump', 'مضخة الجرعات'], [
      'İstenen miktarda yağ, toz veya aromanın püskürtülmesini sağlar.',
      'Sprays the required amount of oil, powder or aroma.',
      'ترش الكمية المطلوبة من الزيت أو المسحوق أو المنكّه.',
    ]),
    p(84, 45, ['Besleme konveyörü', 'Infeed conveyor', 'ناقل التغذية'], [
      'Ürünü tambura taşıyan eğimli bant.',
      'Inclined belt that carries the product into the drum.',
      'سير مائل ينقل المنتج إلى الأسطوانة.',
    ]),
  ],

  /* ── Auxiliary machines (TASLAK: catalogue p.45 gives photos only) ── */
  'm-pyj-iii': [
    p(28, 48, ['Peristaltik pompa', 'Peristaltic pump', 'مضخة تمعجية'], [
      'Şurubu hortum üzerinden sabit debiyle basar.',
      'Pumps the syrup through the tube at a steady rate.',
      'تضخ الشراب عبر الأنبوب بمعدل ثابت.',
    ]),
    p(25, 66, ['Kumanda kutusu', 'Control box', 'صندوق التحكم'], [
      'Dijital göstergeli kumanda.',
      'Controls with a digital display.',
      'أزرار تحكم مع شاشة رقمية.',
    ]),
    p(62, 48, ['Şurup tankı', 'Syrup tank', 'خزان الشراب'], [
      'Püskürtülecek şurubun beklediği paslanmaz tank.',
      'Stainless tank holding the syrup to be sprayed.',
      'خزان من الفولاذ المقاوم للصدأ يحفظ الشراب المراد رشّه.',
    ]),
    p(80, 67, ['Çıkış vanası', 'Outlet valve', 'صمام المخرج'], [
      'Tankın alt çıkışı.',
      'The tank’s bottom outlet.',
      'المخرج السفلي للخزان.',
    ]),
    p(89, 40, CART, CART_D),
  ],
  'm-jxj-ii': [
    p(21, 45, ['Dolgu çıkışı', 'Filling outlet', 'مخرج الحشو'], [
      'Dolgu malzemesi bu bağlantıdan hatta gönderilir.',
      'The filling is sent to the line through this connection.',
      'يُرسَل الحشو إلى الخط عبر هذه الوصلة.',
    ]),
    p(50, 11, STIRRER, [
      'Tanktaki dolgu malzemesini karıştırır.',
      'Stirs the filling inside the tank.',
      'يقلّب مادة الحشو داخل الخزان.',
    ]),
    p(50, 36, ['Dolgu tankı', 'Filling tank', 'خزان الحشو'], [
      'Dolgu malzemesinin beklediği paslanmaz tank.',
      'Stainless tank holding the filling.',
      'خزان من الفولاذ المقاوم للصدأ يحفظ مادة الحشو.',
    ]),
    p(58, 63, ['Kumanda paneli', 'Control panel', 'لوحة التحكم'], [
      'Dijital ve analog göstergeler, çalıştırma düğmeleri.',
      'Digital and analogue gauges with start controls.',
      'مؤشرات رقمية وتناظرية مع أزرار التشغيل.',
    ]),
  ],
  'm-tjj-ii': [
    p(33, 21, STIRRER, [
      'Tanktaki yağı karıştırır.',
      'Stirs the oil inside the tank.',
      'يقلّب الزيت داخل الخزان.',
    ]),
    p(30, 52, ['Yağ tankı', 'Oil tank', 'خزان الزيت'], [
      'Püskürtülecek yağın beklediği paslanmaz tank.',
      'Stainless tank holding the oil to be sprayed.',
      'خزان من الفولاذ المقاوم للصدأ يحفظ الزيت المراد رشّه.',
    ]),
    p(59, 66, ['Çıkış bağlantısı', 'Outlet connection', 'وصلة المخرج'], [
      'Yağ bu bağlantıdan püskürtme hattına gider.',
      'The oil goes to the spray line through this connection.',
      'يتجه الزيت إلى خط الرش عبر هذه الوصلة.',
    ]),
    p(72, 14, ['Kumanda panosu', 'Control box', 'صندوق التحكم'], [
      'Dijital göstergeli kumanda; çalıştırma ve durdurma düğmeleri.',
      'Controls with a digital display and start/stop buttons.',
      'تحكم بشاشة رقمية وأزرار تشغيل وإيقاف.',
    ]),
    p(91, 58, CART, CART_D),
  ],
  'm-cxj': [
    p(22, 23, ['Şekillendirme silindirleri', 'Forming rollers', 'أسطوانات التشكيل'], [
      'Ürün şeridi silindirlerin arasından geçerek şekil alır.',
      'The product strand takes shape as it passes between the rollers.',
      'يتشكل شريط المنتج أثناء مروره بين الأسطوانات.',
    ]),
    p(51, 8, ['Ayar topuzları', 'Adjusting knobs', 'مقابض الضبط'], [
      'Silindir aralığı bu topuzlarla ayarlanır.',
      'The roller gap is set with these knobs.',
      'تُضبط المسافة بين الأسطوانات بهذه المقابض.',
    ]),
    p(70, 42, ['Açma-kapama şalteri', 'On/off switch', 'مفتاح التشغيل'], [
      'Makineyi çalıştırıp durduran şalter.',
      'Switch that starts and stops the machine.',
      'مفتاح يشغّل الآلة ويوقفها.',
    ]),
    p(88, 14, ['Kılavuz tarak', 'Guide comb', 'مشط التوجيه'], [
      'Ürün şeritlerini hizalayan kılavuz çubuklar.',
      'Guide rods that keep the product strands aligned.',
      'قضبان توجيه تحاذي أشرطة المنتج.',
    ]),
  ],
  'm-qdj-ii': [
    p(18, 14, ['Kesme ünitesi', 'Cutting unit', 'وحدة القطع'], [
      'Çekilen ürünü istenen boyda keser; bıçaklar koruma kapağının altındadır.',
      'Cuts the pulled product to length; the knives sit under the guard.',
      'تقطع المنتج المسحوب بالطول المطلوب، وتقع السكاكين تحت الغطاء الواقي.',
    ]),
    p(26, 50, ['Elektrik panosu', 'Electrical cabinet', 'الخزانة الكهربائية'], [
      'Makinenin elektrik ve kumanda panosu.',
      'The machine’s electrical and control cabinet.',
      'خزانة الكهرباء والتحكم الخاصة بالآلة.',
    ]),
    p(38, 12, ['Baskı silindiri', 'Pressure roller', 'أسطوانة الضغط'], [
      'Ürün şeridini banda bastırır; aralığı üstteki topuzla ayarlanır.',
      'Holds the product strand on the belt; its gap is set with the knob on top.',
      'تضغط شريط المنتج على السير، وتُضبط المسافة بالمقبض العلوي.',
    ]),
    p(70, 18, ['Çekme bandı', 'Pulling belt', 'سير السحب'], [
      'Ürün şeridini kesme ünitesine çeken uzun bant.',
      'Long belt that pulls the product strand to the cutting unit.',
      'سير طويل يسحب شريط المنتج إلى وحدة القطع.',
    ]),
  ],
  'm-pan-shaper': [
    p(15, 22, ['Döner disk muhafazası', 'Rotary disc guard', 'واقي القرص الدوّار'], [
      'Döner diski çevreleyen koruma kapağı.',
      'Guard enclosing the rotary disc.',
      'غطاء واقٍ يحيط بالقرص الدوّار.',
    ]),
    p(17, 50, ['Çıkış oluğu', 'Discharge chute', 'مزلق التفريغ'], [
      'Şekillenen ürün bu oluktan alınır.',
      'The shaped product leaves along this chute.',
      'يخرج المنتج المُشكَّل عبر هذا المزلق.',
    ]),
    p(39, 9, ['Ayar topuzları', 'Adjusting knobs', 'مقابض الضبط'], [
      'Silindir baskısı üstteki topuzlarla ayarlanır.',
      'Roller pressure is set with the knobs on top.',
      'يُضبط ضغط الأسطوانات بالمقابض العلوية.',
    ]),
    p(73, 26, ['Şekillendirme silindirleri', 'Forming rollers', 'أسطوانات التشكيل'], [
      'Ürün, silindir çiftlerinin arasından geçerek şekil alır.',
      'The product takes shape passing between the roller pairs.',
      'يتشكل المنتج أثناء مروره بين أزواج الأسطوانات.',
    ]),
    p(84, 58, ['Ayar göstergeleri', 'Control gauges', 'مؤشرات الضبط'], [
      'İki analog gösterge, ayar düğmeleri ve şalterler.',
      'Two analogue gauges with adjustment knobs and switches.',
      'مؤشران تناظريان مع مقابض ضبط ومفاتيح.',
    ]),
  ],

  /* ── Mills (feature lists p.46–48) ── */
  'm-hammer-mill': [
    at(MILL_BEARING, 15, 52),
    p(32, 9, ['Besleme ağzı', 'Feed inlet', 'فتحة التغذية'], [
      'Kendini temizleyen çark beslemeli ya da mıknatıslı bant beslemeli olarak seçilebilir.',
      'Choice of self-cleaning impeller feeding or belt-magnet feeding.',
      'يمكن اختيار التغذية بدوّارة ذاتية التنظيف أو بحزام مغناطيسي.',
    ]),
    p(45, 45, ['Öğütme odası ve elek kapağı', 'Grinding chamber and screen door', 'حجرة الطحن وباب المنخل'], [
      'Çekiçler bu odada döner; yan kapak açılarak elek kolayca değiştirilir.',
      'The hammers spin in this chamber; the side door opens for quick screen changes.',
      'تدور المطارق في هذه الحجرة، ويُفتح الباب الجانبي لتغيير المنخل بسهولة.',
    ]),
    p(62, 40, ['Kaplin muhafazası', 'Coupling guard', 'واقي الوصلة'], [
      'Motor rotoru doğrudan tahrik eder; kaplin bu kapağın altındadır.',
      'The motor drives the rotor directly; the coupling sits under this guard.',
      'يدير المحرك الدوّار مباشرة، وتقع الوصلة تحت هذا الغطاء.',
    ]),
    p(80, 33, ['Elektrik motoru', 'Electric motor', 'المحرك الكهربائي'], [
      'Modele göre 18,5–110 kW.',
      '18.5–110 kW depending on the model.',
      'من 18.5 إلى 110 kW حسب الطراز.',
    ]),
  ],
  'n-fine-mill': [
    at(MILL_BEARING, 17, 66),
    p(43, 22, ['Besleme bölümü', 'Feed section', 'قسم التغذية'], [
      'Gözetleme camlı besleme bölümü.',
      'Feed section with an inspection window.',
      'قسم التغذية بنافذة مراقبة.',
    ]),
    p(42, 62, ['Öğütme odası', 'Grinding chamber', 'حجرة الطحن'], [
      'Yeni tasarım çekiçler ve kolay değiştirilen çoklu çember elek.',
      'Newly designed hammers and small multi-chamber screens that are easy to replace.',
      'مطارق بتصميم جديد ومناخل صغيرة متعددة الحجرات سهلة الاستبدال.',
    ]),
    p(68, 58, ['Elektrik motoru', 'Electric motor', 'المحرك الكهربائي'], [
      'Modele göre 30–315 kW.',
      '30–315 kW depending on the model.',
      'من 30 إلى 315 kW حسب الطراز.',
    ]),
    p(86, 56, ['Elek kapağı', 'Screen door', 'باب المنخل'], [
      'Geniş yan kapak açılarak elek değiştirilir.',
      'The wide side door opens for screen changes.',
      'يُفتح الباب الجانبي العريض لتغيير المنخل.',
    ]),
  ],
  'n-micro-mill': [
    p(25, 62, ['Ana motor', 'Main motor', 'المحرك الرئيسي'], [
      'Modele göre 55–160 kW.',
      '55–160 kW depending on the model.',
      'من 55 إلى 160 kW حسب الطراز.',
    ]),
    p(30, 40, ['Helezonlu besleyici', 'Screw feeder', 'مغذٍّ لولبي'], [
      'Ağır yabancı maddeleri ayırarak tıkanmayı önler.',
      'Removes heavy impurities and prevents blockages.',
      'يزيل الشوائب الثقيلة ويمنع الانسداد.',
    ]),
    p(44, 31, ['Ürün çıkışı', 'Product outlet', 'مخرج المنتج'], [
      'İnce ürün hava akımıyla bu kanaldan çıkar.',
      'The fine product leaves with the air stream through this port.',
      'يخرج المنتج الناعم مع تيار الهواء عبر هذه الفتحة.',
    ]),
    p(51, 52, ['Öğütme odası', 'Grinding chamber', 'حجرة الطحن'], [
      'Elek kullanılmaz; öğütme ve havayla sınıflandırma aynı anda yapılır.',
      'Screenless: grinding and air classification happen at the same time.',
      'بلا منخل: يتم الطحن والتصنيف الهوائي في آن واحد.',
    ]),
    p(59, 10, ['Sınıflandırıcı motoru', 'Classifier motor', 'محرك المصنِّف'], [
      'Öğütme inceliği 30–140 µm arasında ayarlanabilir.',
      'Grinding fineness is adjustable from 30 to 140 µm.',
      'يمكن ضبط نعومة الطحن من 30 إلى 140 µm.',
    ]),
  ],

  /* ── Packaging (p.50 features + p.50–51 spec tables) ── */
  'm-packaging': [
    p(72, 35, ['Kovalı elevatör', 'Bucket elevator', 'رافعة القواديس'], [
      'Ürünü alttaki hazneden tartıcının üstüne taşır.',
      'Lifts the product from the lower hopper to the top of the weigher.',
      'ترفع المنتج من القادوس السفلي إلى أعلى الميزان.',
    ]),
    p(37, 42, ['Çok kafalı tartıcı', 'Multihead weigher', 'ميزان متعدد الرؤوس'], [
      'Ürünü 10–1000 g arasında tartar.',
      'Weighs the product between 10 and 1000 g.',
      'يزن المنتج بين 10 و1000 g.',
    ]),
    p(64, 56, ['Dokunmatik panel', 'Touch panel', 'شاشة لمس'], [
      'Dokunmatik panelli PLC kontrol, adım adım açıklamalı.',
      'PLC control with a touch panel and step-by-step instructions.',
      'تحكم PLC بشاشة لمس مع تعليمات خطوة بخطوة.',
    ]),
    p(36, 72, VFFS, [
      'Film torbaya dönüşür, dolar ve ısıyla kapatılır; servo sarmalı pnömatik sistem.',
      'Film is formed into a bag, filled and heat-sealed; pneumatic system with servo film drive.',
      'يتحول الفيلم إلى كيس يُملأ ويُغلق حراريًا؛ نظام هوائي مع سحب فيلم مؤازر.',
    ]),
    p(58, 80, ['Çıkış konveyörü', 'Take-off conveyor', 'ناقل الإخراج'], [
      'Dolan paketleri makineden alır.',
      'Carries the filled packs away from the machine.',
      'ينقل العبوات الممتلئة بعيدًا عن الآلة.',
    ]),
  ],
  'm-spf-398': [
    p(24, 28, ['Burgulu dolum ünitesi', 'Auger filler', 'وحدة التعبئة بالبريمة'], [
      'Tozu 10–500 g arasında hacimsel olarak doldurur.',
      'Doses powder volumetrically between 10 and 500 g.',
      'يعبّئ المسحوق حجميًا بين 10 و500 g.',
    ]),
    p(24, 62, VFFS, [
      'Filmden torba oluşturur, doldurur ve kapatır; önü şeffaf emniyet kapaklı.',
      'Forms, fills and seals bags from film behind clear safety doors.',
      'يشكّل الأكياس من الفيلم ويملؤها ويغلقها خلف أبواب أمان شفافة.',
    ]),
    p(50, 38, ['Helezonlu besleme konveyörü', 'Screw feeding conveyor', 'ناقل تغذية لولبي'], [
      'Tozu alttaki hazneden dolum hunisine taşır.',
      'Carries the powder from the lower hopper up to the filler.',
      'ينقل المسحوق من القادوس السفلي إلى وحدة التعبئة.',
    ]),
    p(84, 61, ['Besleme haznesi', 'Feed hopper', 'قادوس التغذية'], [
      'Toz ürün bu hazneye boşaltılır.',
      'The powder is emptied into this hopper.',
      'يُفرغ المسحوق في هذا القادوس.',
    ]),
  ],
  'm-spk-500': [
    p(14, 40, ['Kumanda paneli', 'Control panel', 'لوحة التحكم'], [
      'Dijital göstergeler ve çalıştırma düğmeleri.',
      'Digital displays and start buttons.',
      'شاشات رقمية وأزرار تشغيل.',
    ]),
    p(25, 66, ['Hava şartlandırıcı', 'Air service unit', 'وحدة تهيئة الهواء'], [
      'Pnömatik sistemi besleyen filtre-regülatör.',
      'Filter-regulator that feeds the pneumatic system.',
      'مرشح ومنظم يغذّي النظام الهوائي.',
    ]),
    p(56, 10, ['Ürün hunisi', 'Product hopper', 'قادوس المنتج'], [
      'Granül ürünün beklediği paslanmaz huni.',
      'Stainless hopper holding the granular product.',
      'قادوس من الفولاذ المقاوم للصدأ يحفظ المنتج الحبيبي.',
    ]),
    p(60, 40, ['Hacimsel ölçü kapları', 'Volumetric measuring cups', 'أكواب القياس الحجمي'], [
      'Döner diskteki kaplar her paketin miktarını ölçer (50–500 ml).',
      'Cups on a rotating disc measure each pack (50–500 ml).',
      'تقيس الأكواب على قرص دوّار كمية كل عبوة (50–500 ml).',
    ]),
    p(56, 64, ['Form borusu ve kapatma çeneleri', 'Forming tube and sealing jaws', 'أنبوب التشكيل وفكوك اللحام'], [
      'Film boru etrafında torbaya dönüşür ve ısıyla kapatılır.',
      'The film is formed into a bag around the tube and heat-sealed.',
      'يتشكّل الفيلم كيسًا حول الأنبوب ويُغلق حراريًا.',
    ]),
  ],
  'm-sp-350': [
    p(25, 40, ['Besleme bandı', 'Infeed conveyor', 'ناقل التغذية'], [
      'Ürünleri sırayla sarma ünitesine taşır.',
      'Carries the products in sequence to the wrapping unit.',
      'ينقل المنتجات بالتتابع إلى وحدة التغليف.',
    ]),
    p(48, 10, ['Film rulo mili', 'Film reel holder', 'حامل بكرة الفيلم'], [
      'Ambalaj filmi bu mile takılır.',
      'The packaging film reel is mounted here.',
      'تُركَّب بكرة فيلم التغليف هنا.',
    ]),
    p(73, 13, ['Dokunmatik panel', 'Touch panel', 'شاشة لمس'], [
      'Paketleme hızı 20–200 paket/dk aralığında.',
      'Packing speed from 20 to 200 packs/min.',
      'سرعة التغليف من 20 إلى 200 عبوة/دقيقة.',
    ]),
    p(76, 40, ['Kapatma ve kesme ünitesi', 'Sealing and cutting unit', 'وحدة اللحام والقطع'], [
      'Paketleri kapatıp birbirinden ayırır.',
      'Seals the packs and cuts them apart.',
      'تغلق العبوات وتفصلها عن بعضها.',
    ]),
    p(90, 44, ['Çıkış bandı', 'Outfeed conveyor', 'ناقل الإخراج'], [
      'Paketlenen ürünleri alır.',
      'Takes the wrapped products away.',
      'ينقل المنتجات المغلّفة.',
    ]),
  ],
  'm-sp-50': [
    p(30, 85, ['Torba bandı', 'Sack conveyor', 'ناقل الأكياس'], [
      'Dolan torbayı dikiş makinesine taşır.',
      'Carries the filled sack to the sewing head.',
      'ينقل الكيس الممتلئ إلى رأس الخياطة.',
    ]),
    p(38, 65, ['Dikiş makinesi', 'Sewing head', 'رأس الخياطة'], [
      'Dolan torbanın ağzını diker.',
      'Sews the mouth of the filled sack shut.',
      'يخيط فوهة الكيس الممتلئ.',
    ]),
    p(59, 14, ['Besleme hunisi', 'Feed hopper', 'قادوس التغذية'], [
      'Ürünün beklediği büyük paslanmaz huni.',
      'Large stainless hopper holding the product.',
      'قادوس كبير من الفولاذ المقاوم للصدأ يحفظ المنتج.',
    ]),
    p(57, 44, ['Tartım ünitesi', 'Weighing unit', 'وحدة الوزن'], [
      'Ürünü torbaya bırakmadan önce tartar (5–50 kg).',
      'Weighs each batch before it drops into the sack (5–50 kg).',
      'تزن كل دفعة قبل نزولها في الكيس (5–50 kg).',
    ]),
    p(59, 62, ['Torba kıskacı', 'Bag clamp', 'ماسك الكيس'], [
      'Torbayı dolum ağzında tutar; hava kaynağı 0,3–0,5 MPa.',
      'Holds the sack on the filling spout; air supply 0.3–0.5 MPa.',
      'يثبّت الكيس على فوهة التعبئة؛ مصدر الهواء 0.3–0.5 MPa.',
    ]),
    p(81, 59, ['Kumanda kutusu', 'Control box', 'صندوق التحكم'], [
      'Dijital tartım göstergesi ve düğmeler.',
      'Digital weight display and buttons.',
      'شاشة وزن رقمية وأزرار.',
    ]),
  ],
};

/** SP85-II: catalogue p.41 gives part-by-part facts, so it keeps its own, richer list. */
export const ANATOMY_BY_MODEL: Record<string, AnatomyPoint[]> = {
  'sp85-ii': [
    p(10, 47, ['Kesme sistemi', 'Cutting system', 'نظام القطع'], [
      'Kalıp önünde ayarlanabilir hızlı kesici; ürün boyunu belirler.',
      'Variable-speed cutter at the die; sets product length.',
      'قاطع متغير السرعة عند القالب؛ يحدد طول المنتج.',
    ]),
    p(31, 44, ['Ekstrüzyon sistemi', 'Extrusion system', 'نظام البثق'], [
      '38CrMoAl kovan ve segmentli ikiz vida; kovan sertliği ~HRC60.',
      '38CrMoAl barrel and segmented twin screw; barrel hardness ~HRC60.',
      'أسطوانة ولولب مزدوج مقطّعي من 38CrMoAl؛ صلادة الأسطوانة ~HRC60.',
    ]),
    p(48, 17, ['Besleme sistemi', 'Feeding system', 'نظام التغذية'], [
      'Paslanmaz çelik besleme silosu; 0,75 kW, iki karıştırıcı.',
      'Stainless feeding hopper; 0.75 kW, two agitators.',
      'قادوس تغذية من الفولاذ المقاوم للصدأ؛ 0.75 kW وخلّاطان.',
    ]),
    p(56, 42, ['Dişli kutusu ve yağlama', 'Gearbox & lubrication', 'علبة التروس والتزييت'], [
      'Zorlanmış yağlama; 3 mm çelik yağ kutusu, 300 psi kapalı boru.',
      'Forced lubrication; 3 mm steel oil box, 300 psi sealed tube.',
      'تزييت قسري؛ صندوق زيت فولاذي 3 mm وأنبوب محكم 300 psi.',
    ]),
    p(75, 40, ['Ana motor', 'Main motor', 'المحرك الرئيسي'], [
      '75 kW / 110 kW; frekans kontrollü hız.',
      '75 kW / 110 kW; frequency-controlled speed.',
      '75 / 110 kW؛ سرعة بالتحكم في التردد.',
    ]),
    p(89, 26, CONTROL_PANEL, [
      'Bağımsız panel; görünür otomatik sıcaklık kontrolü.',
      'Independent panel; visible automatic temperature control.',
      'لوحة مستقلة؛ تحكم آلي مرئي بدرجة الحرارة.',
    ]),
  ],
};

export const anatomyFor = (slug: string, asset?: string): AnatomyPoint[] | undefined =>
  ANATOMY_BY_MODEL[slug] ?? (asset ? ANATOMY[asset] : undefined);
