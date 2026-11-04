// Card stories — HTML + Vite
import { icon } from '../../icons/icons.js';
import { inFrame, mobileFrame, reportHeight } from '../../foundations/mobile-frame.js';
const INFO = `<button type="button" class="btn btn--icon btn--sm btn--info" aria-label="Más información">${icon('info')}</button>`;
const ON_CANVAS = { globals: { backgrounds: { value: 'canvas' } } };

/** KPI card: label · amount · optional sub. Colours: 'black' | 'primary' (blue) | 'attention' (orange). */
export const kpiCardHTML = ({ label = 'Total facturado', labelColor = 'black', amount = '50.790,36 €', amountColor = 'black',
  showSub = true, sub = 'Base imponible', info = false, interactive = false, state = 'default', width = '' } = {}) => {
  const cls = ['card', 'card--kpi', `card--${amountColor === 'attention' ? 'attention' : 'primary'}`];   // accent = selected outline
  if (interactive) cls.push('card--interactive');
  if (state === 'selected') cls.push('is-selected');
  if (state === 'disabled') cls.push('is-disabled');
  if (interactive && (state === 'hover' || state === 'focus')) cls.push(`is-${state}`);
  const tag = interactive ? 'a' : 'div';
  const attrs = [interactive ? ' href="#"' : '', state === 'selected' ? ' aria-current="true"' : '', state === 'disabled' ? ' aria-disabled="true"' : '', width ? ` style="width:${width}"` : ''].join('');
  const lbl = `<h2 class="card__label${labelColor !== 'black' ? ` card__label--${labelColor}` : ''}">${label}</h2>`;
  const top = info && !interactive ? `<div class="card__header">${lbl}${INFO}</div>` : lbl;
  return `<${tag} class="${cls.join(' ')}"${attrs}>
  ${top}
  <p class="card__amount${amountColor !== 'black' ? ` card__amount--${amountColor}` : ''}">${amount}</p>${showSub ? `
  <p class="card__sub">${sub}</p>` : ''}
</${tag}>`;
};

const COLOR = (name, description) => ({ name, control: { type: 'inline-radio', labels: { black: 'Black', primary: 'Blue', attention: 'Orange' } }, options: ['black', 'primary', 'attention'], description, table: { category: 'Variant' } });

export default {
  title: 'App/Components/Card',
  tags: ['!autodocs'],   // documented in Card.mdx
  excludeStories: ['kpiCardHTML'],
  ...ON_CANVAS,
};

export const KpiCard = {
  name: 'KPI card',
  render: (a) => kpiCardHTML({ ...a, width: '320px' }),
  argTypes: {
    labelColor: COLOR('Label colour', 'Black in the sections · blue (income) or orange (payments) on the dashboard'),
    amountColor: COLOR('Amount colour', 'Black on the dashboard · the section colour in the sections · orange for pending amounts'),
    state: { name: 'State', control: 'select', options: ['default', 'hover', 'focus', 'selected', 'disabled'], description: 'Hover and focus: interactive cards only · selected / disabled: periods (IRPF)', table: { category: 'Variant' } },
    interactive: { name: 'Interactive', control: 'boolean', description: 'The whole card is a link to its page (dashboard): hover shadow', table: { category: 'Boolean' } },
    showSub: { name: 'Subtitle', control: 'boolean', table: { category: 'Boolean' } },
    info: { name: 'Info button', control: 'boolean', description: 'ⓘ next to the label (not on interactive cards: a button can\'t sit inside a link)', if: { arg: 'interactive', truthy: false }, table: { category: 'Boolean' } },
    label: { name: 'Label', control: 'text', table: { category: 'Text' } },
    amount: { name: 'Amount', control: 'text', table: { category: 'Text' } },
    sub: { name: 'Subtitle text', control: 'text', if: { arg: 'showSub' }, table: { category: 'Text' } },
    width: { table: { disable: true } },
  },
  args: { labelColor: 'black', amountColor: 'primary', state: 'default', interactive: false, showSub: true, info: false, label: 'Total facturado', amount: '50.790,36 €', sub: 'Base imponible' },
};

/* Docs only: every state */
export const KpiStates = {
  name: 'KPI card · States',
  tags: ['!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => {
    const head = 'font-family:var(--font-mono);font-size:var(--text-10);text-transform:uppercase;letter-spacing:var(--ls-caps);color:var(--text-muted)';
    const DASH = { label: 'IVA a pagar', labelColor: 'attention', amount: '1.778,23 €', amountColor: 'black' };
    const cells = [
      ['Default', {}],
      ['Hover · interactive', { state: 'hover', interactive: true, ...DASH }], ['Focus · interactive', { state: 'focus', interactive: true, ...DASH }],
      ['Selected', { state: 'selected' }], ['Disabled', { state: 'disabled' }],
    ];
    return `<div style="display:grid;grid-template-columns:repeat(5,minmax(180px,1fr));gap:var(--space-12) var(--space-16);max-width:1108px">
      ${cells.map(([n]) => `<span style="${head}">${n}</span>`).join('')}
      ${cells.map(([, o]) => kpiCardHTML({ label: 'IRPF acumulado (3T)', amount: '3.508,86 €', amountColor: 'primary', showSub: false, ...o })).join('')}
    </div>`;
  },
};

/* ── In the app ── */
const grid4 = (cards) => `<div class="card-grid card-grid--4" style="max-width:1108px">${cards.map(kpiCardHTML).join('')}</div>`;

/** View control: the same composition on desktop or on mobile (390px frame, real mobile CSS). One component, fully responsive. */
const VIEW = {
  argTypes: { view: { name: 'View', control: { type: 'inline-radio', labels: { desktop: 'Desktop', mobile: 'Mobile (390px)' } }, options: ['desktop', 'mobile'] } },
  args: { view: 'desktop' },
};
const responsive = (storyId, draw) => ({ view }) => {
  if (inFrame()) { const el = document.createElement('div'); el.innerHTML = draw(); return reportHeight(el); }
  if (view === 'mobile') return mobileFrame(storyId, { view: 'desktop' });
  return draw();
};

export const Dashboard = {
  name: 'Dashboard',
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => `<div class="card-grid card-grid--2" style="max-width:1108px">
    ${kpiCardHTML({ label: 'Salario neto del mes', labelColor: 'primary', amount: '5.221,69 €', sub: 'En base al beneficio neto del mes anterior', info: true })}
    ${kpiCardHTML({ label: 'IVA a pagar', labelColor: 'attention', amount: '1.778,23 €', sub: '3T · Jul–Sep · vence 20 de octubre', interactive: true })}
    ${kpiCardHTML({ label: 'Previsión de ahorro mensual', labelColor: 'primary', amount: '626,60 €', sub: 'Estimación del 12 % del salario neto mensual' })}
    ${kpiCardHTML({ label: 'IRPF a pagar', labelColor: 'attention', amount: '2.683,99 €', sub: '3T · Jul–Sep · vence 20 de octubre', interactive: true })}
  </div>`,
};

export const Facturacion = {
  name: 'Facturación',
  parameters: { layout: 'padded' },
  ...VIEW,
  render: responsive('app-components-card--facturacion', () => grid4([
    { label: 'Total facturado', amount: '50.790,36 €', amountColor: 'primary', sub: 'Base imponible' },
    { label: 'Cobrado', amount: '43.383,73 €', amountColor: 'primary', sub: '11 facturas' },
    { label: 'Pendiente de cobro', amount: '7.406,63 €', amountColor: 'attention', sub: '2 facturas' },
    { label: 'IRPF retenido', amount: '1.443,37 €', amountColor: 'primary', sub: '15% retención' },
  ]),)
};

export const Gastos = {
  name: 'Gastos',
  parameters: { layout: 'padded' },
  ...VIEW,
  render: responsive('app-components-card--gastos', () => grid4([
    { label: 'Total gastos', amount: '12.609,29 €', amountColor: 'attention', sub: 'Base imponible' },
    { label: 'IVA soportado', amount: '515,66 €', amountColor: 'attention', sub: 'Total' },
    { label: 'IVA incluido 303', amount: '90,69 €', amountColor: 'attention', sub: 'Checkboxes activos' },
    { label: 'Total gastado', amount: '13.124,95 €', amountColor: 'attention', sub: 'Base + IVA' },
  ]),)
};

export const IrpfPeriods = {
  name: 'IRPF · Periods',
  parameters: { layout: 'padded' },
  ...VIEW,
  render: responsive('app-components-card--irpf-periods', () => grid4([
    { label: 'IRPF abonado (1T)', amount: '1.367,23 €', amountColor: 'primary', showSub: false, state: 'disabled' },
    { label: 'IRPF acumulado (2T)', amount: '3.508,86 €', amountColor: 'primary', showSub: false, state: 'disabled' },
    { label: 'IRPF acumulado (3T)', amount: '3.508,86 €', amountColor: 'primary', showSub: false, state: 'selected' },
    { label: 'IRPF acumulado (4T)', amount: '— €', amountColor: 'primary', showSub: false, state: 'disabled' },
  ]),)
};

export const Panel = {
  name: 'Container · Header & list',
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => {
    const rows = [['411', 'University', '30/09/2026', '4.826,00 €', 'pending'], ['412', 'Main client', '30/09/2026', '2.580,63 €', 'pending'], ['409', 'Main client', '15/09/2026', '3.892,45 €', 'paid'], ['410', 'University', '15/09/2026', '1.950,60 €', 'paid'], ['408', 'Main client', '15/08/2026', '2.580,63 €', 'paid'], ['407', 'University', '31/07/2026', '2.845,85 €', 'paid']];
    const lbl = { paid: 'Cobrada', pending: 'Pendiente' };
    return `<section class="card" style="max-width:540px" aria-labelledby="p-title">
      <div class="card__header"><h2 class="card__title" id="p-title">Últimas facturas</h2>${INFO}</div>
      <div class="card__body" style="font-size:12px">
        ${rows.map(([n, c, d, a, s], i) => `
          <div style="display:flex;align-items:center;gap:var(--space-16);padding:var(--space-12) 0;${i ? 'border-top:1px solid var(--line)' : ''}">
            <b style="width:32px">${n}</b><span style="flex:1">${c}</span><span style="color:var(--text-muted)">${d}</span><b style="width:88px;text-align:right">${a}</b>
            <span class="status status--${s}" role="img" aria-label="${lbl[s]}"></span>
          </div>`).join('')}
      </div>
    </section>`;
  },
};

/* Tax form (sectioned container card): a copy of the app's Modelo 303 (IVA) and Modelo 130 (IRPF), built from DS parts */
const TAX = {
  iva: {
    accent: 'attention', title: 'Modelo 303 · 3T · Jul–Sep 2026', due: 'Plazo: 20 de octubre',
    sections: [
      ['Ingresos con IVA · España', [['c.01', 'Base imponible', '9.622,45 €'], ['c.03', 'IVA repercutido 21%', '2.020,71 €', 'accent']]],
      ['Gastos con IVA deducible · Checkboxes activos', [['c.28', 'Base gastos', '431,85 €'], ['c.29', 'IVA soportado', '90,69 €', 'accent']]],
      ['subtotal', 'IVA repercutido − IVA soportado', '1.930,03 €'],
      ['Operaciones no sujetas por reglas de localización', [['c.120', 'Servicios a empresa extranjera', '14.411,21 €']]],
      ['compensar', 'IVA a compensar de trimestres anteriores', '151,80'],
    ],
    result: ['A ingresar este trimestre', '1.778,23 €'],
  },
  irpf: {
    accent: 'primary', title: 'Modelo 130 · 3T · Jul–Sep 2026', due: 'Plazo: 20 de octubre',
    sections: [
      ['Ingresos y gastos acumulados hasta 3T · Jul–Sep', [['c.01', 'Ingresos íntegros acumulados', '50.790,36 €'], ['c.02', 'Gastos deducibles acumulados', '12.609,29 €'], ['c.03', 'Rendimiento neto acumulado', '38.181,07 €', 'accent']]],
      ['Cálculo del pago fraccionado', [['c.05', '20% sobre rendimiento neto', '7.636,21 €'], ['c.07', 'Retenciones acumuladas 15%', '1.443,37 €', 'muted'], ['c.08', 'Pagos fraccionados anteriores', '3.508,86 €', 'muted']]],
    ],
    result: ['A ingresar este trimestre', '2.683,99 €'],
  },
};
const taxFormHTML = (tax = 'iva') => {
  const t = TAX[tax]; const id = `tf-${tax}`;
  const rows = (list) => `<dl class="list list--${t.accent}">${list.map(([code, label, value, kind]) => `
        <div class="row row--kv"><dt class="row__label"><span class="chip chip--code">${code}</span>${label}</dt><dd class="row__value${kind ? ` row__value--${kind}` : ''}">${value}</dd></div>`).join('')}
      </dl>`;
  const block = ([title, a, b]) => {
    if (title === 'subtotal') return `<div class="result result--sm"><p class="result__label">${a}</p><p class="result__value">${b}</p></div>`;
    if (title === 'compensar') return `<div class="card__section">
      <h3 class="card__section-title">${a}</h3>
      <div class="list"><div class="row row--kv">
        <label class="check"><input type="checkbox" checked> Aplicar compensación</label>
        <input class="input input--sm input--num input--w-sm" value="${b}" inputmode="decimal" aria-label="Importe a compensar">
      </div></div>
    </div>`;
    return `<div class="card__section">
      <h3 class="card__section-title">${title}</h3>
      ${rows(a)}
    </div>`;
  };
  return `<section class="card card--sectioned card--${t.accent} field--${t.accent}" style="max-width:1108px" aria-labelledby="${id}">
  <div class="card__header"><h2 class="card__title card__title--caps" id="${id}">${t.title}</h2><p class="card__due">${t.due}</p></div>
  ${t.sections.map(block).join('\n  ')}
  <div class="result result--pay" role="status"><p class="result__label">${t.result[0]}</p><p class="result__value">${t.result[1]}</p></div>
  <div class="card__section">
    <h3 class="card__section-title">Registrar pago realizado</h3>
    <div class="list"><div class="row row--kv">
      <label class="row__label" for="${id}-pago">Importe ingresado en Hacienda</label>
      <input class="input input--sm input--num input--w-sm" id="${id}-pago" placeholder="0,00" inputmode="decimal">
    </div></div>
  </div>
  <div class="card__section">
    <h3 class="card__section-title"><label for="${id}-notas">Notas del trimestre</label></h3>
    <textarea class="input input--filled" id="${id}-notas" placeholder="Criterios o decisiones de este trimestre…"></textarea>
  </div>
</section>`;
};

export const TaxForm = {
  name: 'Container · Tax form',
  parameters: { layout: 'padded' },
  render: ({ tax }) => taxFormHTML(tax),
  argTypes: { tax: { name: 'Tax', control: { type: 'inline-radio', labels: { iva: 'IVA · Modelo 303 (orange)', irpf: 'IRPF · Modelo 130 (blue)' } }, options: ['iva', 'irpf'] } },
  args: { tax: 'iva' },
};

export const Salario = {
  name: 'Container · Cálculo del salario',
  parameters: { layout: 'padded' },
  ...VIEW,
  render: responsive('app-components-card--salario', () => `<section class="card card--primary" style="max-width:1108px" aria-labelledby="sal-t">
    <div class="card__header"><h2 class="card__title card__title--caps" id="sal-t">Cálculo del salario (Dashboard)</h2></div>
    <p class="card__text" id="sal-h">Defina los clientes en base a cuyas facturas se calculará el salario mensual. Sepáralos por el signo + entre medias, si son varios nombres o escriba «Todas» en caso de querer considerar la facturación total mensual.</p>
    <div class="field field--primary field--inline">
      <label class="field__label" for="sal-c">Clientes</label>
      <input class="input" id="sal-c" type="text" value="Main client" placeholder="Main client" autocomplete="off" aria-describedby="sal-h">
    </div>
  </section>`),
};
