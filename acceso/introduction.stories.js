import { panelHTML, FLOWS } from './components/acceso-html.js';
export default {
  title: 'Accessibility assistant/Introduction',
  tags: ['!autodocs', '!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  globals: { backgrounds: { value: 'canvas' } },
};
export const Overview = { name: 'The assistant', render: () => `<div style="max-width:1108px">${panelHTML({ body: FLOWS.consult() })}</div>` };
