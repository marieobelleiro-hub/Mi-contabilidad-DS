// Pastes dist/ into a single-file app between markers:
//   <style id="ds-css">…</style>   and   <script id="ds-js">…</script>  (old name: ds-chart)
// Usage: node scripts/inline.mjs path/to/app_DEMO.html
import { readFileSync, writeFileSync } from 'node:fs';

const app = process.argv[2];
if (!app) { console.error('Usage: node scripts/inline.mjs <app.html>'); process.exit(1); }
let html = readFileSync(app, 'utf8');
const css = readFileSync('dist/mi-contabilidad-ds.css', 'utf8');
const js = readFileSync('dist/mi-contabilidad-ds.js', 'utf8');
const swap = (re, block, name) => {
  if (!re.test(html)) { console.error(`Marker ${name} not found in ${app}`); process.exit(1); }
  html = html.replace(re, () => block);
};
swap(/<style id="ds-css">[\s\S]*?<\/style>/, `<style id="ds-css">\n${css}</style>`, '<style id="ds-css">');
swap(/<script id="ds-(?:js|chart)">[\s\S]*?<\/script>/, `<script id="ds-js">\n${js}</script>`, '<script id="ds-js">');
writeFileSync(app, html);
console.log(`Design system pasted into ${app}`);
