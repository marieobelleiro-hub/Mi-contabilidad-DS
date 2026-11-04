// List row stories — HTML + Vite
// The rows on their own (no card around them). Every example is a real case from the app;
// "Card view" links open the same rows inside their card on the Card page.
const ON_WHITE = { globals: { backgrounds: { value: 'white' } } };
const LBL = { paid: 'Cobrada', pending: 'Pendiente' };
const statusBtn = (s) => `<button type="button" class="status-btn" aria-label="${LBL[s]} — pulsa para cambiar"><span class="status status--${s}" aria-hidden="true"></span></button>`;
const box = (html, width = '540px') => `<div style="width:${width};max-width:100%">${html}</div>`;

/* ── Real data from the app ── */
const INVOICES = [['411', 'University', '30/09/2026', '4.826,00 €', 'pending'], ['412', 'Main client', '30/09/2026', '2.580,63 €', 'pending'],
  ['409', 'Main client', '15/09/2026', '3.892,45 €', 'paid'], ['410', 'University', '15/09/2026', '1.950,60 €', 'paid'],
  ['408', 'Main client', '15/08/2026', '2.580,63 €', 'paid'], ['407', 'University', '31/07/2026', '2.845,85 €', 'paid']];
const IVA_ROWS = [['c.01', 'Base imponible', '9.622,45 €'], ['c.03', 'IVA repercutido 21%', '2.020,71 €', 'accent']];
const IRPF_ROWS = [['c.05', '20% sobre rendimiento neto', '7.636,21 €'], ['c.07', 'Retenciones acumuladas 15%', '1.443,37 €', 'muted'], ['c.08', 'Pagos fraccionados anteriores', '3.508,86 €', 'muted']];
const DISTRIB = [['Seguridad Social', 52], ['Arrendamiento', 19], ['Servicios exteriores', 18], ['Luz/Tel', 4], ['Viajes', 3], ['Otros consumos', 2], ['Otros desgravables', 2], ['Otros suministros', 0], ['Manutención', 0], ['Otros gastos', 0]];
const RESULT_LABEL = { pay: 'A ingresar este trimestre', credit: 'A compensar próximo trimestre', none: 'Sin actividad con IVA' };

/** Record rows: number · name · date · amount · status */
export const recordListHTML = ({ size = 'sm', density = 'compact', rows = INVOICES, status = true } = {}) =>
  `<ul class="list${size === 'sm' ? ' list--sm' : ''}${density === 'compact' ? ' list--compact' : ''}">
    ${rows.map(([n, c, d, a, s]) => `<li class="row">
      <span class="row__lead">${n}</span><span class="row__title">${c}</span>
      <span class="row__meta">${d}</span><span class="row__value row__value--strong">${a}</span>
      ${status ? `<span class="row__trail">${statusBtn(s)}</span>` : ''}
    </li>`).join('')}
  </ul>`;

/** Label → value rows (tax forms): code chip · label · amount */
export const kvListHTML = ({ size = 'md', density = 'regular', accent = 'attention', rows = IVA_ROWS, chip = true } = {}) =>
  `<dl class="list${size === 'sm' ? ' list--sm' : ''}${density === 'compact' ? ' list--compact' : ''} list--${accent}">
    ${rows.map(([code, label, value, kind]) => `<div class="row row--kv">
      <dt class="row__label">${chip && code ? `<span class="chip chip--code">${code}</span>` : ''}${label}</dt>
      <dd class="row__value${kind ? ` row__value--${kind}` : ''}">${value}</dd>
    </div>`).join('')}
  </dl>`;

/** Bar rows: label · bar · % */
export const barListHTML = ({ accent = 'attention', rows = DISTRIB } = {}) =>
  `<dl class="list list--sm list--bars list--${accent}">
    ${rows.map(([l, p]) => `<div class="row row--bar">
      <dt class="row__label">${l}</dt>
      <dd class="row__bar-cell"><span class="row__bar" aria-hidden="true"><span style="width:${p}%"></span></span><span class="row__value">${p}%</span></dd>
    </div>`).join('')}
  </dl>`;

/** Result row (the .result bar): states pay · credit · none · subtotal (sm) · annual footer */
export const resultHTML = ({ state = 'pay', size = 'md', footer = false, accent = 'attention', label, value = '1.778,23 €', live = true } = {}) => {
  const cls = ['result'];
  if (footer) cls.push('result--footer', `result--${accent}`);
  else cls.push(`result--${state}`);
  if (size === 'sm') cls.push('result--sm');
  return `<div class="${cls.join(' ')}"${live ? ' role="status"' : ''}><p class="result__label">${label ?? RESULT_LABEL[state]}</p><p class="result__value">${value}</p></div>`;
};

/** Toggle the status dots in a preview */
const live = (html) => {
  const el = document.createElement('div');
  el.innerHTML = html;
  el.querySelectorAll('.status-btn').forEach((b) => b.addEventListener('click', () => {
    const d = b.querySelector('.status'); const paid = d.classList.toggle('status--paid'); d.classList.toggle('status--pending', !paid);
    b.setAttribute('aria-label', `${paid ? 'Cobrada' : 'Pendiente'} — pulsa para cambiar`);
  }));
  return el.firstElementChild;
};

export default {
  title: 'App/Components/List row',
  tags: ['!autodocs'],   // documented in List.mdx
  excludeStories: ['recordListHTML', 'kvListHTML', 'barListHTML', 'resultHTML'],
  ...ON_WHITE,
  parameters: { layout: 'padded' },
};

export const Playground = {
  name: 'Playground',
  render: ({ kind, accent, size, density, state }) => {
    if (kind === 'record') return live(box(recordListHTML({ size, density })));
    if (kind === 'kv') return box(kvListHTML({ size, density, accent, rows: accent === 'primary' ? IRPF_ROWS : IVA_ROWS }), '720px');
    if (kind === 'bar') return box(barListHTML({ accent }));
    return box(resultHTML({ state, size: state === 'subtotal' ? 'sm' : 'md', label: state === 'subtotal' ? 'IVA repercutido − IVA soportado' : undefined, value: state === 'subtotal' ? '1.930,03 €' : state === 'none' ? '0,00 €' : state === 'credit' ? '151,80 €' : '1.778,23 €' }), '720px');
  },
  argTypes: {
    kind: { name: 'Kind', control: { type: 'inline-radio', labels: { record: 'Record', kv: 'Label → value', bar: 'Bar', result: 'Result' } }, options: ['record', 'kv', 'bar', 'result'] },
    accent: { name: 'Colour', control: { type: 'inline-radio', labels: { primary: 'Blue (IRPF)', attention: 'Orange (IVA, Gastos)' } }, options: ['primary', 'attention'], if: { arg: 'kind', neq: 'record' } },
    size: { name: 'Text size', control: { type: 'inline-radio', labels: { sm: '12 (dashboard)', md: '14 (forms)' } }, options: ['sm', 'md'], if: { arg: 'kind', neq: 'result' } },
    density: { name: 'Density', control: { type: 'inline-radio', labels: { compact: 'Compact 8px', regular: 'Regular 12px' } }, options: ['compact', 'regular'], if: { arg: 'kind', neq: 'result' } },
    state: { name: 'Result', control: { type: 'select', labels: { pay: 'A ingresar (orange)', credit: 'A compensar (green tint)', none: 'Sin actividad (grey)', subtotal: 'Subtotal' } }, options: ['pay', 'credit', 'none', 'subtotal'], if: { arg: 'kind', eq: 'result' } },
  },
  args: { kind: 'record', accent: 'attention', size: 'sm', density: 'compact', state: 'pay' },
};

export const Records = {
  name: 'Record · Últimas facturas',
  parameters: { controls: { disable: true } },
  render: () => live(box(recordListHTML({}))),
};

export const KeyValue = {
  name: 'Label → value · Tax form',
  parameters: { controls: { disable: true } },
  render: () => `<div style="display:flex;flex-direction:column;gap:var(--space-32);width:720px;max-width:100%">
    ${kvListHTML({ accent: 'attention', rows: IVA_ROWS })}
    ${kvListHTML({ accent: 'primary', rows: IRPF_ROWS })}
  </div>`,
};

export const Bars = {
  name: 'Bar · Distribución del gasto',
  parameters: { controls: { disable: true } },
  render: () => box(barListHTML({})),
};

export const Results = {
  name: 'Result · States',
  parameters: { controls: { disable: true } },
  render: () => `<div style="display:flex;flex-direction:column;gap:var(--space-16);width:720px;max-width:100%">
    ${resultHTML({ state: 'pay', value: '1.778,23 €', live: false })}
    ${resultHTML({ state: 'credit', value: '151,80 €', live: false })}
    ${resultHTML({ state: 'none', value: '0,00 €', live: false })}
    ${resultHTML({ state: 'none', size: 'sm', label: 'IVA repercutido − IVA soportado', value: '1.930,03 €', live: false })}
  </div>`,
};

export const Footers = {
  name: 'Result · Annual footer',
  parameters: { controls: { disable: true } },
  render: () => `<div style="display:flex;flex-direction:column;gap:var(--space-24);width:720px;max-width:100%">
    ${resultHTML({ footer: true, accent: 'attention', label: 'Resultado anual → Mod. 390', value: '1.930,03 €', live: false })}
    ${resultHTML({ footer: true, accent: 'primary', label: 'Pagado a cuenta → Mod. 100', value: '3.508,86 €', live: false })}
  </div>`,
};

export const Mobile = {
  name: 'Mobile',
  parameters: { controls: { disable: true } },
  globals: { ...ON_WHITE.globals, viewport: { value: 'mobile' } },
  render: () => live(`<div style="display:flex;flex-direction:column;gap:var(--space-24)">
    ${recordListHTML({ size: 'md', rows: INVOICES.slice(0, 3) })}
    ${kvListHTML({ rows: IVA_ROWS })}
    ${resultHTML({ state: 'pay', live: false })}
  </div>`),
};
