// Acceso fácil — markup builders shared by the stories. All texts are the real ones from the app.
import { icon } from '../../icons/icons.js';
import { switchHTML } from '../../components/selectors/selectors.stories.js';

export const AF_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="6.8" r="1.5" fill="currentColor"/><path d="M6.5 9.4c1.8.5 3.7.8 5.5.8s3.7-.3 5.5-.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 10.3v3.9M12 14.2l-2.3 4.3M12 14.2l2.3 4.3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export const STEPS = {
  what: ['¿Qué deseas? Selecciona una opción:', ['Consultar datos', 'Introducir datos', 'Consultar definiciones']],
  catConsult: ['Elige una categoría:', ['Datos clave', 'Facturación', 'Gastos', 'Impuestos']],
  catEnter: ['Elige una categoría:', ['Facturación', 'Gastos', 'Impuestos']],
  tax: ['¿Qué impuesto?', ['IVA · Modelo 303', 'IRPF · Modelo 130']],
  todo: ['¿Qué quieres hacer?', ['Nueva factura', 'Marcar factura como cobrada', 'Clientes del salario']],
  defs: ['Elige un término:', ['Base imponible', 'IVA repercutido', 'IVA soportado', 'Modelo 303', 'Modelo 390', 'Operaciones no sujetas (c.120)', 'IRPF', 'Modelo 130', 'Rendimiento neto', 'Retención IRPF (15 %)', 'Cuota de autónomos (RETA)', 'Gastos deducibles', 'Amortización', 'IVA a compensar', 'Cobrada / Pendiente', 'Salario neto del mes', 'Previsión de ahorro mensual', 'Beneficio', 'Trimestre (1T–4T)']],
};
let n = 0;

/** One step: a question and its options. done = a choice was made (only “1.” is left visible). */
export const optionHTML = (label, { pressed = false, primary = false, state = 'default', type = 'button' } = {}) =>
  `<button type="${type}" class="af-option${primary ? ' af-option--primary' : ''}${state === 'hover' ? ' is-hover' : state === 'focus' ? ' is-focus' : ''}"${primary ? '' : ` aria-pressed="${pressed}"`}>${label}</button>`;
export const stepHTML = ([label, options], { num = 1, chosen = -1 } = {}) => {
  const id = `af-r${++n}`; const done = chosen >= 0;
  return `<div class="af-step${done ? ' is-done has-choice' : ''}" role="group" aria-labelledby="${id}">
    <span class="af-step__label" id="${id}">${done ? `<span aria-hidden="true">${num}.</span><span class="sr-only">${label}</span>` : label}</span>
    <div class="af-step__options">${options.map((o, i) => optionHTML(o, { pressed: i === chosen })).join('')}</div>
  </div>`;
};
export const footHTML = () => '<div class="af-foot"><button type="button" class="af-link">Volver</button><button type="button" class="af-link">Empezar de nuevo</button></div>';

/* ── Answers ── */
export const answerHTML = (content) => `<section class="af-answer" aria-labelledby="af-resp-${++n}">
    <div class="af-answer__head"><h3 class="af-answer__label" id="af-resp-${n}" tabindex="-1">Respuesta</h3><span class="af-answer__rule" aria-hidden="true"></span></div>
    ${content}
  </section>`;
export const IVA_ANSWER = `<h4>Modelo 303 · 3T · Jul–Sep 2026</h4><p>Plazo: 20 de octubre</p>
  <ul><li><strong>c.01 · Base imponible:</strong> 9.622,45 €</li><li><strong>c.03 · IVA repercutido:</strong> 2.020,71 €</li><li><strong>c.28 · Base gastos:</strong> 431,85 €</li><li><strong>c.29 · IVA soportado:</strong> 90,69 €</li><li><strong>IVA repercutido − IVA soportado:</strong> 1.930,03 €</li><li><strong>c.120 · Servicios a empresa extranjera:</strong> 14.411,21 €</li></ul>
  <p><strong>A ingresar este trimestre:</strong> 1.778,23 €</p>`;
export const NOTE_ANSWER = `<h4>Modelo 303 · 4T · Oct–Dic 2026</h4><p>Plazo: 30 de enero</p>
  <p class="af-note">Sin facturación española → IVA soportado no deducible este trimestre.</p>
  <p><strong>Sin actividad con IVA:</strong> 0,00 €</p>`;
export const DEF_ANSWER = '<h4>Base imponible</h4><p>Importe de una factura o de un gasto antes de impuestos, sin IVA y sin retención. Es la cifra sobre la que se calculan el IVA y el IRPF.</p>';
export const STATUS = '<p class="af-status" role="status">Factura 413 guardada en el 4T 2026 como pendiente de cobro. Total facturado este trimestre: 2.580,63 €.</p>';

/* ── Form (Nueva factura) ── */
const field = (p, k, label, { ph = '', error = '', opts } = {}) => {
  const id = `${p}${k}`;
  const ctl = opts
    ? `<select class="input" id="${id}">${opts.map((o) => `<option${o === '21 %' ? ' selected' : ''}>${o}</option>`).join('')}</select>`
    : `<input class="input" id="${id}" type="text"${ph ? ` placeholder="${ph}"` : ''}${label.includes('€') ? ' inputmode="decimal"' : ''} autocomplete="off"${error ? ` aria-invalid="true" aria-describedby="${id}-err"` : ''}>`;
  return `<div class="field"><label class="field__label" for="${id}">${label}</label>${ctl}${error ? `<p class="field__error" id="${id}-err">${error}</p>` : ''}</div>`;
};
export const formHTML = ({ errors = false } = {}) => {
  const p = `af-f${++n}-`; const req = errors ? 'Este campo es obligatorio.' : '';
  return `<p class="af-note">Ejemplo online: los cambios se ven en la app; al recargar la página vuelven los datos de ejemplo.</p>
  <form class="af-form" novalidate onsubmit="return false">
    <fieldset><legend>¿Es una factura nacional?</legend><div class="af-option-group has-choice">
      <label class="af-option-radio"><input type="radio" name="${p}tipo" checked><span>Sí: nacional, con IVA</span></label>
      <label class="af-option-radio"><input type="radio" name="${p}tipo"><span>No: exenta de impuestos, cliente extranjero</span></label>
    </div></fieldset>
    ${field(p, 'iva', '% de IVA', { opts: ['0 %', '4 %', '5 %', '10 %', '21 %'] })}
    <label class="check"><input type="checkbox" checked> Aplicar retención IRPF del 15 %</label>
    ${field(p, 'num', 'Número de factura', { error: req })}
    ${field(p, 'fecha', 'Fecha · 2026', { ph: 'DD/MM/AAAA', error: errors ? 'Escribe una fecha válida (DD/MM/AAAA).' : '' })}
    ${field(p, 'cliente', 'Cliente', { error: req })}
    ${field(p, 'concepto', 'Concepto', { error: req })}
    ${field(p, 'base', 'Base imponible en €', { error: req })}
    ${optionHTML('Guardar', { primary: true, type: 'submit' })}
  </form>`;
};

/* ── Panel ── */
export const panelHTML = ({ full = false, body = '', lang = 'es' } = {}) => `<section class="af-panel af-panel--static${full ? ' af-panel--full' : ''}" role="dialog" aria-modal="false" aria-labelledby="af-t-${++n}" lang="${lang}">
  <div class="af-panel__head">
    <div class="af-panel__title">${AF_ICON}<h2 id="af-t-${n}">${lang === 'en' ? 'Easy access' : 'Acceso fácil'}</h2></div>
    ${switchHTML({ checked: lang === 'en', label: 'English' })}
    <button type="button" class="af-head-btn" aria-pressed="${full}" aria-label="${full ? 'Salir de pantalla completa' : 'Pantalla completa'}">${icon(full ? 'minimize' : 'maximize', { size: 'md' })}</button>
    <button type="button" class="af-head-btn" aria-label="Cerrar">${icon('close', { size: 'md' })}</button>
  </div>
  <div class="af-panel__body">
    <p class="af-panel__hello">Hola, esta ventana quiere hacerte la tarea más fácil.</p>
    ${body}
  </div>
</section>`;

/* The real flows */
export const FLOWS = {
  start: () => stepHTML(STEPS.what),
  consult: () => stepHTML(STEPS.what, { chosen: 0 }) + stepHTML(STEPS.catConsult, { num: 2, chosen: 3 }) + stepHTML(STEPS.tax, { num: 3, chosen: 0 }) + answerHTML(IVA_ANSWER) + footHTML(),
  pending: () => stepHTML(STEPS.what, { chosen: 0 }) + stepHTML(STEPS.catConsult, { num: 2, chosen: 3 }) + stepHTML(STEPS.tax) + footHTML(),
  enter: () => stepHTML(STEPS.what, { chosen: 1 }) + stepHTML(STEPS.catEnter, { num: 2, chosen: 0 }) + stepHTML(STEPS.todo, { num: 3, chosen: 0 }) + answerHTML(formHTML()) + footHTML(),
  saved: () => stepHTML(STEPS.what, { chosen: 1 }) + stepHTML(STEPS.catEnter, { num: 2, chosen: 0 }) + stepHTML(STEPS.todo, { num: 3, chosen: 0 }) + answerHTML(STATUS) + footHTML(),
  define: () => stepHTML(STEPS.what, { chosen: 2 }) + stepHTML(STEPS.defs, { num: 2, chosen: 0 }) + answerHTML(DEF_ANSWER) + footHTML(),
};
