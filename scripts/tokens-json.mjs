// Converts tokens/tokens.css into dist/tokens.json, in the W3C Design Tokens format (DTCG).
// Read by AI assistants, Figma (variables / Tokens Studio) and other platforms.
// Every value and reference comes from tokens.css: never edit tokens.json by hand.
// No Node imports: Storybook also uses it in the browser (Foundations/Tokens).

// Group header in tokens.css → path in tokens.json
const GROUPS = [
  [/^Palette · ([\w]+)/, (m) => ['color', 'palette', m[1].toLowerCase()]],
  [/^Actions/, () => ['color', 'action']],
  [/^Data$/, () => ['color', 'data']],
  [/^Surfaces/, () => ['color', 'surface']],
  [/^Brand & states/, () => ['color', 'state']],
  [/^Typography · family/, () => ['font', 'family']],
  [/^Typography · size/, () => ['font', 'size']],
  [/^Typography · weight/, () => ['font', 'weight']],
  [/^Typography · line height/, () => ['font', 'leading']],
  [/^Spacing/, () => ['space']],
  [/^Radius/, () => ['radius']],
  [/^Icon/, () => ['icon']],
  [/^Elevation/, () => ['shadow']],
  [/^Border/, () => ['border']],
  [/^Layer/, () => ['layer']],
  [/^Motion/, () => ['motion']],
  [/^Layout/, () => ['layout']],
  [/^Assistant · (.+)/, (m) => ['assistant', slug(m[1])]],   // sub-system: Asistente inteligente
  [/^Acceso · (.+)/, (m) => ['acceso', slug(m[1])]],         // sub-system: Acceso fácil
];
const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// baseCss (optional): the main tokens, so a sub-system's references ({color.action.primary}) and types resolve.
export function tokensToJson(css, baseCss = '') {
  const parse = (src) => {
  const tokens = [];                       // { name, value, note, path }
  let path = ['misc'];
  for (const line of src.split('\n')) {
    const head = line.match(/^\s*\/\*\s*──\s*(.+?)\s*──\s*\*\/\s*$/);
    if (head) {
      const g = GROUPS.find(([re]) => re.test(head[1]));
      path = g ? g[1](head[1].match(g[0])) : ['component', slug(head[1])];
      continue;
    }
    const m = line.match(/^\s*(--[\w-]+)\s*:\s*([^;]+);\s*(?:\/\*\s*(.*?)\s*\*\/)?/);
    if (m) tokens.push({ name: m[1].slice(2), value: m[2].trim(), note: m[3] || '', path: [...path] });
  }
  return tokens;
  };
  const tokens = parse(css);
  const byName = Object.fromEntries([...parse(baseCss), ...tokens].map((t) => [t.name, t]));
  const ref = (name) => `{${[...byName[name].path, name].join('.')}}`;

  const typeOf = (t, seen = new Set()) => {
    const v = t.value;
    const r = v.match(/^var\(--([\w-]+)\)$/);
    if (r && byName[r[1]] && !seen.has(r[1])) return typeOf(byName[r[1]], seen.add(r[1]));
    if (t.path[0] === 'font' && t.path[1] === 'family') return 'fontFamily';
    if (t.path[0] === 'font' && t.path[1] === 'weight') return 'fontWeight';
    if (t.path[0] === 'shadow') return 'shadow';
    if (t.path[0] === 'motion') return 'duration';
    if (/^(#|rgba?\()/i.test(v)) return 'color';
    if (/^-?[\d.]+(px|em|rem|%)$/.test(v) || v === '0') return 'dimension';
    if (/^-?[\d.]+s$/.test(v)) return 'duration';
    if (/^-?[\d.]+$/.test(v)) return 'number';
    return undefined;                      // e.g. a CSS filter: kept as a string
  };
  const toValue = (t, type) => {
    const v = t.value;
    const r = v.match(/^var\(--([\w-]+)\)$/);
    if (r && byName[r[1]]) return ref(r[1]);
    if (type === 'fontFamily') return v.split(',').map((f) => f.trim().replace(/^'|'$/g, ''));
    if (type === 'fontWeight' || type === 'number') return Number(v);
    if (type === 'dimension') return v === '0' ? '0px' : v;
    if (type === 'duration') return v.startsWith('.') ? `0${v}` : v;
    if (type === 'shadow') {
      const [x, y, blur, color] = v.match(/^(\S+) (\S+) (\S+) (rgba\([^)]*\))$/).slice(1);
      return { offsetX: x === '0' ? '0px' : x, offsetY: y, blur, spread: '0px', color };
    }
    return v;
  };

  const out = {
    $description: 'Mi Contabilidad design system tokens. Generated from tokens/tokens.css by scripts/build.mjs: do not edit by hand.',
  };
  for (const t of tokens) {
    let node = out;
    for (const p of t.path) node = node[p] ??= {};
    const type = typeOf(t);
    node[t.name] = { $value: toValue(t, type), ...(type && { $type: type }), ...(t.note && { $description: t.note }), $extensions: { css: `var(--${t.name})` } };
  }
  return { json: out, count: tokens.length };
}

