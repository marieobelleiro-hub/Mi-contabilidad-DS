import { composerHTML, T } from './assistant-html.js';

export default {
  title: 'Chatbot/Components/Composer',
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
  globals: { backgrounds: { value: 'canvas' } },
};
const PH = { default: T.es.ph, pick: T.es.phPick, form: T.es.phForm };
export const Playground = {
  name: 'Composer',
  render: ({ placeholder, state, value }) => `<div style="max-width:900px;background:var(--ai-canvas);padding:var(--space-24)">${composerHTML({ placeholder: PH[placeholder], state, value })}</div>`,
  argTypes: {
    placeholder: { name: 'Hint', control: { type: 'select', labels: { default: 'Free question', pick: 'While a question card is open', form: 'While a form card is open' } }, options: ['default', 'pick', 'form'] },
    state: { name: 'State', control: 'select', options: ['default', 'focus'] },
    value: { name: 'Text', control: 'text', description: 'Delete it to see the hint' },
  },
  args: { placeholder: 'default', state: 'default', value: '¿Cuánto IVA tengo que pagar?' },
};
