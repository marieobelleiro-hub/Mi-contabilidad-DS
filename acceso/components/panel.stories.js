import { panelHTML, FLOWS } from './acceso-html.js';
export default {
  title: 'Accessibility assistant/Components/Panel',
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
  globals: { backgrounds: { value: 'canvas' } },
};
export const Playground = {
  name: 'Panel',
  render: ({ screen, full, lang }) => `<div style="max-width:1108px">${panelHTML({ full, lang, body: FLOWS[screen]() })}</div>`,
  argTypes: {
    screen: { name: 'Screen', control: { type: 'select', labels: { start: '1 · Start', pending: 'A step waiting for a choice', consult: 'Consultar datos → answer', define: 'Consultar definiciones → answer', enter: 'Introducir datos → form', saved: 'Form saved' } }, options: ['start', 'pending', 'consult', 'define', 'enter', 'saved'] },
    full: { name: 'Full screen', control: 'boolean' },
    lang: { name: 'Language', control: { type: 'inline-radio', labels: { es: 'Esp', en: 'Eng' } }, options: ['es', 'en'], description: 'The switch of the header (the screens below are in Spanish)' },
  },
  args: { screen: 'start', full: false, lang: 'es' },
};
export const Mobile = {
  name: 'Panel · Mobile',
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  globals: { viewport: { value: 'mobile' } },
  render: () => panelHTML({ body: FLOWS.pending() }),
};
