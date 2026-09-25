// Previous and next case study, side by side at the foot of each case study.
const CASES = {
  edabroad: {
    url: 'EdAbroad.dc.html', title: 'EdAbroad',
    line: 'Study abroad advice that is not quietly selling you something.',
    img: '/_blob/3fe48ebd774e2e720a4c4411d439c294',
    alt: 'The EdAbroad app logo beside a phone showing the app'
  },
  texitag: {
    url: 'Texitag.dc.html', title: 'Texitag',
    line: 'Garment recycling made personal, visual and worth doing.',
    img: '/_blob/6c27cb3c4a54cd6bcaf33ce91a7c6d21',
    alt: 'Texitag app screens showing a virtual closet of garments'
  },
  optimity: {
    url: 'Optimity.dc.html', title: 'Optimity',
    line: 'A B2B health platform site people actually stay on.',
    img: '/_blob/d06ba297ff82480a74763f9473568902',
    alt: 'Optimity website pages laid out at an angle'
  },
  eb5: {
    url: 'EB5Resources.dc.html', title: 'EB5 Resources',
    line: 'Clarity and trust for families moving to the U.S.',
    img: '/_blob/f2db24ce560af36945c92f528a5787dc',
    alt: 'The EB5 Resources website over a photo of the Golden Gate Bridge'
  }
};

const arrow = (dir) => '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  + (dir === 'prev' ? '<path d="M13 8H3"></path><path d="M7 4L3 8l4 4"></path>' : '<path d="M3 8h10"></path><path d="M9 4l4 4-4 4"></path>')
  + '</svg>';

const card = (key, dir) => {
  const c = CASES[key];
  if (!c) throw new Error('unknown case ' + key);
  return [
    '        <a class="cs-jump ' + dir + '" href="' + c.url + '" data-cursor="' + (dir === 'prev' ? 'previous' : 'next') + ' case study" data-reveal>',
    '          <span class="cs-jumpimg" aria-hidden="true"><img src="' + c.img + '" alt="" loading="lazy"></span>',
    '          <span class="cs-jumptext">',
    '            <span class="cs-jumplbl">' + arrow('prev') + (dir === 'prev' ? 'Previous' : 'Next') + arrow('next') + '</span>',
    '            <span class="cs-jumpttl">' + c.title + '</span>',
    '            <span class="cs-jumpline">' + c.line + '</span>',
    '          </span>',
    '        </a>'
  ].join('\n');
};

/* the section that replaces the old single "Up next" bar */
const nav = (prevKey, nextKey) => [
  '  <!-- ================= PREVIOUS AND NEXT ================= -->',
  '  <section class="pad" style="box-sizing: border-box; width: 100%; padding: 0 80px 120px 80px;">',
  '    <div class="wrap">',
  '      <div class="cs-jumps">',
  card(prevKey, 'prev'),
  card(nextKey, 'next'),
  '      </div>',
  '    </div>',
  '  </section>',
  ''
].join('\n');

const css = [
  "  '/* previous and next, one at each end */',",
  "  '.cs-jumps { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 20px; border-top: 1px solid var(--border); padding-top: 34px; }',",
  "  '.cs-jump { display: flex; gap: 18px; align-items: center; padding: 16px; border-radius: 22px; border: 1px solid var(--border); background: var(--raised); color: var(--ink); transition: transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease, border-color .4s ease; }',",
  "  '.cs-jump.next { flex-direction: row-reverse; text-align: right; }',",
  "  '.cs-jump:hover { transform: translateY(-4px); box-shadow: var(--shadow-lift); border-color: var(--primary); color: var(--ink); }',",
  "  '.cs-jumpimg { flex: none; width: 116px; height: 92px; border-radius: 14px; overflow: hidden; background: var(--sunken); }',",
  "  '.cs-jumpimg img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.22,1,.36,1); }',",
  "  '.cs-jump:hover .cs-jumpimg img { transform: scale(1.06); }',",
  "  '.cs-jumptext { min-width: 0; display: flex; flex-direction: column; gap: 4px; }',",
  "  '.cs-jumplbl { display: flex; align-items: center; gap: 7px; font-family: ui-monospace, \\'SF Mono\\', Menlo, Consolas, monospace; font-size: 11.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--primary); }',",
  "  '.cs-jump.prev .cs-jumplbl svg:last-child, .cs-jump.next .cs-jumplbl svg:first-child { display: none; }',",
  "  '.cs-jump.next .cs-jumplbl { justify-content: flex-end; }',",
  "  '.cs-jumpttl { font-family: \\'Space Grotesk\\', sans-serif; font-size: 24px; line-height: 1.15; letter-spacing: -0.022em; color: var(--ink); font-weight: 700; transition: color .35s ease; }',",
  "  '.cs-jump:hover .cs-jumpttl { color: var(--primary); }',",
  "  '.cs-jumpline { font-size: 14.5px; line-height: 1.5; color: var(--ink-2); }',",
  "  '@media (hover: none) { .cs-jump { border-color: var(--primary); } .cs-jumpttl { color: var(--primary); } }',",
  "  '@media (max-width: 860px) { .cs-jumps { grid-template-columns: minmax(0,1fr); } .cs-jump.next { flex-direction: row; text-align: left; } .cs-jump.next .cs-jumplbl { justify-content: flex-start; } }',",
  "  '@media (max-width: 700px) { .cs-jumpimg { width: 92px; height: 76px; } .cs-jumpttl { font-size: 20px; } .cs-jumpline { font-size: 13.5px; } }',"
].join('\n');

module.exports = { CASES, nav, css };
