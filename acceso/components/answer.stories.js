import { answerHTML, IVA_ANSWER, NOTE_ANSWER, DEF_ANSWER, STATUS } from './acceso-html.js';
export default {
  title: 'Accessibility assistant/Components/Answer',
  tags: ['!autodocs'],
  parameters: { layout: 'padded', controls: { disable: true } },
  globals: { backgrounds: { value: 'canvas' } },
};
const dark = (html) => `<div class="af-panel__body" style="background:var(--af-canvas);color:var(--af-text);max-width:1108px">${html}</div>`;
export const Figures = { name: 'Answer · Figures', render: () => dark(answerHTML(IVA_ANSWER)) };
export const Note = { name: 'Answer · With a note', render: () => dark(answerHTML(NOTE_ANSWER)) };
export const Definition = { name: 'Answer · Definition', render: () => dark(answerHTML(DEF_ANSWER)) };
export const Saved = { name: 'Answer · Confirmation', render: () => dark(answerHTML(STATUS)) };
