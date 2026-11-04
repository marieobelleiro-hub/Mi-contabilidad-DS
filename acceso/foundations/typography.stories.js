export default {
  title: 'Accessibility assistant/Foundations/Typography',
  tags: ['!autodocs', '!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  globals: { backgrounds: { value: 'white' } },
};
const row = (style, spec, sample, css) => `<div style="display:grid;grid-template-columns:180px 240px 1fr;gap:var(--space-16);align-items:center;padding:var(--space-12) var(--space-16);background:var(--af-canvas);color:var(--af-text);border-top:1px solid var(--af-line)">
  <b style="font-family:var(--font-mono);font-size:var(--text-12);text-transform:uppercase;letter-spacing:var(--ls-caps)">${style}</b><span style="font-size:var(--text-12);color:var(--af-text-muted)">${spec}</span><span style="${css}">${sample}</span></div>`;
export const Styles = {
  name: 'Text styles',
  render: () => `<div style="max-width:1000px">
    ${row('Header title', 'Label · Mono 12 / 700 · caps', 'Acceso fácil', 'font-family:var(--font-mono);font-size:var(--text-12);font-weight:var(--weight-bold);text-transform:uppercase;letter-spacing:var(--ls-caps)')}
    ${row('Text', 'Sans 16 / 400 · line height 1.45', 'Hola, esta ventana quiere hacerte la tarea más fácil.', 'font-size:var(--text-16)')}
    ${row('Option', 'Label · Mono 12 · caps', '<span class="af-option">Consultar datos</span>', '')}
    ${row('Answer heading', 'Sans 16 / 500', 'Modelo 303 · 3T · Jul–Sep 2026', 'font-size:var(--text-16);font-weight:var(--weight-medium)')}
    ${row('Fields, errors', 'Sans 16', 'Este campo es obligatorio.', 'font-size:var(--text-16);color:var(--af-error)')}
    ${row('Link', 'Label · Mono 12 · caps, underlined', '<span class="af-link" style="display:inline-block">Empezar de nuevo</span>', '')}
  </div>`,
};
