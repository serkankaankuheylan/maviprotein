/**
 * The flow line: a single thin line threaded through numbered discs.
 * It measures the discs, draws a path with rounded turns (so it snakes across
 * rows on desktop and runs straight down on mobile, mirrored automatically in RTL),
 * then draws itself as the container scrolls through the viewport, lighting each
 * disc as the line reaches it.
 */
export function mountFlowLines(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-flow]').forEach((box) => {
    const svg = box.querySelector<SVGSVGElement>('[data-flow-svg]');
    const nodes = [...box.querySelectorAll<HTMLElement>('[data-flow-node]')];
    if (!svg || nodes.length < 2) return;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const ghost = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    ghost.setAttribute('class', 'flow-ghost');
    path.setAttribute('class', 'flow-path');
    svg.append(ghost, path);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = parseFloat(box.dataset.flowStart ?? '0.85');
    const end = parseFloat(box.dataset.flowEnd ?? '0.35');
    let total = 0;
    let stops: number[] = [];

    const build = () => {
      const b = box.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
      svg.setAttribute('width', String(b.width));
      svg.setAttribute('height', String(b.height));
      const pts = nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return { x: r.left + r.width / 2 - b.left, y: r.top + r.height / 2 - b.top };
      });
      const R = 28;
      let d = `M${pts[0].x},${pts[0].y}`;
      // Orthogonal routing: horizontal runs, vertical drops between rows, rounded corners.
      const single = pts.every((q) => Math.abs(q.x - pts[0].x) < 4);
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], c = pts[i];
        if (single || Math.abs(a.y - c.y) < 4) { d += ` L${c.x},${c.y}`; continue; }
        // row change: run out past the outermost column, drop, come back
        const dir = a.x > b.width / 2 ? 1 : -1;
        const outX = dir > 0 ? b.width + 28 : -28;
        const sy = Math.sign(c.y - a.y);
        d += ` L${outX - dir * R},${a.y} Q${outX},${a.y} ${outX},${a.y + sy * R}`;
        d += ` L${outX},${c.y - sy * R} Q${outX},${c.y} ${outX - dir * R},${c.y} L${c.x},${c.y}`;
      }
      path.setAttribute('d', d);
      ghost.setAttribute('d', d);
      total = path.getTotalLength();
      // arc length at which each node is reached
      stops = [];
      let k = 0;
      const step = 4;
      for (let s = 0; s <= total && k < pts.length; s += step) {
        const p = path.getPointAtLength(s);
        if (Math.hypot(p.x - pts[k].x, p.y - pts[k].y) < step * 1.5) { stops.push(s); k++; }
      }
      while (stops.length < pts.length) stops.push(total);
      path.style.strokeDasharray = `${total} ${total}`;
      update();
    };
    const update = () => {
      const r = box.getBoundingClientRect();
      const vh = innerHeight;
      const p = reduce ? 1 : Math.min(1, Math.max(0, (vh * start - r.top) / (r.height + vh * (start - end) - vh * 0.0)));
      const len = total * p;
      path.style.strokeDashoffset = String(total - len);
      nodes.forEach((n, i) => n.classList.toggle('is-lit', len >= stops[i] - 2));
      box.style.setProperty('--flow', p.toFixed(3));
    };
    let raf = 0;
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); }, { passive: true });
    new ResizeObserver(() => build()).observe(box);
    document.fonts?.ready.then(build);
    build();
  });
}
