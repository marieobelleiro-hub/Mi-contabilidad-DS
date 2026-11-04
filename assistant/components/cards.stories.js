import { msgHTML, questionHTML, formHTML, SAVED, CLOSED } from './assistant-html.js';

export default {
  title: 'Chatbot/Components/Question & form cards',
  tags: ['!autodocs'],
  parameters: { layout: 'padded', controls: { disable: true } },
  globals: { backgrounds: { value: 'canvas' } },
};
const log = (html) => `<div class="ai-panel__log" style="max-width:900px;max-height:none;background:var(--ai-canvas);padding:var(--space-24)">${html}</div>`;

export const Question = {
  name: 'Question card',
  render: () => log(msgHTML('user', 'Añadir una factura') + msgHTML('bot', questionHTML())),
};
export const Form = {
  name: 'Form card',
  parameters: { controls: { disable: false } },
  render: ({ type, error }) => log(msgHTML('bot', formHTML({ type, error }))),
  argTypes: {
    type: { name: 'Type', control: { type: 'inline-radio', labels: { factura: 'Factura nacional (blue)', gasto: 'Nuevo gasto (orange)' } }, options: ['factura', 'gasto'] },
    error: { name: 'Error example', control: 'boolean', description: 'A wrong date, with its message', if: { arg: 'type', eq: 'gasto' } },
  },
  args: { type: 'gasto', error: false },
};
export const Done = {
  name: 'After the form',
  render: () => log(msgHTML('bot', SAVED) + msgHTML('bot', CLOSED)),
};
