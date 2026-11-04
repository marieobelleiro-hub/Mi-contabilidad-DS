// Storybook UI: Carbon-style theme and the name at the top of the sidebar
import { addons } from 'storybook/manager-api';
import { carbonTheme } from './carbon-theme.js';

addons.setConfig({ theme: carbonTheme });
