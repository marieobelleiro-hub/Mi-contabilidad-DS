import afRaw from '../tokens.css?raw';
import { subTokenTable } from '../../assistant/foundations/sub-tokens.js';
export default {
  title: 'Accessibility assistant/Foundations/Colors',
  tags: ['!autodocs', '!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  globals: { backgrounds: { value: 'white' } },
};
const sw = (name, token, note, dark = false) => `<div style="display:flex;flex-direction:column;gap:var(--space-8);width:200px">
  <i style="display:block;height:64px;background:${dark ? 'var(--af-canvas)' : `var(${token})`};box-shadow:inset 0 0 0 1px var(--line);${dark ? `display:flex;align-items:center;padding:0 var(--space-12)` : ''}">${dark ? `<span style="font-style:normal;color:var(${token});font-size:var(--text-16)">Texto · Aa</span>` : ''}</i>
  <b style="font-family:var(--font-mono);font-size:var(--text-12)">${token}</b><span style="font-size:var(--text-14)">${name}</span><span style="font-size:var(--text-12);color:var(--text-muted)">${note}</span></div>`;
export const Palette = {
  name: 'Dark theme',
  render: () => `<div style="display:flex;flex-wrap:wrap;gap:var(--space-24)">
    ${sw('Panel', '--af-canvas', 'own value #525252')}
    ${sw('Text', '--af-text', '= --white · 7.8:1', true)}
    ${sw('Secondary text', '--af-text-muted', '= --gray-150 · 5.9:1', true)}
    ${sw('Error', '--af-error', 'own value · 4.7:1', true)}
    ${sw('Option', '--af-option-bg', '= --surface')}
    ${sw('Option, not chosen', '--af-option-dim', 'own value · black text 8.8:1')}
    ${sw('Chosen option border', '--af-option-selected', '= --attention · 5.5:1 on white')}
    ${sw('Confirmation bar', '--af-status-line', '= --brand · 6.1:1')}
  </div>`,
};
export const ColorTokens = { name: 'Colour tokens', render: () => subTokenTable(afRaw, { only: /Panel|Header|Option|Answer/ }) };
