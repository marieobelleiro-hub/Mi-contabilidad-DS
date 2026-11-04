import { breakpointRuler, desktopWire, mobileWire, layoutOverview } from './layout-diagram.js';

export default {
  title: 'App/Foundations/Layout & breakpoints',
  tags: ['!autodocs', '!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  globals: { backgrounds: { value: 'white' } },
};

export const Ruler = { name: 'Breakpoints', render: () => breakpointRuler() };
export const Desktop = { render: () => desktopWire() };
export const Mobile = { render: () => mobileWire() };
export const Layouts = { name: 'Desktop & mobile', render: () => layoutOverview() };
