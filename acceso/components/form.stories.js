import { answerHTML, formHTML } from './acceso-html.js';
export default {
  title: 'Accessibility assistant/Components/Form on dark',
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
  globals: { backgrounds: { value: 'canvas' } },
};
const dark = (html) => `<div class="af-panel__body" style="background:var(--af-canvas);color:var(--af-text);max-width:1108px">${html}</div>`;
export const NewInvoice = {
  name: 'Nueva factura',
  render: ({ errors }) => dark(answerHTML(formHTML({ errors }))),
  argTypes: { errors: { name: 'Errors', control: 'boolean', description: 'What you see after pressing Guardar with empty fields' } },
  args: { errors: false },
};
