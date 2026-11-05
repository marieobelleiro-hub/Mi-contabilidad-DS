// Links a story to its component in the Figma library "Mi Contabilidad DS" (Design tab).
// figma('25:179') → the node with that id. Find an id in Figma: select the layer → Copy link (the node-id at the end, 25-179).
export const FIGMA_FILE = 'https://www.figma.com/design/1oz4hKarYzMsyY3QPhb0wC/Mi-Contabilidad-DS';
export const figma = (id) => ({ type: 'figma', url: `${FIGMA_FILE}?node-id=${id.replace(':', '-')}` });
