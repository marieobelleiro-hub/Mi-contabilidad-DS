// Token table for a sub-system (Asistente inteligente, later Acceso fácil): same look as Foundations/Tokens,
// read live from the sub-system's token file. References to the main tokens are shown as chips.
import '../../foundations/token-docs.css';
import mainRaw from '../../tokens/tokens.css?raw';

const parse = (raw) => {
  const groups = []; let g = null;
  for (const line of raw.split('\n')) {
    const h = line.match(/^\s*\/\*\s*──\s*(.+?)\s*──\s*\*\/\s*$/);
    if (h) { g = { name: h[1].replace(/^(Assistant|Acceso) · /, ''), tokens: [] }; groups.push(g); continue; }
    const m = line.match(/^\s*(--[\w-]+)\s*:\s*([^;]+);\s*(?:\/\*\s*(.*?)\s*\*\/)?/);
    if (m && g) g.tokens.push({ name: m[1], value: m[2].trim(), note: m[3] || '' });
  }
  return groups;
};
const MAIN = Object.fromEntries(parse(`/* ── x ── */\n${mainRaw}`).flatMap((g) => g.tokens).map((t) => [t.name, t.value]));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const isColor = (v) => /^(#|rgba?\()/i.test(v);

export const subTokenTable = (raw, { only } = {}) => {
  const ALL = Object.fromEntries(parse(raw).flatMap((g) => g.tokens).map((t) => [t.name, t.value]));
  const resolve = (v, n = 0) => { const r = (v.match(/^var\((--[\w-]+)\)$/) || [])[1]; return r && n < 6 ? resolve(ALL[r] ?? MAIN[r] ?? v, n + 1) : v; };
  const chain = (v) => { const c = []; let r = (v.match(/^var\((--[\w-]+)\)$/) || [])[1]; while (r && c.length < 6) { c.push(r); r = ((ALL[r] ?? MAIN[r] ?? '').match(/^var\((--[\w-]+)\)$/) || [])[1]; } return c; };
  const groups = parse(raw).filter((g) => !only || only.test(g.name));
  const el = document.createElement('div');
  el.className = 'td';
  el.innerHTML = groups.map((g) => `<section class="td-group">
    <header class="td-group__head"><h4>${g.name}</h4><span class="td-count">${g.tokens.length}</span></header>
    <div class="td-table" role="table" aria-label="${g.name} tokens">
      <div class="td-row td-row--head" role="row"><span role="columnheader">Preview</span><span role="columnheader">Token</span><span role="columnheader">Value</span><span role="columnheader">Description</span></div>
      ${g.tokens.map((t) => {
        const final = resolve(t.value); const c = chain(t.value);
        const pv = isColor(final) ? `<span class="td-pv td-pv--color"><i><b style="background:var(${t.name})"></b></i></span>`
          : /shadow/.test(t.name) ? `<span class="td-pv"><i class="td-pv__tile" style="box-shadow:var(${t.name})"></i></span>`
            : /px$/.test(final) ? `<span class="td-pv td-pv--dim"><i style="width:var(${t.name});max-width:112px"></i></span>` : '<span class="td-pv"></span>';
        const value = c.length ? `<span class="td-alias">${c.map((r) => `<span class="td-chip">${r}</span>`).join('<span class="td-arrow" aria-hidden="true">→</span>')}</span><code class="td-final">${esc(final)}</code>` : `<code>${esc(t.value)}</code>`;
        return `<div class="td-row" role="row"><div role="cell">${pv}</div><div role="cell" class="td-name"><b class="td-copy" style="cursor:text">${t.name}</b></div><div role="cell" class="td-value">${value}</div><div role="cell" class="td-desc">${esc(t.note) || '<span class="td-none">—</span>'}</div></div>`;
      }).join('')}
    </div></section>`).join('');
  return el;
};
