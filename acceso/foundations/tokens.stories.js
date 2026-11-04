import afRaw from '../tokens.css?raw';
import { subTokenTable } from '../../assistant/foundations/sub-tokens.js';
export default {
  title: 'Accessibility assistant/Foundations/Tokens',
  tags: ['!autodocs', '!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  globals: { backgrounds: { value: 'white' } },
};
export const AllTokens = { name: 'All Acceso fácil tokens', render: () => subTokenTable(afRaw) };
