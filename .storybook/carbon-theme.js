// Storybook UI theme in the style of IBM Carbon (IBM Plex Sans / Mono, square corners), with the colours of our palette:
// --black #000 · --gray-600 #666 · --gray-250 #C6C6C6 · --gray-150 #DEDEDE · --gray-100 #E9E9E9 · --gray-50 #F4F4F4 · --blue #0F62FE.
// The sidebar is dark (#525252, the Acceso fácil panel): see manager-head.html.
import { create } from 'storybook/theming';

export const carbonTheme = create({
  base: 'light',
  brandTitle: 'Mi Contabilidad DS',
  brandUrl: './',
  fontBase: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif',
  fontCode: '"IBM Plex Mono", Menlo, "Courier New", monospace',
  colorPrimary: '#0F62FE',
  colorSecondary: '#0F62FE',
  appBg: '#F4F4F4',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#E9E9E9',
  appBorderRadius: 0,
  textColor: '#000000',
  textInverseColor: '#FFFFFF',
  textMutedColor: '#666666',
  barTextColor: '#666666',
  barHoverColor: '#0F62FE',
  barSelectedColor: '#0F62FE',
  barBg: '#FFFFFF',
  buttonBg: '#F4F4F4',
  buttonBorder: '#C6C6C6',
  booleanBg: '#DEDEDE',
  booleanSelectedBg: '#FFFFFF',
  inputBg: '#FFFFFF',
  inputBorder: '#C6C6C6',
  inputTextColor: '#000000',
  inputBorderRadius: 0,
});
