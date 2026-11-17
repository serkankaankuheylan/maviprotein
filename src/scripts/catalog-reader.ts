/**
 * Catalogue reader (see src/components/CatalogReader.astro for the shell and the loading rules).
 * Spreads: 0 = [–, 1] (cover), k = [2k, 2k+1] for k = 1…27, 28 = [56, –] (back cover).
 */
type Lang = 'tr' | 'en';
interface Cfg {
  lang: Lang; pages: number; pdf: Record<Lang, string>;
  t: { page: string; cover: string; back: string; zoomIn: string; zoomOut: string; loading: string };
  chapters: { t: string; p: string; start: number }[];
}
interface Reader { open: (page?: number) => void }

const PAGE_AR = 595.276 / 841.89; // A4 portrait, width / height
const MAX_Z = 4;
const instances = new WeakMap<HTMLDialogElement, Reader>();

export function openReader(dlg: HTMLDialogElement, page?: number) {
  let r = instances.get(dlg);
  if (!r) { r = createReader(dlg); instances.set(dlg, r); }
  r.open(page);
}

function createReader(dlg: HTMLDialogElement): Reader {
  const cfg: Cfg = JSON.parse(dlg.dataset.cfg || '{}');
  const N = cfg.pages;
  const LAST = Math.floor(N / 2); // 28: the back cover alone (N is even)
  const $ = <T extends Element>(s: string) => dlg.querySelector(s) as T;
  const $$ = <T extends Element>(s: string) => [...dlg.querySelectorAll(s)] as T[];

  const stage = $<HTMLElement>('[data-cr-stage]');
  const zoomEl = $<HTMLElement>('[data-cr-zoom]');
  const book = $<HTMLElement>('[data-cr-book]');
  const halfL = $<HTMLElement>('[data-cr-l]');
  const halfR = $<HTMLElement>('[data-cr-r]');
  const range = $<HTMLInputElement>('[data-cr-range]');
  const count = $<HTMLOutputElement>('[data-cr-count]');
  const toast = $<HTMLElement>('[data-cr-toast]');
  const panel = $<HTMLElement>('[data-cr-panelbox]');
  const panelBtn = $<HTMLButtonElement>('[data-cr-panel]');
  const grid = $<HTMLOListElement>('[data-cr-grid]');
  const zoomBtn = $<HTMLButtonElement>('[data-cr-zoombtn]');
  const dl = $<HTMLAnchorElement>('[data-cr-dl]');
  const top = $<HTMLElement>('.cr__top');
  const bottom = $<HTMLElement>('.cr__bottom');
  const sideNext = $<HTMLElement>('.cr__side--next');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  // same query as the CSS: phones and tablets held sideways, and any short window. The bars lie over the
  // paper and step aside while reading, so the paper can take the whole height.
  const overlay = matchMedia('(max-height: 520px), (orientation: landscape) and (pointer: coarse)');

  let lang: Lang = cfg.lang;
  let idx = 0;
  let bw = 0, bh = 0, sw = 0, sh = 0;
  let z = 1, tx = 0, ty = 0;
  let turning: { anim: Animation; done: () => void } | null = null;
  let pushed = false;
  let gridBuilt = '';

  /* ---------- spreads ---------- */
  const pagesOf = (s: number): [number | null, number | null] =>
    s <= 0 ? [null, 1] : s >= LAST ? [N, null] : [2 * s, 2 * s + 1];
  const spreadOf = (p: number) => Math.max(0, Math.min(LAST, Math.floor(p / 2)));
  const single = (s: number) => s <= 0 || s >= LAST;
  const label = (s: number) => { const [a, b] = pagesOf(s); return a && b ? `${a}–${b}` : String(a ?? b); };
  const src = (n: number, w: number | 't') => `/katalog/${lang}/${String(n).padStart(2, '0')}-${w}.webp`;
  const srcset = (n: number) => `${src(n, 480)} 480w, ${src(n, 960)} 960w, ${src(n, 1600)} 1600w`;
  const sizes = () => `${Math.ceil((bw / 2) * z)}px`;

  /* ---------- page elements ---------- */
  function fill(el: HTMLElement, n: number | null) {
    el.replaceChildren();
    el.classList.toggle('is-blank', !n);
    el.style.backgroundImage = '';
    if (!n) { el.removeAttribute('aria-label'); return; }
    el.style.backgroundImage = `url(${src(n, 't')})`;
    el.classList.add('cr__loading');
    const img = new Image();
    img.alt = `${cfg.t.page} ${n}`;
    img.decoding = 'async';
    img.draggable = false;
    img.sizes = sizes();
    img.srcset = srcset(n);
    img.src = src(n, 960);
    const show = () => { img.classList.add('is-in'); el.classList.remove('cr__loading'); };
    if (img.complete && img.naturalWidth) show(); else img.addEventListener('load', show, { once: true });
    el.append(img);
  }

  function preload(s: number) {
    if (s < 0 || s > LAST) return;
    for (const n of pagesOf(s)) {
      if (!n) continue;
      const img = new Image();
      img.sizes = sizes();
      img.srcset = srcset(n);
      img.src = src(n, 960);
    }
  }
  const idle = (fn: () => void) => ('requestIdleCallback' in window ? (window as any).requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 300));

  let laidSingle: boolean | null = null;
  function relayoutIfNeeded() {
    if (sw >= 760 || laidSingle === single(idx)) return;
    layout();
  }

  function paint(s: number) {
    const [a, b] = pagesOf(s);
    fill(halfL, a);
    fill(halfR, b);
    book.classList.toggle('is-cover', s <= 0);
    book.classList.toggle('is-backcover', s >= LAST);
  }

  function sync() {
    range.value = String(idx);
    count.innerHTML = `${label(idx)}<small> / ${N}</small>`;
    $$<HTMLButtonElement>('[data-cr-prev]').forEach((b) => (b.disabled = idx <= 0));
    $$<HTMLButtonElement>('[data-cr-next]').forEach((b) => (b.disabled = idx >= LAST));
    grid.querySelectorAll('li').forEach((li, i) => li.classList.toggle('is-current', i === idx));
    const first = pagesOf(idx)[0] ?? pagesOf(idx)[1];
    if (dlg.open) history.replaceState(history.state, '', `#s-${first}`);
    idle(() => { preload(idx + 1); preload(idx - 1); });
  }

  /* ---------- turning ---------- */
  // ends a running turn at once (synchronously: the 'finish' event would fire after the next turn began)
  function finishTurn() { const t = turning; if (!t) return; turning = null; t.done(); }

  // the page that just landed is already loaded on the leaf: move it into its half instead of loading it again
  function adopt(face: HTMLElement, half: HTMLElement, n: number | null) {
    const img = face.querySelector('img');
    if (!n || !img) { fill(half, n); return; }
    half.replaceChildren(img);
    half.classList.remove('is-blank');
    half.style.backgroundImage = face.style.backgroundImage;
    half.classList.toggle('cr__loading', face.classList.contains('cr__loading'));
    if (!img.classList.contains('is-in')) img.addEventListener('load', () => half.classList.remove('cr__loading'), { once: true });
  }

  function go(target: number, animate = true) {
    target = Math.max(0, Math.min(LAST, target));
    finishTurn();
    if (target === idx) return;
    if (z > 1) resetZoom(false);
    const step = target - idx;
    if (!animate || reduce.matches || Math.abs(step) > 1 || !dlg.open) {
      idx = target;
      relayoutIfNeeded();
      paint(idx);
      if (animate && !reduce.matches) book.animate([{ opacity: 0.25 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
      sync();
      return;
    }
    flip(step > 0 ? 1 : -1, target);
  }

  function flip(dir: 1 | -1, target: number) {
    const [a, b] = pagesOf(idx);
    const [c, d] = pagesOf(target);
    const leaf = document.createElement('div');
    leaf.className = `cr__leaf cr__leaf--${dir > 0 ? 'next' : 'prev'}`;
    const front = document.createElement('div');
    const back = document.createElement('div');
    front.className = 'cr__face cr__face--front';
    back.className = 'cr__face cr__face--back';
    const shadeF = document.createElement('i');
    const shadeB = document.createElement('i');
    for (const sh of [shadeF, shadeB]) sh.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;opacity:0;';
    shadeF.style.background = `linear-gradient(${dir > 0 ? 'to right' : 'to left'}, rgba(0,0,0,.35), rgba(0,0,0,.08))`;
    shadeB.style.background = `linear-gradient(${dir > 0 ? 'to left' : 'to right'}, rgba(0,0,0,.3), rgba(0,0,0,.05))`;

    if (dir > 0) {
      fill(front, b); fill(back, c);
      fill(halfR, d);
    } else {
      fill(front, a); fill(back, d);
      fill(halfL, c);
    }
    front.append(shadeF); back.append(shadeB);
    leaf.append(front, back);
    book.append(leaf);
    book.classList.toggle('is-cover', target <= 0);
    book.classList.toggle('is-backcover', target >= LAST);

    const dur = 680;
    const ease = 'cubic-bezier(.32,.08,.24,1)';
    const anim = leaf.animate(
      [{ transform: 'rotateY(0deg)' }, { transform: `rotateY(${dir > 0 ? -90 : 90}deg)`, offset: 0.5 }, { transform: `rotateY(${dir > 0 ? -180 : 180}deg)` }],
      { duration: dur, easing: ease, fill: 'forwards' },
    );
    shadeF.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur / 2, easing: ease, fill: 'forwards' });
    shadeB.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur / 2, delay: dur / 2, easing: 'ease-out', fill: 'forwards' });

    idx = target;
    relayoutIfNeeded();
    sync();
    let ended = false;
    const done = () => {
      if (ended) return;
      ended = true;
      if (turning?.anim === anim) turning = null;
      if (dir > 0) adopt(back, halfL, c); else adopt(back, halfR, d);
      anim.cancel();
      leaf.remove();
    };
    turning = { anim, done };
    anim.addEventListener('finish', done);
    // also by the clock: a throttled (hidden or busy) tab may never deliver 'finish'
    setTimeout(done, dur + 60);
  }

  const next = () => go(idx + 1);
  const prev = () => go(idx - 1);

  /* ---------- layout ---------- */
  function layout() {
    const rect = stage.getBoundingClientRect();
    sw = rect.width; sh = rect.height;
    const narrow = sw < 760;
    const over = overlay.matches;
    const padX = over ? 16 : narrow ? 10 : Math.max(72, sw * 0.06);
    const padY = over ? 8 : narrow ? 12 : 28;
    // phones: a cover stands alone, so it may fill the screen instead of half a spread
    const alone = narrow && single(idx);
    const A = alone ? PAGE_AR : 2 * PAGE_AR;
    const fit = Math.max(alone ? 120 : 200, Math.min(sw - 2 * padX, (sh - 2 * padY) * A));
    bw = alone ? fit * 2 : fit;
    bh = bw / (2 * PAGE_AR);
    book.style.setProperty('--bw', `${bw}px`);
    book.style.setProperty('--bh', `${bh}px`);
    dlg.style.setProperty('--top-h', `${top.offsetHeight}px`);
    dlg.style.setProperty('--bot-h', `${bottom.offsetHeight}px`);
    // the turn arrows sit in the side margins; where the paper needs that room (a tablet held sideways)
    // they give way instead of covering it (the bottom bar, a swipe or the page edges turn there)
    const room = getComputedStyle(sideNext).display === 'none' ? 0 : rect.right - sideNext.getBoundingClientRect().left + 6;
    dlg.classList.toggle('is-tight', over && (sw - (alone ? bw / 2 : bw)) / 2 < room);
    laidSingle = single(idx);
    resetZoom(false);
    refreshSizes();
  }

  /* ---------- zoom & pan ---------- */
  // the visible paper, in stage coordinates at zoom 1 (a cover shows one page, centred)
  const paper = () => { const cw = single(idx) ? bw / 2 : bw; return { x: (sw - cw) / 2, y: (sh - bh) / 2, w: cw, h: bh }; };

  function clampPan(nz: number, nx: number, ny: number): [number, number] {
    const p = paper();
    const W = p.w * nz, H = p.h * nz;
    const fx = (lo: number, size: number, view: number, t: number) =>
      size <= view ? (view - size) / 2 - lo * nz : Math.min(-lo * nz, Math.max(view - (lo + size / nz) * nz, t));
    return [fx(p.x, W, sw, nx), fx(p.y, H, sh, ny)];
  }

  function apply(animate = false) {
    dlg.classList.toggle('is-animating', animate);
    zoomEl.style.transform = z === 1 && tx === 0 && ty === 0 ? '' : `translate3d(${tx}px, ${ty}px, 0) scale(${z})`;
    const zoomed = z > 1.01;
    dlg.classList.toggle('is-zoomed', zoomed);
    zoomBtn.setAttribute('aria-label', zoomed ? cfg.t.zoomOut : cfg.t.zoomIn);
  }

  let sizesTimer = 0;
  function refreshSizes() {
    clearTimeout(sizesTimer);
    sizesTimer = window.setTimeout(() => dlg.querySelectorAll<HTMLImageElement>('.cr__half img').forEach((im) => (im.sizes = sizes())), 180);
  }

  function zoomTo(nz: number, px: number, py: number, animate = true) {
    nz = Math.max(1, Math.min(MAX_Z, nz));
    if (nz <= 1.02) { resetZoom(animate); return; }
    const lx = (px - tx) / z, ly = (py - ty) / z;
    [tx, ty] = clampPan(nz, px - lx * nz, py - ly * nz);
    z = nz;
    apply(animate);
    refreshSizes();
  }

  function resetZoom(animate = true) {
    z = 1; tx = 0; ty = 0;
    apply(animate);
  }

  // one step in: phones go to "page fills the height" so a spread reads like two pages side by side
  function zoomStep(px = sw / 2, py = sh / 2) {
    if (z > 1.01) { resetZoom(true); return; }
    const fitH = sh / bh;
    const target = sw < 760 ? Math.min(MAX_Z, Math.max(2, fitH)) : 2.2;
    zoomTo(target, px, py, true);
  }

  /* ---------- pointer gestures ---------- */
  const pts = new Map<number, { x: number; y: number; type: string }>();
  let g = { x: 0, y: 0, t: 0, tx: 0, ty: 0, z: 1, moved: false, pinch: false, d0: 0, mx: 0, my: 0 };
  let lastTap = { t: 0, x: 0, y: 0 };
  let tapTimer = 0;

  const local = (e: { clientX: number; clientY: number }) => { const r = stage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const edgeAt = (x: number) => {
    if (z > 1.01) return '';
    const p = paper();
    if (x < p.x + p.w * 0.16) return idx > 0 ? 'prev' : '';
    if (x > p.x + p.w * 0.84) return idx < LAST ? 'next' : '';
    return '';
  };
  const dist = () => { const [a, b] = [...pts.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
  const mid = () => { const [a, b] = [...pts.values()]; return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; };

  function baseline(p: { x: number; y: number }) {
    g = { ...g, x: p.x, y: p.y, t: performance.now(), tx, ty, z, pinch: false };
  }

  stage.addEventListener('pointerdown', (e) => {
    if ((e.target as Element).closest('button')) return;
    try { stage.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
    const p = local(e);
    pts.set(e.pointerId, { ...p, type: e.pointerType });
    // a mouse wakes the bars; a finger leaves them be: a tap shows or hides them (tap), a swipe only turns
    if (e.pointerType === 'mouse') wake();
    if (pts.size === 1) { baseline(p); g.moved = false; }
    if (pts.size === 2) {
      const m = mid();
      g = { ...g, pinch: true, d0: dist(), mx: m.x, my: m.y, tx, ty, z, moved: true };
      zoomEl.style.translate = '';
    }
  });

  stage.addEventListener('pointermove', (e) => {
    const p = local(e);
    if (!pts.has(e.pointerId)) {
      if (e.pointerType === 'mouse') stage.dataset.edge = edgeAt(p.x);
      return;
    }
    pts.set(e.pointerId, { ...p, type: e.pointerType });
    if (g.pinch && pts.size === 2) {
      const m = mid();
      const nz = Math.max(0.85, Math.min(MAX_Z * 1.15, (g.z * dist()) / g.d0));
      const lx = (g.mx - g.tx) / g.z, ly = (g.my - g.ty) / g.z;
      z = nz; tx = m.x - lx * nz; ty = m.y - ly * nz;
      apply(false);
      return;
    }
    const dx = p.x - g.x, dy = p.y - g.y;
    if (Math.hypot(dx, dy) > 8) g.moved = true;
    if (!g.moved) return;
    if (z > 1.01) {
      stage.classList.add('is-dragging');
      [tx, ty] = clampPan(z, g.tx + dx, g.ty + dy);
      apply(false);
    } else if (e.pointerType !== 'mouse' && Math.abs(dx) > Math.abs(dy)) {
      // follow the finger a little, so a swipe feels attached to the paper
      const can = dx < 0 ? idx < LAST : idx > 0;
      zoomEl.style.translate = `${dx * (can ? 0.35 : 0.12)}px 0`;
    }
  });

  function endPointer(e: PointerEvent) {
    if (!pts.has(e.pointerId)) return;
    const p = local(e);
    pts.delete(e.pointerId);
    stage.classList.remove('is-dragging');
    if (g.pinch) {
      if (pts.size === 1) { baseline([...pts.values()][0]); g.moved = true; return; }
      if (z < 1.05) resetZoom(true);
      else { const c = clampPan(Math.min(z, MAX_Z), tx, ty); z = Math.min(z, MAX_Z); [tx, ty] = c; apply(true); refreshSizes(); }
      g.pinch = false;
      return;
    }
    if (pts.size) return;
    const dx = p.x - g.x, dy = p.y - g.y, dt = performance.now() - g.t;
    if (zoomEl.style.translate) {
      zoomEl.animate([{ translate: zoomEl.style.translate }, { translate: '0 0' }], { duration: 220, easing: 'ease-out' });
      zoomEl.style.translate = '';
    }
    if (!g.moved && dt < 400 && e.type === 'pointerup') return tap(p, e.pointerType);
    if (z <= 1.01 && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) { dx < 0 ? next() : prev(); sleep(); }
  }
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);
  stage.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') delete stage.dataset.edge; });

  function tap(p: { x: number; y: number }, type: string) {
    if (type === 'mouse') {
      const edge = edgeAt(p.x);
      if (edge === 'next') next(); else if (edge === 'prev') prev(); else zoomStep(p.x, p.y);
      return;
    }
    const now = performance.now();
    if (now - lastTap.t < 320 && Math.hypot(p.x - lastTap.x, p.y - lastTap.y) < 40) {
      clearTimeout(tapTimer);
      lastTap.t = 0;
      zoomStep(p.x, p.y);
      return;
    }
    lastTap = { t: now, ...p };
    clearTimeout(tapTimer);
    const hidden = dlg.classList.contains('is-idle');
    tapTimer = window.setTimeout(() => {
      const edge = edgeAt(p.x);
      if (edge === 'next') next(); else if (edge === 'prev') prev();
      else if (hidden) wake(); else sleep();
    }, 320);
  }

  // wheel: ctrl/pinch on a trackpad zooms, a zoomed page pans, otherwise a deliberate scroll turns
  let acc = 0, wheelCool = 0, wheelQuiet = 0;
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    const p = local(e);
    const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? sh : 1;
    if (e.ctrlKey) { zoomTo(z * Math.exp(-e.deltaY * k * 0.01), p.x, p.y, false); return; }
    if (z > 1.01) { [tx, ty] = clampPan(z, tx - e.deltaX * k, ty - e.deltaY * k); apply(false); return; }
    const now = performance.now();
    clearTimeout(wheelQuiet);
    wheelQuiet = window.setTimeout(() => (acc = 0), 180);
    if (now < wheelCool) return;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    acc += d * k;
    if (Math.abs(acc) > 70) { acc > 0 ? next() : prev(); acc = 0; wheelCool = now + 520; }
  }, { passive: false });

  /* ---------- controls ---------- */
  $$('[data-cr-prev]').forEach((b) => b.addEventListener('click', prev));
  $$('[data-cr-next]').forEach((b) => b.addEventListener('click', next));
  zoomBtn.addEventListener('click', () => zoomStep());
  $<HTMLButtonElement>('[data-cr-close]').addEventListener('click', requestClose);

  range.addEventListener('input', () => { count.innerHTML = `${label(Number(range.value))}<small> / ${N}</small>`; wake(); });
  range.addEventListener('change', () => go(Number(range.value), false));

  $$<HTMLButtonElement>('[data-cr-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.crLang as Lang)));
  function setLang(l: Lang) {
    if (l === lang && dl.getAttribute('href') === cfg.pdf[l]) { markLang(); return; }
    lang = l;
    markLang();
    dl.href = cfg.pdf[l];
    finishTurn();
    paint(idx);
    if (gridBuilt) buildGrid();
  }
  const markLang = () => $$<HTMLButtonElement>('[data-cr-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.crLang === lang)));

  panelBtn.addEventListener('click', () => togglePanel());
  function togglePanel(force?: boolean) {
    const on = force ?? panel.hidden;
    panel.hidden = !on;
    panelBtn.setAttribute('aria-expanded', String(on));
    if (on) {
      if (gridBuilt !== lang) buildGrid();
      grid.querySelector('.is-current')?.scrollIntoView({ block: 'center' });
    } else wake(); // the bars waited for the panel; now they may step aside again
  }
  function buildGrid() {
    gridBuilt = lang;
    grid.replaceChildren(...Array.from({ length: LAST + 1 }, (_, s) => {
      const li = document.createElement('li');
      li.classList.toggle('is-current', s === idx);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.crSpread = String(s);
      const th = document.createElement('span');
      th.className = `cr__th${single(s) ? ' is-single' : ''}`;
      for (const n of pagesOf(s)) {
        if (!n) continue;
        const im = document.createElement('img');
        im.loading = 'lazy'; im.decoding = 'async'; im.alt = ''; im.src = src(n, 't');
        th.append(im);
      }
      const cap = document.createElement('span');
      cap.textContent = s === 0 ? `1 · ${cfg.t.cover}` : s === LAST ? `${N} · ${cfg.t.back}` : label(s);
      btn.append(th, cap);
      btn.setAttribute('aria-label', `${cfg.t.page} ${label(s)}`);
      li.append(btn);
      return li;
    }));
  }
  panel.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('button');
    if (!b) return;
    const s = b.dataset.crSpread != null ? Number(b.dataset.crSpread) : b.dataset.crGo ? spreadOf(Number(b.dataset.crGo)) : null;
    if (s == null) return;
    go(s, false);
    if (sw < 900) togglePanel(false);
  });

  dlg.addEventListener('keydown', (e) => {
    if ((e.target as Element).matches('input')) return;
    if (e.metaKey || e.altKey) return;
    const k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !(e.target as Element).closest('button, a'))) { e.preventDefault(); next(); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); prev(); }
    else if (k === 'Home') { e.preventDefault(); go(0, false); }
    else if (k === 'End') { e.preventDefault(); go(LAST, false); }
    else if (k === '+' || k === '=') { e.preventDefault(); zoomTo(z * 1.5, sw / 2, sh / 2); }
    else if (k === '-') { e.preventDefault(); zoomTo(z / 1.5, sw / 2, sh / 2); }
    else if (k === '0') { e.preventDefault(); resetZoom(true); }
    else if (z > 1.01 && k.startsWith('Arrow')) { e.preventDefault(); }
    wake();
  });
  dlg.addEventListener('cancel', (e) => {
    e.preventDefault();
    if (!panel.hidden) togglePanel(false);
    else if (z > 1.01) resetZoom(true);
    else requestClose();
  });

  /* ---------- chrome that steps aside while reading (overlay) ---------- */
  let idleTimer = 0;
  function wake() {
    dlg.classList.remove('is-idle');
    clearTimeout(idleTimer);
    idleTimer = window.setTimeout(sleep, 3200);
  }
  function sleep() { if (overlay.matches && panel.hidden) dlg.classList.add('is-idle'); }
  // only a real mouse wakes the bars by moving: a tap also fires a mousemove, and a tap decides for itself
  dlg.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') wake(); });
  [top, bottom].forEach((b) => b.addEventListener('pointerdown', () => wake()));
  // turned sideways while open: the bars show, then step aside as they do on opening
  overlay.addEventListener('change', () => { if (dlg.open) wake(); });

  /* ---------- hints ---------- */
  let toastTimer = 0;
  function say(msg: string, ms = 3400) {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-on'), ms);
  }
  function hints() {
    if (finePointer.matches) return;
    const seen = (k: string) => { try { if (sessionStorage.getItem(k)) return true; sessionStorage.setItem(k, '1'); } catch { /* storage may be blocked */ } return false; };
    const portrait = matchMedia('(orientation: portrait) and (max-width: 760px)').matches;
    const rotate = dlg.querySelector('[data-cr-toast]')?.getAttribute('data-rotate');
    if (portrait && !seen('cr-rotate')) say(rotate || '', 4200);
    else if (!seen('cr-hint')) say(toast.dataset.hint || '', 3600);
  }

  /* ---------- open / close ---------- */
  const ro = new ResizeObserver(() => { if (dlg.open) layout(); });
  ro.observe(stage);

  function requestClose() {
    if (!dlg.open) return;
    if (pushed && history.state?.cr) { history.back(); return; }
    closeNow();
    history.replaceState(history.state, '', location.pathname + location.search);
  }
  function closeNow() {
    if (!dlg.open) return;
    finishTurn();
    pushed = false;
    togglePanel(false);
    clearTimeout(idleTimer);
    const done = () => { dlg.classList.remove('is-closing'); dlg.close(); document.documentElement.classList.remove('cr-lock'); };
    if (reduce.matches) return done();
    dlg.classList.add('is-closing');
    setTimeout(done, 230);
  }
  window.addEventListener('popstate', () => { if (dlg.open && !/^#s-\d+$/.test(location.hash)) closeNow(); });
  // a page number typed or linked while the reader is open
  window.addEventListener('hashchange', () => {
    const m = /^#s-(\d{1,2})$/.exec(location.hash);
    if (dlg.open && m && spreadOf(Number(m[1])) !== idx) go(spreadOf(Number(m[1])), false);
  });
  dlg.addEventListener('close', () => document.documentElement.classList.remove('cr-lock'));

  return {
    open(page?: number) {
      const s = page ? spreadOf(page) : 0;
      markLang();
      dlg.classList.remove('is-ready');
      document.documentElement.classList.add('cr-lock');
      if (!dlg.open) dlg.showModal();
      idx = s;
      layout();
      paint(idx);
      const first = pagesOf(idx)[0] ?? pagesOf(idx)[1];
      if (/^#s-\d+$/.test(location.hash)) history.replaceState({ ...(history.state || {}), cr: 0 }, '', `#s-${first}`);
      else { history.pushState({ cr: 1 }, '', `#s-${first}`); pushed = true; }
      sync();
      wake();
      hints();
      setTimeout(() => dlg.classList.add('is-ready'), 60);
    },
  };
}
