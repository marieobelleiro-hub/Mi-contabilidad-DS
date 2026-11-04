import aiRaw from '../tokens.css?raw';
import { subTokenTable } from './sub-tokens.js';

export default {
  title: 'Chatbot/Foundations/Colors',
  tags: ['!autodocs', '!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  globals: { backgrounds: { value: 'white' } },
};

const sw = (name, token, note) => `<div style="display:flex;flex-direction:column;gap:var(--space-8);width:200px">
  <i style="display:block;height:64px;background:var(${token});box-shadow:inset 0 0 0 1px var(--line)"></i>
  <b style="font-family:var(--font-mono);font-size:var(--text-12)">${token}</b><span style="font-size:var(--text-14)">${name}</span><span style="font-size:var(--text-12);color:var(--text-muted)">${note}</span></div>`;

export const Palette = {
  name: 'Assistant colours',
  render: () => `<div style="display:flex;flex-wrap:wrap;gap:var(--space-24)">
    ${sw('Panel background', '--ai-canvas', '= --primary-tint')}
    ${sw('Header', '--ai-header-bg', '= --primary · white text 5.0:1')}
    ${sw('Switch track on the header', '--ai-switch-track', 'own value · thumb 11.3:1')}
    ${sw('Your message', '--ai-msg-user-bg', '= --fill-hover · text 15.6:1')}
    ${sw('Reply', '--ai-msg-bot-bg', '= --surface + 1px --line')}
    ${sw('Note bar', '--ai-note-line', '= --attention')}
  </div>`,
};

export const ColorTokens = { name: 'Colour tokens', render: () => subTokenTable(aiRaw, { only: /Panel|Header|Messages|chip/i }) };
