/**
 * Line journeys: every production line, end to end, station by station, in the material's own words.
 *
 * Sources (nothing invented):
 *  - numbered stations (`n`) are the catalogue's line schema, in its order (catalogue p.10–39, lines.json);
 *  - stations without `n` complete the line end to end with the firm's own equipment and process:
 *    grinding (mill pages p.46–48), packaging (p.50–51) and, for fish feed, the steps of note 64
 *    "Akuakültür ekstrüde yemlerinin üretimi" (silo → grinding → mixing → … → crumbling & sieving → packing);
 *  - the chips line's moulding machine and rollers are the unnumbered "Kalıplama makinesi / Kalıplar" on p.20;
 *  - texts paraphrase the line descriptions in lines.json and note 64; metrics are read from machines.json / lines.json.
 * TASLAK: the starch line has no numbered schema in the catalogue (only the SP85-II and SP130 extruders, p.34–35);
 * its feeding, milling and packing stations are inferred from the catalogue photos (extruded ropes, powder bagging)
 * and must be confirmed by the client.
 * Station titles per line (`title`) are drafts built from the catalogue's raw materials and products (TASLAK).
 */
type L3 = { tr: string; en: string; ar: string };

export type Metric =
  | { line: 'capacity' }                       // the line's capacity range (lines.json)
  | { spec: string; key: string }              // a spec of a machine model (machines.json), e.g. { spec: 'sgt-ii', key: 'capacity' }
  | { millCapacity: string }                   // capacity range across a mill's variants
  | { v: string | L3; u: L3 };                 // a literal value

export interface JStation {
  /** catalogue number on the line schema; omitted = a station that completes the line end to end */
  n?: number;
  /** machine image (design-assets/final) */
  asset: string;
  step: L3;
  /** machine name; for numbered stations it defaults to the catalogue component name */
  machine?: L3;
  /** appended to the machine name, e.g. the extruder models of the line */
  model?: string;
  text: L3;
  metric?: Metric;
  /** material image after this station, and its name */
  mat: string;
  matName: L3;
  /** machine page (model slug in machines.json) or a machines-page family hash ('#kurutucular') */
  page?: string;
}

export interface LineJourney { title: L3; stations: JStation[] }

/* ---------- shared words ---------- */
const STEP = {
  raw: { tr: 'Hammadde', en: 'Raw materials', ar: 'المواد الخام' },
  grind: { tr: 'Öğütme', en: 'Grinding', ar: 'الطحن' },
  mix: { tr: 'Karıştırma', en: 'Mixing', ar: 'الخلط' },
  moisten: { tr: 'Nemlendirme', en: 'Moistening', ar: 'الترطيب' },
  feed: { tr: 'Besleme', en: 'Feeding', ar: 'التغذية' },
  extrude: { tr: 'Ekstrüzyon', en: 'Extrusion', ar: 'البثق' },
  convey: { tr: 'Taşıma', en: 'Conveying', ar: 'النقل' },
  lift: { tr: 'Aktarma', en: 'Transfer', ar: 'التحويل' },
  spread: { tr: 'Dağıtma', en: 'Spreading', ar: 'التوزيع' },
  dry: { tr: 'Kurutma', en: 'Drying', ar: 'التجفيف' },
  coat: { tr: 'Kaplama', en: 'Coating', ar: 'التغليف' },
  oil: { tr: 'Yağlama', en: 'Oil coating', ar: 'التزييت' },
  flavor: { tr: 'Tatlandırma', en: 'Flavouring', ar: 'إضافة النكهة' },
  cool: { tr: 'Soğutma', en: 'Cooling', ar: 'التبريد' },
  crumble: { tr: 'Kırma', en: 'Crumbling', ar: 'التكسير' },
  sieve: { tr: 'Eleme', en: 'Sieving', ar: 'الغربلة' },
  pack: { tr: 'Paketleme', en: 'Packaging', ar: 'التعبئة' },
  mould: { tr: 'Kalıplama', en: 'Moulding', ar: 'القولبة' },
  cut: { tr: 'Kesme', en: 'Cutting', ar: 'القطع' },
  fry: { tr: 'Kızartma', en: 'Frying', ar: 'القلي' },
  deoil: { tr: 'Yağ alma', en: 'De-oiling', ar: 'إزالة الزيت' },
  flake: { tr: 'İnceltme', en: 'Flaking', ar: 'التحويل إلى رقائق' },
  toast: { tr: 'Kavurma', en: 'Toasting', ar: 'التحميص' },
  sugar: { tr: 'Şekerleme', en: 'Sugar coating', ar: 'التغطية بالسكر' },
  fill: { tr: 'Dolgu', en: 'Filling', ar: 'الحشو' },
  shape: { tr: 'Şekillendirme', en: 'Shaping', ar: 'التشكيل' },
} satisfies Record<string, L3>;

const MACHINE = {
  silo: { tr: 'Hammadde silosu', en: 'Raw material silo', ar: 'صومعة المواد الخام' },
  hammer: { tr: 'Çekiçli değirmen (1. kuşak)', en: 'Hammer mill (1st generation)', ar: 'طاحونة مطرقية (الجيل الأول)' },
  fine: { tr: 'İnce öğütme değirmeni (2. kuşak)', en: 'Fine grinder (2nd generation)', ar: 'مطحنة ناعمة (الجيل الثاني)' },
  micro: { tr: 'Mikro öğütme değirmeni (son kuşak)', en: 'Micro grinder (latest generation)', ar: 'مطحنة دقيقة (أحدث جيل)' },
  mixer: { tr: 'Karıştırıcı / mikser', en: 'Mixer', ar: 'خلاط' },
  sgt: { tr: 'SGT-II 2 bölümlü tatlandırma hattı', en: 'SGT-II double-drum flavouring line', ar: 'خط النكهات ثنائي الأسطوانة SGT-II' },
  cxj: { tr: 'CXJ kalıplama makinesi ve kalıp silindirleri', en: 'CXJ moulding machine and mould rollers', ar: 'آلة القولبة CXJ وأسطوانات القوالب' },
  crumbler: { tr: 'Krumble kırma makinesi', en: 'Crumbler', ar: 'آلة التكسير (كرامبل)' },
  sieve: { tr: 'Titreşimli elek', en: 'Vibrating sieve', ar: 'غربال اهتزازي' },
  spk: { tr: 'SPK tam otomatik dikey granül paketleme hattı', en: 'SPK full automatic vertical granule packaging line', ar: 'خط التعبئة العمودي الأوتوماتيكي للحبيبات SPK' },
  spk500: { tr: 'SPK-500 otomatik granül paketleme makinesi', en: 'SPK-500 automatic granule packaging machine', ar: 'آلة تعبئة الحبيبات الأوتوماتيكية SPK-500' },
  spf: { tr: 'SPF-398 otomatik un (toz) paketleme makinesi', en: 'SPF-398 automatic powder packaging machine', ar: 'آلة تعبئة المساحيق الأوتوماتيكية SPF-398' },
  sp350: { tr: 'SP-350 hızlı paketleme makinesi', en: 'SP-350 fast pillow packaging machine', ar: 'آلة التعبئة السريعة SP-350' },
  sp50: { tr: 'SP-50 elektronik sayımlı paketleme terazisi', en: 'SP-50 electronic packaging scale', ar: 'ميزان التعبئة الإلكتروني SP-50' },
  screw: { tr: 'Helezonlu taşıyıcı', en: 'Screw conveyor', ar: 'ناقل لولبي' },
  starchExtruders: { tr: 'SP85-II çift vidalı ya da SP130 tek vidalı ekstruder', en: 'SP85-II twin-screw or SP130 single-screw extruder', ar: 'باثقة SP85-II ثنائية اللولب أو SP130 أحادية اللولب' },
} satisfies Record<string, L3>;

/* ---------- shared sentences ---------- */
const TXT = {
  screw: { tr: 'Karışım, ekstruderin besleme silosuna aktarılır.', en: 'The mix is transferred to the extruder’s feed hopper.', ar: 'يُنقل الخليط إلى قادوس تغذية الباثقة.' },
  screwHeat: { tr: 'Karışım, ekstrudere beslenmeden önce ısıtılır.', en: 'The mix is heated before it is fed into the extruder.', ar: 'يُسخَّن الخليط قبل تغذيته إلى الباثقة.' },
  pneumatic: { tr: 'Taze ürün kapalı hatta, kırılmadan kurutucuya taşınır.', en: 'The fresh product is carried to the dryer in a closed line, without breaking.', ar: 'يُنقل المنتج الطازج إلى المجفف عبر خط مغلق دون أن يتكسّر.' },
  pneumaticTo: { tr: 'Ürün kapalı hatta, kırılmadan bir sonraki makineye taşınır.', en: 'The product is carried to the next machine in a closed line, without breaking.', ar: 'يُنقل المنتج إلى الآلة التالية عبر خط مغلق دون أن يتكسّر.' },
  lift: { tr: 'Ürün aşındırılmadan bir sonraki makineye yükseltilir.', en: 'The product is lifted to the next machine without abrasion.', ar: 'يُرفع المنتج إلى الآلة التالية دون احتكاك.' },
  spread: { tr: 'Titreşim ürünü yayarak sonraki makineyi düzenli besler.', en: 'Vibration spreads the product and feeds the next machine evenly.', ar: 'يوزّع الاهتزاز المنتج ويغذّي الآلة التالية بانتظام.' },
  dryer: { tr: 'Çok katlı fırında, termostatla ayarlanan sıcaklıkta kurutulur.', en: 'Dried in the multi-layer dryer at a thermostat-set temperature.', ar: 'يُجفَّف في المجفف متعدد الطبقات عند درجة حرارة مضبوطة بالثرموستات.' },
  coolBelt: { tr: 'Ürün fanlı bantta soğutulur.', en: 'The product is cooled on a fan-cooled belt.', ar: 'يُبرَّد المنتج على حزام مزوّد بمراوح.' },
  pack: { tr: 'Ürün el değmeden tartılır ve paketlenir.', en: 'The product is weighed and packed untouched by hand.', ar: 'يُوزن المنتج ويُعبّأ دون أن تمسّه يد.' },
} satisfies Record<string, L3>;

const LAYERS: Metric = { v: '5', u: { tr: 'katlı fırın', en: 'layers', ar: 'طبقات' } };
const DRYERS = '#kurutucular';

/* ---------- materials that recur ---------- */
const PELLET_WET = { tr: 'Islak pelet', en: 'Wet pellets', ar: 'حبيبات رطبة' };

export const JOURNEYS: Record<string, LineJourney> = {
  'hayvancilik-yemi': {
    title: { tr: 'Rasyondan <em>pelet yeme.</em>', en: 'From ration <em>to pellet feed.</em>', ar: 'من العليقة <em>إلى العلف المحبب.</em>' },
    stations: [
      { asset: 'm-hammer-mill', step: STEP.grind, machine: MACHINE.hammer, page: 'standart-ogutme-degirmeni', metric: { millCapacity: 'standart-ogutme-degirmeni' },
        text: { tr: 'Kuru içerikler, karıştırılmadan önce öğütülür.', en: 'Dry ingredients are ground before mixing.', ar: 'تُطحن المكونات الجافة قبل الخلط.' },
        mat: 'mat-powder', matName: { tr: 'Öğütülmüş hammadde', en: 'Ground raw material', ar: 'مواد خام مطحونة' } },
      { n: 1, asset: 'm-mixer', step: STEP.mix,
        text: { tr: 'Türe ve yaşa göre hazırlanan rasyonun kuru ve nemli içerikleri bir araya gelir.', en: 'The dry and wet ingredients of a ration prepared for species and age come together.', ar: 'تجتمع المكونات الجافة والرطبة لعليقة مُعدّة وفق النوع والعمر.' },
        mat: 'lv-mix', matName: { tr: 'Rasyon karışımı', en: 'Ration blend', ar: 'خليط العليقة' } },
      { n: 2, asset: 'm-screw-conveyor', step: STEP.feed, text: TXT.screwHeat,
        mat: 'lv-mash', matName: { tr: 'Isıtılmış karışım', en: 'Heated mash', ar: 'خليط مُسخَّن' } },
      { n: 3, asset: 'sp85-ii-extruder', step: STEP.extrude, model: 'SP65-III · SP70-II · SP85-II', page: 'sp85-ii', metric: { line: 'capacity' },
        text: { tr: 'Karışım açık uca ilerlerken yoğun sıcaklık ve basınç altında şekil verilip kesilerek pişirilir.', en: 'As it moves toward the open end, the mix is shaped, cut and cooked under intense heat and pressure.', ar: 'يُشكَّل الخليط ويُقطع ويُطهى تحت حرارة وضغط عاليين أثناء تقدمه نحو الطرف المفتوح.' },
        mat: 'lv-wet', matName: PELLET_WET },
      { n: 4, asset: 'm-pneumatic-conveyor', step: STEP.convey, text: TXT.pneumatic, mat: 'lv-wet', matName: PELLET_WET },
      { n: 5, asset: 'm-dryer', step: STEP.dry, page: DRYERS, metric: LAYERS,
        text: { tr: 'Yem, çok geçişli kurutucuda nem kabuk oluşumuna uygun seviyeye inene kadar kurutulur.', en: 'The feed is dried in the multi-pass dryer until its moisture is right for the crust to form.', ar: 'يُجفَّف العلف في المجفف متعدد المراحل حتى تبلغ رطوبته المستوى المناسب لتكوّن القشرة.' },
        mat: 'lv-dry', matName: { tr: 'Kuru pelet', en: 'Dry pellets', ar: 'حبيبات جافة' } },
      { n: 6, asset: 'm-flavoring-drum', step: STEP.coat, page: 'sgt-ii', metric: { spec: 'sgt-ii', key: 'capacity' },
        text: { tr: 'Hayvansal yağ ve vitaminler kaplama tamburunda uygulanır.', en: 'Animal fat and vitamins are applied in the coating drum.', ar: 'تُضاف الدهون الحيوانية والفيتامينات في أسطوانة التغليف.' },
        mat: 'lv-coated', matName: { tr: 'Kaplı pelet', en: 'Coated pellets', ar: 'حبيبات مغلّفة' } },
      { n: 7, asset: 'm-cooling-conveyor', step: STEP.cool, text: TXT.coolBelt,
        mat: 'lv-coated', matName: { tr: 'Soğumuş pelet', en: 'Cooled pellets', ar: 'حبيبات مبرّدة' } },
      { asset: 'm-sp-50', step: STEP.pack, machine: MACHINE.sp50, page: 'sp-50', metric: { spec: 'sp-50', key: 'weight' },
        text: { tr: 'Pelet yem tartılarak torbalara doldurulur.', en: 'The pellet feed is weighed into sacks.', ar: 'يُوزن العلف المحبب ويُعبّأ في أكياس.' },
        mat: 'pk-livestock-feed', matName: { tr: 'Torbalanmış yem', en: 'Bagged feed', ar: 'علف معبّأ' } },
    ],
  },

  'akvaryum-yemi': {
    title: { tr: 'İnce hammaddeden <em>renkli granüle.</em>', en: 'From fine meal <em>to colourful granules.</em>', ar: 'من المسحوق الناعم <em>إلى حبيبات ملوّنة.</em>' },
    stations: [
      { asset: 'n-micro-mill', step: STEP.grind, machine: MACHINE.micro, page: 'mikro-ogutme-degirmeni', metric: { spec: 'mikro-ogutme-degirmeni', key: 'fineness' },
        text: { tr: 'Küçük yemler için hammadde mikron düzeyinde öğütülür.', en: 'For small feeds, the raw material is ground to micron size.', ar: 'للأعلاف الصغيرة تُطحن المادة الخام إلى حجم الميكرون.' },
        mat: 'aq-premix', matName: { tr: 'İnce öğütülmüş hammadde', en: 'Finely ground meal', ar: 'مسحوق مطحون بدقة' } },
      { asset: 'm-mixer', step: STEP.mix, machine: MACHINE.mixer,
        text: { tr: 'Her granül aynı besin değerini taşısın diye içerikler homojen karıştırılır.', en: 'Ingredients are blended evenly so every granule carries the same nutrition.', ar: 'تُخلط المكونات خلطًا متجانسًا لتحمل كل حبيبة القيمة الغذائية نفسها.' },
        mat: 'aq-premix', matName: { tr: 'Homojen karışım', en: 'Even blend', ar: 'خليط متجانس' } },
      { n: 1, asset: 'sp85-ii-extruder', step: STEP.extrude, model: 'SP65-III · SP70-II · SP85-II', page: 'sp85-ii', metric: { line: 'capacity' },
        text: { tr: 'Hamur çift vidalı ekstruderde basınç altında pişirilir, kalıp çıkışında bıçaklarla küçük granüllere kesilir.', en: 'The dough is cooked under pressure in the twin-screw extruder and cut into small granules by knives at the die.', ar: 'تُطهى العجينة تحت الضغط في الباثقة ثنائية اللولب وتُقطع بالسكاكين عند القالب إلى حبيبات صغيرة.' },
        mat: 'aq-wet', matName: { tr: 'Islak granül', en: 'Wet granules', ar: 'حبيبات رطبة' } },
      { n: 2, asset: 'm-pneumatic-conveyor', step: STEP.convey, metric: { v: '1–3', u: { tr: 'mm çaplı yem', en: 'mm feed', ar: 'مم قطر العلف' } },
        text: { tr: '1–3 mm çaplı küçük yemler havalı taşıyıcıyla kurutucuya gönderilir.', en: 'Small feeds of 1–3 mm are sent to the dryer by air conveyor.', ar: 'تُرسل الأعلاف الصغيرة بقطر 1–3 مم إلى المجفف بالناقل الهوائي.' },
        mat: 'aq-wet', matName: { tr: 'Islak granül', en: 'Wet granules', ar: 'حبيبات رطبة' } },
      { n: 3, asset: 'm-dryer-steam', step: STEP.dry, page: DRYERS, metric: LAYERS, text: TXT.dryer,
        mat: 'aq-dry', matName: { tr: 'Kuru granül', en: 'Dry granules', ar: 'حبيبات جافة' } },
      { n: 4, asset: 'm-hoister', step: STEP.lift, text: TXT.lift, mat: 'aq-dry', matName: { tr: 'Kuru granül', en: 'Dry granules', ar: 'حبيبات جافة' } },
      { n: 5, asset: 'm-flavoring-drum', step: STEP.flavor, page: 'sgt-ii', metric: { spec: 'sgt-ii', key: 'capacity' },
        text: { tr: 'Dozaj pompasıyla yağ, vitamin ve renk artırıcı doğal katkılar püskürtülür; tambur dönerek homojen kaplar.', en: 'A dosing pump sprays oil, vitamins and natural colour enhancers; the turning drum coats evenly.', ar: 'تُرش مضخة الجرعات الزيت والفيتامينات والإضافات الطبيعية المعزّزة للألوان، وتغلّف الأسطوانة الدوّارة بالتساوي.' },
        mat: 'aq-coated', matName: { tr: 'Kaplanmış granül', en: 'Coated granules', ar: 'حبيبات مغلّفة' } },
      { n: 6, asset: 'm-hoister', step: STEP.lift, text: TXT.lift, mat: 'aq-coated', matName: { tr: 'Kaplanmış granül', en: 'Coated granules', ar: 'حبيبات مغلّفة' } },
      { n: 7, asset: 'm-cooler-box', step: STEP.cool,
        text: { tr: 'Granüller soğutulur; nemi düşük yem, kalitesini daha uzun korur.', en: 'The granules are cooled; the lower its moisture, the longer feed keeps its quality.', ar: 'تُبرَّد الحبيبات؛ فكلما قلّت رطوبة العلف حافظ على جودته مدة أطول.' },
        mat: 'aq-coated', matName: { tr: 'Soğumuş granül', en: 'Cooled granules', ar: 'حبيبات مبرّدة' } },
      { asset: 'm-spk-500', step: STEP.pack, machine: MACHINE.spk500, page: 'spk-500', metric: { spec: 'spk-500', key: 'speed' },
        text: { tr: 'Granül yem küçük paketlere doldurulur.', en: 'The granules are filled into small packs.', ar: 'تُعبّأ الحبيبات في عبوات صغيرة.' },
        mat: 'pk-aquarium-feed', matName: { tr: 'Paketlenmiş yem', en: 'Packed feed', ar: 'علف معبّأ' } },
    ],
  },

  'kultur-baligi-yemi': {
    title: { tr: 'Silodaki hammaddeden <em>yüzen, batan ve yavaş batan pelete.</em>', en: 'From raw material in the silo <em>to floating, sinking and slow-sinking pellets.</em>', ar: 'من المواد الخام في الصومعة <em>إلى حبيبات طافية وغاطسة وبطيئة الغوص.</em>' },
    stations: [
      { asset: 'n-raw-silo', step: STEP.raw, machine: MACHINE.silo,
        text: { tr: 'Rasyondaki hammaddeler silolarda saklanır ve rasyona göre dozajlanır.', en: 'Ration ingredients are stored in silos and dosed to the ration.', ar: 'تُخزَّن مكونات العليقة في الصوامع وتُوزن جرعاتها وفق العليقة.' },
        mat: 'fs-raw', matName: { tr: 'Hammadde', en: 'Raw materials', ar: 'مواد خام' } },
      { asset: 'm-hammer-mill', step: STEP.grind, machine: MACHINE.hammer, page: 'standart-ogutme-degirmeni', metric: { millCapacity: 'standart-ogutme-degirmeni' },
        text: { tr: 'Hammadde mikron düzeyinde öğütülür; partikül boyutu pelet kalitesini doğrudan belirler.', en: 'Raw materials are ground to micron size; particle size directly determines pellet quality.', ar: 'تُطحن المواد الخام إلى حجم الميكرون؛ ويحدد حجم الجسيمات جودة الحبيبات مباشرة.' },
        mat: 'mat-powder', matName: { tr: 'Öğütülmüş hammadde', en: 'Ground raw material', ar: 'مواد خام مطحونة' } },
      { asset: 'm-mixer', step: STEP.mix, machine: MACHINE.mixer,
        text: { tr: 'Öğütülen hammaddeler homojen karıştırılır ve yem yapılana kadar stok silosunda bekler.', en: 'The ground ingredients are blended evenly and wait in a stock silo until production.', ar: 'تُخلط المكونات المطحونة خلطًا متجانسًا وتنتظر في صومعة التخزين حتى الإنتاج.' },
        mat: 'mat-mix', matName: { tr: 'Homojen karışım', en: 'Even blend', ar: 'خليط متجانس' } },
      { n: 1, asset: 'sp85-ii-extruder', step: STEP.extrude, model: 'SP65-III · SP70-II · SP85-II', page: 'sp85-ii', metric: { line: 'capacity' },
        text: { tr: 'Şartlandırıcıda su ile tavlanan hamur, ekstruderde basınç altında pişirilir ve çıkıştaki bıçaklarla kesilir.', en: 'Dough tempered with water in the conditioner is cooked under pressure in the extruder and cut by knives at the outlet.', ar: 'تُطهى العجينة المعالجة بالماء في وحدة التكييف تحت الضغط داخل الباثقة، وتُقطع بالسكاكين عند المخرج.' },
        mat: 'mat-pellet-wet', matName: PELLET_WET },
      { n: 2, asset: 'm-pneumatic-conveyor', step: STEP.convey,
        text: { tr: 'Havalı taşıyıcı peletleri hem ön soğutur hem de kapalı ortamda kurutucuya taşır.', en: 'The air conveyor pre-cools the pellets and carries them to the dryer in a closed line.', ar: 'يبرّد الناقل الهوائي الحبيبات مبدئيًا وينقلها إلى المجفف في خط مغلق.' },
        mat: 'mat-pellet-wet', matName: PELLET_WET },
      { n: 3, asset: 'm-dryer-steam', step: STEP.dry, page: DRYERS, metric: LAYERS, text: TXT.dryer,
        mat: 'mat-pellet-dry', matName: { tr: 'Kuru pelet', en: 'Dry pellets', ar: 'حبيبات جافة' } },
      { asset: 'm-flavoring-drum', step: STEP.oil, machine: MACHINE.sgt, page: 'sgt-ii', metric: { spec: 'sgt-ii', key: 'capacity' },
        text: { tr: 'İki silindirli tamburda dozaj pompasıyla yağ ve aroma püskürtülür.', en: 'Oil and aroma are sprayed by a dosing pump in the two-cylinder drum.', ar: 'يُرش الزيت والمنكّه بمضخة الجرعات داخل الأسطوانة ثنائية الحجرة.' },
        mat: 'mat-pellet-coated', matName: { tr: 'Yağlanmış pelet', en: 'Oil-coated pellets', ar: 'حبيبات مزيّتة' } },
      { n: 4, asset: 'm-cooling-conveyor', step: STEP.cool,
        text: { tr: 'Peletler soğutmalı taşıyıcıyla silolara gider; paketlemeden önce bir gün dinlenir.', en: 'The cooling conveyor takes the pellets to silos, where they rest for a day before packing.', ar: 'ينقل ناقل التبريد الحبيبات إلى الصوامع حيث تستريح يومًا قبل التعبئة.' },
        mat: 'mat-pellet-coated', matName: { tr: 'Soğumuş pelet', en: 'Cooled pellets', ar: 'حبيبات مبرّدة' } },
      { asset: 'n-crumbler', step: STEP.crumble, machine: MACHINE.crumbler, metric: { v: '< 1', u: { tr: 'mm yem için', en: 'mm feed', ar: 'مم للأعلاف' } },
        text: { tr: '1 mm’den küçük yem için peletler ayarlanabilir silindirlerle kırılır.', en: 'For feed below 1 mm, pellets are broken between adjustable rolls.', ar: 'للأعلاف التي يقل حجمها عن 1 مم تُكسَّر الحبيبات بين أسطوانات قابلة للضبط.' },
        mat: 'fs-crumble', matName: { tr: 'Kırılmış pelet', en: 'Crumbled pellets', ar: 'حبيبات مكسّرة' } },
      { asset: 'n-vibro-sieve', step: STEP.sieve, machine: MACHINE.sieve,
        text: { tr: 'Titreşimli elek kırılan yemi boyutlarına ayırır ve tozdan arındırır.', en: 'The vibrating sieve sizes the crumbles and removes the dust.', ar: 'يصنّف الغربال الاهتزازي الحبيبات المكسّرة حسب الحجم ويزيل غبارها.' },
        mat: 'fs-crumble', matName: { tr: 'Mikropartikül yem', en: 'Micro-particle feed', ar: 'علف دقيق الجسيمات' } },
      { asset: 'm-packaging', step: STEP.pack, machine: MACHINE.spk, page: 'spk-520', metric: { spec: 'spk-520', key: 'speed' }, text: TXT.pack,
        mat: 'pk-feed-pouch', matName: { tr: 'Paketlenmiş yem', en: 'Packed feed', ar: 'علف معبّأ' } },
    ],
  },

  'evcil-hayvan-mamasi': {
    title: { tr: 'Et ve tahıldan <em>kuru mamaya.</em>', en: 'From meat and cereal <em>to dry pet food.</em>', ar: 'من اللحم والحبوب <em>إلى طعام جاف للحيوانات الأليفة.</em>' },
    stations: [
      { asset: 'm-hammer-mill', step: STEP.grind, machine: MACHINE.hammer, page: 'standart-ogutme-degirmeni', metric: { millCapacity: 'standart-ogutme-degirmeni' },
        text: { tr: 'Tahıl gibi kuru içerikler karıştırılmadan önce öğütülür.', en: 'Dry ingredients such as cereals are ground before mixing.', ar: 'تُطحن المكونات الجافة كالحبوب قبل الخلط.' },
        mat: 'mat-powder', matName: { tr: 'Öğütülmüş tahıl', en: 'Ground cereal', ar: 'حبوب مطحونة' } },
      { n: 1, asset: 'm-mixer', step: STEP.mix,
        text: { tr: 'Et; öğütülmüş tahıl, vitamin ve minerallerle mikserde bir araya gelir.', en: 'Meat meets the ground cereal, vitamins and minerals in the mixer.', ar: 'يلتقي اللحم بالحبوب المطحونة والفيتامينات والمعادن في الخلاط.' },
        mat: 'pf-mix', matName: { tr: 'Et ve tahıl karışımı', en: 'Meat and cereal blend', ar: 'خليط اللحم والحبوب' } },
      { n: 2, asset: 'm-screw-conveyor', step: STEP.feed, text: TXT.screwHeat,
        mat: 'pf-mix', matName: { tr: 'Isıtılmış karışım', en: 'Heated mix', ar: 'خليط مُسخَّن' } },
      { n: 3, asset: 'sp85-ii-extruder', step: STEP.extrude, model: 'SP65-III · SP70-II · SP85-II', page: 'sp85-ii', metric: { line: 'capacity' },
        text: { tr: 'Karışım yoğun sıcaklık ve basınç altında şekil verilip kesilerek pişirilir.', en: 'The mix is shaped, cut and cooked under intense heat and pressure.', ar: 'يُشكَّل الخليط ويُقطع ويُطهى تحت حرارة وضغط عاليين.' },
        mat: 'pf-wet', matName: { tr: 'Islak mama', en: 'Wet kibble', ar: 'حبيبات طعام رطبة' } },
      { n: 4, asset: 'm-pneumatic-conveyor', step: STEP.convey, text: TXT.pneumatic, mat: 'pf-wet', matName: { tr: 'Islak mama', en: 'Wet kibble', ar: 'حبيبات طعام رطبة' } },
      { n: 5, asset: 'm-dryer', step: STEP.dry, page: DRYERS, metric: LAYERS,
        text: { tr: 'Mama, çok geçişli kurutucuda nem kabuk oluşumuna uygun seviyeye inene kadar kurutulur.', en: 'The kibble is dried in the multi-pass dryer until its moisture is right for the crust to form.', ar: 'تُجفَّف الحبيبات في المجفف متعدد المراحل حتى تبلغ رطوبتها المستوى المناسب لتكوّن القشرة.' },
        mat: 'pf-dry', matName: { tr: 'Kuru mama', en: 'Dry kibble', ar: 'حبيبات جافة' } },
      { n: 6, asset: 'm-flavoring-drum', step: STEP.flavor, page: 'sgt-ii', metric: { spec: 'sgt-ii', key: 'capacity' },
        text: { tr: 'Hayvansal yağ ve vitaminler tatlandırma tamburunda uygulanır.', en: 'Animal fat and vitamins are applied in the flavouring drum.', ar: 'تُضاف الدهون الحيوانية والفيتامينات في أسطوانة النكهات.' },
        mat: 'p-pet-food', matName: { tr: 'Kaplanmış mama', en: 'Coated kibble', ar: 'حبيبات مغلّفة' } },
      { n: 7, asset: 'm-cooling-conveyor', step: STEP.cool, text: TXT.coolBelt,
        mat: 'p-pet-food', matName: { tr: 'Soğumuş mama', en: 'Cooled kibble', ar: 'حبيبات مبرّدة' } },
      { asset: 'm-packaging', step: STEP.pack, machine: MACHINE.spk, page: 'spk-720', metric: { spec: 'spk-720', key: 'speed' }, text: TXT.pack,
        mat: 'pk-pet-food', matName: { tr: 'Paketlenmiş mama', en: 'Packed pet food', ar: 'طعام معبّأ' } },
    ],
  },

  'evcil-hayvan-odul-mamasi': {
    title: { tr: 'Nişasta hamurundan <em>burgu çiğneme çubuğuna.</em>', en: 'From starch dough <em>to twisted chews.</em>', ar: 'من عجينة النشا <em>إلى أعواد مضغ ملتوية.</em>' },
    stations: [
      { n: 1, asset: 'm-mixer', step: STEP.mix,
        text: { tr: 'Nişasta ve diğer içerikler mikserde karıştırılır.', en: 'Starch and the other ingredients are blended in the mixer.', ar: 'يُخلط النشا وبقية المكونات في الخلاط.' },
        mat: 'pt-mix', matName: { tr: 'Nişastalı karışım', en: 'Starch blend', ar: 'خليط النشا' } },
      { n: 2, asset: 'm-screw-conveyor', step: STEP.feed, text: TXT.screw, mat: 'pt-mix', matName: { tr: 'Nişastalı karışım', en: 'Starch blend', ar: 'خليط النشا' } },
      { n: 3, asset: 'm-sp100', step: STEP.extrude, model: 'SP100', page: 'sp100', metric: { line: 'capacity' },
        text: { tr: 'Tek vidalı ekstruder hamuru sürekli şeritler halinde verir: kıvrılmış, çift renkli ya da içi dolu.', en: 'The single-screw extruder delivers the dough as continuous strands: twisted, two-coloured or filled.', ar: 'تُخرج الباثقة أحادية اللولب العجينة شرائط متصلة: ملتوية أو بلونين أو محشوّة.' },
        mat: 'pt-rope', matName: { tr: 'Sürekli şerit', en: 'Continuous strand', ar: 'شريط متصل' } },
      { n: 4, asset: 'm-cooling-belt', step: STEP.cool,
        text: { tr: 'Şeritler uzun soğutma bandında sertleşir.', en: 'The strands set on the long cooling belt.', ar: 'تتماسك الشرائط على حزام التبريد الطويل.' },
        mat: 'pt-rope', matName: { tr: 'Soğumuş şerit', en: 'Cooled strand', ar: 'شريط مبرّد' } },
      { n: 5, asset: 'm-cutter', step: STEP.cut,
        text: { tr: 'Şeritler gereken boyda kesilir.', en: 'The strands are cut to the required length.', ar: 'تُقطع الشرائط بالطول المطلوب.' },
        mat: 'pt-cut', matName: { tr: 'Kesilmiş çubuk', en: 'Cut sticks', ar: 'أعواد مقطّعة' } },
      { n: 6, asset: 'm-hoister', step: STEP.lift, text: TXT.lift, mat: 'pt-cut', matName: { tr: 'Kesilmiş çubuk', en: 'Cut sticks', ar: 'أعواد مقطّعة' } },
      { n: 7, asset: 'm-dryer', step: STEP.dry, page: DRYERS, metric: LAYERS, text: TXT.dryer,
        mat: 'p-pet-treats', matName: { tr: 'Ödül ve çiğneme maması', en: 'Treats and chews', ar: 'مكافآت وأعواد مضغ' } },
      { asset: 'm-packaging', step: STEP.pack, machine: MACHINE.spk, page: 'spk-520', metric: { spec: 'spk-520', key: 'speed' }, text: TXT.pack,
        mat: 'pk-pet-treats', matName: { tr: 'Paketlenmiş ürün', en: 'Packed treats', ar: 'منتج معبّأ' } },
    ],
  },

  'ekstrude-cips-kraker': {
    title: { tr: 'Buğday ve mısır unundan <em>çıtır cipse.</em>', en: 'From wheat and maize flour <em>to crisp chips.</em>', ar: 'من دقيق القمح والذرة <em>إلى رقائق مقرمشة.</em>' },
    stations: [
      { n: 1, asset: 'm-mixer', step: STEP.mix,
        text: { tr: 'Buğday unu, mısır unu, su, bitkisel yağ ve tuz karıştırılır.', en: 'Wheat flour, maize flour, water, vegetable oil and salt are mixed.', ar: 'يُخلط دقيق القمح ودقيق الذرة والماء والزيت النباتي والملح.' },
        mat: 'cc-mix', matName: { tr: 'Un karışımı', en: 'Flour blend', ar: 'خليط الدقيق' } },
      { n: 2, asset: 'm-screw-conveyor', step: STEP.feed, text: TXT.screw, mat: 'cc-mix', matName: { tr: 'Un karışımı', en: 'Flour blend', ar: 'خليط الدقيق' } },
      { n: 3, asset: 'm-sp70-ii', step: STEP.extrude, model: 'SP65-III · SP70-II', page: 'sp70-ii', metric: { line: 'capacity' },
        text: { tr: 'Hamur pişirilir ve kalıptan yassı bir tabaka halinde çıkar.', en: 'The dough is cooked and leaves the die as a flat sheet.', ar: 'تُطهى العجينة وتخرج من القالب على شكل صفيحة مسطّحة.' },
        mat: 'cc-sheet', matName: { tr: 'Hamur tabakası', en: 'Dough sheet', ar: 'صفيحة العجين' } },
      { asset: 'm-cxj', step: STEP.mould, machine: MACHINE.cxj, page: 'cxj',
        text: { tr: 'Kalıp silindirleri tabakaya desen verir; kalıp değiştirilerek farklı cips şekilleri elde edilir.', en: 'The mould rollers pattern the sheet; changing the moulds gives other chip shapes.', ar: 'تطبع أسطوانات القوالب النقش على الصفيحة، وبتغيير القوالب تُنتج أشكال أخرى.' },
        mat: 'cc-shaped', matName: { tr: 'Desenli tabaka', en: 'Patterned sheet', ar: 'صفيحة منقوشة' } },
      { n: 4, asset: 'm-qdj-ii', step: STEP.cut, page: 'qdj-ii',
        text: { tr: 'Tabaka çekilerek üçgen, kare, çubuk ve benzeri parçalara kesilir.', en: 'The sheet is pulled and cut into triangles, squares, sticks and more.', ar: 'تُسحب الصفيحة وتُقطع إلى مثلثات ومربعات وأعواد وغيرها.' },
        mat: 'cc-cut', matName: { tr: 'Çiğ cips', en: 'Raw chips', ar: 'رقائق نيئة' } },
      { n: 5, asset: 'm-fryer-batch', step: STEP.fry,
        text: { tr: 'Parçalar kızartılarak genleşir ve çıtırlaşır.', en: 'Frying expands the pieces and makes them crisp.', ar: 'يُنفخ القلي القطع ويجعلها مقرمشة.' },
        mat: 'cc-fried', matName: { tr: 'Kızarmış cips', en: 'Fried chips', ar: 'رقائق مقلية' } },
      { n: 6, asset: 'm-seasoning-drum', step: STEP.flavor,
        text: { tr: 'Dönen tamburda çeşni serpilerek tat verilir.', en: 'Seasoning is dusted on in the turning drum.', ar: 'تُرش التوابل على المنتج داخل الأسطوانة الدوّارة.' },
        mat: 'p-chips-crackers', matName: { tr: 'Çeşnili cips', en: 'Seasoned chips', ar: 'رقائق متبّلة' } },
      { asset: 'm-packaging', step: STEP.pack, machine: MACHINE.spk, page: 'spk-520', metric: { spec: 'spk-520', key: 'speed' }, text: TXT.pack,
        mat: 'pk-chips-crackers', matName: { tr: 'Paketlenmiş cips', en: 'Packed chips', ar: 'رقائق معبّأة' } },
    ],
  },

  'misir-gevregi-kahvaltilik-tahil': {
    title: { tr: 'Mısır irmiğinden <em>şekerli gevreğe.</em>', en: 'From maize grits <em>to frosted flakes.</em>', ar: 'من جريش الذرة <em>إلى رقائق مُحلّاة.</em>' },
    stations: [
      { n: 1, asset: 'm-mixer', step: STEP.mix,
        text: { tr: 'Ayıklanıp kabuğu soyulan mısır ve diğer tahıllar karıştırılır.', en: 'Selected, dehulled maize and other cereals are mixed.', ar: 'تُخلط الذرة المنتقاة المقشّرة مع الحبوب الأخرى.' },
        mat: 'cf-grits', matName: { tr: 'Mısır irmiği', en: 'Maize grits', ar: 'جريش الذرة' } },
      { n: 2, asset: 'm-screw-conveyor', step: STEP.feed, text: TXT.screw, mat: 'cf-grits', matName: { tr: 'Mısır irmiği', en: 'Maize grits', ar: 'جريش الذرة' } },
      { n: 3, asset: 'sp85-ii-extruder', step: STEP.extrude, model: 'SP65-III · SP70-II · SP85-II', page: 'sp85-ii', metric: { line: 'capacity' },
        text: { tr: 'Tahıl, çift vidalı ekstruderde pişirilip küçük peletler halinde kesilir.', en: 'The cereal is cooked in the twin-screw extruder and cut into small pellets.', ar: 'تُطهى الحبوب في الباثقة ثنائية اللولب وتُقطع إلى حبيبات صغيرة.' },
        mat: 'cf-pellet', matName: { tr: 'Pişmiş pelet', en: 'Cooked pellets', ar: 'حبيبات مطهوّة' } },
      { n: 4, asset: 'm-vibro-feeder', step: STEP.spread, text: TXT.spread, mat: 'cf-pellet', matName: { tr: 'Pişmiş pelet', en: 'Cooked pellets', ar: 'حبيبات مطهوّة' } },
      { n: 5, asset: 'm-pneumatic-conveyor', step: STEP.convey, text: TXT.pneumaticTo, mat: 'cf-pellet', matName: { tr: 'Pişmiş pelet', en: 'Cooked pellets', ar: 'حبيبات مطهوّة' } },
      { n: 6, asset: 'm-flaker', step: STEP.flake,
        text: { tr: 'Peletler iki silindir arasında ezilerek ince gevreğe dönüşür.', en: 'The pellets are pressed between two rolls into thin flakes.', ar: 'تُضغط الحبيبات بين أسطوانتين فتتحول إلى رقائق رفيعة.' },
        mat: 'cf-flake-raw', matName: { tr: 'Ham gevrek', en: 'Raw flakes', ar: 'رقائق نيئة' } },
      { n: 7, asset: 'm-pneumatic-conveyor', step: STEP.convey, text: TXT.pneumatic, mat: 'cf-flake-raw', matName: { tr: 'Ham gevrek', en: 'Raw flakes', ar: 'رقائق نيئة' } },
      { n: 8, asset: 'm-dryer', step: STEP.dry, page: DRYERS, metric: LAYERS, text: TXT.dryer,
        mat: 'cf-flake-dry', matName: { tr: 'Kuru gevrek', en: 'Dry flakes', ar: 'رقائق جافة' } },
      { n: 9, asset: 'm-hoister', step: STEP.lift, text: TXT.lift, mat: 'cf-flake-dry', matName: { tr: 'Kuru gevrek', en: 'Dry flakes', ar: 'رقائق جافة' } },
      { n: 10, asset: 'm-vibro-feeder', step: STEP.spread, text: TXT.spread, mat: 'cf-flake-dry', matName: { tr: 'Kuru gevrek', en: 'Dry flakes', ar: 'رقائق جافة' } },
      { n: 11, asset: 'm-puffing-oven', step: STEP.toast,
        text: { tr: 'Sıcak hava üflemesiyle gevrekler kabarır, kıvrılır ve altın rengini alır.', en: 'Blown hot air puffs and curls the flakes and turns them golden.', ar: 'ينفخ الهواء الساخن الرقائق ويجعّدها ويكسبها لونًا ذهبيًا.' },
        mat: 'p-corn-flakes', matName: { tr: 'Kavrulmuş gevrek', en: 'Toasted flakes', ar: 'رقائق محمّصة' } },
      { n: 12, asset: 'm-sugar-coater', step: STEP.sugar,
        text: { tr: 'Dönen tamburda gevreklere şeker şurubu püskürtülür.', en: 'Sugar syrup is sprayed onto the flakes in a turning drum.', ar: 'يُرش شراب السكر على الرقائق داخل أسطوانة دوّارة.' },
        mat: 'cf-frosted', matName: { tr: 'Şekerli gevrek', en: 'Frosted flakes', ar: 'رقائق مُحلّاة' } },
      { n: 13, asset: 'm-dryer', step: STEP.dry, page: DRYERS,
        text: { tr: 'Şurup kaplaması kurutulur.', en: 'The syrup coating is dried.', ar: 'تُجفَّف طبقة الشراب.' },
        mat: 'cf-frosted', matName: { tr: 'Şekerli gevrek', en: 'Frosted flakes', ar: 'رقائق مُحلّاة' } },
      { n: 14, asset: 'm-cooling-conveyor', step: STEP.cool, text: TXT.coolBelt,
        mat: 'cf-frosted', matName: { tr: 'Soğumuş gevrek', en: 'Cooled flakes', ar: 'رقائق مبرّدة' } },
      { asset: 'm-packaging', step: STEP.pack, machine: MACHINE.spk, page: 'spk-720', metric: { spec: 'spk-720', key: 'speed' }, text: TXT.pack,
        mat: 'pk-corn-flakes', matName: { tr: 'Paketlenmiş gevrek', en: 'Packed flakes', ar: 'رقائق معبّأة' } },
    ],
  },

  'citir-atistirmalik': {
    title: { tr: 'Mısır irmiğinden <em>kıvrık çereze.</em>', en: 'From maize grits <em>to corn curls.</em>', ar: 'من جريش الذرة <em>إلى رقائق ذرة ملتوية.</em>' },
    stations: [
      { n: 1, asset: 'm-vertical-mixer', step: STEP.moisten,
        text: { tr: 'Mısır taneleri dikey karıştırıcıda su ile nemlendirilir.', en: 'Maize grits are moistened with water in the vertical mixer.', ar: 'يُرطَّب جريش الذرة بالماء في الخلاط العمودي.' },
        mat: 'cr-grits', matName: { tr: 'Nemli mısır irmiği', en: 'Moist maize grits', ar: 'جريش ذرة مرطّب' } },
      { n: 2, asset: 'm-screw-conveyor', step: STEP.feed,
        text: { tr: 'Nemli mısır döner başlı ekstrudere beslenir.', en: 'The moist grits are fed to the rotary-head extruder.', ar: 'يُغذّى الجريش المرطّب إلى الباثقة ذات الرأس الدوّار.' },
        mat: 'cr-grits', matName: { tr: 'Nemli mısır irmiği', en: 'Moist maize grits', ar: 'جريش ذرة مرطّب' } },
      { n: 3, asset: 'm-sp76', step: STEP.extrude, model: 'SP76', page: 'sp76', metric: { line: 'capacity' },
        text: { tr: 'Pirinçten iki döner plaka mısırı sıkıp döndürerek kıvırır; bıçaklar boyuna keser.', en: 'Two rotating brass plates squeeze and turn the maize into curls; knives cut them to size.', ar: 'تعصر لوحتان دوّارتان من النحاس الأصفر الذرة وتلفّانها فتلتوي، ثم تقطعها السكاكين بالحجم المطلوب.' },
        mat: 'cr-raw', matName: { tr: 'Ham kıvrık', en: 'Raw curls', ar: 'رقائق ملتوية نيئة' } },
      { n: 4, asset: 'm-hoister', step: STEP.lift, text: TXT.lift, mat: 'cr-raw', matName: { tr: 'Ham kıvrık', en: 'Raw curls', ar: 'رقائق ملتوية نيئة' } },
      { n: 5, asset: 'm-drum-sieve', step: STEP.sieve,
        text: { tr: 'Döner elek kırıntı ve tozu ayırır.', en: 'The rotating sieve drum removes crumbs and fines.', ar: 'يفصل الغربال الأسطواني الدوّار الفتات والغبار.' },
        mat: 'cr-raw', matName: { tr: 'Elenmiş kıvrık', en: 'Sieved curls', ar: 'رقائق مغربلة' } },
      { n: 6, asset: 'm-vibro-feeder', step: STEP.spread, text: TXT.spread, mat: 'cr-raw', matName: { tr: 'Elenmiş kıvrık', en: 'Sieved curls', ar: 'رقائق مغربلة' } },
      { n: 7, asset: 'm-fryer-lxy', step: STEP.fry, page: 'lxy-ii', metric: { spec: 'lxy-ii', key: 'capacity' },
        text: { tr: 'Kıvrık mısırlar pişirme yağında sürekli kızartılır.', en: 'The curls are fried continuously in cooking oil.', ar: 'تُقلى الرقائق الملتوية بشكل متواصل في زيت الطهي.' },
        mat: 'cr-fried', matName: { tr: 'Kızarmış kıvrık', en: 'Fried curls', ar: 'رقائق مقلية' } },
      { n: 8, asset: 'm-deoiler', step: STEP.deoil,
        text: { tr: 'Titreşimli elek fazla yağı süzer.', en: 'The vibrating screen drains off excess oil.', ar: 'يصفّي الغربال الاهتزازي الزيت الزائد.' },
        mat: 'cr-fried', matName: { tr: 'Yağı alınmış kıvrık', en: 'De-oiled curls', ar: 'رقائق منزوعة الزيت' } },
      { n: 9, asset: 'm-seasoning-drum', step: STEP.flavor,
        text: { tr: 'Çeşniler, tadı geliştirmek için yüzeye püskürtülür.', en: 'Seasonings are sprayed onto the surface to bring out the taste.', ar: 'تُرش التوابل على السطح لتعزيز المذاق.' },
        mat: 'p-puffed-snacks', matName: { tr: 'Çeşnili çerez', en: 'Seasoned curls', ar: 'رقائق متبّلة' } },
      { asset: 'm-packaging', step: STEP.pack, machine: MACHINE.spk, page: 'spk-520', metric: { spec: 'spk-520', key: 'speed' }, text: TXT.pack,
        mat: 'pk-puffed-snacks', matName: { tr: 'Paketlenmiş çerez', en: 'Packed snacks', ar: 'وجبات معبّأة' } },
    ],
  },

  'kizartilmis-halka-3d-pelet': {
    title: { tr: 'Nişasta ve undan <em>üç boyutlu çereze.</em>', en: 'From starch and flour <em>to 3D snacks.</em>', ar: 'من النشا والدقيق <em>إلى وجبات خفيفة ثلاثية الأبعاد.</em>' },
    stations: [
      { n: 1, asset: 'm-mixer', step: STEP.mix,
        text: { tr: 'Patates nişastası, mısır nişastası ve buğday unu karıştırılır.', en: 'Potato starch, maize starch and wheat flour are mixed.', ar: 'يُخلط نشا البطاطس ونشا الذرة ودقيق القمح.' },
        mat: 'td-mix', matName: { tr: 'Nişasta ve un karışımı', en: 'Starch and flour blend', ar: 'خليط النشا والدقيق' } },
      { n: 2, asset: 'm-screw-conveyor', step: STEP.feed, text: TXT.screw, mat: 'td-mix', matName: { tr: 'Nişasta ve un karışımı', en: 'Starch and flour blend', ar: 'خليط النشا والدقيق' } },
      { n: 3, asset: 'm-sp100', step: STEP.extrude, model: 'SP100', page: 'sp100', metric: { line: 'capacity' },
        text: { tr: 'Tek vidalı ekstruder hamuru pişirir ve yoğun bir profil halinde verir.', en: 'The single-screw extruder cooks the dough and delivers it as a dense profile.', ar: 'تطهو الباثقة أحادية اللولب العجينة وتُخرجها مقطعًا كثيفًا.' },
        mat: 'td-sheet', matName: { tr: 'Ekstrüde profil', en: 'Extruded profile', ar: 'مقطع مبثوق' } },
      { n: 4, asset: 'm-qdj-ii', step: STEP.cut, page: 'qdj-ii',
        text: { tr: 'Profil çekilip deniz kabuğu, burgu, spiral, kare ve çember tüp şekillerinde kesilir.', en: 'The profile is pulled and cut into shells, twists, spirals, square and round tubes.', ar: 'يُسحب المقطع ويُقطع على شكل أصداف ولوالب وحلزونات وأنابيب مربعة ودائرية.' },
        mat: 'td-cut', matName: { tr: 'Çiğ pelet', en: 'Raw pellets', ar: 'حبيبات نيئة' } },
      { n: 5, asset: 'm-cooling-bin', step: STEP.cool,
        text: { tr: 'Kesilen peletler soğutulur.', en: 'The cut pellets are cooled.', ar: 'تُبرَّد الحبيبات المقطّعة.' },
        mat: 'td-cut', matName: { tr: 'Çiğ pelet', en: 'Raw pellets', ar: 'حبيبات نيئة' } },
      { n: 6, asset: 'm-hot-air-dryer', step: STEP.dry,
        text: { tr: 'Sıcak hava peletleri kurutarak sert, camsı bir yarı mamule dönüştürür.', en: 'Hot air dries the pellets into a hard, glassy half-product.', ar: 'يجفّف الهواء الساخن الحبيبات فتصبح منتجًا نصف مصنّع صلبًا لامعًا.' },
        mat: 'td-dry', matName: { tr: 'Kuru 3D pelet', en: 'Dry 3D pellets', ar: 'حبيبات ثلاثية الأبعاد جافة' } },
      { n: 7, asset: 'm-fryer-batch', step: STEP.fry,
        text: { tr: 'Kurutmadan sonra ürünlerin genleşmesi için kızartılması gerekir.', en: 'After drying, the products must be fried to expand.', ar: 'بعد التجفيف يجب قلي المنتجات لكي تنتفخ.' },
        mat: 'p-3d-pellets', matName: { tr: 'Genleşmiş çerez', en: 'Expanded snacks', ar: 'وجبات منتفخة' } },
      { n: 8, asset: 'm-seasoning-drum', step: STEP.flavor,
        text: { tr: 'Dönen tamburda çeşni serpilerek tat verilir.', en: 'Seasoning is dusted on in the turning drum.', ar: 'تُرش التوابل على المنتج داخل الأسطوانة الدوّارة.' },
        mat: 'td-seasoned', matName: { tr: 'Çeşnili çerez', en: 'Seasoned snacks', ar: 'وجبات متبّلة' } },
      { asset: 'm-packaging', step: STEP.pack, machine: MACHINE.spk, page: 'spk-520', metric: { spec: 'spk-520', key: 'speed' }, text: TXT.pack,
        mat: 'pk-3d-pellets', matName: { tr: 'Paketlenmiş çerez', en: 'Packed snacks', ar: 'وجبات معبّأة' } },
    ],
  },

  'musli-tahil-bar': {
    title: { tr: 'Şuruplu tahıldan <em>paketli bara.</em>', en: 'From syrup-bound cereal <em>to wrapped bars.</em>', ar: 'من حبوب ممزوجة بالشراب <em>إلى ألواح مغلّفة.</em>' },
    stations: [
      { n: 1, asset: 'm-bar-conveyor', step: STEP.feed,
        text: { tr: 'Şeker ya da çikolatayla karışan fıstık ve tahıllar kalıplama makinesine taşınır.', en: 'Nuts and cereals mixed with sugar or chocolate are carried to the moulding machine.', ar: 'تُنقل المكسرات والحبوب الممزوجة بالسكر أو الشوكولاتة إلى آلة القولبة.' },
        mat: 'mb-mix', matName: { tr: 'Şuruplu tahıl karışımı', en: 'Syrup-bound cereal mix', ar: 'خليط حبوب بالشراب' } },
      { n: 2, asset: 'm-bar-former', step: STEP.mould, model: 'SP45-II', metric: { line: 'capacity' },
        text: { tr: 'PLC kontrollü paslanmaz makine karışımı çubuk, top ya da kare şeklinde kalıplar.', en: 'The PLC-controlled stainless machine moulds the mix into bars, balls or squares.', ar: 'تقولب الآلة المصنوعة من الفولاذ المقاوم للصدأ والمتحكَّم بها بـ PLC الخليط على شكل ألواح أو كرات أو مربعات.' },
        mat: 'mb-formed', matName: { tr: 'Kalıplanmış bar', en: 'Moulded bars', ar: 'ألواح مقولبة' } },
      { n: 3, asset: 'm-bar-cooler', step: STEP.cool,
        text: { tr: 'Barlar bantta soğuyarak sertleşir.', en: 'The bars set as they cool on the belt.', ar: 'تتماسك الألواح أثناء تبريدها على الحزام.' },
        mat: 'p-muesli-bar', matName: { tr: 'Soğumuş bar', en: 'Cooled bars', ar: 'ألواح مبرّدة' } },
      { asset: 'm-sp-350', step: STEP.pack, machine: MACHINE.sp350, page: 'sp-350', metric: { spec: 'sp-350', key: 'speed' },
        text: { tr: 'Her bar tek tek akış paketine sarılır.', en: 'Each bar is flow-wrapped individually.', ar: 'يُغلَّف كل لوح على حدة بغلاف انسيابي.' },
        mat: 'pk-muesli-bar', matName: { tr: 'Paketlenmiş bar', en: 'Wrapped bar', ar: 'لوح مغلّف' } },
    ],
  },

  'pofidik-rulokat': {
    title: { tr: 'Mısır unundan <em>içi dolu yastık çereze.</em>', en: 'From maize flour <em>to filled pillows.</em>', ar: 'من دقيق الذرة <em>إلى وسائد محشوّة.</em>' },
    stations: [
      { n: 1, asset: 'm-mixer', step: STEP.mix,
        text: { tr: 'Mısır unu ya da küçük mısır taneleri su eklenerek karıştırılır.', en: 'Maize flour or small maize grits are mixed with added water.', ar: 'يُخلط دقيق الذرة أو جريشها الصغير مع إضافة الماء.' },
        mat: 'pr-mix', matName: { tr: 'Nemli mısır unu', en: 'Moist maize flour', ar: 'دقيق ذرة مرطّب' } },
      { n: 2, asset: 'm-screw-conveyor', step: STEP.feed,
        text: { tr: 'Karışım vidaya doğru ilerleyerek ekstruder silosunu besler.', en: 'The mix moves toward the screw and feeds the extruder hopper.', ar: 'يتقدم الخليط نحو اللولب ويغذّي قادوس الباثقة.' },
        mat: 'pr-mix', matName: { tr: 'Nemli mısır unu', en: 'Moist maize flour', ar: 'دقيق ذرة مرطّب' } },
      { n: 3, asset: 'm-sp70-ii', step: STEP.extrude, model: 'SP65-III · SP70-II', page: 'sp70-ii', metric: { line: 'capacity' },
        text: { tr: 'Ürün şekli; kalıp aralığı, ilerleme ve kesici yüzünün birleşimiyle belirlenir.', en: 'The shape is set by the die gap, the feed and the cutter face together.', ar: 'يتحدد شكل المنتج بتوليفة فتحة القالب والتقدم ووجه القاطع.' },
        mat: 'pr-tube', matName: { tr: 'İçi boş tüp', en: 'Hollow tube', ar: 'أنبوب مجوّف' } },
      { n: 4, asset: 'm-jxj-ii', step: STEP.fill, page: 'jxj-ii',
        text: { tr: 'Tüpün içine krema dolgu basılır.', en: 'A cream filling is pumped into the tube.', ar: 'يُضخ حشو كريمي داخل الأنبوب.' },
        mat: 'pr-filled', matName: { tr: 'Dolgulu tüp', en: 'Filled tube', ar: 'أنبوب محشو' } },
      { n: 5, asset: 'm-pillow-shaper', step: STEP.shape,
        text: { tr: 'Döndürücü silindirlerle hızla gelen tüp dört köşe yastık şeklinde kesilir.', en: 'Brought in fast by the rollers, the tube is cut into four-cornered pillows.', ar: 'يصل الأنبوب بسرعة عبر الأسطوانات ويُقطع إلى وسائد رباعية الزوايا.' },
        mat: 'pr-pillow', matName: { tr: 'Yastık', en: 'Pillows', ar: 'وسائد' } },
      { n: 6, asset: 'm-hoister', step: STEP.lift, text: TXT.lift, mat: 'pr-pillow', matName: { tr: 'Yastık', en: 'Pillows', ar: 'وسائد' } },
      { n: 7, asset: 'm-dryer', step: STEP.dry, page: DRYERS, metric: LAYERS,
        text: { tr: 'Yastıklar çoklu geçişli kurutucuda kurutulur.', en: 'The pillows are dried in the multi-pass dryer.', ar: 'تُجفَّف الوسائد في المجفف متعدد المراحل.' },
        mat: 'pr-pillow', matName: { tr: 'Kurumuş yastık', en: 'Dried pillows', ar: 'وسائد مجففة' } },
      { n: 8, asset: 'm-flavoring-drum', step: STEP.flavor, page: 'sgt-ii', metric: { spec: 'sgt-ii', key: 'capacity' },
        text: { tr: 'Kaplama tamburunda un, tuz, yağ, peynir ve baharatla çeşnilenir.', en: 'In the coating drum they are seasoned with flour, salt, oil, cheese and spices.', ar: 'تُتبّل في أسطوانة التغليف بالدقيق والملح والزيت والجبن والبهارات.' },
        mat: 'p-pofidik', matName: { tr: 'Çeşnili yastık', en: 'Seasoned pillows', ar: 'وسائد متبّلة' } },
      { asset: 'm-packaging', step: STEP.pack, machine: MACHINE.spk, page: 'spk-520', metric: { spec: 'spk-520', key: 'speed' },
        text: { tr: 'Otomatik dikey paketleme makinesinde 140 g ve üzeri paketlere doldurulur.', en: 'An automatic vertical packer fills them into bags of 140 g and up.', ar: 'تعبّئها آلة التعبئة العمودية الأوتوماتيكية في أكياس من 140 غ فأكثر.' },
        mat: 'pk-pofidik', matName: { tr: 'Paketlenmiş çerez', en: 'Packed snacks', ar: 'وجبات معبّأة' } },
    ],
  },

  'bebek-mamasi': {
    title: { tr: 'Tahıl unlarından <em>bebek maması tozuna.</em>', en: 'From cereal flours <em>to infant cereal powder.</em>', ar: 'من دقيق الحبوب <em>إلى مسحوق أغذية الرضّع.</em>' },
    stations: [
      { n: 1, asset: 'm-mixer', step: STEP.mix,
        text: { tr: 'Mısır, buğday, pirinç, yulaf ve soya unları karıştırılır.', en: 'Maize, wheat, rice, oat and soy flours are mixed.', ar: 'يُخلط دقيق الذرة والقمح والأرز والشوفان والصويا.' },
        mat: 'bb-flour', matName: { tr: 'Tahıl unu karışımı', en: 'Cereal flour blend', ar: 'خليط دقيق الحبوب' } },
      { n: 2, asset: 'm-screw-conveyor', step: STEP.feed,
        text: { tr: 'Karışım ekstruder silosuna aktarılır; titreşimli dozajlayıcı vidayı besler.', en: 'The mix goes to the extruder hopper; a vibrating doser feeds the screw.', ar: 'ينتقل الخليط إلى قادوس الباثقة، وتغذّي وحدة جرعات اهتزازية اللولب.' },
        mat: 'bb-flour', matName: { tr: 'Tahıl unu karışımı', en: 'Cereal flour blend', ar: 'خليط دقيق الحبوب' } },
      { n: 3, asset: 'sp85-ii-extruder', step: STEP.extrude, model: 'SP65-III · SP70-II · SP85-II', page: 'sp85-ii', metric: { line: 'capacity' },
        text: { tr: 'Tahıl hamuru çift vidalı ekstruderde pişirilir ve kesilir.', en: 'The cereal dough is cooked and cut in the twin-screw extruder.', ar: 'تُطهى عجينة الحبوب وتُقطع في الباثقة ثنائية اللولب.' },
        mat: 'bb-puff', matName: { tr: 'Ekstrüdat', en: 'Extrudate', ar: 'منتج مبثوق' } },
      { n: 4, asset: 'm-pneumatic-conveyor', step: STEP.convey, text: TXT.pneumatic, mat: 'bb-puff', matName: { tr: 'Ekstrüdat', en: 'Extrudate', ar: 'منتج مبثوق' } },
      { n: 5, asset: 'm-dryer', step: STEP.dry, page: DRYERS, metric: LAYERS, text: TXT.dryer,
        mat: 'bb-puff', matName: { tr: 'Kuru ekstrüdat', en: 'Dry extrudate', ar: 'منتج مبثوق جاف' } },
      { n: 6, asset: 'm-hoister', step: STEP.lift, text: TXT.lift, mat: 'bb-puff', matName: { tr: 'Kuru ekstrüdat', en: 'Dry extrudate', ar: 'منتج مبثوق جاف' } },
      { n: 7, asset: 'n-vibro-sieve', step: STEP.sieve,
        text: { tr: 'Ürün titreşimli elekte boyutlarına ayrılır.', en: 'The vibrating sieve sizes the product.', ar: 'يصنّف الغربال الاهتزازي المنتج حسب الحجم.' },
        mat: 'bb-puff', matName: { tr: 'Elenmiş ekstrüdat', en: 'Sieved extrudate', ar: 'منتج مغربل' } },
      { n: 8, asset: 'm-mill-system', step: STEP.grind,
        text: { tr: 'Değirmen sistemi ürünü ince toza öğütür; siklon ve torba filtre tozu toplar.', en: 'The mill system grinds the product to a fine powder; a cyclone and bag filter collect it.', ar: 'يطحن نظام الطحن المنتج إلى مسحوق ناعم، ويجمعه الإعصار والمرشّح الكيسي.' },
        mat: 'p-baby-food', matName: { tr: 'Bebek maması tozu', en: 'Infant cereal powder', ar: 'مسحوق أغذية الرضّع' } },
      { asset: 'm-spf-398', step: STEP.pack, machine: MACHINE.spf, page: 'spf-398', metric: { spec: 'spf-398', key: 'speed' },
        text: { tr: 'Toz mama otomatik olarak tartılıp paketlenir.', en: 'The powder is weighed and packed automatically.', ar: 'يُوزن المسحوق ويُعبّأ تلقائيًا.' },
        mat: 'pk-baby-food', matName: { tr: 'Paketlenmiş mama', en: 'Packed infant cereal', ar: 'غذاء رضّع معبّأ' } },
    ],
  },

  'jelatinize-modifiye-nisasta': {
    title: { tr: 'Nişastadan <em>jelatinize nişastaya.</em>', en: 'From starch <em>to pre-gelatinised starch.</em>', ar: 'من النشا <em>إلى نشا مُجلتن مسبقًا.</em>' },
    stations: [
      // TASLAK: inferred (see header)
      { asset: 'm-screw-conveyor', step: STEP.feed, machine: MACHINE.screw,
        text: { tr: 'Ham nişasta, ekstruderin besleme silosuna aktarılır.', en: 'Native starch is transferred to the extruder’s feed hopper.', ar: 'يُنقل النشا الخام إلى قادوس تغذية الباثقة.' },
        mat: 'st-raw', matName: { tr: 'Ham nişasta', en: 'Native starch', ar: 'نشا خام' } },
      { asset: 'sp85-ii-extruder', step: STEP.extrude, machine: MACHINE.starchExtruders, page: 'sp85-ii', metric: { line: 'capacity' },
        text: { tr: 'Nişasta ekstruderde ısı ve basınçla jelatinize olur; kalıptan gözenekli şeritler halinde çıkar.', en: 'Heat and pressure in the extruder gelatinise the starch; it leaves the die as porous ropes.', ar: 'تُجلتن الحرارة والضغط داخل الباثقة النشا، فيخرج من القالب حبالًا مسامية.' },
        mat: 'st-extrudate', matName: { tr: 'Jelatinize ekstrüdat', en: 'Gelatinised extrudate', ar: 'منتج مبثوق مُجلتن' } },
      // TASLAK: inferred (see header)
      { asset: 'n-fine-mill', step: STEP.grind, machine: MACHINE.fine, page: 'ince-ogutme-degirmeni', metric: { millCapacity: 'ince-ogutme-degirmeni' },
        text: { tr: 'Ekstrüdat ince toza öğütülür.', en: 'The extrudate is ground to a fine powder.', ar: 'يُطحن المنتج المبثوق إلى مسحوق ناعم.' },
        mat: 'p-modified-starch', matName: { tr: 'Ön jelatinize nişasta', en: 'Pre-gelatinised starch', ar: 'نشا مُجلتن مسبقًا' } },
      // TASLAK: inferred (see header)
      { asset: 'm-sp-50', step: STEP.pack, machine: MACHINE.sp50, page: 'sp-50', metric: { spec: 'sp-50', key: 'weight' },
        text: { tr: 'Toz nişasta tartılarak torbalara doldurulur.', en: 'The starch powder is weighed into sacks.', ar: 'يُوزن مسحوق النشا ويُعبّأ في أكياس.' },
        mat: 'pk-modified-starch', matName: { tr: 'Torbalanmış nişasta', en: 'Bagged starch', ar: 'نشا معبّأ' } },
    ],
  },

  'yapay-pirinc': {
    title: { tr: 'Kırık pirinçten <em>yeni pirinç tanesine.</em>', en: 'From broken rice <em>to new rice kernels.</em>', ar: 'من الأرز المكسور <em>إلى حبات أرز جديدة.</em>' },
    stations: [
      { asset: 'n-fine-mill', step: STEP.grind, machine: MACHINE.fine, page: 'ince-ogutme-degirmeni', metric: { millCapacity: 'ince-ogutme-degirmeni' },
        text: { tr: 'Kırık pirinçler ince una öğütülür.', en: 'Broken rice is ground into fine flour.', ar: 'يُطحن الأرز المكسور إلى دقيق ناعم.' },
        mat: 'ar-flour', matName: { tr: 'Pirinç unu', en: 'Rice flour', ar: 'دقيق الأرز' } },
      { n: 1, asset: 'm-mixer', step: STEP.mix,
        text: { tr: 'İsteğe göre vitamin ve mineraller eklenerek karıştırılır.', en: 'Vitamins and minerals can be added in the mix.', ar: 'يمكن إضافة الفيتامينات والمعادن أثناء الخلط.' },
        mat: 'ar-flour', matName: { tr: 'Zenginleştirilmiş karışım', en: 'Fortified blend', ar: 'خليط مدعّم' } },
      { n: 2, asset: 'm-screw-conveyor', step: STEP.feed, text: TXT.screw, mat: 'ar-flour', matName: { tr: 'Zenginleştirilmiş karışım', en: 'Fortified blend', ar: 'خليط مدعّم' } },
      { n: 3, asset: 'sp85-ii-extruder', step: STEP.extrude, model: 'SP65-III · SP70-II · SP85-II', page: 'sp85-ii', metric: { line: 'capacity' },
        text: { tr: 'Hamur pirinç tanesi biçiminde kalıplanır; renk, form, boyut ve pişme süresi hassasça ayarlanır.', en: 'The dough is shaped like rice grains; colour, form, size and cooking time are set precisely.', ar: 'تُشكَّل العجينة على هيئة حبات الأرز، ويُضبط اللون والشكل والحجم وزمن الطهي بدقة.' },
        mat: 'ar-wet', matName: { tr: 'Taze pirinç tanesi', en: 'Fresh kernels', ar: 'حبات طازجة' } },
      { n: 4, asset: 'm-vibro-cooler', step: STEP.cool,
        text: { tr: 'Taze taneler titreşimli tablada soğutularak birbirinden ayrılır.', en: 'Fresh kernels are cooled and separated on a vibrating tray.', ar: 'تُبرَّد الحبات الطازجة وتُفصل عن بعضها على صينية اهتزازية.' },
        mat: 'ar-wet', matName: { tr: 'Ayrışmış tane', en: 'Separated kernels', ar: 'حبات منفصلة' } },
      { n: 5, asset: 'm-pneumatic-conveyor', step: STEP.convey, text: TXT.pneumatic, mat: 'ar-wet', matName: { tr: 'Ayrışmış tane', en: 'Separated kernels', ar: 'حبات منفصلة' } },
      { n: 6, asset: 'm-dryer', step: STEP.dry, page: DRYERS, metric: LAYERS, text: TXT.dryer,
        mat: 'p-artificial-rice', matName: { tr: 'Kuru pirinç', en: 'Dry rice', ar: 'أرز جاف' } },
      { n: 7, asset: 'm-cooling-conveyor', step: STEP.cool, text: TXT.coolBelt,
        mat: 'p-artificial-rice', matName: { tr: 'Soğumuş pirinç', en: 'Cooled rice', ar: 'أرز مبرّد' } },
      { asset: 'm-packaging', step: STEP.pack, machine: MACHINE.spk, page: 'spk-720', metric: { spec: 'spk-720', key: 'speed' }, text: TXT.pack,
        mat: 'pk-artificial-rice', matName: { tr: 'Paketlenmiş pirinç', en: 'Packed rice', ar: 'أرز معبّأ' } },
    ],
  },

  'bitkisel-protein-dokusu': {
    title: { tr: 'Yağsız soya unundan <em>bitkisel protein dokusuna.</em>', en: 'From defatted soy flour <em>to textured vegetable protein.</em>', ar: 'من دقيق الصويا منزوع الدهن <em>إلى بروتين نباتي مُنسَّج.</em>' },
    stations: [
      { n: 1, asset: 'm-mixer', step: STEP.mix,
        text: { tr: 'Soya yağının yan ürünü olan yağsız soya unu karıştırılır.', en: 'Defatted soy flour, a by-product of soybean oil, is mixed.', ar: 'يُخلط دقيق الصويا منزوع الدهن، وهو منتج ثانوي لزيت الصويا.' },
        mat: 'tvp-flour', matName: { tr: 'Yağsız soya unu', en: 'Defatted soy flour', ar: 'دقيق صويا منزوع الدهن' } },
      { n: 2, asset: 'm-screw-conveyor', step: STEP.feed, text: TXT.screw, mat: 'tvp-flour', matName: { tr: 'Yağsız soya unu', en: 'Defatted soy flour', ar: 'دقيق صويا منزوع الدهن' } },
      { n: 3, asset: 'sp85-ii-extruder', step: STEP.extrude, model: 'SP65-IV · SP85-III', metric: { line: 'capacity' },
        text: { tr: 'Protein, basınç ve ısı altında lifli, et benzeri bir dokuya kavuşur.', en: 'Under pressure and heat the protein takes on a fibrous, meat-like texture.', ar: 'يكتسب البروتين تحت الضغط والحرارة قوامًا ليفيًا شبيهًا باللحم.' },
        mat: 'tvp-wet', matName: { tr: 'Islak protein dokusu', en: 'Wet textured protein', ar: 'بروتين مُنسَّج رطب' } },
      { n: 4, asset: 'm-pneumatic-conveyor', step: STEP.convey, text: TXT.pneumatic, mat: 'tvp-wet', matName: { tr: 'Islak protein dokusu', en: 'Wet textured protein', ar: 'بروتين مُنسَّج رطب' } },
      { n: 5, asset: 'm-dryer', step: STEP.dry, page: DRYERS, metric: LAYERS, text: TXT.dryer,
        mat: 'p-tvp', matName: { tr: 'Kuru protein dokusu', en: 'Dry textured protein', ar: 'بروتين مُنسَّج جاف' } },
      { n: 6, asset: 'm-cooling-conveyor', step: STEP.cool, text: TXT.coolBelt,
        mat: 'p-tvp', matName: { tr: 'Soğumuş ürün', en: 'Cooled product', ar: 'منتج مبرّد' } },
      { asset: 'm-packaging', step: STEP.pack, machine: MACHINE.spk, page: 'spk-520', metric: { spec: 'spk-520', key: 'speed' }, text: TXT.pack,
        mat: 'pk-tvp', matName: { tr: 'Paketlenmiş ürün', en: 'Packed product', ar: 'منتج معبّأ' } },
    ],
  },
};
