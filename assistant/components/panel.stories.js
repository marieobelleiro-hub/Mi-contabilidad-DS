import { panelHTML, msgHTML, IVA_ANSWER, EXAMPLES, chipsHTML } from './assistant-html.js';

export default {
  title: 'Chatbot/Components/Panel',
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
  globals: { backgrounds: { value: 'canvas' } },
};

export const Playground = {
  name: 'Panel',
  render: ({ lang, full, conversation }) => `<div style="max-width:1108px">${panelHTML({ lang, full, log: conversation ? msgHTML('user', lang === 'en' ? 'How much VAT do I pay?' : '¿Cuánto IVA tengo que pagar?', lang) + msgHTML('bot', IVA_ANSWER, lang) : '' })}</div>`,
  argTypes: {
    lang: { name: 'Language', control: { type: 'inline-radio', labels: { es: 'Esp', en: 'Eng' } }, options: ['es', 'en'], description: 'The Esp / Eng switch of the header' },
    full: { name: 'Full screen', control: 'boolean', description: 'The header button switches to “Salir de pantalla completa”' },
    conversation: { name: 'Conversation', control: 'boolean', description: 'Off: only the greeting (the conversation area is hidden while empty)' },
  },
  args: { lang: 'es', full: false, conversation: true },
};

export const Empty = {
  name: 'Panel · Just opened',
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => `<div style="max-width:1108px">${panelHTML({ foot: true })}</div>`,
};

export const Mobile = {
  name: 'Panel · Mobile',
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  globals: { viewport: { value: 'mobile' } },
  render: () => panelHTML({ log: msgHTML('user', '¿Cuánto IVA tengo que pagar?') + msgHTML('bot', IVA_ANSWER) }),
};
