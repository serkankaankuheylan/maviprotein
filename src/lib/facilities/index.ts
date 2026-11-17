/**
 * Turnkey facility plates: one isometric engineering drawing per facility type the firm installs
 * (services.json → turnkey groups). `title` is the inventory's Turkish title, used to match a service
 * item to its plate; zone keys are labelled in src/i18n/facilities.ts.
 * The SVGs are served by src/pages/cizim/[id].svg.ts; FacilitySet.astro lays the zone overlay on top.
 */
import { Plate, type PlateOut } from '../iso';
import * as aqua from './aqua';
import * as agri from './agri';

export interface FacilityDef { id: string; title: string; draw: (P: Plate) => void }

export const FACILITIES: FacilityDef[] = [
  { id: 'kulucka', title: 'Yavru balık kuluçkahane tesisleri', draw: aqua.kulucka },
  { id: 'ras', title: 'Kapalı ve açık sistem tüm mekanizasyon kurulumları', draw: aqua.ras },
  { id: 'besi', title: 'Besi tesisleri', draw: aqua.besi },
  { id: 'kafes', title: 'Deniz ve göl kafes sistemleri', draw: aqua.kafes },
  { id: 'karada', title: 'Karada besicilik', draw: aqua.karada },
  { id: 'havuz', title: 'Toprak havuz ve beton havuz sistemleri', draw: aqua.havuz },
  { id: 'isleme', title: 'İşleme tesisleri, planlama ve kurulum hizmetleri', draw: aqua.isleme },
  { id: 'yem-gida', title: 'Yem ve gıda makineleri kurulumu', draw: aqua.yemGida },
  { id: 'akvaryum', title: 'Tatlı su ve deniz akvaryum tesisleri kurulumu', draw: aqua.akvaryum },
  { id: 'akuaponik', title: 'Akuaponik üretim sistemleri', draw: aqua.akuaponik },
  { id: 'canli-yem', title: 'Canlı yem ve yosun üretim sistemleri kurulumu', draw: aqua.canliYem },
  { id: 'sera', title: 'Sera kurulumu', draw: agri.sera },
  { id: 'sebze-meyve', title: 'Sebze ve meyve işleme ve paketleme tesisleri', draw: agri.sebzeMeyve },
  { id: 'zeytin', title: 'Zeytin ve zeytinyağı işleme tesisleri', draw: agri.zeytin },
  { id: 'besi-ciftligi', title: 'Besi çiftlikleri', draw: agri.besiCiftligi },
  { id: 'kumes', title: 'Kümes hayvanları tüm sistemler kurulumu', draw: agri.kumes },
  { id: 'kesimhane', title: 'Kesimhaneler', draw: agri.kesimhane },
  { id: 'yem-sanayi', title: 'Yem sanayi sistemleri ve mekanizasyonu', draw: agri.yemSanayi },
  { id: 'et-sut', title: 'Et ve süt ürünleri işleme ve paketleme tesisleri', draw: agri.etSut },
  { id: 'soguk-depo', title: 'Soğuk hava depoları', draw: agri.sogukDepo },
];

const cache = new Map<string, PlateOut>();
export function plate(id: string): PlateOut | undefined {
  if (!cache.has(id)) {
    const def = FACILITIES.find((d) => d.id === id);
    if (!def) return undefined;
    const P = new Plate();
    def.draw(P);
    cache.set(id, P.render());
  }
  return cache.get(id);
}
export const facilityFor = (trTitle: string) => FACILITIES.find((d) => d.title === trTitle);
