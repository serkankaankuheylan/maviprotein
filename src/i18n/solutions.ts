/** Copy for the Aquaculture and Agriculture & Livestock solution pages. */
export const solutionsCopy = {
  tr: {
    aqua: {
      meta: { title: 'Su Ürünleri', description: 'Kuluçkahane, kafes ve karada besicilik sistemleri; biyolojik üretim planlaması, anaç yönetimi, larva-nursery-büyütme, yem rasyonları ve anahtar teslim akuakültür tesisleri.' },
      kicker: 'Çözüm · Su ürünleri',
      title: 'Yumurtadan <em>hasada.</em>', // TASLAK
      lead: 'Bütün akuakültür sistemlerinin kurulması, üretime alınması, üretim eğitiminin sağlanması ve Ar-Ge çalışmalarının düzenlenmesi. Her ihtiyaca ya doğrudan çözüm ya da doğru çözüm ortağıyla ekonomik ve yüksek verimli bir iş.',
      toc: [['dongu', 'Yaşam döngüsü'], ['yetkinlikler', 'Yetkinlikler'], ['kulucka', 'Kuluçkahane anatomisi'], ['kurulumlar', 'Anahtar teslim'], ['yontem', 'Nasıl çalışıyoruz']],
      problem: {
        q: '“Canlıyı nasıl üreteceğim?”',
        a: 'Akuakültürde başarıyı makine değil biyoloji belirler. Anaç balığın yönetiminden larvanın ilk yemine, nursery’den besiye kadar her evre ayrı bir bilgi ister. 1990’dan beri sahada edindiğimiz bu bilgiyi tesisinizin planına, ekipmanına ve personelinin eğitimine dönüştürüyoruz.',
      },
      cycle: {
        label: 'Yaşam döngüsü',
        title: 'Her evrede <em>ayrı bir bilgi.</em>',
        stages: [
          { asset: 'b-fish-eggs', name: 'Yumurta', sci: 'Anaç yönetimi', items: ['Anaç balık yönetim ve organizasyonu', 'Yavru balık kuluçkahane tesisleri', 'Alternatif türler yetiştiriciliği'] },
          { asset: 'b-larva', name: 'Larva', sci: 'Larva üretimi', items: ['Larva üretimi', 'Canlı yem ve alg üretimi', 'Artemia, alg ve rotifer besinleri'] },
          { asset: 'b-juvenile', name: 'Yavru', sci: 'Nursery', items: ['Nursery üretimleri', 'Yavru ve büyütme yemleri', 'Kapalı devre sistemler'] },
          { asset: 'b-sea-bream', name: 'Ergin', sci: 'Besi ve hasat', items: ['Besi üretimleri', 'Deniz ve göl kafes sistemleri', 'İşleme tesisleri'] },
        ],
      },
      comp: { label: 'Yetkinlikler', title: 'Ne yapıyoruz, <em>ayrıntısıyla.</em>' },
      hatchery: {
        label: 'Kuluçkahane anatomisi',
        title: 'Bir kuluçkahanede <em>neler var?</em>',
        lead: 'Tedarik listemizdeki her kalem, bir tesisin içinde bir yere oturur. Bir bileşene dokunun.',
        parts: [
          { k: 'filtre', t: 'Mekanik ve biyolojik filtre', d: 'Su arıtım ve kalite' },
          { k: 'uv', t: 'UV sterilizasyon', d: 'Su arıtım ve kalite' },
          { k: 'ozon', t: 'Ozon jeneratörü', d: 'Su arıtım ve kalite' },
          { k: 'oksijen', t: 'Oksijenlendirme', d: 'Kuluçkahane ve üretim ekipmanı' },
          { k: 'isi', t: 'Isıtma ve soğutma', d: 'Kuluçkahane ve üretim ekipmanı' },
          { k: 'tank', t: 'Larva ve yavru tankları', d: 'Kuluçkahane ve üretim ekipmanı' },
          { k: 'canli', t: 'Canlı yem ünitesi', d: 'Yem ve biyolojik girdiler' },
          { k: 'olcum', t: 'Ölçüm ve kontrol', d: 'Ölçüm ve kontrol' },
        ],
        link: 'Tedarik kataloğunda gör',
      },
      turnkey: { label: 'Anahtar teslim', title: 'Kurduğumuz <em>tesis tipleri.</em>' },
      method: {
        label: 'Nasıl çalışıyoruz',
        steps: [
          { t: 'Keşif ve ön etüt', d: 'Saha, su kaynağı, tür ve pazar.' },
          { t: 'Fizibilite ve fon', d: 'Rantabilite analizi, uygun destek programı.' },
          { t: 'Biyolojik plan', d: 'Tür, üretim takvimi, yem rasyonu.' },
          { t: 'Kurulum', d: 'Mekanizasyon, ekipman, devreye alma.' },
          { t: 'Eğitim ve üretim', d: 'Personel eğitimi, ilk üretimler, tedarik.' },
        ],
      },
      related: 'İlgili hatlar ve hizmetler',
      close: 'Kuluçkahaneniz, kafesiniz ya da <em>ilk fikriniz için</em> konuşalım.',
    },
    agri: {
      meta: { title: 'Tarım ve Hayvancılık', description: 'Tarımsal ve hayvansal üretimde çözüm ortaklığı: efektif mikroorganizmalar, katkı maddeleri, silaj ve kompost, atık arıtım, alternatif makine bantları ve anahtar teslim tesisler.' },
      kicker: 'Çözüm · Tarım ve hayvancılık',
      title: 'Atık yok, <em>döngü var.</em>', // TASLAK
      lead: 'Tüm tarımsal ve hayvansal faaliyetlerin üretim sorunlarında çözüm ortaklığı. Mikroorganizmadan silaja, atık arıtımından anahtar teslim besi çiftliğine kadar.',
      // Each stop of the cycle lists its services straight from the inventory (services.json); only the
      // stop names and the "every step" label are written here.
      cycle: {
        label: 'Döngü',
        stops: ['Tarla', 'Yem', 'Hayvan', 'Atık', 'Kompost'], // TASLAK (istasyon adları)
        every: 'Her adımda', // TASLAK
        back: 'Döngü tarlaya döner', // TASLAK (yalnızca ekran okuyucu)
      },
      turnkey: { label: 'Anahtar teslim', title: 'Tarladan <em>soğuk depoya.</em>' },
      close: 'Tarlanız, çiftliğiniz ya da tesisiniz için <em>döngüyü birlikte kuralım.</em>',
    },
  },
  en: {
    aqua: {
      meta: { title: 'Aquaculture', description: 'Hatchery, cage and land-based grow-out systems; biological production planning, broodstock management, larvae, nursery and grow-out, feed rations and turnkey aquaculture facilities.' },
      kicker: 'Solution · Aquaculture',
      title: 'From egg <em>to harvest.</em>',
      lead: 'Setting up all kinds of aquaculture systems, bringing them into production, providing production training and organising R&D work. For every need, either a direct solution or an economical, high-yield job with the right solution partner.',
      toc: [['dongu', 'Life cycle'], ['yetkinlikler', 'Capabilities'], ['kulucka', 'Anatomy of a hatchery'], ['kurulumlar', 'Turnkey'], ['yontem', 'How we work']],
      problem: {
        q: '“How do I raise the living stock?”',
        a: 'In aquaculture, success is decided by biology, not machinery. Every stage, from broodstock management to the larva’s first feed, from nursery to grow-out, calls for its own knowledge. We turn what we have learned in the field since 1990 into your facility’s plan, its equipment and the training of its staff.',
      },
      cycle: {
        label: 'Life cycle',
        title: 'Each stage, <em>its own knowledge.</em>',
        stages: [
          { asset: 'b-fish-eggs', name: 'Egg', sci: 'Broodstock management', items: ['Broodstock management and organisation', 'Fry hatchery facilities', 'Farming alternative species'] },
          { asset: 'b-larva', name: 'Larva', sci: 'Larval production', items: ['Larval production', 'Live feed and algae production', 'Artemia, algae and rotifer feeds'] },
          { asset: 'b-juvenile', name: 'Juvenile', sci: 'Nursery', items: ['Nursery production', 'Fry and grow-out feeds', 'Recirculating systems'] },
          { asset: 'b-sea-bream', name: 'Adult', sci: 'Grow-out and harvest', items: ['Grow-out production', 'Sea and lake cage systems', 'Processing plants'] },
        ],
      },
      comp: { label: 'Capabilities', title: 'What we do, <em>in detail.</em>' },
      hatchery: {
        label: 'Anatomy of a hatchery',
        title: 'What goes into <em>a hatchery?</em>',
        lead: 'Every item on our supply list has its place inside a facility. Tap a component.',
        parts: [
          { k: 'filtre', t: 'Mechanical and biological filter', d: 'Water treatment and quality' },
          { k: 'uv', t: 'UV sterilisation', d: 'Water treatment and quality' },
          { k: 'ozon', t: 'Ozone generator', d: 'Water treatment and quality' },
          { k: 'oksijen', t: 'Oxygenation', d: 'Hatchery and production equipment' },
          { k: 'isi', t: 'Heating and cooling', d: 'Hatchery and production equipment' },
          { k: 'tank', t: 'Larval and fry tanks', d: 'Hatchery and production equipment' },
          { k: 'canli', t: 'Live feed unit', d: 'Feed and biological inputs' },
          { k: 'olcum', t: 'Measurement and control', d: 'Measurement and control' },
        ],
        link: 'See in the supply catalogue',
      },
      turnkey: { label: 'Turnkey', title: 'Facility types <em>we build.</em>' },
      method: {
        label: 'How we work',
        steps: [
          { t: 'Survey and pre-study', d: 'Site, water source, species and market.' },
          { t: 'Feasibility and funding', d: 'Profitability analysis, the right support programme.' },
          { t: 'Biological plan', d: 'Species, production calendar, feed ration.' },
          { t: 'Installation', d: 'Mechanisation, equipment, commissioning.' },
          { t: 'Training and production', d: 'Staff training, first production runs, supply.' },
        ],
      },
      related: 'Related lines and services',
      close: 'Let us talk about your hatchery, your cages or <em>your first idea.</em>',
    },
    agri: {
      meta: { title: 'Agriculture & Livestock', description: 'Solution partnership in crop and livestock production: effective microorganisms, additives, silage and compost, waste treatment, alternative machinery lines and turnkey facilities.' },
      kicker: 'Solution · Agriculture & livestock',
      title: 'No waste, <em>just a cycle.</em>',
      lead: 'A solution partner for production problems across all agricultural and livestock activities. From microorganisms to silage, from waste treatment to turnkey livestock farms.',
      cycle: {
        label: 'The cycle',
        stops: ['Field', 'Feed', 'Animal', 'Waste', 'Compost'],
        every: 'At every step',
        back: 'The cycle returns to the field',
      },
      turnkey: { label: 'Turnkey', title: 'From field <em>to cold store.</em>' },
      close: 'Let us build <em>the cycle together</em> for your field, farm or facility.',
    },
  },
  ar: {
    aqua: {
      meta: { title: 'الاستزراع المائي', description: 'المفرخات والأقفاص وأنظمة التسمين البرية؛ تخطيط الإنتاج الحيوي، وإدارة الأمهات، واليرقات والحضانة والتسمين، وعلائق الأعلاف، ومنشآت الاستزراع المائي الجاهزة للتشغيل.' },
      kicker: 'الحلول · الاستزراع المائي',
      title: 'من البيضة <em>إلى الحصاد.</em>',
      lead: 'إنشاء جميع أنظمة الاستزراع المائي وتشغيلها إنتاجيًا، وتوفير التدريب على الإنتاج، وتنظيم أعمال البحث والتطوير. لكل حاجة إما حل مباشر، وإما عمل اقتصادي عالي الكفاءة مع شريك الحل المناسب.',
      toc: [['dongu', 'دورة الحياة'], ['yetkinlikler', 'القدرات'], ['kulucka', 'تشريح المفرخ'], ['kurulumlar', 'الجاهز للتشغيل'], ['yontem', 'كيف نعمل']],
      problem: {
        q: '«كيف سأُنتج الكائن الحي؟»',
        a: 'في الاستزراع المائي، البيولوجيا لا الآلات هي ما يحدد النجاح. فكل مرحلة، من إدارة الأمهات إلى أول غذاء لليرقة، ومن الحضانة إلى التسمين، تتطلب معرفة خاصة بها. ونحن نحوّل هذه المعرفة التي اكتسبناها في الميدان منذ 1990 إلى مخطط منشأتكم ومعداتها وتدريب كوادرها.',
      },
      cycle: {
        label: 'دورة الحياة',
        title: 'لكل مرحلة <em>معرفتها الخاصة.</em>',
        stages: [
          { asset: 'b-fish-eggs', name: 'البيضة', sci: 'إدارة الأمهات', items: ['إدارة الأمهات وتنظيمها', 'منشآت مفرخات الإصبعيات', 'استزراع الأنواع البديلة'] },
          { asset: 'b-larva', name: 'اليرقة', sci: 'إنتاج اليرقات', items: ['إنتاج اليرقات', 'إنتاج الأعلاف الحية والطحالب', 'أغذية الأرتيميا والطحالب والروتيفر'] },
          { asset: 'b-juvenile', name: 'الإصبعية', sci: 'الحضانة', items: ['إنتاج الحضانة', 'أعلاف الإصبعيات والتسمين', 'أنظمة إعادة التدوير المغلقة'] },
          { asset: 'b-sea-bream', name: 'البالغ', sci: 'التسمين والحصاد', items: ['إنتاج التسمين', 'أنظمة الأقفاص البحرية والبحيرية', 'منشآت المعالجة'] },
        ],
      },
      comp: { label: 'القدرات', title: 'ما نقوم به <em>بالتفصيل.</em>' },
      hatchery: {
        label: 'تشريح المفرخ',
        title: 'ماذا يوجد <em>في المفرخ؟</em>',
        lead: 'كل بند في قائمة التوريد لدينا له مكانه داخل المنشأة. المسوا أحد المكونات.',
        parts: [
          { k: 'filtre', t: 'مرشح ميكانيكي وحيوي', d: 'معالجة المياه وجودتها' },
          { k: 'uv', t: 'التعقيم بالأشعة فوق البنفسجية', d: 'معالجة المياه وجودتها' },
          { k: 'ozon', t: 'مولّد الأوزون', d: 'معالجة المياه وجودتها' },
          { k: 'oksijen', t: 'التزويد بالأكسجين', d: 'معدات المفرخ والإنتاج' },
          { k: 'isi', t: 'التدفئة والتبريد', d: 'معدات المفرخ والإنتاج' },
          { k: 'tank', t: 'أحواض اليرقات والإصبعيات', d: 'معدات المفرخ والإنتاج' },
          { k: 'canli', t: 'وحدة الأعلاف الحية', d: 'الأعلاف والمدخلات الحيوية' },
          { k: 'olcum', t: 'القياس والتحكم', d: 'القياس والتحكم' },
        ],
        link: 'عرض في كتالوج التوريد',
      },
      turnkey: { label: 'الجاهز للتشغيل', title: 'أنواع المنشآت <em>التي ننشئها.</em>' },
      method: {
        label: 'كيف نعمل',
        steps: [
          { t: 'الاستكشاف والدراسة الأولية', d: 'الموقع ومصدر المياه والنوع والسوق.' },
          { t: 'الجدوى والتمويل', d: 'تحليل الربحية وبرنامج الدعم المناسب.' },
          { t: 'الخطة الحيوية', d: 'النوع وتقويم الإنتاج وعليقة العلف.' },
          { t: 'التركيب', d: 'الميكنة والمعدات والتشغيل.' },
          { t: 'التدريب والإنتاج', d: 'تدريب الكوادر وأولى دورات الإنتاج والتوريد.' },
        ],
      },
      related: 'خطوط وخدمات ذات صلة',
      close: 'لنتحدث عن مفرخكم أو أقفاصكم أو <em>فكرتكم الأولى.</em>',
    },
    agri: {
      meta: { title: 'الزراعة والثروة الحيوانية', description: 'شراكة في الحلول للإنتاج الزراعي والحيواني: الكائنات الدقيقة الفعالة، والإضافات، والسيلاج والسماد العضوي، ومعالجة النفايات، وخطوط الآلات البديلة، والمنشآت الجاهزة للتشغيل.' },
      kicker: 'الحلول · الزراعة والثروة الحيوانية',
      title: 'لا نفايات، <em>بل دورة.</em>',
      lead: 'شراكة في حل مشكلات الإنتاج في جميع الأنشطة الزراعية والحيوانية. من الكائنات الدقيقة إلى السيلاج، ومن معالجة النفايات إلى مزارع التسمين الجاهزة للتشغيل.',
      cycle: {
        label: 'الدورة',
        stops: ['الحقل', 'العلف', 'الحيوان', 'النفايات', 'السماد العضوي'],
        every: 'في كل خطوة',
        back: 'تعود الدورة إلى الحقل',
      },
      turnkey: { label: 'الجاهز للتشغيل', title: 'من الحقل <em>إلى المخزن المبرّد.</em>' },
      close: 'لنُنشئ <em>الدورة معًا</em> لحقلكم أو مزرعتكم أو منشأتكم.',
    },
  },
};
