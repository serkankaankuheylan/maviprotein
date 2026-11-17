/**
 * Home page copy. Facts come from the inventory (site-audit/, catalog).
 * Lines marked `// TASLAK` are proposals from TASARIM.md that need client approval.
 */
export const home = {
  tr: {
    meta: {
      title: 'Mavi Protein Danışmanlık · Fikirden üretim hattına',
      description: 'İzmir merkezli Mavi Protein; su ürünleri, yem ve gıda, tarım ve hayvancılıkta fizibiliteden fona, ekstrüzyon hattından anahtar teslim kuruluma kadar danışmanlık verir.',
    },
    hero: {
      kicker: 'İzmir · 1990’dan beri akuakültür',
      title: ['Fikirden', 'üretim', 'hattına.'], // TASLAK
      lead: 'Su ürünleri, yem ve gıda, tarım ve hayvancılıkta; fizibiliteden fona, makineden kuruluma kadar yanınızdayız.', // TASLAK
      intentsLabel: 'Nereden başlamak istersiniz?',
      intents: [
        { n: '01', text: 'Tesis kurmak istiyorum', route: 'aquaculture', hash: 'kurulumlar' },
        { n: '02', text: 'Üretim hattı arıyorum', route: 'lines' },
        { n: '03', text: 'Proje ve fon desteği', route: 'funding' },
        { n: '04', text: 'Ekipman ve tedarik', route: 'supply' },
      ],
    },
    chain: {
      label: 'Üretim zinciri',
      lead: 'Elinizde yalnızca bir fikir olsa bile fizibiliteyi çıkarır, fonu bulur, canlının biyolojisini planlar, hattı seçip getirir, kurar ve üretimi öğreterek teslim ederiz.',
      links: [
        { word: 'Fikir', text: 'Henüz bir yatırım fikri olmayana da proje ve yatırım önerisi.', items: ['Proje keşfi', 'Ön etüt', 'Yatırım önerisi'], route: 'feasibility' },
        { word: 'Fizibilite', text: 'Üretim sistemlerinin fizibilite ve rantabilite analizi.', items: ['Rantabilite analizi', 'Mühendislik ölçümleri', 'Kurulu sistem revizyonu'], route: 'feasibility' },
        { word: 'Fon', text: 'Ulusal ve uluslararası destek programlarıyla finansman.', items: ['TÜBİTAK 1501', 'Horizon Europe', 'Proje ortağı bulma'], route: 'funding' },
        { word: 'Biyoloji', text: 'Anaçtan larvaya, besiden canlı yeme bütün biyolojik üretimin planı.', items: ['Anaç yönetimi', 'Larva, nursery, büyütme', 'Canlı yem ve alg'], route: 'aquaculture' },
        { word: 'Tarif', text: 'Yem rasyonu, ürün formülasyonu ve tesis planı.', items: ['Yem rasyonları', 'Mama formülasyonu', 'İşleme tesisi planı'], route: 'lines' },
        { word: 'Makine', text: 'Ekstruderden paketlemeye; laboratuvar ölçeğinden sanayiye.', items: ['15 üretim hattı', 'Ekstruder ve kurutucu', 'Pilot ölçek sistemler'], route: 'machines' },
        { word: 'Kurulum', text: 'Kuluçkahaneden yem fabrikasına anahtar teslim kurulum.', items: ['Mekanizasyon', 'Montaj', 'Bakım ve teknik destek'], route: 'aquaculture', hash: 'kurulumlar' },
        { word: 'Üretim', text: 'Üretimi öğreterek teslim eder, tedarikle yanınızda kalırız.', items: ['Personel eğitimi', 'Yem yapım eğitimi', 'Hammadde ve sarf tedariki'], route: 'supply' },
      ],
      close: 'Bir fikirle gelin. <em>Çalışan bir üretim hattıyla dönün.</em>', // TASLAK
      more: 'Ayrıntılar',
      stepLabel: 'Adım',
    },
    worlds: {
      label: 'Faaliyet alanları',
      title: 'Sektörünüzü <em>seçin.</em>',
      lead: 'Her çözüm kendi malzemesiyle çalışır: su, çelik ve toprak. Hepsinin altında aynı yöntem var.',
      panels: [
        { key: 'aquaculture', title: 'Su Ürünleri', text: 'Kuluçkahaneden kafese; biyolojik üretim planından anahtar teslim tesise.', items: ['Kuluçkahane tesisleri', 'Deniz ve göl kafes sistemleri', 'Biyolojik üretim planlaması', 'Anahtar teslim kurulum'] },
        { key: 'lines', title: 'Yem ve Gıda Hatları', text: 'Toz hammaddeden paketlenmiş ürüne 15 ekstrüzyon hattı.', items: ['Kültür balığı yemi', 'Evcil hayvan maması', 'Kahvaltılık tahıl ve atıştırmalık', 'Bitkisel protein'] },
        { key: 'agri', title: 'Tarım ve Hayvancılık', text: 'Tarladan ahıra ve geri; atığı değere çeviren bir döngü.', items: ['Efektif mikroorganizmalar', 'Silaj ve kompost', 'Atık arıtım sistemleri', 'Besi çiftliği ve sera kurulumu'] },
      ],
      more: 'Keşfet',
      stages: ['Yumurta', 'Larva', 'Yavru', 'Ergin'],
    },
    journey: {
      label: 'Hat yolculuğu',
      title: 'Toz hammaddeden <em>paketlenmiş ürüne.</em>',
      stations: [
        { asset: 'm-hammer-mill', name: 'Öğütme', machine: 'Çekiçli değirmen', text: 'Hammadde, ekstrüzyona uygun inceliğe öğütülür.', metric: '1,7–16,6', unit: 'ton/saat', mat: 'mat-powder', matName: 'Toz' },
        { asset: 'm-mixer', name: 'Karıştırma', machine: 'Karıştırıcı / Mikser', text: 'Bütün içerikler bir araya gelir; kuru içerikler nemli içeriklerle karıştırılır.', metric: 'Rasyon', unit: 'türe ve yaşa göre', mat: 'mat-mix', matName: 'Karışım' },
        { asset: 'm-screw-conveyor', name: 'Besleme', machine: 'Helezonlu taşıyıcı', text: 'Isıtılan karışım ekstruderin besleme silosuna aktarılır.', metric: '0,75', unit: 'kW besleme', mat: 'mat-mash', matName: 'Nemli hamur' },
        { asset: 'sp85-ii-extruder', name: 'Ekstrüzyon', machine: 'SP85-II çift vidalı ekstruder', text: 'Karışım yoğun sıcaklık ve basınç altında şekil verilip kesilerek pişirilir.', metric: '38CrMoAl', unit: 'kovan · ~HRC60', mat: 'mat-pellet-wet', matName: 'Islak pelet' },
        { asset: 'm-pneumatic-conveyor', name: 'Taşıma', machine: 'Havalı taşıyıcı', text: 'Taze peletler kırılmadan kurutucuya taşınır.', metric: 'Hava', unit: 'ile taşıma', mat: 'mat-pellet-wet', matName: 'Islak pelet' },
        { asset: 'm-dryer', name: 'Kurutma', machine: 'Çok katlı kurutma fırını', text: 'Nem, kabuk oluşumu için uygun seviyeye inene kadar kurutulur.', metric: '~200', unit: '°C', mat: 'mat-pellet-dry', matName: 'Kuru pelet' },
        { asset: 'm-flavoring-drum', name: 'Kaplama', machine: 'SGT-II tatlandırma tamburu', text: 'Yağ ve vitaminler kaplama tamburunda uygulanır.', metric: '500', unit: 'kg/saat', mat: 'mat-pellet-coated', matName: 'Kaplı pelet' },
        { asset: 'm-cooling-conveyor', name: 'Soğutma', machine: 'Soğutmalı taşıyıcı', text: 'Ürün paketlemeden önce soğutulur ve dinlendirilir.', metric: 'Fanlı', unit: 'bant', mat: 'mat-pellet-coated', matName: 'Soğumuş pelet' },
        { asset: 'm-packaging', name: 'Paketleme', machine: 'SPK dikey paketleme', text: 'Ürün tartılır, torbalanır ve sevkiyata hazırlanır.', metric: '≤ 45', unit: 'paket/dk', mat: 'pk-feed-pouch', matName: 'Paketlenmiş ürün' },
      ],
      end: 'Aynı yöntem; balık yemi, kedi-köpek maması, mısır gevreği ya da bitkisel protein üretebilir.', // TASLAK
      endLink: '15 üretim hattını keşfedin',
    },
    specimens: {
      title: 'Ne üretebilirsiniz?',
      sub: 'On beş hat, <em>on beş ürün.</em>',
      cap: 'Kapasite',
    },
    proof: {
      title: 'Bilimle kurulan <em>bir firma.</em>',
      // Alıntı: eski Hakkımızda > Misyon metninin ikinci cümlesi (yalnız sondaki "-tır" atıldı). Açıklama: Hakkımızda tanıtım paragrafı + Misyon ilk cümlesinin sadeleştirilmiş birleşimi.
      quote: 'Tüm çalışma ortaklarımızın işini, kendi işimizi yaparken duyduğumuz heyecanla, motivasyonla ve yılmadan gerçekleştirip uzun ömürlü ilişkiler kurmak.',
      founder: 'Doç. Dr. Fatih Başaran',
      founderRole: 'Kurucu · Akuakültürde 1990’dan beri',
      founderText: 'Mavi Protein Danışmanlık, Doç. Dr. Fatih Başaran’ın 1990’da başlayan akuakültür deneyimini, akademik birikimini ve reel sektör tecrübesini insanlığın hizmetine sunmak için 2015 başında kuruldu. Yatırımcı ve üreticilerin Ar-Ge projelerini hayata geçirmesi için ulusal ve uluslararası kaynaklara rehberlik ederek ülkenin üretim gücünü artırmayı amaçlıyor.',
      timeline: [
        { y: '1990', t: 'Akuakültürde ilk saha deneyimi' },
        { y: '2015', t: 'Mavi Protein İzmir’de kuruldu' },
        { y: '2016', t: 'TÜBİTAK 1501 projesi başladı; AGRA ME Dubai ve Future Fish Eurasia' },
        { y: '2017', t: 'Turkuaz Marin Ar-Ge projesi tamamlandı' },
        { y: '2020', t: 'Rotika mama danışmanlığı; ALGOPHYCO spirulina' },
      ],
      figures: [
        // Katalog 2016 (Jinan Sunpring makineleri). TASLAK: kapasitelerin güncelliği müşteriye teyit ettirilmeli.
        { n: '16,6', u: 'ton/saat', c: 'En büyük değirmenin öğütme kapasitesi' },
        { n: '30', u: 'µm', c: 'Mikro değirmende inebilen öğütme inceliği' },
        { n: '%50', c: 'Çift vidalı ekstrüderde işlenebilen taze et oranı' },
        { n: '15', u: 'hat', c: '5 yem ve mama, 10 gıda hattı; hammaddeden pakete' },
      ],
      stamps: {
        label: 'Belgelendirme · çözüm ortaklarımızla',
        // Katalog s.52: "Uluslararası geçerliliğe sahip denetim ve belgelendirme hizmetleri sunulmaktadır."
        lead: 'Uluslararası geçerli yönetim sistemi ve personel belgelendirmesinde yol gösteriyoruz.',
        cta: 'Belgelendirme hizmeti',
        people: 'Mesleki yetkinlik sertifikası',
      },
      // Fotoğraf: Future Fish Eurasia 2016 (img/works/5c54Resim6.jpg). Kurucu, yaka kartındaki "Fatih Başaran · Katılımcı" yazısından tanındı. TASLAK: müşteriye teyit ettirilmeli.
      exhibit: {
        year: '2016',
        alt: 'Future Fish Eurasia 2016, İzmir: Doç. Dr. Fatih Başaran, katılımcı kartıyla Mavi Protein standının önünde ziyaretçilerle',
      },
    },
    records: {
      title: 'Saha kayıtları',
      all: 'Bütün kayıtlar',
      ui: { prev: 'Önceki fotoğraf', next: 'Sonraki fotoğraf', close: 'Kapat', more: 'Projeyi incele', gallery: 'Fotoğraflar' },
      items: [
        { code: 'TÜBİTAK 1501 · 2016–2017', kind: 'Ar-Ge projesi', title: 'Turkuaz Marin Deniz Ürünleri', text: 'Sanayi Ar-Ge projesi; Ocak 2016–Temmuz 2017 arasında yürütüldü.', hash: 'turkuaz-marin', stamp: ['TÜBİTAK 1501', 'Sanayi Ar-Ge', '01.2016 – 07.2017'] },
        { code: 'İRAN · 2020', kind: 'Danışmanlık', title: 'Rotika', text: 'Kedi-köpek ve kuş maması formülasyon ve üretim danışmanlığı; ürünler piyasada.', hash: 'rotika', alts: ['Rotika mama üretim tesisi, İran', 'Rotika yetişkin kedi maması ambalajı', 'Rotika orta-büyük papağan yemi ambalajı', 'Rotika orta-büyük ırk yetişkin köpek maması, 2 kg; ambalajda “Official Licensed Product · Mavi Protein” yazıyor'] },
        { code: 'TÜRKİYE + ORTADOĞU', kind: 'Ortaklık', title: 'Jinan Sunpring Machinery', text: 'Yem ve gıda ekstrüzyon makinelerinde Türkiye ve Ortadoğu exclusive distribütörlüğü.', hash: 'sunpring', alts: ['AGRA ME 2016 Dubai fuar davetiyesi: Mavi Protein ve Sunpring logoları, S1E19 numaralı stant'] },
        { code: 'DUBAİ · İZMİR · 2016', kind: 'Fuar', title: 'AGRA ME · Future Fish Eurasia', text: 'Dubai’de on ülkeden yatırımcıyla görüşme; İzmir’de Future Fish Eurasia.', hash: 'fuarlar', alts: ['AGRA ME 2016, Dubai: Mavi Protein standında bir ekstruderin önünde ziyaretçilerle', 'Future Fish Eurasia 2016, İzmir: 228 numaralı Mavi Protein standı'] },
      ],
    },
    funding: {
      label: 'Proje ve fon',
      title: 'İyi bir fikir, <em>iyi yazılmış</em> bir projeyle finanse edilir.', // TASLAK
      lead: 'Ulusal projelerde hazırlık, yazım ve yürütücü danışmanlık; uluslararası projelerde ortak bulma ve başvuru.',
      programs: ['TÜBİTAK 1501', 'Horizon Europe', 'Marie Skłodowska-Curie', 'Ar-Ge ve inovasyon hibeleri'],
      steps: ['Fikir değerlendirme', 'Program eşleştirme', 'Proje yazımı ve ortaklar', 'Yürütme ve raporlama'],
      sheets: ['Başvuru formu', 'Bütçe', 'İş paketleri'],
      link: 'Proje ve fon hizmetleri',
    },
    algae: {
      label: 'ALGOPHYCO™ · Spirulina',
      title: 'Adımızdaki <em>mavi protein.</em>', // TASLAK
      text: 'Spirulina’ya rengini veren fikosiyanin, kelimenin tam anlamıyla mavi bir proteindir. Mavi-yeşil algler 3,5 milyar yıl önce suyu ve havayı temizleyip oksijen üretmeye başladı; besin zincirinin ilk halkasından da önceki halka.',
      fig: '%64–67',
      figCap: 'protein (kuru madde)',
      local: 'Yerli üretim spirulina · 100 g, 250 g, 900 g',
      link: 'ALGOPHYCO’yu keşfedin',
    },
    notes: {
      label: 'Mavi Protein diyor ki',
      title: 'Notlar',
      all: 'Bütün notlar',
    },
    close: {
      title: 'Projeniz hangi aşamada olursa olsun, <em>buradan başlayabiliriz.</em>', // TASLAK
      primary: 'Proje Başlat',
      secondary: 'Kataloğu indir',
      or: 'ya da doğrudan',
    },
  },
  en: {
    meta: {
      title: 'Mavi Protein Consultancy · From idea to production line',
      description: 'Based in İzmir, Mavi Protein provides consultancy in aquaculture, feed and food, agriculture and livestock: from feasibility to funding, from extrusion lines to turnkey installation.',
    },
    hero: {
      kicker: 'İzmir · in aquaculture since 1990',
      title: ['From idea', 'to production', 'line.'],
      lead: 'In aquaculture, feed and food, agriculture and livestock, we stay with you from feasibility to funding, from machinery to installation.',
      intentsLabel: 'Where would you like to start?',
      intents: [
        { n: '01', text: 'I want to build a facility', route: 'aquaculture', hash: 'kurulumlar' },
        { n: '02', text: 'I am looking for a production line', route: 'lines' },
        { n: '03', text: 'Project and funding support', route: 'funding' },
        { n: '04', text: 'Equipment and supply', route: 'supply' },
      ],
    },
    chain: {
      label: 'Production chain',
      lead: 'Even if all you have is an idea, we work out the feasibility, find the funding, plan the biology of the species, select and deliver the line, install it and hand it over by teaching you to produce.',
      links: [
        { word: 'Idea', text: 'Project and investment proposals, even for those without an investment idea yet.', items: ['Project scoping', 'Pre-feasibility study', 'Investment proposal'], route: 'feasibility' },
        { word: 'Feasibility', text: 'Feasibility and profitability analysis of production systems.', items: ['Profitability analysis', 'Engineering measurements', 'Revision of existing systems'], route: 'feasibility' },
        { word: 'Funding', text: 'Financing through funds in your own country and international programmes.', items: ['National funds', 'Horizon Europe', 'Finding project partners'], route: 'funding' },
        { word: 'Biology', text: 'A plan for all biological production, from broodstock to larvae, from grow-out to live feed.', items: ['Broodstock management', 'Larvae, nursery, grow-out', 'Live feed and algae'], route: 'aquaculture' },
        { word: 'Recipe', text: 'Feed rations, product formulation and facility planning.', items: ['Feed rations', 'Pet food formulation', 'Processing plant layout'], route: 'lines' },
        { word: 'Machine', text: 'From extruder to packaging; from laboratory scale to industrial.', items: ['15 production lines', 'Extruders and dryers', 'Pilot-scale systems'], route: 'machines' },
        { word: 'Installation', text: 'Turnkey installation, from hatcheries to feed mills.', items: ['Mechanisation', 'Assembly', 'Maintenance and technical support'], route: 'aquaculture', hash: 'kurulumlar' },
        { word: 'Production', text: 'We hand over by teaching you to produce, and stay with you through supply.', items: ['Staff training', 'Feed-making training', 'Raw material and consumable supply'], route: 'supply' },
      ],
      close: 'Come with an idea. <em>Leave with a working production line.</em>',
      more: 'Details',
      stepLabel: 'Step',
    },
    worlds: {
      label: 'Areas of activity',
      title: 'Choose your <em>sector.</em>',
      lead: 'Each solution works with its own material: water, steel and soil. Beneath them all lies the same method.',
      panels: [
        { key: 'aquaculture', title: 'Aquaculture', text: 'From hatchery to sea cage; from biological planning to turnkey facility.', items: ['Hatchery facilities', 'Sea and lake cage systems', 'Biological production planning', 'Turnkey installation'] },
        { key: 'lines', title: 'Feed & Food Lines', text: '15 extrusion lines, from powdered raw material to packaged product.', items: ['Farmed fish feed', 'Pet food', 'Breakfast cereals and snacks', 'Plant protein'] },
        { key: 'agri', title: 'Agriculture & Livestock', text: 'From field to barn and back; a cycle that turns waste into value.', items: ['Effective microorganisms', 'Silage and compost', 'Waste treatment systems', 'Livestock farm and greenhouse set-up'] },
      ],
      more: 'Discover',
      stages: ['Egg', 'Larva', 'Fry', 'Adult'],
    },
    journey: {
      label: 'Line journey',
      title: 'From powdered raw material <em>to packaged product.</em>',
      stations: [
        { asset: 'm-hammer-mill', name: 'Grinding', machine: 'Hammer mill', text: 'The raw material is ground to a fineness suitable for extrusion.', metric: '1.7–16.6', unit: 't/h', mat: 'mat-powder', matName: 'Powder' },
        { asset: 'm-mixer', name: 'Mixing', machine: 'Mixer', text: 'All ingredients come together; dry ingredients are blended with wet ones.', metric: 'Ration', unit: 'by species and age', mat: 'mat-mix', matName: 'Blend' },
        { asset: 'm-screw-conveyor', name: 'Feeding', machine: 'Screw conveyor', text: 'The heated mix is transferred to the extruder’s feed hopper.', metric: '0.75', unit: 'kW feeder', mat: 'mat-mash', matName: 'Wet mash' },
        { asset: 'sp85-ii-extruder', name: 'Extrusion', machine: 'SP85-II twin-screw extruder', text: 'Under intense heat and pressure, the mix is shaped, cut and cooked.', metric: '38CrMoAl', unit: 'barrel · ~HRC60', mat: 'mat-pellet-wet', matName: 'Wet pellet' },
        { asset: 'm-pneumatic-conveyor', name: 'Conveying', machine: 'Pneumatic conveyor', text: 'Fresh pellets are carried to the dryer without breaking.', metric: 'Air', unit: 'conveying', mat: 'mat-pellet-wet', matName: 'Wet pellet' },
        { asset: 'm-dryer', name: 'Drying', machine: 'Multi-layer drying oven', text: 'Pellets are dried until moisture falls to the right level for crust formation.', metric: '~200', unit: '°C', mat: 'mat-pellet-dry', matName: 'Dry pellet' },
        { asset: 'm-flavoring-drum', name: 'Coating', machine: 'SGT-II flavouring drum', text: 'Oil and vitamins are applied in the coating drum.', metric: '500', unit: 'kg/h', mat: 'mat-pellet-coated', matName: 'Coated pellet' },
        { asset: 'm-cooling-conveyor', name: 'Cooling', machine: 'Cooling conveyor', text: 'The product is cooled and left to settle before packaging.', metric: 'Fan-cooled', unit: 'belt', mat: 'mat-pellet-coated', matName: 'Cooled pellet' },
        { asset: 'm-packaging', name: 'Packaging', machine: 'SPK vertical packaging', text: 'The product is weighed, bagged and readied for dispatch.', metric: '≤ 45', unit: 'bags/min', mat: 'pk-feed-pouch', matName: 'Packaged product' },
      ],
      end: 'The same method can produce fish feed, cat and dog food, corn flakes or plant protein.',
      endLink: 'Explore the 15 production lines',
    },
    specimens: {
      title: 'What can you produce?',
      sub: 'Fifteen lines, <em>fifteen products.</em>',
      cap: 'Capacity',
    },
    proof: {
      title: 'A company <em>built on science.</em>',
      // Quote and text: from the old About page (mission + introduction), translated from the Turkish original.
      quote: 'To carry out the work of all our partners with the same excitement, motivation and perseverance we bring to our own, and to build long-lasting relationships.',
      founder: 'Assoc. Prof. Dr. Fatih Başaran',
      founderRole: 'Founder · in aquaculture since 1990',
      founderText: 'Mavi Protein Consultancy was founded in early 2015 to put Assoc. Prof. Dr. Fatih Başaran’s experience in aquaculture since 1990, his academic background and his real-sector expertise at the service of humanity. It guides investors and producers in using national and international resources to bring their R&D projects to life, aiming to increase the country’s production capacity.',
      timeline: [
        { y: '1990', t: 'First field experience in aquaculture' },
        { y: '2015', t: 'Mavi Protein founded in İzmir' },
        { y: '2016', t: 'TÜBİTAK 1501 project started; AGRA ME Dubai and Future Fish Eurasia' },
        { y: '2017', t: 'Turkuaz Marin R&D project completed' },
        { y: '2020', t: 'Rotika pet food consultancy; ALGOPHYCO spirulina' },
      ],
      figures: [
        { n: '16.6', u: 't/h', c: 'Grinding capacity of the largest mill' },
        { n: '30', u: 'µm', c: 'Finest setting of the micro-grinding mill' },
        { n: '50%', c: 'Share of fresh meat a twin-screw extruder can process' },
        { n: '15', u: 'lines', c: '5 feed and pet food, 10 food lines; raw material to package' },
      ],
      stamps: {
        label: 'Certification · with our partners',
        lead: 'We guide you through internationally recognised management system and personnel certification.',
        cta: 'Certification service',
        people: 'Professional competence certificate',
      },
      exhibit: {
        year: '2016',
        alt: 'Future Fish Eurasia 2016, Izmir: Assoc. Prof. Dr. Fatih Başaran, wearing his exhibitor badge, with visitors in front of the Mavi Protein stand',
      },
    },
    records: {
      title: 'Field records',
      all: 'All records',
      ui: { prev: 'Previous photo', next: 'Next photo', close: 'Close', more: 'View project', gallery: 'Photos' },
      items: [
        { code: 'TÜBİTAK 1501 · 2016–2017', kind: 'R&D project', title: 'Turkuaz Marin Deniz Ürünleri', text: 'Industrial R&D project, carried out from January 2016 to July 2017.', hash: 'turkuaz-marin', stamp: ['TÜBİTAK 1501', 'Industrial R&D', '01.2016 – 07.2017'] },
        { code: 'IRAN · 2020', kind: 'Consultancy', title: 'Rotika', text: 'Formulation and production consultancy for cat, dog and bird food; the products are on the market.', hash: 'rotika', alts: ['Rotika pet food plant, Iran', 'Rotika adult cat food packaging', 'Rotika medium to large parrot food packaging', 'Rotika medium to large breeds adult dog food, 2 kg; the bag reads “Official Licensed Product · Mavi Protein”'] },
        { code: 'TÜRKİYE + MIDDLE EAST', kind: 'Partnership', title: 'Jinan Sunpring Machinery', text: 'Exclusive distributor for Türkiye and the Middle East of feed and food extrusion machinery.', hash: 'sunpring', alts: ['AGRA ME 2016 Dubai fair invitation: Mavi Protein and Sunpring logos, stand S1E19'] },
        { code: 'DUBAI · İZMİR · 2016', kind: 'Trade fair', title: 'AGRA ME · Future Fish Eurasia', text: 'Meetings with investors from ten countries in Dubai; Future Fish Eurasia in İzmir.', hash: 'fuarlar', alts: ['AGRA ME 2016, Dubai: visitors in front of an extruder at the Mavi Protein stand', 'Future Fish Eurasia 2016, İzmir: Mavi Protein stand 228'] },
      ],
    },
    funding: {
      label: 'Projects & funding',
      title: 'A good idea is funded through a <em>well-written</em> project.',
      lead: 'For funds in your own country, we handle preparation, writing and project management support; for international programmes, partner search and application.',
      programs: ['TÜBİTAK 1501', 'Horizon Europe', 'Marie Skłodowska-Curie', 'National and international R&D grants'],
      steps: ['Idea assessment', 'Programme matching', 'Project writing and partners', 'Implementation and reporting'],
      sheets: ['Application form', 'Budget', 'Work packages'],
      link: 'Project and funding services',
    },
    algae: {
      label: 'ALGOPHYCO™ · Spirulina',
      title: 'The <em>blue protein</em> in our name.',
      text: 'Phycocyanin, which gives spirulina its colour, is quite literally a blue protein. Blue-green algae began cleaning water and air and producing oxygen 3.5 billion years ago: the link that came even before the first link of the food chain.',
      fig: '64–67%',
      figCap: 'protein (dry matter)',
      local: 'Spirulina produced in Türkiye · 100 g, 250 g, 900 g',
      link: 'Discover ALGOPHYCO',
    },
    notes: {
      label: 'Mavi Protein says',
      title: 'Notes',
      all: 'All notes',
    },
    close: {
      title: 'Whatever stage your project is at, <em>we can start here.</em>',
      primary: 'Start a project',
      secondary: 'Download catalogue',
      or: 'or directly',
    },
  },
  ar: {
    meta: {
      title: 'Mavi Protein للاستشارات · من الفكرة إلى خط الإنتاج',
      description: 'تقدّم Mavi Protein، ومقرها إزمير، خدمات استشارية في الاستزراع المائي والأعلاف والأغذية والزراعة والثروة الحيوانية: من دراسة الجدوى إلى التمويل، ومن خطوط البثق إلى التركيب الجاهز للتشغيل.',
    },
    hero: {
      kicker: 'إزمير · في الاستزراع المائي منذ 1990',
      title: ['من الفكرة', 'إلى خط', 'الإنتاج.'],
      lead: 'في الاستزراع المائي والأعلاف والأغذية والزراعة والثروة الحيوانية، نرافقكم من دراسة الجدوى إلى التمويل، ومن الآلات إلى التركيب.',
      intentsLabel: 'من أين تودّون البدء؟',
      intents: [
        { n: '01', text: 'أريد إنشاء منشأة', route: 'aquaculture', hash: 'kurulumlar' },
        { n: '02', text: 'أبحث عن خط إنتاج', route: 'lines' },
        { n: '03', text: 'دعم المشاريع والتمويل', route: 'funding' },
        { n: '04', text: 'المعدات والتوريد', route: 'supply' },
      ],
    },
    chain: {
      label: 'سلسلة الإنتاج',
      lead: 'حتى لو لم يكن لديكم سوى فكرة، نُعدّ دراسة الجدوى، ونجد التمويل، ونخطط للجانب الحيوي للكائن، ونختار الخط ونورّده، ونركّبه، ثم نسلّمه بعد أن نعلّمكم الإنتاج.',
      links: [
        { word: 'الفكرة', text: 'مقترحات مشاريع واستثمار، حتى لمن لا يملك فكرة استثمارية بعد.', items: ['استكشاف المشروع', 'الدراسة الأولية', 'مقترح استثماري'], route: 'feasibility' },
        { word: 'الجدوى', text: 'تحليل الجدوى والربحية لأنظمة الإنتاج.', items: ['تحليل الربحية', 'القياسات الهندسية', 'تطوير الأنظمة القائمة'], route: 'feasibility' },
        { word: 'التمويل', text: 'التمويل عبر صناديق بلدكم والبرامج الدولية.', items: ['الصناديق الوطنية', 'Horizon Europe', 'إيجاد شركاء المشروع'], route: 'funding' },
        { word: 'البيولوجيا', text: 'تخطيط الإنتاج الحيوي كاملًا، من الأمهات إلى اليرقات، ومن التسمين إلى الأعلاف الحية.', items: ['إدارة الأمهات', 'اليرقات والحضانة والتسمين', 'الأعلاف الحية والطحالب'], route: 'aquaculture' },
        { word: 'الوصفة', text: 'علائق الأعلاف وتركيب المنتجات وتخطيط المنشأة.', items: ['علائق الأعلاف', 'تركيب أغذية الحيوانات الأليفة', 'تخطيط مصنع المعالجة'], route: 'lines' },
        { word: 'الآلة', text: 'من آلة البثق إلى التعبئة؛ ومن النطاق المختبري إلى الصناعي.', items: ['15 خط إنتاج', 'آلات البثق والمجففات', 'أنظمة بنطاق تجريبي'], route: 'machines' },
        { word: 'التركيب', text: 'تركيب جاهز للتشغيل، من المفرخات إلى مصانع الأعلاف.', items: ['الميكنة', 'التجميع', 'الصيانة والدعم الفني'], route: 'aquaculture', hash: 'kurulumlar' },
        { word: 'الإنتاج', text: 'نسلّم بعد أن نعلّمكم الإنتاج، ونبقى إلى جانبكم بالتوريد.', items: ['تدريب الكوادر', 'التدريب على تصنيع الأعلاف', 'توريد المواد الخام والمستهلكات'], route: 'supply' },
      ],
      close: 'تعالوا بفكرة. <em>وعودوا بخط إنتاج يعمل.</em>',
      more: 'التفاصيل',
      stepLabel: 'الخطوة',
    },
    worlds: {
      label: 'مجالات النشاط',
      title: 'اختاروا <em>قطاعكم.</em>',
      lead: 'لكل حل مادته الخاصة: الماء والفولاذ والتربة. وتحتها جميعًا المنهج ذاته.',
      panels: [
        { key: 'aquaculture', title: 'الاستزراع المائي', text: 'من المفرخات إلى الأقفاص؛ ومن تخطيط الإنتاج الحيوي إلى المنشأة الجاهزة للتشغيل.', items: ['منشآت المفرخات', 'أنظمة الأقفاص البحرية والبحيرية', 'تخطيط الإنتاج الحيوي', 'تركيب جاهز للتشغيل'] },
        { key: 'lines', title: 'خطوط الأعلاف والأغذية', text: '15 خط بثق، من المواد الخام المسحوقة إلى المنتج المعبأ.', items: ['أعلاف الأسماك المستزرعة', 'أغذية الحيوانات الأليفة', 'حبوب الإفطار والوجبات الخفيفة', 'البروتين النباتي'] },
        { key: 'agri', title: 'الزراعة والثروة الحيوانية', text: 'من الحقل إلى الحظيرة والعودة؛ دورة تحوّل النفايات إلى قيمة.', items: ['الكائنات الدقيقة الفعالة', 'السيلاج والسماد العضوي', 'أنظمة معالجة النفايات', 'إنشاء مزارع التسمين والبيوت المحمية'] },
      ],
      more: 'اكتشف',
      stages: ['بيضة', 'يرقة', 'إصبعية', 'بالغة'],
    },
    journey: {
      label: 'رحلة الخط',
      title: 'من المواد الخام المسحوقة <em>إلى المنتج المعبأ.</em>',
      stations: [
        { asset: 'm-hammer-mill', name: 'الطحن', machine: 'مطحنة مطرقية', text: 'تُطحن المادة الخام إلى نعومة مناسبة للبثق.', metric: '1.7–16.6', unit: 'طن/ساعة', mat: 'mat-powder', matName: 'مسحوق' },
        { asset: 'm-mixer', name: 'الخلط', machine: 'خلاط', text: 'تجتمع المكونات كلها، وتُخلط المكونات الجافة بالمكونات الرطبة.', metric: 'العليقة', unit: 'حسب النوع والعمر', mat: 'mat-mix', matName: 'خليط' },
        { asset: 'm-screw-conveyor', name: 'التغذية', machine: 'ناقل حلزوني', text: 'يُنقل الخليط المسخَّن إلى قادوس تغذية آلة البثق.', metric: '0.75', unit: 'kW للتغذية', mat: 'mat-mash', matName: 'عجينة رطبة' },
        { asset: 'sp85-ii-extruder', name: 'البثق', machine: 'آلة البثق ثنائية اللولب SP85-II', text: 'يُشكَّل الخليط ويُقطع ويُطهى تحت حرارة وضغط عاليين.', metric: '38CrMoAl', unit: 'الأسطوانة · ~HRC60', mat: 'mat-pellet-wet', matName: 'حبيبات رطبة' },
        { asset: 'm-pneumatic-conveyor', name: 'النقل', machine: 'ناقل هوائي', text: 'تُنقل الحبيبات الطازجة إلى المجفف دون أن تتكسر.', metric: 'هواء', unit: 'للنقل', mat: 'mat-pellet-wet', matName: 'حبيبات رطبة' },
        { asset: 'm-dryer', name: 'التجفيف', machine: 'فرن تجفيف متعدد الطوابق', text: 'تُجفَّف الحبيبات حتى تنخفض الرطوبة إلى المستوى المناسب لتكوّن القشرة.', metric: '~200', unit: '°C', mat: 'mat-pellet-dry', matName: 'حبيبات جافة' },
        { asset: 'm-flavoring-drum', name: 'الطلاء', machine: 'أسطوانة التنكيه SGT-II', text: 'تُضاف الزيوت والفيتامينات في أسطوانة الطلاء.', metric: '500', unit: 'كغ/ساعة', mat: 'mat-pellet-coated', matName: 'حبيبات مطلية' },
        { asset: 'm-cooling-conveyor', name: 'التبريد', machine: 'ناقل تبريد', text: 'يُبرَّد المنتج ويُترك ليستقر قبل التعبئة.', metric: 'مروحي', unit: 'سير ناقل', mat: 'mat-pellet-coated', matName: 'حبيبات مبرّدة' },
        { asset: 'm-packaging', name: 'التعبئة', machine: 'آلة تعبئة عمودية SPK', text: 'يُوزن المنتج ويُعبّأ ويُجهَّز للشحن.', metric: '≤ 45', unit: 'عبوة/دقيقة', mat: 'pk-feed-pouch', matName: 'منتج معبّأ' },
      ],
      end: 'المنهج ذاته يمكنه إنتاج أعلاف الأسماك أو أغذية القطط والكلاب أو رقائق الذرة أو البروتين النباتي.',
      endLink: 'اكتشف خطوط الإنتاج الخمسة عشر',
    },
    specimens: {
      title: 'ماذا يمكنكم أن تنتجوا؟',
      sub: 'خمسة عشر خطًا، <em>خمسة عشر منتجًا.</em>',
      cap: 'الطاقة الإنتاجية',
    },
    proof: {
      title: 'شركة <em>قامت على العلم.</em>',
      // Alıntı ve açıklama: eski Hakkımızda sayfasının Türkçe metninden çevrildi (eski Arapça sürümde "reel sektör" yanlışlıkla "العقارات" olarak çevrilmişti).
      quote: 'أن ننجز أعمال جميع شركائنا بالحماس والدافع والمثابرة نفسها التي نعمل بها في أعمالنا، وأن نبني علاقات طويلة الأمد.',
      founder: 'أ.م.د. فاتح باشاران',
      founderRole: 'المؤسس · في الاستزراع المائي منذ 1990',
      founderText: 'تأسست Mavi Protein للاستشارات في بداية عام 2015 لوضع خبرة أ.م.د. فاتح باشاران في الاستزراع المائي منذ عام 1990، ورصيده الأكاديمي، وتجربته في القطاع الحقيقي في خدمة الإنسانية. وتهدف إلى زيادة القدرة الإنتاجية للبلاد من خلال توجيه المستثمرين والمنتجين في استخدام الموارد الوطنية والدولية لتحويل مشاريع البحث والتطوير إلى واقع.',
      timeline: [
        { y: '1990', t: 'أول خبرة ميدانية في الاستزراع المائي' },
        { y: '2015', t: 'تأسيس Mavi Protein في إزمير' },
        { y: '2016', t: 'انطلاق مشروع TÜBİTAK 1501؛ معرضا AGRA ME دبي وFuture Fish Eurasia' },
        { y: '2017', t: 'اكتمال مشروع البحث والتطوير لشركة Turkuaz Marin' },
        { y: '2020', t: 'استشارات أغذية الحيوانات الأليفة لـ Rotika؛ سبيرولينا ALGOPHYCO' },
      ],
      figures: [
        { n: '16.6', u: 'طن/ساعة', c: 'قدرة الطحن لأكبر مطحنة' },
        { n: '30', u: 'ميكرون', c: 'أدق درجة طحن في مطحنة الطحن الدقيق' },
        { n: '50%', c: 'نسبة اللحم الطازج التي يعالجها البثّاق ثنائي اللولب' },
        { n: '15', u: 'خطًا', c: '5 خطوط للأعلاف وأغذية الحيوانات الأليفة و10 خطوط للأغذية، من المادة الخام إلى العبوة' },
      ],
      stamps: {
        label: 'إصدار الشهادات · مع شركائنا',
        lead: 'نرشدكم في الحصول على شهادات أنظمة الإدارة وشهادات الكفاءة المهنية المعترف بها دوليًا.',
        cta: 'خدمة إصدار الشهادات',
        people: 'شهادة الكفاءة المهنية',
      },
      exhibit: {
        year: '2016',
        alt: 'Future Fish Eurasia 2016، إزمير: الأستاذ المشارك الدكتور فاتح باشاران ببطاقة العارض مع الزوار أمام جناح Mavi Protein',
      },
    },
    records: {
      title: 'سجلات ميدانية',
      all: 'جميع السجلات',
      ui: { prev: 'الصورة السابقة', next: 'الصورة التالية', close: 'إغلاق', more: 'عرض المشروع', gallery: 'الصور' },
      items: [
        { code: 'TÜBİTAK 1501 · 2016–2017', kind: 'مشروع بحث وتطوير', title: 'Turkuaz Marin Deniz Ürünleri', text: 'مشروع بحث وتطوير صناعي نُفّذ بين يناير 2016 ويوليو 2017.', hash: 'turkuaz-marin', stamp: ['TÜBİTAK 1501', 'بحث وتطوير صناعي', '01.2016 – 07.2017'] },
        { code: 'إيران · 2020', kind: 'استشارات', title: 'Rotika', text: 'استشارات في تركيب أغذية القطط والكلاب والطيور وإنتاجها؛ والمنتجات متوفرة في السوق.', hash: 'rotika', alts: ['مصنع Rotika لأغذية الحيوانات الأليفة، إيران', 'عبوة غذاء Rotika للقطط البالغة', 'عبوة غذاء Rotika للببغاوات المتوسطة والكبيرة', 'غذاء Rotika للكلاب البالغة من السلالات المتوسطة والكبيرة، 2 kg؛ وعلى الكيس عبارة “Official Licensed Product · Mavi Protein”'] },
        { code: 'تركيا + الشرق الأوسط', kind: 'شراكة', title: 'Jinan Sunpring Machinery', text: 'الموزّع الحصري في تركيا والشرق الأوسط لآلات بثق الأعلاف والأغذية.', hash: 'sunpring', alts: ['دعوة معرض AGRA ME 2016 في دبي: شعارا Mavi Protein وSunpring، الجناح S1E19'] },
        { code: 'دبي · إزمير · 2016', kind: 'معرض', title: 'AGRA ME · Future Fish Eurasia', text: 'لقاءات مع مستثمرين من عشر دول في دبي؛ ومعرض Future Fish Eurasia في إزمير.', hash: 'fuarlar', alts: ['AGRA ME 2016، دبي: زوار أمام باثقة في جناح Mavi Protein', 'Future Fish Eurasia 2016، إزمير: جناح Mavi Protein رقم 228'] },
      ],
    },
    funding: {
      label: 'المشاريع والتمويل',
      title: 'الفكرة الجيدة تُموَّل بمشروع <em>مكتوب جيدًا.</em>',
      lead: 'لصناديق بلدكم: الإعداد والكتابة والاستشارة في إدارة المشروع؛ وللبرامج الدولية: إيجاد الشركاء وتقديم الطلب.',
      programs: ['TÜBİTAK 1501', 'Horizon Europe', 'Marie Skłodowska-Curie', 'منح البحث والتطوير الوطنية والدولية'],
      steps: ['تقييم الفكرة', 'مطابقة البرنامج', 'كتابة المشروع والشركاء', 'التنفيذ وإعداد التقارير'],
      sheets: ['نموذج الطلب', 'الميزانية', 'حزم العمل'],
      link: 'خدمات المشاريع والتمويل',
    },
    algae: {
      label: 'ALGOPHYCO™ · Spirulina',
      title: '<em>البروتين الأزرق</em> في اسمنا.',
      text: 'الفيكوسيانين الذي يمنح السبيرولينا لونها بروتين أزرق بكل معنى الكلمة. بدأت الطحالب الخضراء المزرقة قبل 3.5 مليار سنة بتنقية الماء والهواء وإنتاج الأكسجين؛ إنها الحلقة التي تسبق حتى الحلقة الأولى في السلسلة الغذائية.',
      fig: '64–67%',
      figCap: 'بروتين (مادة جافة)',
      local: 'سبيرولينا من إنتاج تركيا · 100 غ، 250 غ، 900 غ',
      link: 'اكتشف ALGOPHYCO',
    },
    notes: {
      label: 'Mavi Protein تقول',
      title: 'ملاحظات',
      all: 'جميع الملاحظات',
    },
    close: {
      title: 'أيًّا كانت مرحلة مشروعكم، <em>يمكننا أن نبدأ من هنا.</em>',
      primary: 'ابدأ مشروعك',
      secondary: 'تحميل الكتالوج',
      or: 'أو مباشرة',
    },
  },
};
