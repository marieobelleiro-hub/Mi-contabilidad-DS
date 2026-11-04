// Guardrail: components may only use tokens, never raw values.
// Fails (exit 1) on a raw colour, size, weight, line height, duration or z-index in the design-system CSS.
// Allowed: 0, values inside tokens/tokens.css, media queries (CSS can't use tokens there) as long as they use
// the one breakpoint (max-width:1023px / min-width:1024px),
// and lines marked /* lint-ok: reason */.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const files = [
  'tokens/base.css', 'icons/icons.css', 'assistant/assistant.css', 'acceso/acceso.css',
  ...readdirSync('components').flatMap((d) => readdirSync(join('components', d)).filter((f) => f.endsWith('.css')).map((f) => join('components', d, f))),
];

const RULES = [
  ['raw colour', /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(/i],
  ['raw size', /(?<![\w-])-?\d*\.?\d+(px|rem|em)\b/],
  ['raw font weight', /font-weight\s*:\s*\d/],
  ['raw line height', /line-height\s*:\s*\d/],
  ['raw duration', /(?<![\w-])\d*\.?\d+m?s\b/],
  ['raw z-index', /z-index\s*:\s*-?\d/],
];

const problems = [];
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  let inComment = false;
  lines.forEach((raw, i) => {
    let line = raw;
    if (line.includes('lint-ok')) return;
    // strip comments (also multi-line)
    if (inComment) { const end = line.indexOf('*/'); if (end < 0) return; line = line.slice(end + 2); inComment = false; }
    line = line.replace(/\/\*.*?\*\//g, '');
    const start = line.indexOf('/*'); if (start >= 0) { line = line.slice(0, start); inComment = true; }
    if (/@media/.test(line)) {
      // One breakpoint only: mobile (max-width:1023px) · desktop (min-width:1024px) = --bp-desktop
      for (const w of line.matchAll(/(min|max)-width\s*:\s*(\d+)px/g)) {
        if (!(w[1] === 'max' && w[2] === '1023') && !(w[1] === 'min' && w[2] === '1024'))
          problems.push(`${file}:${i + 1}  breakpoint "${w[0]}"  →  use (max-width:1023px) or (min-width:1024px)`);
      }
      line = line.replace(/@media[^{]*/, '');
    }
    for (const [name, re] of RULES) {
      const m = line.match(re);
      if (m) problems.push(`${file}:${i + 1}  ${name} "${m[0]}"  →  use a token`);
    }
  });
}

if (problems.length) {
  console.error(`✗ ${problems.length} raw value(s) found. Components must use tokens (see tokens/tokens.css):\n`);
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`✓ lint: ${files.length} CSS files use tokens only`);
