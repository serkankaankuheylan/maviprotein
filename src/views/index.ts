import type { RouteKey } from '../lib/routes';
import Home from './Home.astro';
import Line from './Line.astro';
import Lines from './Lines.astro';
import Machines from './Machines.astro';
import Machine from './Machine.astro';
import Aquaculture from './Aquaculture.astro';
import Agri from './Agri.astro';
import Funding from './Funding.astro';
import Feasibility from './Feasibility.astro';
import Supply from './Supply.astro';
import Certification from './Certification.astro';
import Projects from './Projects.astro';
import Algophyco from './Algophyco.astro';
import About from './About.astro';
import Notes from './Notes.astro';
import Note from './Note.astro';
import Catalog from './Catalog.astro';
import Archive from './Archive.astro';
import Contact from './Contact.astro';
import Start from './Start.astro';
import Privacy from './Privacy.astro';
import Cookies from './Cookies.astro';

/** Route key → view. Every key in ROUTES has a view. */
export const VIEWS: Record<RouteKey, any> = {
  home: Home, aquaculture: Aquaculture, lines: Lines, agri: Agri, line: Line,
  machines: Machines, machine: Machine,
  funding: Funding, feasibility: Feasibility, supply: Supply, certification: Certification,
  projects: Projects, algophyco: Algophyco, about: About, notes: Notes, note: Note,
  catalog: Catalog, archive: Archive, contact: Contact, start: Start, privacy: Privacy, cookies: Cookies,
};
