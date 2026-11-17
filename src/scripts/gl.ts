/**
 * Shared start-up for the WebGL scenes (caustics, surface, chain).
 *
 * Linking a shader program is the costliest moment of a scene. A plain `getProgramParameter(LINK_STATUS)`
 * makes the main thread wait for the GPU compiler (measured: up to ~460 ms on a cold cache), which froze
 * the hero while it was surfacing. With KHR_parallel_shader_compile (Chrome, Edge, Firefox) the compile runs
 * in the background and we only poll its non-blocking completion flag once per frame. Where the extension
 * is missing the link still blocks, but only after the page has painted and gone idle.
 */
export const frame = () => new Promise<number>((r) => requestAnimationFrame(r));

/** An idle slot, or `timeout` ms at the latest. */
export const idle = (timeout = 600) =>
  new Promise<void>((r) => ('requestIdleCallback' in window ? requestIdleCallback(() => r(), { timeout }) : setTimeout(r, 1)));

/** Resolves once `el` comes within `margin` of the viewport. */
export const near = (el: Element, margin: string) =>
  new Promise<void>((resolve) => {
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      io.disconnect();
      resolve();
    }, { rootMargin: margin });
    io.observe(el);
  });

/** After the page's own load (fonts, hero, first images) and an idle slot: for work nobody is waiting on yet. */
export const afterLoad = () =>
  new Promise<void>((r) => {
    const go = () => idle(1500).then(r);
    if (document.readyState === 'complete') go();
    else addEventListener('load', go, { once: true });
  });

export async function linkProgram(gl: WebGLRenderingContext, vs: string, fs: string): Promise<WebGLProgram | null> {
  const prog = gl.createProgram();
  if (!prog) return null;
  for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]] as const) {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    gl.attachShader(prog, s);
  }
  gl.linkProgram(prog);
  const par = gl.getExtension('KHR_parallel_shader_compile');
  if (par) while (!gl.isContextLost() && !gl.getProgramParameter(prog, par.COMPLETION_STATUS_KHR)) await frame();
  if (gl.isContextLost() || !gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  return prog;
}
