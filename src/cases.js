// Real case studies, with the card markup shared by the homepage and Work page.
const cases = [
  { key: 'edabroad', sub: "Master's thesis, eight months end to end", name: 'EdAbroad', kicker: "EdAbroad / Master's thesis", wm: 'edabroad',
    line: 'Study abroad advice that is not quietly selling you something.',
    tags: ['Product strategy', 'UX research', 'End to end'], meta: '0→1 Product / 2025', tint: 'var(--p-lav)', h: 440,
    desc: 'An AI-powered platform that helps Indian creative students find the right programme, a real mentor and every deadline. Eight months of research, testing and design.',
    url: 'EdAbroad.dc.html', cats: ['product', 'research'] },
  { key: 'texitag', sub: "Garment tracing, research through to UI", name: 'Texitag', kicker: 'Texitag / Waste Management', wm: 'texitag',
    line: 'Making garment recycling personal, visual and worth doing.',
    tags: ['UX research', 'Strategy', 'UI design'], meta: 'Research / 2023', tint: 'var(--p-sage)', h: 420,
    desc: 'A garment tracing dashboard that shows people where their clothes end up, and makes recycling the obvious next step.',
    url: 'Texitag.dc.html', cats: ['product', 'research'] },
  { key: 'optimity', sub: "A B2B website for a micro-learning platform", name: 'Optimity', kicker: 'Optimity / Website', wm: 'optimity',
    line: 'A B2B site people actually stay on.',
    tags: ['UI design', 'Web', 'Client work'], meta: 'Web / Client work', tint: 'var(--p-peach)', h: 400,
    desc: 'A website for a micro-learning health platform, built to explain the product to business buyers. It holds a 55% bounce rate, 15 points better than the category.',
    url: 'Optimity.dc.html', cats: ['web'] },
  { key: 'eb5', sub: 'Website for a global immigration consultancy', name: 'EB5 Resources', kicker: 'EB5 Resources / Immigration advisory', wm: 'eb5',
    line: 'Clarity and trust for families moving their lives to the U.S.',
    tags: ['UX', 'Information architecture', 'Webflow'], meta: 'Web / Supercharged Studio', tint: 'var(--p-peach)', h: 420,
    desc: 'The website for an EB-5 advisory firm founded by an investor himself, designed to feel honest and calm for families making a big, expensive move. I owned the website; the studio did the brand.',
    url: 'EB5Resources.dc.html', cats: ['web'] },
  { key: 'aiia', sub: "A non-profit site rebuilt around its users", name: 'AIIA', kicker: 'AIIA / Non-profit', wm: 'aiia',
    line: 'A non-profit site EB-5 investors can navigate.',
    tags: ['UX', 'UI', 'Architecture'], meta: 'Web / Client work', tint: 'var(--p-olive)', h: 420,
    desc: 'Rebuilt the architecture and interface of a non-profit site so investors and industry professionals can find what they came for, on any device.',
    url: null, cats: ['web', 'research'] },
  { key: 'ipl', sub: "Cricket on a watch face and a dashboard", name: 'IPL, off the phone', kicker: 'IPL / Multi-platform', wm: 'ipl',
    line: 'Cricket that fits a watch face and a dashboard.',
    tags: ['Smartwatch', 'Automotive', 'UX'], meta: 'Research / 2025', tint: 'var(--p-rose)', h: 420,
    desc: 'Taking the IPL app onto smartwatches and car infotainment, designing for a three second glance and for hands that are busy driving.',
    url: null, cats: ['research'] },
  { key: 'comicbuff', sub: "A chatbot for new comic collectors", name: 'Comic Buff', kicker: 'Comic Buff / Conversational UI', wm: 'comic buff',
    line: 'A chatbot that teaches comic collecting.',
    tags: ['Conversational UI', 'Voiceflow', 'Content'], meta: 'Fun / 2025', tint: 'var(--p-lav)', h: 400,
    desc: 'Grading, rarity and market trends broken into a chat a new collector can follow, built in Voiceflow on a curated content inventory.',
    url: null, cats: ['fun', 'research'] },
  { key: 'glassgarden', sub: "A terrarium game about careful decisions", name: 'Glass Garden', kicker: 'Glass Garden / Game design', wm: 'glass garden',
    line: 'Grow a terrarium, one careful decision at a time.',
    tags: ['Game design', 'Unity', '2D'], meta: 'Fun / 2025', tint: 'var(--p-sage)', h: 420,
    desc: 'A casual resource management game about water, sunlight and pests, designed in Figma and prototyped in Unity.',
    url: null, cats: ['fun'] }
];

const arrow = '<span class="parrow" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 11.5l7-7"></path><path d="M5.5 4.5h6v6"></path></svg></span>';

// one card; `pos` is the grid class for the homepage, or holes for the filterable Work page
const card = (c, opts = {}) => {
  const tag = c.url ? 'a' : 'div';
  const link = c.url ? ' href="' + c.url + '" data-cursor="read the case study"' : ' data-cursor="case study soon"';
  const soonCls = c.url ? '' : ' soon';
  const open = opts.work
    ? '        <div class="{{p.' + c.key + '.cls}}" hidden="{{p.' + c.key + '.hidden}}" style="view-transition-name: p-' + c.key + ';"><' + tag + ' class="proj' + soonCls + '"' + link + ' data-reveal>'
    : '        <' + tag + ' class="proj cell' + soonCls + '"' + link + ' data-reveal style="grid-column: ' + opts.pos + ';">';
  const close = opts.work ? '        </' + tag + '></div>' : '        </' + tag + '>';
  return [
    open,
    '          <div class="panel grow" style="background: ' + c.tint + '; height: ' + c.h + 'px;">',
    '            <p class="lbl" style="position: absolute; left: 34px; top: 30px; margin: 0; z-index: 2;">' + c.kicker + '</p>',
    '            <p class="cswm" aria-hidden="true">' + c.wm + '</p>',
    '            <div class="csbody">',
    '              <p class="csline">' + c.line + '</p>',
    '              <div style="display: flex; flex-wrap: wrap; gap: 8px;">' + c.tags.map((t) => '<span class="mk-tag">' + t + '</span>').join('') + '</div>',
    '            </div>',
    '            ' + (c.url ? arrow : '<span class="soonchip">Case study soon</span>'),
    '          </div>',
    '          <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 20px; flex-wrap: wrap; margin: 22px 4px 8px 4px;">',
    '            <h3 style="margin: 0; font-size: 21px; line-height: 1.35; font-weight: 400; color: var(--ink-2);"><span class="ttl" style="font-weight: 700; color: var(--ink);">' + c.name + '.</span> ' + c.sub + '</h3>',
    '            <p class="lbl" style="margin: 0; color: var(--petrol);">' + c.meta + '</p>',
    '          </div>',
    '          <p style="margin: 0 4px; font-size: 16px; line-height: 1.65; color: var(--ink-2); max-width: 62ch;">' + c.desc + '</p>',
    close
  ].join('\n');
};

module.exports = { cases, card };
