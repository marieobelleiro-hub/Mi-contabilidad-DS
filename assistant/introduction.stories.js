import { panelHTML, msgHTML, IVA_ANSWER, typingHTML } from './components/assistant-html.js';

export default {
  title: 'Chatbot/Introduction',
  tags: ['!autodocs', '!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  globals: { backgrounds: { value: 'canvas' } },
};

export const Overview = {
  name: 'The assistant',
  render: () => `<div style="max-width:1108px">${panelHTML({ log: msgHTML('user', '¿Cuánto IVA tengo que pagar?') + msgHTML('bot', IVA_ANSWER) })}</div>`,
};
