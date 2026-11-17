// Photos shown when a field record (home page, "Saha kayıtları") is opened as a dossier.
// Every photo comes from the old site (site-audit), and its subject is backed by the source:
//  · Rotika: blog post 67 (plant photos 0a/0b, packaging 1–6) and the gallery series uploaded with it
//    (real bags, bird and rodent packaging). Package names are transcribed from the bags themselves.
//  · AGRA ME Dubai 2016: posts 55/61 (invitation with the Sunpring logo, stand photo; the neighbouring
//    stand reads S1E15, ours was S1E19).
//  · Future Fish Eurasia İzmir 2016: posts 62/63 (invitation, stand 228). Gallery photos "Resim1–6" are one
//    upload batch with the stand-228 photo: same camera, same red carpet hall, same Turkish posters.
// Turkuaz Marin has no photo in the source; its fiche keeps the ink stamp and has no gallery.
import type { Lang } from '../lib/i18n';

type L = Record<Lang, string>;
export type GalleryPhoto = { src: string; w: number; h: number; cap?: L; alt: L };

const img = (name: string, w: number, h: number) => ({ src: `/img/records/${name}-${Math.max(w, h)}.webp`, w, h });
const same = (s: string): L => ({ tr: s, en: s, ar: s });

const dubai = same('Dubai · 03.2016');
const izmir = same('İzmir · 06.2016');

const rotika: GalleryPhoto[] = [
  { ...img('rotika-tesis-1', 1080, 810), cap: { tr: 'Rotika tesisi · İran', en: 'Rotika plant · Iran', ar: 'مصنع Rotika · إيران' },
    alt: { tr: 'Rotika mama üretim tesisi, İran: ekstrüzyon hattı ve kurulumda çalışan ekip', en: 'Rotika pet food plant, Iran: the extrusion line with the team at work', ar: 'مصنع Rotika لأغذية الحيوانات الأليفة، إيران: خط البثق والفريق أثناء العمل' } },
  { ...img('rotika-tesis-2', 1080, 810), cap: { tr: 'Rotika tesisi · İran', en: 'Rotika plant · Iran', ar: 'مصنع Rotika · إيران' },
    alt: { tr: 'Rotika tesisinde üretim hattı, İran', en: 'The production line at the Rotika plant, Iran', ar: 'خط الإنتاج في مصنع Rotika، إيران' } },
  { ...img('rotika-foto-kopek-orta-buyuk-junior', 608, 1080), cap: { tr: 'Raftaki ürün · yavru köpek', en: 'On the shelf · junior dog', ar: 'المنتج على الرف · جراء الكلاب' },
    alt: { tr: 'Rotika orta-büyük ırk yavru köpek maması ambalajı', en: 'Rotika medium to large breeds junior dog food bag', ar: 'كيس غذاء Rotika لجراء الكلاب من السلالات المتوسطة والكبيرة' } },
  { ...img('rotika-foto-kopek-kucuk-yetiskin', 608, 1080), cap: { tr: 'Raftaki ürün · küçük ırk', en: 'On the shelf · small breeds', ar: 'المنتج على الرف · السلالات الصغيرة' },
    alt: { tr: 'Rotika küçük ırk yetişkin köpek maması ambalajı', en: 'Rotika small breeds adult dog food bag', ar: 'كيس غذاء Rotika للكلاب البالغة من السلالات الصغيرة' } },
  { ...img('rotika-kopek-orta-buyuk-yetiskin', 599, 1080), cap: { tr: 'Orta-büyük ırk yetişkin köpek · 2 kg', en: 'Medium to large adult dogs · 2 kg', ar: 'كلاب بالغة متوسطة وكبيرة · 2 kg' },
    alt: { tr: 'Rotika orta-büyük ırk yetişkin köpek maması ambalajı, 2 kg; üzerinde Mavi Protein logosu', en: 'Rotika medium to large breeds adult dog food packaging, 2 kg, with the Mavi Protein logo', ar: 'عبوة غذاء Rotika للكلاب البالغة من السلالات المتوسطة والكبيرة، 2 kg، وعليها شعار Mavi Protein' } },
  { ...img('rotika-kopek-orta-buyuk-junior', 588, 1080), cap: { tr: 'Orta-büyük ırk yavru köpek · 2 kg', en: 'Medium to large junior dogs · 2 kg', ar: 'جراء متوسطة وكبيرة · 2 kg' },
    alt: { tr: 'Rotika orta-büyük ırk yavru köpek maması ambalajı, 2 kg', en: 'Rotika medium to large breeds junior dog food packaging, 2 kg', ar: 'عبوة غذاء Rotika لجراء الكلاب من السلالات المتوسطة والكبيرة، 2 kg' } },
  { ...img('rotika-kopek-kucuk-yetiskin', 591, 1080), cap: { tr: 'Küçük ırk yetişkin köpek · 2 kg', en: 'Small breeds adult dogs · 2 kg', ar: 'كلاب بالغة صغيرة · 2 kg' },
    alt: { tr: 'Rotika küçük ırk yetişkin köpek maması ambalajı, 2 kg', en: 'Rotika small breeds adult dog food packaging, 2 kg', ar: 'عبوة غذاء Rotika للكلاب البالغة من السلالات الصغيرة، 2 kg' } },
  { ...img('rotika-kopek-kucuk-junior', 604, 1080), cap: { tr: 'Küçük ırk yavru köpek · 2 kg', en: 'Small breeds junior dogs · 2 kg', ar: 'جراء صغيرة · 2 kg' },
    alt: { tr: 'Rotika küçük ırk yavru köpek maması ambalajı, 2 kg', en: 'Rotika small breeds junior dog food packaging, 2 kg', ar: 'عبوة غذاء Rotika لجراء الكلاب من السلالات الصغيرة، 2 kg' } },
  { ...img('rotika-kedi-yavru', 593, 1080), cap: { tr: 'Yavru kedi · 2 kg', en: 'Kittens · 2 kg', ar: 'صغار القطط · 2 kg' },
    alt: { tr: 'Rotika yavru kedi maması ambalajı, 2 kg', en: 'Rotika kitten food packaging, 2 kg', ar: 'عبوة غذاء Rotika لصغار القطط، 2 kg' } },
  { ...img('rotika-kedi-yetiskin', 600, 1080), cap: { tr: 'Yetişkin kedi · 2 kg', en: 'Adult cats · 2 kg', ar: 'قطط بالغة · 2 kg' },
    alt: { tr: 'Rotika yetişkin kedi maması ambalajı, 2 kg', en: 'Rotika adult cat food packaging, 2 kg', ar: 'عبوة غذاء Rotika للقطط البالغة، 2 kg' } },
  { ...img('rotika-papagan-orta-buyuk', 671, 1080), cap: { tr: 'Orta-büyük papağan · 1 kg', en: 'Medium to large parrots · 1 kg', ar: 'ببغاوات متوسطة وكبيرة · 1 kg' },
    alt: { tr: 'Rotika orta-büyük papağan günlük pelet yemi ambalajı, 1 kg', en: 'Rotika medium to large parrots daily pellet food packaging, 1 kg', ar: 'عبوة غذاء Rotika اليومي المحبب للببغاوات المتوسطة والكبيرة، 1 kg' } },
  { ...img('rotika-papagan-kucuk-orta', 659, 1080), cap: { tr: 'Küçük-orta papağan · 1 kg', en: 'Small to medium parrots · 1 kg', ar: 'ببغاوات صغيرة ومتوسطة · 1 kg' },
    alt: { tr: 'Rotika küçük-orta papağan günlük pelet yemi ambalajı, 1 kg', en: 'Rotika small to medium parrots daily pellet food packaging, 1 kg', ar: 'عبوة غذاء Rotika اليومي المحبب للببغاوات الصغيرة والمتوسطة، 1 kg' } },
  { ...img('rotika-kus-mynah', 608, 1080), cap: { tr: 'Mynah · 1 kg', en: 'Mynah · 1 kg', ar: 'طائر المينا · 1 kg' },
    alt: { tr: 'Rotika mynah kuşu günlük pelet yemi ambalajı, 1 kg', en: 'Rotika mynah daily pellet food packaging, 1 kg', ar: 'عبوة غذاء Rotika اليومي المحبب لطائر المينا، 1 kg' } },
  { ...img('rotika-kus-karisik', 660, 1080), cap: { tr: 'Süs kuşu karışımı · 1 kg', en: 'Companion birds mix · 1 kg', ar: 'خليط طيور الزينة · 1 kg' },
    alt: { tr: 'Rotika zenginleştirilmiş peletli süs kuşu karma yemi ambalajı, 1 kg', en: 'Rotika mixed food for companion birds with enriched pellet, packaging, 1 kg', ar: 'عبوة غذاء Rotika المخلوط لطيور الزينة مع حبيبات مدعّمة، 1 kg' } },
  { ...img('rotika-kemirgen', 701, 1080), cap: { tr: 'Kemirgen · 1 kg', en: 'Rodents · 1 kg', ar: 'القوارض · 1 kg' },
    alt: { tr: 'Rotika kemirgen için kuruyemiş ve meyve karışımı, saman bazlı peletli; ambalaj, 1 kg', en: 'Rotika rodent nuts and fruit mix with hay-based pellet, packaging, 1 kg', ar: 'عبوة غذاء Rotika للقوارض من المكسرات والفواكه مع حبيبات أساسها التبن، 1 kg' } },
];

const dubaiInvite: GalleryPhoto = {
  ...img('agra-me-2016-davetiye', 1280, 835), cap: dubai,
  alt: { tr: 'AGRA ME 2016 Dubai fuar davetiyesi: Mavi Protein ve Sunpring logoları, S1E19 numaralı stant', en: 'AGRA ME 2016 Dubai fair invitation: Mavi Protein and Sunpring logos, stand S1E19', ar: 'دعوة معرض AGRA ME 2016 في دبي: شعارا Mavi Protein وSunpring، الجناح S1E19' },
};
const dubaiStand: GalleryPhoto = {
  ...img('agra-me-2016-dubai-stant', 1280, 721), cap: dubai,
  alt: { tr: 'AGRA ME 2016, Dubai: Mavi Protein standında bir ekstrüderin önünde ziyaretçilerle', en: 'AGRA ME 2016, Dubai: visitors in front of an extruder at the Mavi Protein stand', ar: 'AGRA ME 2016، دبي: زوار أمام آلة بثق في جناح Mavi Protein' },
};

const fairs: GalleryPhoto[] = [
  dubaiInvite,
  dubaiStand,
  { ...img('future-fish-2016-davetiye', 1280, 743), cap: izmir,
    alt: { tr: 'Future Fish Eurasia 2016 İzmir fuar davetiyesi: 228 numaralı stant, Hall D', en: 'Future Fish Eurasia 2016 İzmir fair invitation: stand 228, Hall D', ar: 'دعوة معرض Future Fish Eurasia 2016 في إزمير: الجناح 228، القاعة D' } },
  { ...img('future-fish-2016-stant-228', 1280, 720), cap: izmir,
    alt: { tr: 'Future Fish Eurasia 2016, İzmir: 228 numaralı Mavi Protein standı ve masalarda görüşmeler', en: 'Future Fish Eurasia 2016, İzmir: Mavi Protein stand 228 with meetings at the tables', ar: 'Future Fish Eurasia 2016، إزمير: جناح Mavi Protein رقم 228 ولقاءات حول الطاولات' } },
  { ...img('future-fish-2016-gorusme-1', 1280, 720), cap: izmir,
    alt: { tr: 'Future Fish Eurasia 2016, İzmir: Mavi Protein standında masa başında görüşme', en: 'Future Fish Eurasia 2016, İzmir: a meeting at a table on the Mavi Protein stand', ar: 'Future Fish Eurasia 2016، إزمير: لقاء حول طاولة في جناح Mavi Protein' } },
  { ...img('future-fish-2016-gorusme-2', 1280, 720), cap: izmir,
    alt: { tr: 'Future Fish Eurasia 2016, İzmir: standda ziyaretçilerle toplantı masası', en: 'Future Fish Eurasia 2016, İzmir: a meeting table with visitors on the stand', ar: 'Future Fish Eurasia 2016، إزمير: طاولة اجتماع مع الزوار في الجناح' } },
  { ...img('future-fish-2016-gorusme-3', 1280, 720), cap: izmir,
    alt: { tr: 'Future Fish Eurasia 2016, İzmir: ziyaretçilerle standda görüşme', en: 'Future Fish Eurasia 2016, İzmir: a meeting with visitors on the stand', ar: 'Future Fish Eurasia 2016، إزمير: لقاء مع الزوار في الجناح' } },
  { ...img('future-fish-2016-stant-ziyaret-1', 1280, 721), cap: izmir,
    alt: { tr: 'Future Fish Eurasia 2016, İzmir: Mavi Protein standında ziyaretçilerle hatıra fotoğrafı', en: 'Future Fish Eurasia 2016, İzmir: a group photo with visitors at the Mavi Protein stand', ar: 'Future Fish Eurasia 2016، إزمير: صورة جماعية مع الزوار في جناح Mavi Protein' } },
  { ...img('future-fish-2016-stant-ziyaret-2', 1280, 721), cap: izmir,
    alt: { tr: 'Future Fish Eurasia 2016, İzmir: standda ziyaretçilerle; arkada “Bu yemler bizim makinelerimizle yapılmıştır” panosu', en: 'Future Fish Eurasia 2016, İzmir: with visitors on the stand; behind them a sign reading “These feeds were made with our machines”', ar: 'Future Fish Eurasia 2016، إزمير: مع الزوار في الجناح، وخلفهم لوحة كُتب عليها «صُنعت هذه الأعلاف بآلاتنا»' } },
];

export const recordGalleries: Record<string, GalleryPhoto[]> = {
  rotika,
  // The partnership's first fair: AGRA ME Dubai, on a stand shared with Sunpring (post 61).
  sunpring: [dubaiInvite, dubaiStand],
  fuarlar: fairs,
};

/** The projects page keeps one record per fair: the same photos, split by fair. */
export const fairGalleries: Record<string, GalleryPhoto[]> = {
  'agra-me-2016': [dubaiInvite, dubaiStand],
  'future-fish-eurasia-2016': fairs.slice(2),
};
