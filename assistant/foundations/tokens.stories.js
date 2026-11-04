import aiRaw from '../tokens.css?raw';
import { subTokenTable } from './sub-tokens.js';

export default {
  title: 'Chatbot/Foundations/Tokens',
  tags: ['!autodocs', '!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  globals: { backgrounds: { value: 'white' } },
};
export const AllTokens = { name: 'All assistant tokens', render: () => subTokenTable(aiRaw) };
