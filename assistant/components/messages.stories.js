import { msgHTML, IVA_ANSWER, NOTE_ANSWER, CLARIFY, typingHTML } from './assistant-html.js';

export default {
  title: 'Chatbot/Components/Messages',
  tags: ['!autodocs'],
  parameters: { layout: 'padded', controls: { disable: true } },
  globals: { backgrounds: { value: 'canvas' } },
};
const log = (html) => `<div class="ai-panel__log" style="max-width:900px;max-height:none;background:var(--ai-canvas);padding:var(--space-24)">${html}</div>`;

export const Conversation = {
  name: 'Your message & the reply',
  render: () => log(msgHTML('user', '¿Cuánto IVA tengo que pagar?') + msgHTML('bot', IVA_ANSWER)),
};
export const Note = {
  name: 'Reply with a note',
  render: () => log(msgHTML('user', '¿Cuánto IVA pago este trimestre?') + msgHTML('bot', NOTE_ANSWER)),
};
export const Clarify = {
  name: 'Not understood',
  render: () => log(msgHTML('user', 'impuestos') + msgHTML('bot', CLARIFY)),
};
export const Typing = {
  name: 'Thinking',
  render: () => log(msgHTML('user', '¿Qué facturas tengo pendientes?') + typingHTML()),
};
