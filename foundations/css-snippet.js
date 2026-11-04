// Builds the self-contained CSS of one component for its docs page:
// fonts + only the tokens it uses (followed through every reference) + base styles + icon class + the component itself.
// Pasted together with the HTML from the Code tab, it gives exactly the component shown in Storybook.
import tokensRaw from '../tokens/tokens.css?raw';
import baseRaw from '../tokens/base.css?raw';
import iconsRaw from '../icons/icons.css?raw';

const FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=IBM+Plex+Sans:wght@300;400;500&display=swap">';

const tokenMap = (raw) => {
  const map = new Map();
  for (const m of raw.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) map.set(m[1], m[2].trim());
  return map;
};
let TOKENS = tokenMap(tokensRaw);

const usedTokens = (css) => {
  const found = new Set();
  const visit = (text) => {
    for (const m of text.matchAll(/var\((--[\w-]+)/g)) {
      const name = m[1];
      if (found.has(name) || !TOKENS.has(name)) continue;
      found.add(name);
      visit(TOKENS.get(name));
    }
  };
  visit(css);
  return [...TOKENS.keys()].filter((n) => found.has(n));   // keep the order of tokens.css
};

const strip = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n{3,}/g, '\n\n').trim();

/** Full snippet: <link> for the fonts + one <style> with everything the component needs. */
/* subTokens: a sub-system's token file (e.g. assistant/tokens.css), added to the main tokens. */
export const cssSnippet = (name, componentRaw, { icons = true, also = [], subTokens = '' } = {}) => {
  TOKENS = subTokens ? new Map([...tokenMap(tokensRaw), ...tokenMap(subTokens)]) : tokenMap(tokensRaw);
  const extra = also.map(([n, raw]) => `\n/* ── ${n} (appears in the ${name} examples) ── */\n${strip(raw)}\n`).join('');
  const parts = [strip(baseRaw), icons ? strip(iconsRaw) : '', extra, strip(componentRaw)].join('\n');
  const tokens = usedTokens(parts);
  return `${FONTS}
<style>
/* ── Tokens used by ${name} (from tokens.css) ── */
:root{
${tokens.map((t) => `  ${t}:${TOKENS.get(t)};`).join('\n')}
}

/* ── Base: box sizing, font, focus ring ── */
${strip(baseRaw)}
${icons ? `\n/* ── Icon ── */\n${strip(iconsRaw)}\n` : ''}${extra}
/* ── ${name} ── */
${strip(componentRaw)}
</style>`;
};
