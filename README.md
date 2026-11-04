# Mi Contabilidad · Design System

Tokens, foundations and components for the Mi Contabilidad app, documented in Storybook.

## Run locally

```bash
npm install
npm run storybook        # http://localhost:6006
npm run build-storybook  # static site in storybook-static/
npm run lint             # fails if a component uses a raw value instead of a token
npm run build            # lint + dist/: CSS, script (charts + icons), icon sprite and files, tokens.json, AGENTS.md
npm run inline -- ../app_DEMO.html   # paste dist/ into the app
```

## Structure

```
tokens/        tokens.css (all values) · base.css (reset, focus ring)
icons/         icons.js (the icon set) · icons.css (.icon)
foundations/   Colors · Typography · Spacing · Icons · Tokens (MDX)
components/    one folder per component: CSS + stories + docs
showcase/      one page with everything, opened in its own browser tab
```

## For AI assistants

Read [`AGENTS.md`](AGENTS.md) first. Tokens as JSON: `dist/tokens.json`. Check your work with `npm run lint`.

## Rules

- Components only use tokens (`var(--…)`), never raw values.
- Spacing: `--space-2 … --space-48`, even values only.
- Text colours pass WCAG AA on white; one yellow focus ring everywhere.
