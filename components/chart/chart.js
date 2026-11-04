/* ==========================================================================
   Mi Contabilidad · chart.js
   Small SVG chart helpers that follow the design-system specs.
     lineChart(el, { labels, series:[{ name, color, values, area }], title, money })
     barChart (el, { labels, series:[{ name, color, values }], title, money })
   - Colours are CSS variables (var(--chart-1) …), never hex.
   - Hover AND keyboard (← →) show one tooltip with every series at that point.
   - A "Ver datos en tabla" view is always included.
   - Names and labels are inserted with textContent (never innerHTML).
   ========================================================================== */
const NS = 'http://www.w3.org/2000/svg';
const PAD = { t: 16, r: 16, b: 32, l: 48 };

const svgEl = (tag, attrs = {}, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const h = (tag, cls, parent, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
};
export const formatEuro = (n) => {
  const [i, d] = Math.abs(n).toFixed(2).split('.');
  return `${n < 0 ? '−' : ''}${i.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${d} €`;
};
const compact = (v) => (v >= 1000 ? `${String(+(v / 1000).toFixed(1)).replace('.', ',')}k` : `${Math.round(v)}`);
/** Top of the axis so that the 4 tick steps are round numbers (1 · 1,5 · 2 · 2,5 · 3 · 4 · 5 · 6 · 8 × 10ⁿ). */
const niceMax = (v) => {
  const raw = Math.max(v, 1000) / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].map((f) => f * mag).find((x) => x >= raw);
  return step * 4;
};

function frame(el, { labels, series, title }, kind) {
  el.classList.add('chart');
  el.innerHTML = '';
  const plot = svgEl('svg', { class: 'chart__plot', role: 'img', tabindex: '0' });
  plot.setAttribute('aria-label', `${title}. Usa ← → para ver cada mes.`);
  el.appendChild(plot);
  const tip = h('div', 'tooltip tooltip--dark', el);
  tip.setAttribute('role', 'status');
  tip.hidden = true;

  // Legend (always, for 2+ series)
  if (series.length > 1) {
    const ul = h('ul', 'chart__legend', el);
    series.forEach((s) => {
      const li = h('li', '', ul);
      const k = h('span', `chart__key chart__key--${kind === 'bar' ? 'bar' : 'line'}`, li);
      k.style.background = s.color;
      li.appendChild(document.createTextNode(s.name));
    });
  }
  // Table view
  const det = h('details', 'chart__table', el);
  h('summary', '', det, 'Ver datos en tabla');
  const wrap = h('div', 'table-wrap', det);
  const t = h('table', 'table', wrap);
  const tr = h('tr', '', h('thead', '', t));
  h('th', '', tr, 'Mes').scope = 'col';
  series.forEach((s) => { const th = h('th', 'is-num', tr, s.name); th.scope = 'col'; });
  const tb = h('tbody', '', t);
  labels.forEach((l, i) => {
    const r = h('tr', '', tb);
    h('td', '', r, l);
    series.forEach((s) => h('td', 'is-num', r, formatEuro(s.values[i])));
  });
  return { plot, tip };
}

function axes(plot, W, H, max) {
  const cH = H - PAD.t - PAD.b;
  const g = svgEl('g', {}, plot);
  for (let i = 0; i <= 4; i++) {
    const y = PAD.t + cH * (1 - i / 4);
    svgEl('line', { class: 'chart__grid', x1: PAD.l, x2: W - PAD.r, y1: y, y2: y }, g);
    svgEl('text', { class: 'chart__tick', x: PAD.l - 8, y: y + 3.5, 'text-anchor': 'end' }, g).textContent = compact((max * i) / 4);
  }
}

function tooltip(tip, el, label, series, i, x, y) {
  tip.replaceChildren();
  h('b', '', tip, label);
  series.forEach((s) => {
    tip.appendChild(document.createElement('br'));
    const k = h('span', 'tooltip__key', tip); k.style.background = s.color;
    tip.appendChild(document.createTextNode(`${s.name}  `));
    h('b', '', tip, formatEuro(s.values[i]));
  });
  tip.hidden = false;
  const box = el.getBoundingClientRect();
  const left = x + 12 + tip.offsetWidth > box.width ? x - tip.offsetWidth - 12 : x + 12;
  tip.style.transform = `translate(${left}px, ${Math.max(0, y - 12)}px)`;
}

/** Attached once per chart; `api()` returns the handlers of the latest draw. */
function interact(plot, tip, labels, api) {
  let idx = -1;
  const show = (i) => { idx = i; api().onIndex(i); };
  const hide = () => { idx = -1; api().onIndex(-1); tip.hidden = true; };
  plot.addEventListener('pointermove', (e) => {
    const r = plot.getBoundingClientRect();
    show(api().xAt(e.clientX - r.left));
  });
  plot.addEventListener('pointerleave', hide);
  plot.addEventListener('blur', hide);
  plot.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(Math.min(labels.length - 1, idx + 1)); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(Math.max(0, idx < 0 ? labels.length - 1 : idx - 1)); }
    if (e.key === 'Escape') hide();
  });
}

/** Smooth line through points (Catmull-Rom → Bézier). The control points stay between the two points
 *  of each segment, so the curve never overshoots (it never dips below 0 or above a peak). */
const smooth = (pts) => pts.reduce((d, p, i) => {
  if (!i) return `M${p[0]},${p[1]}`;
  const p0 = pts[Math.max(i - 2, 0)], p1 = pts[i - 1], p3 = pts[Math.min(i + 1, pts.length - 1)];
  const lo = Math.min(p1[1], p[1]), hi = Math.max(p1[1], p[1]);
  const clamp = (v) => Math.min(hi, Math.max(lo, v));
  const c1 = [p1[0] + (p[0] - p0[0]) / 6, clamp(p1[1] + (p[1] - p0[1]) / 6)];
  const c2 = [p[0] - (p3[0] - p1[0]) / 6, clamp(p[1] - (p3[1] - p1[1]) / 6)];
  return `${d} C${c1},${c2},${p}`;
}, '');

export function lineChart(el, cfg) {
  const { labels, series } = cfg;
  const { plot, tip } = frame(el, cfg, 'line');
  const draw = () => {
    plot.replaceChildren();
    const W = plot.clientWidth || 480; const H = plot.clientHeight || 192;
    const cW = W - PAD.l - PAD.r; const cH = H - PAD.t - PAD.b;
    const max = niceMax(Math.max(...series.flatMap((s) => s.values)));
    const x = (i) => PAD.l + (i * cW) / (labels.length - 1);
    const y = (v) => PAD.t + cH - (v / max) * cH;
    plot.setAttribute('viewBox', `0 0 ${W} ${H}`);
    axes(plot, W, H, max);
    series.forEach((s) => {
      const pts = s.values.map((v, i) => [x(i), y(v)]);
      if (s.area !== false) svgEl('path', { class: 'chart__area', d: `${smooth(pts)} L${x(labels.length - 1)},${PAD.t + cH} L${x(0)},${PAD.t + cH} Z`, fill: s.color }, plot);
    });
    series.forEach((s) => svgEl('path', { class: 'chart__line', d: smooth(s.values.map((v, i) => [x(i), y(v)])), stroke: s.color }, plot));
    labels.forEach((l, i) => { svgEl('text', { class: 'chart__tick', x: x(i), y: H - 10, 'text-anchor': 'middle' }, plot).textContent = l; });
    const cross = svgEl('line', { class: 'chart__cross', y1: PAD.t, y2: PAD.t + cH, visibility: 'hidden' }, plot);
    const dots = series.map((s) => svgEl('circle', { class: 'chart__dot', r: 4, fill: s.color, visibility: 'hidden' }, plot));
    current = {
      xAt: (px) => Math.max(0, Math.min(labels.length - 1, Math.round(((px * (W / plot.getBoundingClientRect().width)) - PAD.l) / (cW / (labels.length - 1))))),
      onIndex: (i) => {
        const vis = i < 0 ? 'hidden' : 'visible';
        cross.setAttribute('visibility', vis); dots.forEach((d) => d.setAttribute('visibility', vis));
        if (i < 0) return;
        const scale = plot.getBoundingClientRect().width / W;
        cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i));
        dots.forEach((d, k) => { d.setAttribute('cx', x(i)); d.setAttribute('cy', y(series[k].values[i])); });
        tooltip(tip, el, labels[i], series, i, x(i) * scale, y(Math.max(...series.map((s) => s.values[i]))) * scale);
      } };
  };
  let current = { xAt: () => 0, onIndex: () => {} };
  interact(plot, tip, labels, () => current);
  draw();
  if (el.__ro) el.__ro.disconnect();          // redraws replace the chart: drop the old observer
  el.__ro = new ResizeObserver(draw);
  el.__ro.observe(plot);
}

export function barChart(el, cfg) {
  const { labels, series } = cfg;
  const { plot, tip } = frame(el, cfg, 'bar');
  const draw = () => {
    plot.replaceChildren();
    const W = plot.clientWidth || 480; const H = plot.clientHeight || 192;
    const cW = W - PAD.l - PAD.r; const cH = H - PAD.t - PAD.b;
    const max = niceMax(Math.max(...series.flatMap((s) => s.values)));
    const group = cW / labels.length;
    const GAP = 2; const barW = Math.min(24, (group * 0.6 - GAP) / series.length);
    const y = (v) => PAD.t + cH - (v / max) * cH;
    plot.setAttribute('viewBox', `0 0 ${W} ${H}`);
    axes(plot, W, H, max);
    const bars = labels.map((l, i) => {
      const gx = PAD.l + i * group + group / 2 - (series.length * barW + (series.length - 1) * GAP) / 2;
      const g = svgEl('g', {}, plot);
      series.forEach((s, k) => {
        const v = s.values[i]; const top = y(v); const bh = Math.max(PAD.t + cH - top, 1); const r = Math.min(4, bh, barW / 2);
        const bx = gx + k * (barW + GAP);
        // 4px rounded data-end, square at the baseline
        svgEl('path', { class: 'chart__bar', fill: s.color,
          d: `M${bx},${PAD.t + cH} V${top + r} Q${bx},${top} ${bx + r},${top} H${bx + barW - r} Q${bx + barW},${top} ${bx + barW},${top + r} V${PAD.t + cH} Z` }, g);
      });
      svgEl('text', { class: 'chart__tick', x: PAD.l + i * group + group / 2, y: H - 10, 'text-anchor': 'middle' }, plot).textContent = l;
      return g;
    });
    current = {
      xAt: (px) => Math.max(0, Math.min(labels.length - 1, Math.floor(((px * (W / plot.getBoundingClientRect().width)) - PAD.l) / group))),
      onIndex: (i) => {
        plot.classList.toggle('is-hovering', i >= 0);
        bars.forEach((g, k) => g.querySelectorAll('.chart__bar').forEach((b) => b.classList.toggle('is-active', k === i)));
        if (i < 0) return;
        const scale = plot.getBoundingClientRect().width / W;
        tooltip(tip, el, labels[i], series, i, (PAD.l + i * group + group / 2) * scale, y(Math.max(...series.map((s) => s.values[i]))) * scale);
      } };
  };
  let current = { xAt: () => 0, onIndex: () => {} };
  interact(plot, tip, labels, () => current);
  draw();
  if (el.__ro) el.__ro.disconnect();          // redraws replace the chart: drop the old observer
  el.__ro = new ResizeObserver(draw);
  el.__ro.observe(plot);
}
