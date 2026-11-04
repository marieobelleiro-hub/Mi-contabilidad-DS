import { chipHTML, chipsHTML, EXAMPLES } from './assistant-html.js';

export default {
  title: 'Chatbot/Components/Suggestion chips',
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
  globals: { backgrounds: { value: 'canvas' } },
};
export const Playground = {
  name: 'Suggestion chip',
  render: ({ label, primary, state }) => `<div class="ai-chips" style="margin:0">${chipHTML(label, { primary, state })}</div>`,
  argTypes: {
    primary: { name: 'Main step', control: 'boolean', description: 'Filled blue: the action the assistant expects (Guardar)', table: { category: 'Variant' } },
    state: { name: 'State', control: 'select', options: ['default', 'hover', 'focus', 'disabled'], table: { category: 'Variant' } },
    label: { name: 'Text', control: 'text', table: { category: 'Text' } },
  },
  args: { label: 'Registrar pago del IVA', primary: false, state: 'default' },
};
export const States = {
  name: 'States',
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    const head = 'font-family:var(--font-mono);font-size:var(--text-10);text-transform:uppercase;letter-spacing:var(--ls-caps);color:var(--text-muted)';
    const cols = ['default', 'hover', 'focus', 'disabled'];
    const rows = [['Suggestion', false, 'IRPF · Modelo 130'], ['Main step', true, 'Guardar']];
    return `<div class="card" style="display:grid;grid-template-columns:140px repeat(4,minmax(150px,1fr));gap:var(--space-16);align-items:center;max-width:900px">
      <span></span>${cols.map((c) => `<span style="${head}">${c}</span>`).join('')}
      ${rows.map(([n, p, l]) => `<span style="${head}">${n}</span>${cols.map((c) => `<div>${p && c === 'disabled' ? '<span style="color:var(--text-muted)">—</span>' : chipHTML(l, { primary: p, state: c })}</div>`).join('')}`).join('')}
    </div>`;
  },
};
export const InUse = {
  name: 'In a reply',
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => `<div style="display:flex;flex-direction:column;gap:var(--space-24);max-width:900px">
    <div class="ai-msg ai-msg--bot">${'<p>Algunas preguntas que puedes hacerme:</p>'}${chipsHTML(EXAMPLES)}</div>
    <div class="ai-msg ai-msg--bot"><p>Revisa los datos:</p><ul><li><strong>Proveedor:</strong> Jazztel</li><li><strong>Base imponible:</strong> 37,65 €</li></ul>${chipsHTML(['Guardar', 'Cancelar'], true)}</div>
  </div>`,
};
