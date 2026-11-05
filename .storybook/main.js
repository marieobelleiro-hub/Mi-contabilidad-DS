import remarkGfm from 'remark-gfm';

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  staticDirs: ['./public'],   // favicon.svg: the green DS square of the browser tab
  stories: ['../foundations/**/*.mdx', '../foundations/**/*.stories.js', '../showcase/**/*.stories.js', '../components/**/*.mdx', '../components/**/*.stories.js', '../assistant/**/*.mdx', '../assistant/**/*.stories.js', '../acceso/**/*.mdx', '../acceso/**/*.stories.js'],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } }, // Markdown tables
    },
    '@storybook/addon-a11y',
    '@storybook/addon-designs',   // the Design tab: the matching Figma component, live
  ],
  framework: { name: '@storybook/html-vite', options: {} },
  features: { actions: false, interactions: false,   // panels we don't use (no click logging, no interaction tests)
    sidebarOnboardingChecklist: false, menuOnboardingChecklist: false },   // no “Get started” box
  core: { disableWhatsNewNotifications: true },   // no “What's new in Storybook” notice
};
export default config;
