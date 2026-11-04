// Banner, Tooltip & Toast stories — HTML + Vite
const ON_CANVAS = { globals: { backgrounds: { value: 'canvas' } } };
import { icon } from '../../icons/icons.js';
import { inFrame, frameArgs, mobileFrame, desktopFrame, reportHeight, frameRoot } from '../../foundations/mobile-frame.js';
const INFO_ICON = icon('info');
const CLOSE = icon('close');

export const bannerHTML = ({ type = 'info', title = '', text = '', size = 'md', dismiss = false, action = '' }) => {
  const role = type === 'info' ? 'status' : 'alert';
  const btnVariant = type === 'warning' ? 'attention' : 'primary';
  return `<div class="banner banner--${type}${size === 'sm' ? ' banner--sm' : ''}" role="${role}">
    <div class="banner__body">
      ${title ? `<p class="banner__title">${title}</p>` : ''}
      <p class="banner__text">${text}</p>
      ${action ? `<div class="banner__actions"><button type="button" class="btn btn--ghost btn--${btnVariant} btn--flush">${action}</button></div>` : ''}
    </div>
    ${dismiss ? `<button type="button" class="btn btn--icon btn--sm btn--danger" aria-label="Cerrar aviso">${CLOSE}</button>` : ''}
  </div>`;
};

/** ⓘ button + tooltip. Opens on click, Enter / Space, hover; closes with Esc or clicking outside. */
const toggletip = (html, { end = false, label = 'Más información', open = false } = {}) => {
  const n = Math.random().toString(36).slice(2, 7);
  const w = document.createElement('span');
  w.className = 'tooltip-wrap';
  w.innerHTML = `<button type="button" class="btn btn--icon btn--sm btn--info" aria-label="${label}" aria-expanded="false" aria-controls="tt-${n}">${INFO_ICON}</button>
    <div class="tooltip${end ? ' tooltip--end' : ''}" id="tt-${n}" role="tooltip"${open ? '' : ' hidden'}>${html}</div>`;
  const b = w.querySelector('button'); const t = w.querySelector('.tooltip');
  const set = (open) => { t.hidden = !open; b.setAttribute('aria-expanded', open); };
  if (open) b.setAttribute('aria-expanded', 'true');
  b.addEventListener('click', () => set(t.hidden));
  w.addEventListener('mouseenter', () => set(true));
  w.addEventListener('mouseleave', () => set(false));
  w.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); b.focus(); } });
  document.addEventListener('click', (e) => { if (!w.contains(e.target)) set(false); });
  return w;
};

export default {
  title: 'App/Components/Banner, tooltip & toast',
  tags: ['!autodocs'],   // documented in Feedback.mdx
  excludeStories: ['bannerHTML'],
  parameters: { layout: 'padded' },
};

const VIEW = { name: 'View', control: { type: 'inline-radio', labels: { desktop: 'Desktop', mobile: 'Mobile (390px)' } }, options: ['desktop', 'mobile'] };
/** Desktop: the story as is · Mobile: the same story in a 390px frame (real mobile CSS) */
const view = (storyId, a, draw, opts) => {
  if (inFrame()) return reportHeight(draw({ ...a, ...frameArgs() }, true));
  if (a.view === 'mobile') return mobileFrame(storyId, { ...a, view: 'desktop' }, opts);
  return draw(a, false);
};
const el = (html) => { const d = document.createElement('div'); d.innerHTML = html; return d; };

/* ══ Banner ══ */
export const Banner = {
  name: 'Banner',
  argTypes: {
    view: VIEW,
    type: { name: 'Type', control: { type: 'inline-radio', labels: { info: 'Info (blue)', warning: 'Warning (orange)', error: 'Error (red)' } }, options: ['info', 'warning', 'error'] },
    size: { name: 'Size', control: { type: 'inline-radio', labels: { md: 'Regular · 14px', sm: 'Small · 12px' } }, options: ['md', 'sm'] },
    withTitle: { name: 'Title', control: 'boolean' },
    title: { name: 'Title text', control: 'text', if: { arg: 'withTitle' } },
    text: { name: 'Text', control: 'text' },
    withAction: { name: 'Action', control: 'boolean', description: 'ghost button' },
    action: { name: 'Action text', control: 'text', if: { arg: 'withAction' } },
    dismiss: { name: 'Close button', control: 'boolean' },
  },
  args: { view: 'desktop', type: 'warning', size: 'md', withTitle: false, title: 'Title', text: 'Sin facturación española → IVA soportado no deducible este trimestre.', withAction: false, action: 'Action', dismiss: false },
  render: (a) => view('app-components-banner-tooltip-toast--banner', a, (x) => el(`<div style="max-width:720px">${bannerHTML({ ...x, title: x.withTitle ? x.title : '', action: x.withAction ? x.action : '' })}</div>`), { bg: 'white', background: 'var(--surface)' }),
};

/* Not in the app yet: the design is ready, the text is a placeholder */
export const BannersFuture = {
  name: 'Illustration · Banner future types',
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => `<div style="max-width:720px;display:flex;flex-direction:column;gap:var(--space-16)">
    ${bannerHTML({ type: 'info', title: 'Title', text: 'Message text.' })}
    ${bannerHTML({ type: 'info', size: 'sm', text: 'Message text (small).' })}
    ${bannerHTML({ type: 'warning', title: 'Title', text: 'Message text.', action: 'Action', dismiss: true })}
    ${bannerHTML({ type: 'error', title: 'Title', text: 'Message text.', dismiss: true })}
  </div>`,
};

/* The real one: Modelo 303, a quarter without Spanish invoices */
export const BannerInContext = {
  name: 'Illustration · Banner in the tax form',
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  ...ON_CANVAS,
  render: () => `<section class="card card--sectioned card--attention" style="max-width:720px" aria-labelledby="b303">
    <div class="card__header"><h2 class="card__title card__title--caps" id="b303">Modelo 303 · 4T · Oct–Dic 2026</h2><p class="card__due">Plazo: 30 de enero</p></div>
    <div class="card__section">
      <h3 class="card__section-title">Ingresos con IVA · España</h3>
      <dl class="list list--attention">
        <div class="row row--kv"><dt class="row__label"><span class="chip chip--code">c.01</span>Base imponible</dt><dd class="row__value">0,00 €</dd></div>
        <div class="row row--kv"><dt class="row__label"><span class="chip chip--code">c.03</span>IVA repercutido 21%</dt><dd class="row__value row__value--accent">0,00 €</dd></div>
      </dl>
    </div>
    <div class="card__section">
      <h3 class="card__section-title">Gastos con IVA deducible · Checkboxes activos</h3>
      <dl class="list list--attention">
        <div class="row row--kv"><dt class="row__label"><span class="chip chip--code">c.28</span>Base gastos</dt><dd class="row__value">0,00 €</dd></div>
        <div class="row row--kv"><dt class="row__label"><span class="chip chip--code">c.29</span>IVA soportado</dt><dd class="row__value row__value--accent">0,00 €</dd></div>
      </dl>
      <div style="padding:var(--space-8) 0 var(--space-16)">${bannerHTML({ type: 'warning', text: 'Sin facturación española → IVA soportado no deducible este trimestre.' })}</div>
    </div>
    <div class="result result--sm"><p class="result__label">IVA repercutido − IVA soportado</p><p class="result__value">0,00 €</p></div>
    <div class="result result--none" role="status"><p class="result__label">Sin actividad con IVA</p><p class="result__value">0,00 €</p></div>
  </section>`,
};

/* ══ Tooltip ══ */
const TIPS = {
  salario: ['Dashboard · Salario neto del mes', 'Salario neto del mes', '<p>Salario neto: es una estimación económica para el trabajador autónomo que cuenta con una facturación mensual en parte fija que es lo que le permitirá calcular esa especie de salario. En el apartado Facturación, abajo de la página habrá que incluir el nombre de los clientes, cuya facturación del mes anterior será la base de este cálculo.</p><p>El salario neto es calculado con esas facturas, restando los gastos del mes anterior, independientemente de si los pagos se hayan realizado.</p>'],
  estado: ['Facturación · status dot', 'Cobrada · Pendiente', '<p>Activando el punto junto al total de la factura puede cambiar su estado de pendiente a pagado o vice versa, lo cual repercutirá en todos los totales pertinentes y en los gráficos del dashboard.</p>'],
  orden: ['Gastos · Por cat. IRPF / Por % IVA', 'Gastos', '<p>Los gastos se pueden ordenar con dos criterios diferentes: por las categorías de gastos deducibles que la declaración de IRPF define, o por el porcentaje de IVA aplicado. Seleccione el tabulador que prefiera. Los gastos son los mismos, solo cambia la manera de desplegarlos.</p>'],
  suministros: ['Gastos · a category (3. Suministros)', '3. Suministros (luz, agua, telefonía, internet)', '<p>Electricidad, agua, gas, teléfono e internet del domicilio afecto. Límite: 30% del % de m² afectos. Pago siempre con tarjeta.</p>'],
  iva: ['IVA · page', 'IVA', '<p>Esta página corresponde a las diferentes declaraciones de IVA. Los cálculos numéricos se realizan automáticamente a partir de los apartados Facturación y Gastos.</p>'],
  custom: ['New tooltip (write your text)', 'Title', ''],
};
export const Tooltip = {
  name: 'Tooltip',
  globals: ON_CANVAS.globals,
  argTypes: {
    tooltip: { name: 'Tooltip', control: { type: 'select', labels: Object.fromEntries(Object.entries(TIPS).map(([k, v]) => [k, v[0]])) }, options: Object.keys(TIPS) },
    text: { name: 'Text', control: 'text', if: { arg: 'tooltip', eq: 'custom' }, description: 'Plain text; a new line starts a new paragraph' },
    side: { name: 'Opens to', control: { type: 'inline-radio', labels: { right: 'The right (default)', left: 'The left (tooltip--end, near the right edge)' } }, options: ['right', 'left'] },
    open: { name: 'Open', control: 'boolean', description: 'In the app it opens on hover, click, Enter or Space' },
  },
  args: { tooltip: 'salario', text: 'Tooltip text.', side: 'left', open: true },
  render: ({ tooltip, text, side, open }) => {
    const [, title, html] = TIPS[tooltip];
    const body = tooltip === 'custom' ? text.split('\n').filter(Boolean).map((p) => `<p>${p}</p>`).join('') : html;
    const card = document.createElement('section');
    card.className = 'card';
    card.style.cssText = `max-width:540px;min-height:320px;${side === 'left' ? 'margin-left:auto;margin-right:0' : ''}`;
    card.innerHTML = `<div class="card__header"><h2 class="card__title">${title}</h2><span data-tt></span></div>`;
    card.querySelector('[data-tt]').replaceWith(toggletip(body, { end: side === 'left', open, label: `Más información: ${title}` }));
    return card;
  },
};

export const ChartTooltip = {
  name: 'Chart tooltip',
  parameters: { controls: { disable: true } },
  render: () => `<div style="position:relative;height:120px;width:320px">
    <div class="tooltip tooltip--dark" role="tooltip" style="top:0;left:0">
      <b>Julio</b><br>
      <span class="tooltip__swatch" style="background:var(--income-light)"></span>Ingresos&nbsp; <b>8.203,35 €</b><br>
      <span class="tooltip__swatch" style="background:var(--expense-light)"></span>Gastos&nbsp; <b>1.072,54 €</b>
    </div></div>`,
};

/* ══ Toast ══ */
const ACTIONS = { deshacer: 'Deshacer', entendido: 'Entendido', none: '' };
const toastHTML = (text, action, cls) => `<div class="toast ${cls}" role="status" aria-live="polite"><span>${text}</span>${ACTIONS[action] ? `<button type="button" class="toast__action">${ACTIONS[action]}</button>` : ''}</div>`;
export const Toast = {
  name: 'Toast',
  argTypes: {
    view: { name: 'View', control: { type: 'inline-radio', labels: { desktop: 'Desktop (1232px, scaled)', mobile: 'Mobile (390px)' } }, options: ['desktop', 'mobile'] },
    text: { name: 'Text', control: 'text', description: 'Long messages wrap onto several lines' },
    action: { name: 'Action', control: { type: 'inline-radio', labels: { deshacer: 'Deshacer', entendido: 'Entendido (future)', none: 'None' } }, options: ['deshacer', 'entendido', 'none'] },
  },
  args: { view: 'desktop', text: 'Factura 411 eliminada.', action: 'deshacer' },
  render: (a) => {
    const id = 'app-components-banner-tooltip-toast--toast';
    if (inFrame()) {
      a = { ...a, ...frameArgs() };
      // the screen: on desktop a sidebar strip (124px) shows where the toast starts
      return frameRoot(el(`${a.view === 'desktop' ? '<div aria-hidden="true" style="position:fixed;inset:0 auto 0 0;width:var(--sidebar-w);background:var(--surface);border-right:var(--border-thin) solid var(--line)"></div>' : ''}
        ${toastHTML(a.text, a.action, 'toast--start is-visible')}`), 'Toast');
    }
    return a.view === 'mobile' ? mobileFrame(id, a, { height: 420 }) : desktopFrame(id, a, { height: 420 });
  },
};
