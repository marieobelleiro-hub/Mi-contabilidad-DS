// Layout & breakpoints: drawings for Foundations/Layout & breakpoints and the Showcase.
// Spec drawings (wireframes to scale), built with the design-system tokens: not screenshots.
import './layout-diagram.css';

const MOBILE_MAX = 1023, DESKTOP = 1024, PAGE = 1232, CONTENT = 1108, SIDEBAR = 124, COLUMN = 768, PHONE = 390;

/* ── Breakpoint ruler: 0 → 1440px ─────────────────────────────────────── */
export const breakpointRuler = () => {
  const max = 1440;
  const pct = (v) => `${(v / max) * 100}%`;
  const ticks = [0, PHONE, COLUMN, DESKTOP, PAGE, max];
  const el = document.createElement('div');
  el.className = 'lo-ruler';
  el.innerHTML = `
    <div class="lo-ruler__bands" role="img" aria-label="Mobile layout from 0 to ${MOBILE_MAX}px, desktop layout from ${DESKTOP}px. Mobile design width ${PHONE}px, desktop design width ${PAGE}px.">
      <div class="lo-band lo-band--mobile" style="width:${pct(DESKTOP)}"><b>Mobile layout</b><span>0 – ${MOBILE_MAX}px</span></div>
      <div class="lo-band lo-band--desktop" style="width:${pct(max - DESKTOP)}"><b>Desktop layout</b><span>${DESKTOP}px and up</span></div>
    </div>
    <div class="lo-ruler__sub" aria-hidden="true">
      <span style="left:0;width:${pct(COLUMN)}">column fills the screen</span>
      <span style="left:${pct(COLUMN)};width:${pct(DESKTOP - COLUMN)}">column 768, centred</span>
      <span style="left:${pct(DESKTOP)};width:${pct(PAGE - DESKTOP)}">content shrinks</span>
      <span style="left:${pct(PAGE)};width:${pct(max - PAGE)}">content 1108, centred</span>
    </div>
    <div class="lo-ruler__axis" aria-hidden="true">
      ${ticks.map((t) => `<i style="left:${pct(t)}" class="${t === DESKTOP ? 'is-bp' : ''}${t === max ? ' is-end' : ''}"><span>${t === max ? `${max}+` : t}</span></i>`).join('')}
      <em class="lo-frame" style="left:${pct(PHONE)}">Width</em>
      <em class="lo-frame" style="left:${pct(PAGE)}">Width</em>
    </div>`;
  return el;
};

/* ── Wireframes ───────────────────────────────────────────────────────── */
const dim = (cls, style, label) => `<span class="lo-dim ${cls}" style="${style}"><span>${label}</span></span>`;

export const desktopWire = () => {
  const s = 0.42;                      // scale: 1232px → 517px
  const px = (v) => `${Math.round(v * s)}px`;
  const el = document.createElement('figure');
  el.className = 'lo-wire';
  el.innerHTML = `
    <div class="lo-wire__canvas" style="width:${px(PAGE)}">
      ${dim('lo-dim--h', `left:0;width:${px(SIDEBAR)}`, SIDEBAR)}
      ${dim('lo-dim--h', `left:${px(SIDEBAR)};width:${px(CONTENT)}`, `${CONTENT} content`)}
      <div class="lo-screen" style="width:${px(PAGE)};height:${px(800)}" role="img" aria-label="Desktop layout: sidebar ${SIDEBAR}px on the left, top bar ${64}px, content ${CONTENT}px wide">
        <div class="lo-side" style="width:${px(SIDEBAR)}">
          <i class="lo-chip"></i>
          <i class="lo-nav is-on"></i><i class="lo-nav"></i><i class="lo-nav"></i><i class="lo-nav"></i><i class="lo-nav"></i>
          <span class="lo-fabs"><i></i><i></i></span>
        </div>
        <div class="lo-main" style="left:${px(SIDEBAR)}">
          <div class="lo-top" style="height:${px(132)}">
            <i class="lo-line" style="width:${px(220)}"></i>
            <span class="lo-years">${'<i></i>'.repeat(5)}<i class="is-on"></i></span>
          </div>
          <div class="lo-content" style="width:${px(CONTENT)}">
            <i class="lo-title"></i>
            <span class="lo-grid">${'<i class="lo-card"></i>'.repeat(4)}<i class="lo-card lo-card--tall"></i><i class="lo-card lo-card--tall"></i></span>
          </div>
        </div>
      </div>
      ${dim('lo-dim--h lo-dim--below', `left:0;width:${px(PAGE)}`, `${PAGE} · design width`)}
    </div>
    <figcaption><b>Desktop</b> · from ${DESKTOP}px · designed at ${PAGE}px (sidebar ${SIDEBAR} + content ${CONTENT}). Wider screens centre the content; narrower ones shrink it.</figcaption>`;
  return el;
};

export const mobileWire = () => {
  const s = 0.56;                      // scale: 390px → 218px
  const px = (v) => `${Math.round(v * s)}px`;
  const el = document.createElement('figure');
  el.className = 'lo-wire';
  el.innerHTML = `
    <div class="lo-wire__canvas" style="width:${px(PHONE)}">
      ${dim('lo-dim--h', `left:${px(16)};width:${px(PHONE - 32)}`, 'column · 16px margins')}
      <div class="lo-screen" style="width:${px(PHONE)};height:${px(844)}" role="img" aria-label="Mobile layout: no sidebar, section selector on top, one column, floating buttons in a dock">
        <div class="lo-mtop">
          <span class="lo-row"><i class="lo-chip"></i><i class="lo-line" style="width:${px(150)}"></i></span>
          <i class="lo-select"></i>
          <span class="lo-years">${'<i></i>'}<i class="is-on"></i></span>
        </div>
        <div class="lo-mcontent">
          <i class="lo-title"></i>
          <i class="lo-card lo-card--tall"></i><i class="lo-card"></i><i class="lo-card"></i>
        </div>
        <span class="lo-dock"><i></i><i></i></span>
      </div>
      ${dim('lo-dim--h lo-dim--below', `left:0;width:${px(PHONE)}`, `${PHONE} · design width`)}
    </div>
    <figcaption><b>Mobile</b> · up to ${MOBILE_MAX}px · designed at ${PHONE}px. One column; from ${COLUMN}px it stops growing and stays centred.</figcaption>`;
  return el;
};

/** Both wireframes side by side (Layout page + Showcase). */
export const layoutOverview = () => {
  const el = document.createElement('div');
  el.className = 'lo-overview';
  el.append(desktopWire(), mobileWire());
  return el;
};
