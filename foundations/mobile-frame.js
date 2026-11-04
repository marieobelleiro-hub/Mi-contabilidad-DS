// Mobile view of a story, inside the docs: the same story is loaded in an <iframe> 390px wide,
// so the real mobile CSS (max-width:1023px) applies. Documentation helper, not part of the design system.
//
//   inFrame()                     → true when the story runs inside that iframe
//   mobileFrame(id, args, opts)   → the <iframe> (height follows its content, or a fixed phone height)
//   reportHeight(el)              → call in the inner story so the frame grows with the content

const PARAM = 'mcframe';
export const inFrame = () => new URLSearchParams(window.location.search).has(PARAM);
/** The args the parent page passed (any text: accents, dots, commas). Merge them over the story args in the inner render. */
export const frameArgs = () => { try { return JSON.parse(new URLSearchParams(window.location.search).get('mcargs') || '{}'); } catch { return {}; } };

const encodeArgs = (args) => Object.entries(args)
  .map(([k, v]) => `${k}:${typeof v === 'boolean' ? `!${v}` : String(v)}`).join(';');

let n = 0;
window.addEventListener('message', (e) => {
  const d = e.data;
  if (!d || d.mcFrame == null) return;
  const f = document.querySelector(`iframe[data-mcframe="${d.mcFrame}"]`);
  if (f && !f.dataset.fixed) f.style.height = `${Math.ceil(d.h)}px`;
});

/** storyId: e.g. 'app-components-card--facturacion' · args: the args to pass · height: fixed px (phone screen) */
export const mobileFrame = (storyId, args = {}, { height, background = 'var(--canvas)', bg = 'canvas' } = {}) => {
  const key = `${storyId}-${++n}`;
  const wrap = document.createElement('div');
  wrap.style.cssText = `display:flex;justify-content:center;padding:var(--space-24) 0;background:${background}`;
  const f = document.createElement('iframe');
  f.title = 'Mobile view (390px)';
  f.dataset.mcframe = key;
  if (height) f.dataset.fixed = '1';
  f.src = `iframe.html?id=${storyId}&viewMode=story&args=${encodeURIComponent(encodeArgs(args))}&globals=${encodeURIComponent(`backgrounds.value:${bg}`)}&mcargs=${encodeURIComponent(JSON.stringify(args))}&${PARAM}=${encodeURIComponent(key)}`;
  f.style.cssText = `width:390px;max-width:100%;height:${height || 400}px;border:0;box-shadow:0 0 0 var(--border-thin) var(--line-strong);background:var(--surface)`;
  wrap.append(f);
  return wrap;
};

/** In the inner story: the framed screen is a page of its own, so it gets a <main> and a hidden heading. */
export const frameRoot = (el, title = 'Ejemplo') => {
  if (!inFrame()) return el;
  const m = document.createElement('main');
  m.innerHTML = `<h1 class="sr-only">${title}</h1>`;
  m.append(el);
  return m;
};

/** In the inner story: tell the parent page how tall the content is. */
export const reportHeight = (el) => {
  if (!inFrame()) return el;
  el = frameRoot(el);
  const key = new URLSearchParams(window.location.search).get(PARAM);
  const send = () => window.parent.postMessage({ mcFrame: key, h: document.documentElement.scrollHeight }, '*');
  requestAnimationFrame(() => setTimeout(send, 50));
  window.addEventListener('resize', send);
  return el;
};

/** Desktop view: the story in a 1232px-wide iframe (real desktop CSS), scaled down to fit the docs column. */
export const desktopFrame = (storyId, args = {}, { width = 1232, height = 400, bg = 'canvas' } = {}) => {
  const key = `${storyId}-d${++n}`;
  const wrap = document.createElement('div');
  wrap.style.cssText = 'width:100%;overflow:hidden;box-shadow:0 0 0 var(--border-thin) var(--line-strong)';
  const f = document.createElement('iframe');
  f.title = `Desktop view (${width}px, scaled)`;
  f.dataset.mcframe = key; f.dataset.fixed = '1';
  f.src = `iframe.html?id=${storyId}&viewMode=story&args=${encodeURIComponent(encodeArgs(args))}&globals=${encodeURIComponent(`backgrounds.value:${bg}`)}&mcargs=${encodeURIComponent(JSON.stringify(args))}&${PARAM}=${encodeURIComponent(key)}`;
  f.style.cssText = `display:block;width:${width}px;height:${height}px;border:0;transform-origin:0 0`;
  wrap.append(f);
  const fit = () => { const s = Math.min(1, wrap.clientWidth / width) || 1; f.style.transform = `scale(${s})`; wrap.style.height = `${height * s}px`; };
  new ResizeObserver(fit).observe(wrap);
  requestAnimationFrame(fit);
  return wrap;
};
