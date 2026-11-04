import { stepHTML, optionHTML, footHTML, STEPS } from './acceso-html.js';
export default {
  title: 'Accessibility assistant/Components/Steps & options',
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
  globals: { backgrounds: { value: 'canvas' } },
};
const dark = (html) => `<div class="af-panel__body" style="background:var(--af-canvas);color:var(--af-text);max-width:1108px">${html}</div>`;
export const Playground = {
  name: 'Option',
  render: ({ label, state, chosen, primary }) => dark(`<div class="af-step${chosen === 'other' ? ' has-choice' : ''}"><div class="af-step__options">${optionHTML(label, { pressed: chosen === 'this', primary, state })}</div></div>`),
  argTypes: {
    chosen: { name: 'Choice', control: { type: 'inline-radio', labels: { none: 'Nothing chosen yet', this: 'This one is chosen', other: 'Another one is chosen' } }, options: ['none', 'this', 'other'], table: { category: 'Variant' } },
    primary: { name: 'Main action', control: 'boolean', description: 'Blue: Guardar at the end of a form', table: { category: 'Variant' } },
    state: { name: 'State', control: 'select', options: ['default', 'hover', 'focus'], table: { category: 'Variant' } },
    label: { name: 'Text', control: 'text', table: { category: 'Text' } },
  },
  args: { label: 'Consultar datos', chosen: 'none', primary: false, state: 'default' },
};
export const States = {
  name: 'Option · States',
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    const head = 'font-family:var(--font-mono);font-size:var(--text-10);text-transform:uppercase;letter-spacing:var(--ls-caps);color:var(--af-text-muted)';
    const cols = ['default', 'hover', 'focus'];
    const rows = [['Nothing chosen', 'none'], ['Chosen', 'this'], ['Not chosen', 'other']];
    return dark(`<div style="display:grid;grid-template-columns:160px repeat(3,minmax(170px,1fr));gap:var(--space-16);align-items:center">
      <span></span>${cols.map((c) => `<span style="${head}">${c}</span>`).join('')}
      ${rows.map(([n, ch]) => `<span style="${head}">${n}</span>${cols.map((c) => `<div class="af-step${ch === 'other' ? ' has-choice' : ''}" style="margin:0">${optionHTML('Impuestos', { pressed: ch === 'this', state: c })}</div>`).join('')}`).join('')}
      <span style="${head}">Main action</span>${cols.map((c) => `<div>${optionHTML('Guardar', { primary: true, state: c })}</div>`).join('')}
    </div>`);
  },
};
export const Path = {
  name: 'Steps · A path',
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => dark(stepHTML(STEPS.what, { chosen: 0 }) + stepHTML(STEPS.catConsult, { num: 2, chosen: 3 }) + stepHTML(STEPS.tax) + footHTML()),
};
export const Many = {
  name: 'Steps · Many options',
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => dark(stepHTML(STEPS.what, { chosen: 2 }) + stepHTML(STEPS.defs, { num: 2 })),
};
