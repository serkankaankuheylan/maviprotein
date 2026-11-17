// Turnkey facility plates as static SVG files (/cizim/<id>.svg), shared by every language.
import type { APIRoute } from 'astro';
import { FACILITIES, plate } from '../../lib/facilities';

export function getStaticPaths() {
  return FACILITIES.map((d) => ({ params: { id: d.id } }));
}

export const GET: APIRoute = ({ params }) => {
  const p = plate(params.id!);
  if (!p) return new Response('Not found', { status: 404 });
  return new Response(p.svg, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
};
