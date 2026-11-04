// Token reference page (Foundations/Tokens), in the style of zeroheight / Carbon / Polaris token pages.
// Everything is read live from tokens/tokens.css; tiers, JSON paths and types come from the same
// converter that writes dist/tokens.json, so the page, the CSS and the JSON never disagree.
import './token-docs.css';
import tokensRaw from '../tokens/tokens.css?raw';
import { tokensToJson } from '../scripts/tokens-json.mjs';
import { parseTokens } from './token-list.js';

/* ── Data ─────────────────────────────────────────────────────────────── */

const { json } = tokensToJson(tokensRaw);
const META = {};                                   // name → { path, type }
(function walk(node, path) {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) META[k] = { path: [...path, k].join('.'), type: v.$type || 'string' };
    else if (v && typeof v === 'object') walk(v, [...path, k]);
  }
})(json, []);

const RAW = {};
const GROUPS = parseTokens(tokensRaw).map((g) => {
  const [title, ...rest] = g.name.split(/\s+[·—]\s+/);
  g.tokens.forEach((t) => { RAW[t.name] = t.value; });
  return { ...g, title, sub: rest.join(' · ') };
});

const refOf = (v) => (v.match(/^var\((--[\w-]+)\)$/) || [])[1];
const resolve = (name, seen = new Set()) => {
  const r = refOf(RAW[name] || '');
  return r && !seen.has(r) ? resolve(r, seen.add(r)) : RAW[name];
};
const chain = (name) => { const c = []; let r = refOf(RAW[name] || ''); while (r && c.length < 6) { c.push(r); r = refOf(RAW[r] || ''); } return c; };

// Which category / tier a group belongs to
const CATEGORY = [
  [/^Palette/, 'color', 'primitive', 'Palette · '],
  [/^(Actions|Data|Surfaces|Brand)/, 'color', 'semantic'],
  [/^Typography/, 'type', 'primitive', 'Typography · '],
  [/^Spacing/, 'space', 'primitive'],
  [/^Radius/, 'radius', 'primitive'],
  [/^Border/, 'border', 'primitive'],
  [/^Elevation/, 'elevation', 'primitive'],
  [/^Icon/, 'icon', 'primitive'],
  [/^Motion/, 'motion', 'primitive'],
  [/^Layer/, 'layer', 'primitive'],
  [/^Layout/, 'layout', 'semantic'],
];
const CATEGORIES = [
  ['color', 'Color', 'The palette holds the raw colours. Components use the role tokens (Actions, Data, Surfaces, Brand & states), never the palette.'],
  ['type', 'Typography', 'Two families, five sizes, four weights. Combined into six text styles (see Typography).'],
  ['space', 'Spacing', 'Gaps and paddings. Only these values: never a raw number.'],
  ['radius', 'Radius', 'Square by default. Cards, chips, bars and the switch are the only rounded elements.'],
  ['border', 'Border', 'Line widths: dividers, outlines, focus ring.'],
  ['elevation', 'Elevation', 'Shadows for elements that float: menus, floating buttons, the switch thumb.'],
  ['icon', 'Icon', 'Icon sizes. Every icon is drawn on the same grid.'],
  ['motion', 'Motion', 'Durations. Animations are switched off when the user prefers reduced motion.'],
  ['layer', 'Layer', 'z-index: what sits on top of what.'],
  ['layout', 'Layout', 'Page structure and the colour of the current section.'],
  ['component', 'Components', 'Values that belong to one component. They point to a global token whenever one fits.'],
];
const TIERS = {
  primitive: ['Primitive', 'Raw values: the palette and the scales.'],
  semantic: ['Semantic', 'Say what a value is for: primary, text, canvas…'],
  component: ['Component', 'Used by one component only.'],
};

GROUPS.forEach((g) => {
  const c = CATEGORY.find(([re]) => re.test(g.name));
  g.cat = c ? c[1] : 'component';
  g.tier = c ? c[2] : 'component';
  g.label = c && c[3] ? g.name.replace(c[3], '').split(/\s+[·—]\s+/).join(' · ') : g.title;
  if (c && c[3]) g.sub = '';
});

export const TIER_COUNTS = Object.fromEntries(Object.keys(TIERS).map((t) => [t, GROUPS.filter((g) => g.tier === t).reduce((n, g) => n + g.tokens.length, 0)]));
export const TOTAL = Object.values(TIER_COUNTS).reduce((a, b) => a + b, 0);

/* ── Previews ─────────────────────────────────────────────────────────── */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const preview = (name, g) => {
  const v = `var(${name})`;
  const type = META[name.slice(2)]?.type;
  const n = name;
  if (type === 'color') return `<span class="td-pv td-pv--color"><i><b style="background:${v}"></b></i></span>`;
  if (type === 'shadow') return `<span class="td-pv"><i class="td-pv__tile" style="box-shadow:${v}"></i></span>`;
  if (type === 'fontFamily') return `<span class="td-pv td-pv--aa" style="font-family:${v}">Aa</span>`;
  if (type === 'fontWeight') return `<span class="td-pv td-pv--aa" style="font-weight:${v};font-family:var(${n.includes('bold') ? '--font-mono' : '--font-sans'})">Aa</span>`;
  if (/^--text-\d/.test(n)) return `<span class="td-pv td-pv--aa" style="font-size:${v}">Aa</span>`;
  if (/^--leading/.test(n)) return `<span class="td-pv td-pv--lead" style="line-height:${v}">Debe<br>Haber</span>`;
  if (n === '--ls-caps') return `<span class="td-pv td-pv--caps" style="letter-spacing:${v}">IVA</span>`;
  if (g.cat === 'radius' || /radius/.test(n)) return `<span class="td-pv"><i class="td-pv__corner" style="border-radius:${v}"></i></span>`;
  if (g.cat === 'border' || /-ring$|line-w$/.test(n)) return `<span class="td-pv"><i class="td-pv__line" style="height:${v}"></i></span>`;
  if (g.cat === 'icon' || /^--(check-size|dot-size|legend-swatch)/.test(n)) return `<span class="td-pv"><i class="td-pv__box" style="width:${v};height:${v}"></i></span>`;
  if (g.cat === 'motion') return `<span class="td-pv td-pv--motion"><i style="transition-duration:${v}"></i></span>`;
  if (g.cat === 'layer') return `<span class="td-pv td-pv--layer" aria-hidden="true"><i></i><i></i><i></i></span>`;
  if (/opacity|alpha/.test(n)) return `<span class="td-pv td-pv--color"><i><b style="background:var(--primary);opacity:${v}"></b></i></span>`;
  if (n === '--btn-hover') return `<span class="td-pv td-pv--color"><i><b style="background:var(--primary)"></b></i><i><b style="background:var(--primary);filter:${v}"></b></i></span>`;
  if (type === 'dimension') {
    const px = parseFloat(resolve(name));
    const vertical = /-h(-|$)|-h-sm$/.test(n);
    return `<span class="td-pv td-pv--dim"><i class="${vertical ? 'is-v' : ''}" style="${vertical ? 'height' : 'width'}:${v}"></i>${px > 120 ? '<b>›</b>' : ''}</span>`;
  }
  return '<span class="td-pv"></span>';
};

/* ── Rows ─────────────────────────────────────────────────────────────── */

const row = (t, g) => {
  const id = `td-${t.name.slice(2)}`;
  const c = chain(t.name);
  const final = resolve(t.name);
  const meta = META[t.name.slice(2)];
  const value = c.length
    ? `<span class="td-alias">${c.map((r) => `<a href="#td-${r.slice(2)}" class="td-chip" data-jump="td-${r.slice(2)}">${r}</a>`).join('<span class="td-arrow" aria-hidden="true">→</span>')}</span><code class="td-final">${esc(final)}</code>`
    : `<code>${esc(t.value)}</code>`;
  const q = [t.name, t.value, final, t.note, g.name, meta?.path, ...c].join(' ').toLowerCase();
  return `<div class="td-row" id="${id}" role="row" data-q="${esc(q)}">
    <div role="cell">${preview(t.name, g)}</div>
    <div role="cell" class="td-name"><button type="button" class="td-copy" data-copy="var(${t.name})" title="Click to copy var(${t.name})">${t.name}</button><small>${meta ? meta.path : ''}${meta && meta.type !== 'string' ? ` · ${meta.type}` : ''}</small></div>
    <div role="cell" class="td-value">${value}</div>
    <div role="cell" class="td-desc">${esc(t.note) || '<span class="td-none">—</span>'}</div>
  </div>`;
};

const group = (g) => `<section class="td-group" data-tier="${g.tier}">
  <header class="td-group__head"><h4>${g.label}</h4><span class="td-tier td-tier--${g.tier}">${TIERS[g.tier][0]}</span>${g.sub ? `<span class="td-group__sub">${esc(g.sub)}</span>` : ''}<span class="td-count">${g.tokens.length}</span></header>
  <div class="td-table" role="table" aria-label="${esc(g.label)} tokens">
    <div class="td-row td-row--head" role="row"><span role="columnheader">Preview</span><span role="columnheader">Token</span><span role="columnheader">Value</span><span role="columnheader">Description</span></div>
    ${g.tokens.map((t) => row(t, g)).join('')}
  </div>
</section>`;

/* ── Page ─────────────────────────────────────────────────────────────── */

export const tokenDocs = () => {
  const el = document.createElement('div');
  el.className = 'td';
  const cats = CATEGORIES.map(([key, title, intro]) => {
    const gs = GROUPS.filter((g) => g.cat === key);
    return { key, title, intro, gs, n: gs.reduce((a, g) => a + g.tokens.length, 0) };
  }).filter((c) => c.n);

  el.innerHTML = `
    <div class="td-bar">
      <div class="td-search"><label class="field__label" for="td-q">Search tokens</label><input class="input" id="td-q" type="search" placeholder="Name, value or use: primary, 8px, #0F62FE, btn…" autocomplete="off"></div>
      <div class="td-tiers" role="group" aria-label="Tier">
        <button type="button" class="td-pill is-selected" aria-pressed="true" data-tier="">All <span>${TOTAL}</span></button>
        ${Object.entries(TIERS).map(([k, [name]]) => `<button type="button" class="td-pill" aria-pressed="false" data-tier="${k}">${name} <span>${TIER_COUNTS[k]}</span></button>`).join('')}
      </div>
      <p class="td-status" role="status" aria-live="polite"></p>
    </div>
    <nav class="td-nav" aria-label="Token categories">${cats.map((c) => `<a href="#td-cat-${c.key}" data-jump="td-cat-${c.key}">${c.title}<span>${c.n}</span></a>`).join('')}</nav>
    ${cats.map((c) => `<section class="td-cat" id="td-cat-${c.key}" aria-labelledby="td-h-${c.key}">
      <h3 id="td-h-${c.key}">${c.title} <span class="td-count">${c.n}</span></h3>
      <p class="td-cat__intro">${c.intro}</p>
      ${c.gs.map(group).join('')}
    </section>`).join('')}
    <p class="td-empty" hidden>No token matches. Try a shorter word.</p>`;

  const q = el.querySelector('#td-q');
  const status = el.querySelector('.td-status');
  let tier = '';
  const apply = () => {
    const term = q.value.trim().toLowerCase();
    let shown = 0;
    el.querySelectorAll('.td-group').forEach((g) => {
      const tierOk = !tier || g.dataset.tier === tier;
      let any = 0;
      g.querySelectorAll('.td-row[data-q]').forEach((r) => { const ok = tierOk && (!term || r.dataset.q.includes(term)); r.hidden = !ok; any += ok; });
      g.hidden = !any; shown += any;
    });
    el.querySelectorAll('.td-cat').forEach((c) => { c.hidden = !c.querySelector('.td-group:not([hidden])'); });
    el.querySelectorAll('.td-nav a').forEach((a) => { a.hidden = el.querySelector(`#${a.dataset.jump}`).hidden; });
    el.querySelector('.td-empty').hidden = shown > 0;
    status.textContent = term || tier ? `${shown} of ${TOTAL} tokens` : '';
  };
  q.addEventListener('input', apply);
  el.querySelectorAll('.td-tiers button').forEach((b) => b.addEventListener('click', () => {
    tier = b.dataset.tier;
    el.querySelectorAll('.td-tiers button').forEach((x) => { const on = x === b; x.classList.toggle('is-selected', on); x.setAttribute('aria-pressed', on); });
    apply();
  }));

  el.addEventListener('click', async (e) => {
    const jump = e.target.closest('[data-jump]');
    if (jump) {
      e.preventDefault();
      const target = el.querySelector(`#${jump.dataset.jump}`);
      if (target?.hidden) { q.value = ''; tier = ''; el.querySelector('.td-tiers button').click(); }
      target?.scrollIntoView({ behavior: 'smooth', block: target.classList.contains('td-row') ? 'center' : 'start' });
      if (target?.classList.contains('td-row')) { target.classList.remove('is-flash'); void target.offsetWidth; target.classList.add('is-flash'); }
      return;
    }
    const copy = e.target.closest('[data-copy]');
    if (copy) {
      try { await navigator.clipboard.writeText(copy.dataset.copy); status.textContent = `Copied ${copy.dataset.copy}`; }
      catch { status.textContent = `Copy not allowed here: select ${copy.dataset.copy}`; }
      copy.classList.add('is-copied');
      setTimeout(() => copy.classList.remove('is-copied'), 1200);
    }
  });
  return el;
};

/* ── Tier diagram: how one value travels from the palette to a component ── */

export const tierDiagram = () => {
  const el = document.createElement('div');
  el.className = 'td-tiers-diagram';
  const step = (tier, name, value, use) => `<div class="td-step"><span class="td-tier td-tier--${tier}">${TIERS[tier][0]}</span>
      <div class="td-step__box"><i style="background:var(${name})"></i><div><code>${name}</code><small>${value}</small></div></div>
      <p>${use}</p></div>`;
  el.innerHTML = [
    step('primitive', '--blue', '#0F62FE', 'A raw colour of the palette. <b>Never</b> used in a component.'),
    step('semantic', '--primary', '→ --blue', 'Says what it is for: the main action. Used by buttons, tabs, links.'),
    step('component', '--chart-1', '→ --income → --blue', 'Belongs to one component: the income line of the chart.'),
  ].join('<span class="td-step__arrow" aria-hidden="true">→</span>');
  return el;
};
