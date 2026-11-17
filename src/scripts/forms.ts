/** Shared submit logic: JSON POST to the configured endpoint, or a pre-filled mailto fallback. */
export type FormMsgs = { sending: string; ok: string; err: string; mailto: string; required: string; invalidEmail: string };

export function validate(form: HTMLFormElement, msgs: FormMsgs, scope: ParentNode = form): boolean {
  let ok = true;
  scope.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[required]').forEach((el) => {
    const field = el.closest('.fld');
    const errEl = field?.querySelector<HTMLElement>('.fld__err');
    let msg = '';
    if (el instanceof HTMLInputElement && el.type === 'checkbox') { if (!el.checked) msg = msgs.required; }
    else if (!el.value.trim()) msg = msgs.required;
    else if (el instanceof HTMLInputElement && el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) msg = msgs.invalidEmail;
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (errEl) errEl.textContent = msg;
    if (msg && ok) { el.focus(); ok = false; }
  });
  return ok;
}

export async function send(data: Record<string, string>, endpoint: string, to: string, subject: string): Promise<'ok' | 'mailto' | 'err'> {
  if (endpoint) {
    try {
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...data, _subject: subject }) });
      return r.ok ? 'ok' : 'err';
    } catch { return 'err'; }
  }
  const body = Object.entries(data).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');
  location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return 'mailto';
}
