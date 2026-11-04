import { tokenDocs, tierDiagram } from './token-docs.js';

export default {
  title: 'App/Foundations/Tokens',
  tags: ['!autodocs', '!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  globals: { backgrounds: { value: 'white' } },
};

export const AllTokens = { name: 'All tokens', render: () => tokenDocs() };
export const Tiers = { name: 'Tiers', render: () => tierDiagram(), globals: { backgrounds: { value: 'canvas' } } };
