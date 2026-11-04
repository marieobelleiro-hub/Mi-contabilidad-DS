// Token list, read live from tokens.css: used by Foundations/Tokens and by the Showcase.
import './token-list.css';
import tokensRaw from '../tokens/tokens.css?raw';

export const parseTokens = (css) => {
  const groups = [];
  let group = null;
  css.split('\n').forEach((line) => {
    const head = line.match(/^\s*\/\*\s*(?:──\s*)?(.+?)(?:\s*──)?\s*\*\/\s*$/);
    if (head && !line.includes('--') && !/^[═]/.test(head[1])) { group = { name: head[1], tokens: [] }; groups.push(group); return; }
    for (const m of line.matchAll(/(--[\w-]+)\s*:\s*([^;]+);\s*(?:\/\*\s*(.*?)\s*\*\/)?/g)) {
      if (!group) { group = { name: 'Tokens', tokens: [] }; groups.push(group); }
      group.tokens.push({ name: m[1], value: m[2].trim(), note: m[3] || '' });
    }
  });
  return groups.filter((g) => g.tokens.length);
};
export const TOKEN_GROUPS = parseTokens(tokensRaw);
export const TOKEN_COUNT = TOKEN_GROUPS.reduce((n, g) => n + g.tokens.length, 0);
const isColor = (v) => /^(#|rgb|hsl)/i.test(v.trim());

/** Filterable, collapsible list of every token. `open` = how many groups start open. */
export const tokenList = ({ open = 4, id = 'tl' } = {}) => {
  const el = document.createElement('div');
  el.className = 'tl';
  el.innerHTML = `
    <div class="tl__filter"><label class="field__label" for="${id}-q">Filter</label><input class="input" id="${id}-q" placeholder="e.g. primary, space, btn…" autocomplete="off"><span class="tl__count" id="${id}-n">${TOKEN_COUNT} tokens</span></div>
    ${TOKEN_GROUPS.map((g, gi) => `<details class="tl__group"${gi < open ? ' open' : ''}><summary><h4>${g.name}</h4><span class="tl__count">${g.tokens.length}</span></summary>${g.tokens.map((t) => `
      <div class="tl__tok" data-q="${(t.name + ' ' + t.value + ' ' + t.note + ' ' + g.name).toLowerCase()}">
        <i data-swatch="${t.name}"></i><b>${t.name}</b><code>${t.value}</code><em>${t.note}</em>
      </div>`).join('')}</details>`).join('')}`;
  // Colour swatches for tokens that resolve to a colour
  requestAnimationFrame(() => {
    const cs = getComputedStyle(document.documentElement);
    el.querySelectorAll('[data-swatch]').forEach((i) => {
      const v = cs.getPropertyValue(i.dataset.swatch).trim();
      if (isColor(v)) i.style.background = v; else i.style.boxShadow = 'none';
    });
  });
  const q = el.querySelector('input'); const n = el.querySelector(`#${id}-n`);
  q.addEventListener('input', () => {
    const term = q.value.trim().toLowerCase(); let shown = 0;
    el.querySelectorAll('.tl__tok').forEach((r) => { const ok = !term || r.dataset.q.includes(term); r.hidden = !ok; shown += ok; });
    el.querySelectorAll('.tl__group').forEach((g, gi) => {
      const has = !!g.querySelector('.tl__tok:not([hidden])');
      g.hidden = !has; g.open = term ? has : gi < open;
    });
    n.textContent = `${shown} of ${TOKEN_COUNT} tokens`;
  });
  return el;
};
