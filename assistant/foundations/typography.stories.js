export default {
  title: 'Chatbot/Foundations/Typography',
  tags: ['!autodocs', '!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  globals: { backgrounds: { value: 'white' } },
};
const row = (style, spec, sample, css) => `<div style="display:grid;grid-template-columns:180px 220px 1fr;gap:var(--space-16);align-items:baseline;padding:var(--space-12) 0;border-top:1px solid var(--line)">
  <b style="font-family:var(--font-mono);font-size:var(--text-12);text-transform:uppercase;letter-spacing:var(--ls-caps)">${style}</b><span style="font-size:var(--text-12);color:var(--text-muted)">${spec}</span><span style="${css}">${sample}</span></div>`;
export const Styles = {
  name: 'Text styles',
  render: () => `<div style="max-width:1000px">
    ${row('Greeting', 'Display · Light · 24 / 300 · blue', 'Hola ¿en qué puedo ayudarte?', 'font-size:var(--text-24);font-weight:var(--weight-light);color:var(--primary)')}
    ${row('Header title', 'Title · Medium · 16 / 500 · white', '<span style="background:var(--ai-header-bg);color:var(--white);padding:4px 8px">Asistente Inteligente</span>', 'font-size:var(--text-16);font-weight:var(--weight-medium)')}
    ${row('Message', 'Title size · 16 / 400 · line height 1.45', '¿Cuánto IVA tengo que pagar?', 'font-size:var(--text-16);line-height:var(--leading-normal)')}
    ${row('Message heading', '16 / 500', 'Modelo 303 · 3T · Jul–Sep 2026', 'font-size:var(--text-16);font-weight:var(--weight-medium)')}
    ${row('Chip', 'Body · 14 / 400 · blue', 'Registrar pago del IVA', 'font-size:var(--text-14);color:var(--primary)')}
    ${row('Meta · status', 'Mono · 12 · muted', 'Entendido como: IVA · Modelo 303 · 3T 2026', 'font-family:var(--font-mono);font-size:var(--text-12);color:var(--text-muted)')}
  </div>`,
};
