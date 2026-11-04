// Asistente inteligente — markup builders shared by the stories. All texts are the real ones from the app.
import { icon } from '../../icons/icons.js';
import { FAB_ICONS } from '../../components/button/button.stories.js';
import { switchHTML } from '../../components/selectors/selectors.stories.js';

export const T = {
  es: { title: 'Asistente Inteligente', hello: 'Hola ¿en qué puedo ayudarte?', lbl: 'Escribe tu pregunta', send: 'Enviar', full: 'Pantalla completa', exitFull: 'Salir de pantalla completa', close: 'Cerrar',
    ph: 'Pregunta directamente lo que quieras...', phPick: 'Elige una opción de arriba… (o escribe «cancelar»)', phForm: 'Rellena el formulario de arriba… (o escribe «cancelar»)',
    engine: 'Comprensión: reconocimiento local · Jev no conectado', clear: 'Borrar conversación', typing: 'Pensando…', you: 'Tú:', bot: 'Asistente:' },
  en: { title: 'Smart Assistant', hello: 'Hi, how can I help you?', lbl: 'Type your question', send: 'Send', full: 'Full screen', exitFull: 'Exit full screen', close: 'Close',
    ph: 'Ask me anything about your books...', phPick: 'Choose an option above… (or type “cancel”)', phForm: 'Fill in the form above… (or type “cancel”)',
    engine: 'Understanding: built-in matcher · Jev not connected', clear: 'Clear conversation', typing: 'Thinking…', you: 'You:', bot: 'Assistant:' },
};

/* ── Parts ── */
export const msgHTML = (who, html, lang = 'es') => `<div class="ai-msg ai-msg--${who}"><span class="sr-only">${who === 'user' ? T[lang].you : T[lang].bot}</span>${html}</div>`;
export const chipHTML = (label, { primary = false, state = 'default' } = {}) =>
  `<button type="button" class="ai-chip${primary ? ' ai-chip--primary' : ''}${state === 'hover' ? ' is-hover' : state === 'focus' ? ' is-focus' : ''}"${state === 'disabled' ? ' disabled' : ''}>${label}</button>`;
export const chipsHTML = (labels, primaryFirst = false) => `<div class="ai-chips">${labels.map((l, i) => chipHTML(l, { primary: primaryFirst && i === 0 })).join('')}</div>`;
export const typingHTML = (lang = 'es') => `<div class="ai-typing" aria-hidden="true">${T[lang].typing}</div>`;
export const composerHTML = ({ lang = 'es', placeholder, value = '', state = 'default', id = 'ai-in' } = {}) =>
  `<form class="ai-composer${state === 'focus' ? ' is-focus' : ''}" autocomplete="off" onsubmit="return false">
    <label for="${id}" class="sr-only">${T[lang].lbl}</label>
    <input class="ai-composer__input" id="${id}" type="text" maxlength="300" placeholder="${placeholder ?? T[lang].ph}" value="${value}">
    <button type="submit" class="ai-composer__send${state === 'hover' ? ' is-hover' : ''}" aria-label="${T[lang].send}">${icon('arrow-right')}</button>
  </form>`;

/* ── Real replies ── */
export const EXAMPLES = ['¿Cuánto IVA pago este trimestre?', '¿Qué facturas tengo pendientes?', '¿Qué beneficio llevo este mes?', '¿Cuánto cobraré el mes que viene?', '¿Qué es el Modelo 130?'];
export const IVA_ANSWER = `<h3>Modelo 303 · 3T · Jul–Sep 2026</h3><p>Plazo: 20 de octubre</p>
  <ul><li><strong>c.01 · Base imponible:</strong> 9.622,45 €</li><li><strong>c.03 · IVA repercutido:</strong> 2.020,71 €</li><li><strong>c.28 · Base gastos:</strong> 431,85 €</li><li><strong>c.29 · IVA soportado:</strong> 90,69 €</li><li><strong>IVA repercutido − IVA soportado:</strong> 1.930,03 €</li><li><strong>c.120 · Servicios a empresa extranjera:</strong> 14.411,21 €</li></ul>
  <p><strong>A ingresar este trimestre:</strong> 1.778,23 €</p>
  <p class="ai-msg__meta">Entendido como: IVA · Modelo 303 · 3T 2026 · reconocimiento local</p>
  ${chipsHTML(['IRPF · Modelo 130', 'Definición: Modelo 303', 'Registrar pago del IVA'])}`;
export const NOTE_ANSWER = `<h3>Modelo 303 · 4T · Oct–Dic 2026</h3><p>Plazo: 30 de enero</p>
  <p class="ai-msg__note">Sin facturación española → IVA soportado no deducible este trimestre.</p>
  <p><strong>Sin actividad con IVA:</strong> 0,00 €</p>
  <p class="ai-msg__meta">Entendido como: IVA · Modelo 303 · 4T 2026 · reconocimiento local</p>`;
export const CLARIFY = `<p>No estoy seguro de haberte entendido. ¿Te refieres a…</p>${chipsHTML(['IVA · Modelo 303', 'IRPF · Modelo 130', 'Facturas pendientes'])}`;
let q = 0;
export const questionHTML = (choice = '') => {
  const n = `aipick${++q}`;
  return `<fieldset class="check-group"><legend>¿Qué tipo de factura quieres añadir?</legend>
    <label class="check"><input type="radio" name="${n}" value="inc"${choice === 'inc' ? ' checked' : ''}> A ingresar — la emites tú a un cliente</label>
    <label class="check"><input type="radio" name="${n}" value="exp"${choice === 'exp' ? ' checked' : ''}> Gasto — la recibes de un proveedor</label>
  </fieldset>`;
};

/* ── Form card (Nueva factura / Nuevo gasto) ── */
let f = 0;
const field = (p, k, label, { type = 'text', value = '', ph = '', opts, error = '' } = {}) => {
  const id = `${p}${k}`;
  const ctl = opts
    ? `<select class="input" id="${id}" name="${k}">${opts.map((o, i) => `<option${i === 0 ? ' selected' : ''}>${o}</option>`).join('')}</select>`
    : `<input class="input" id="${id}" name="${k}" type="${type}" value="${value}"${ph ? ` placeholder="${ph}"` : ''}${label.includes('€') ? ' inputmode="decimal"' : ''} autocomplete="off"${error ? ` aria-invalid="true" aria-describedby="${id}-err"` : ''}>`;
  return `<div class="field"><label class="field__label" for="${id}">${label}</label>${ctl}${error ? `<p class="field__error" id="${id}-err">${error}</p>` : ''}</div>`;
};
export const formHTML = ({ type = 'gasto', error = false } = {}) => {
  const p = `aicf${++f}-`; const gasto = type === 'gasto';
  const accent = gasto ? 'attention' : 'primary';
  const IVA = ['21 %', '10 %', '5 %', '4 %', '0 %'];
  const body = gasto
    ? [field(p, 'num', 'Número de factura (opcional)'), field(p, 'fecha', 'Fecha · 2026', { ph: 'DD/MM/AAAA', value: error ? '31/09/2026' : '', error: error ? 'Fecha no válida. Escríbela como DD/MM/AAAA.' : '' }), field(p, 'prov', 'Proveedor'), field(p, 'concepto', 'Concepto'), field(p, 'base', 'Base imponible en €'), field(p, 'iva', '% de IVA', { opts: IVA }),
      '<p class="ai-form__total" aria-live="polite">Total gasto: — €</p>',
      field(p, 'cat', 'Categoría IRPF', { opts: ['Elige una categoría', '1. Seguridad Social / RETA', '2. Arrendamiento', '3. Servicios exteriores'] }),
      '<label class="check"><input type="checkbox" name="e303" checked> Incluir en el 303</label>'].join('')
    : [`<fieldset class="check-group"><legend>¿Es una factura nacional o exenta de impuestos?</legend><label class="check"><input type="radio" name="${p}tipo" checked> Nacional (con IVA)</label><label class="check"><input type="radio" name="${p}tipo"> Exenta de impuestos (cliente extranjero)</label></fieldset>`,
      field(p, 'num', 'Número de factura'), field(p, 'fecha', 'Fecha · 2026', { ph: 'DD/MM/AAAA' }), field(p, 'cli', 'Cliente'), field(p, 'concepto', 'Concepto'), field(p, 'base', 'Base imponible en €'), field(p, 'iva', '% de IVA', { opts: IVA }),
      '<label class="check"><input type="checkbox" name="ret" checked> Aplicar retención IRPF del 15 %</label>'].join('');
  return `<form class="ai-form form--${accent} form--tinted" novalidate aria-labelledby="${p}title" onsubmit="return false">
    <p>Rellena los datos y pulsa Guardar:</p>
    <h3 class="ai-form__title" id="${p}title">${gasto ? 'Nuevo gasto' : 'Factura nacional'}</h3>
    ${body}
    <div class="ai-form__actions"><button type="button" class="btn btn--ghost btn--${accent}"><span class="btn__label">Cancelar</span></button><button type="submit" class="btn btn--${accent}"><span class="btn__label">Guardar</span>${icon('save', { size: 'md' })}</button></div>
  </form>`;
};
export const SAVED = `<h3>Nuevo gasto</h3><p>Datos guardados:</p><ul><li><strong>Fecha:</strong> 12/09/2026</li><li><strong>Proveedor:</strong> Jazztel</li><li><strong>Concepto:</strong> Internet</li><li><strong>Base imponible:</strong> 37,65 €</li><li><strong>% de IVA:</strong> 21 %</li><li><strong>Categoría IRPF:</strong> 4. Suministros</li></ul>`;
export const CLOSED = '<h3>Nuevo gasto</h3><p class="ai-msg__meta">Formulario cerrado sin guardar.</p>';

/* ── Panel ── */
export const panelHTML = ({ lang = 'es', mode = 'static', full = false, log = '', placeholder, foot = true, width } = {}) => {
  const t = T[lang];
  return `<section class="ai-panel ai-panel--${mode}${full ? ' ai-panel--full' : ''}" role="dialog" aria-modal="false" aria-labelledby="ai-t-${++q}" lang="${lang}"${width ? ` style="width:${width}"` : ''}>
  <div class="ai-panel__head">
    <div class="ai-panel__title">${FAB_ICONS.assistant.replace('viewBox="0 0 40 40"', 'viewBox="6 6 28 28"')}<h2 id="ai-t-${q}">${t.title}</h2></div>
    ${switchHTML({ checked: lang === 'en', label: 'English' })}
    <button type="button" class="ai-head-btn" aria-pressed="${full}" aria-label="${full ? t.exitFull : t.full}">${icon(full ? 'minimize' : 'maximize', { size: 'md' })}</button>
    <button type="button" class="ai-head-btn" aria-label="${t.close}">${icon('close', { size: 'md' })}</button>
  </div>
  <div class="ai-panel__body">
    <p class="ai-panel__hello">${t.hello}</p>
    <div class="ai-panel__log" role="log" aria-live="polite" aria-relevant="additions">${log}</div>
    ${composerHTML({ lang, placeholder, id: `ai-in-${q}` })}
    ${foot ? `<div class="ai-panel__foot"><p class="ai-panel__engine">${t.engine}</p>${log ? `<button type="button" class="btn btn--ghost btn--primary"><span class="btn__label">${t.clear}</span></button>` : ''}</div>` : ''}
  </div>
</section>`;
};
