// Builds parts/eb5_body.html on the shared case study scaffolding.
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'parts');
const ed = fs.readFileSync(path.join(dir, 'edabroad_body.html'), 'utf8');

const IMG = {
  desktop: '/_blob/f2db24ce560af36945c92f528a5787dc',
  mobile: '/_blob/f6fb9e553793fab14e3a0c64ef39ab56',
  live: '/_blob/ecc4a80b765aa1743947bda9c7567efd'
};

const baseCss = ed.slice(0, ed.indexOf('</style>'));
const nav = ed.slice(ed.indexOf('  <!-- ================= NAV ================= -->'), ed.indexOf('  </header>') + '  </header>'.length);
const script = ed.slice(ed.indexOf('<script type="text/x-dc"')).replace('"height":9800', '"height":6400');
if (!baseCss || !nav.includes('<nav') || !script.includes('initToc(root, reduced)')) throw new Error('scaffold missing');

const h2 = (n, label, title) => '          <p class="cs-idx">' + n + ' / ' + label + '</p>\n          <h2 class="cs-h2">' + title + '</h2>';
const p = (txt) => '          <p class="cs-p">' + txt + '</p>';
const fig = (src, alt, cap) => [
  '          <figure class="cs-fig" data-reveal>',
  '            <img src="' + src + '" alt="' + alt + '" loading="lazy">',
  cap ? '            <figcaption>' + cap + '</figcaption>' : '',
  '          </figure>'
].filter(Boolean).join('\n');
const toc = [['about', 'The client'], ['brief', 'The brief'], ['role', 'My part'], ['website', 'The website'], ['results', 'Results']];
const steps = ['Competitor analysis', 'Content structure', 'Information architecture', 'Wireframes', 'UI design', 'Final mockups', 'Dev handoff'];

const body = [
  '<div class="{{themeClass}}" style="background: var(--canvas); min-height: 100vh;">',
  '<div id="home-root" ref="{{setRoot}}" class="sheet" style="position: relative; box-sizing: border-box; background: var(--canvas); color: var(--ink); font-family: \'Space Grotesk\', sans-serif; overflow-x: clip;">',
  '',
  '  <div data-top-sentinel aria-hidden="true" style="position: absolute; top: 0; left: 0; width: 1px; height: 1px;"></div>',
  '',
  nav,
  '',
  '  <!-- ================= CASE STUDY HEADER ================= -->',
  '  <section class="pad" style="box-sizing: border-box; width: 100%; padding: 64px 80px 48px 80px;">',
  '    <div class="wrap">',
  '      <a class="fill-link" href="Work.dc.html" style="font-size: 14.5px; font-weight: 600; padding-bottom: 4px;"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 8H3"></path><path d="M7 4L3 8l4 4"></path></svg>All work</a>',
  '      <div class="cs-head" data-reveal>',
  '        <p class="lbl" style="margin: 0 0 18px 0;">Case study / Website design at Supercharged Studio</p>',
  '        <h1 class="cs-title">EB5 Resources</h1>',
  '        <p class="cs-lede">End-to-end brand and website design for a global immigration consultancy.</p>',
  '      </div>',
  '      <dl class="cs-meta" data-reveal data-d="1">',
  '        <div><dt>My role</dt><dd>UX designer, website</dd></div>',
  '        <div><dt>Studio</dt><dd>Supercharged Studio</dd></div>',
  '        <div><dt>Built in</dt><dd>Webflow</dd></div>',
  '        <div><dt>Audience</dt><dd>High net worth families seeking U.S. residency</dd></div>',
  '      </dl>',
  '    </div>',
  '  </section>',
  '',
  '  <section class="pad" style="box-sizing: border-box; width: 100%; padding: 0 80px 96px 80px;">',
  '    <div class="wrap">',
  '      <figure class="cs-cover" data-reveal><img src="' + IMG.desktop + '" alt="EB5 Resources website pages: a hero over the Golden Gate Bridge reading Secure your future with EB-5 investment visas, a full service advisory section, and a list of current EB-5 projects in Washington DC, a steel mill and Houston."></figure>',
  '      <p class="cs-intro" data-reveal>We helped EB5 Resources launch a new brand and website that reflects clarity, empathy, and trust to cater to high net worth individuals seeking US immigration.</p>',
  '    </div>',
  '  </section>',
  '',
  '  <!-- ================= BODY: contents rail + chapters ================= -->',
  '  <section class="pad" style="box-sizing: border-box; width: 100%; padding: 0 80px 120px 80px;">',
  '    <div class="wrap cs-grid">',
  '      <nav class="cs-toc hide-sm" data-toc aria-label="On this page">',
  '        <p class="cap" style="margin: 0 0 14px 0;">On this page</p>',
  toc.map(([id, l]) => '        <a href="#' + id + '">' + l + '</a>').join('\n'),
  '      </nav>',
  '',
  '      <div class="cs-main">',
  '',
  '        <section id="about" class="cs-sec" data-reveal>',
  h2('01', 'About EB5 Resources', 'Founded by an investor who went through it.'),
  p('EB5 Resources is a trusted advisory firm that guides immigrant investors through the EB-5 visa process with empathy, expertise, and transparency. Founded by an EB-5 investor himself, the company combines lived experience with industry knowledge to offer personalised, risk-aware support for families seeking U.S. residency.'),
  '        </section>',
  '',
  '        <section id="brief" class="cs-sec" data-reveal>',
  h2('02', 'The brief', 'More than a visual update.'),
  p('When EB5 Resources approached us, they needed more than just a visual update, they needed a brand that could inspire trust and provide clarity during a complex life transition. We partnered with their team to build a brand identity and website that aligned with their mission: guiding clients with honesty, empathy, and security at every step of their journey.'),
  '          <div class="eb-values"><span>honesty</span><span>empathy</span><span>security</span></div>',
  p('We executed everything end to end, starting with the brand, working through design, and finally launching the site on Webflow for fast, responsive performance and easy maintenance. Every element of the brand was intentionally designed to support the emotional and financial weight of immigration.'),
  '        </section>',
  '',
  '        <section id="role" class="cs-sec" data-reveal>',
  h2('03', 'My part', 'The studio did the brand. I did the website.'),
  '          <div class="eb-scope">',
  '            <div class="side studio"><p class="k">Supercharged Studio</p><p class="t">Brand identity, end to end</p></div>',
  '            <div class="side me"><p class="k">Me, as UX designer</p><p class="t">The website, from research to handoff</p></div>',
  '          </div>',
  p('This was a Supercharged Studio project covering both the brand and the website. I worked only on the website, taking it from research through to a build-ready handoff:'),
  '          <ol class="eb-steps">',
  steps.map((s, i) => '            <li><span class="n">0' + (i + 1) + '</span><span class="t">' + s + '</span></li>').join('\n'),
  '          </ol>',
  '        </section>',
  '',
  '        <section id="website" class="cs-sec" data-reveal>',
  h2('04', 'The website', 'Calm, credible, and easy to read on any screen.'),
  fig(IMG.mobile, 'Three mobile screens of the EB5 Resources site: the Golden Gate hero with a Start your EB5 journey button, a featured blogs carousel on deep green, and an article page about bridge financing.', 'Mobile: the homepage, the blog and an article page.'),
  fig(IMG.live, 'The Current EB-5 Projects page open on a laptop at a cafe table, showing a multifamily development in Washington DC.', 'The live projects page.'),
  '        </section>',
  '',
  '        <section id="results" class="cs-sec" data-reveal>',
  h2('05', 'Results and concluding remarks', 'A credible voice in a space full of jargon.'),
  p('The rebrand gave EB5 Resources a distinct and credible voice in a space often filled with generic visuals and legal jargon. Their new identity instills confidence and warmth across every touchpoint including pitch decks, investor conversations, and the live website.'),
  p('Since launch, the brand has received strong feedback from industry stakeholders and prospective clients alike. More importantly, it now feels like a true reflection of the integrity and care behind the company. A brand built for the future, just like the journeys it helps guide.'),
  '          <p class="mg rot cs-thanks">Thank you for reading! :)</p>',
  '        </section>',
  '',
  '      </div>',
  '    </div>',
  '  </section>',
  '',
  '  <!-- ================= NEXT ================= -->',
  '  <section class="pad" style="box-sizing: border-box; width: 100%; padding: 0 80px 120px 80px;">',
  '    <div class="wrap">',
  '      <a class="cs-more" href="EdAbroad.dc.html" data-cursor="next case study" data-reveal>',
  '        <span class="lbl">Up next</span>',
  '        <span class="t">EdAbroad: study abroad advice that is not quietly selling you something</span>',
  '        <svg width="34" height="34" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10"></path><path d="M9 4l4 4-4 4"></path></svg>',
  '      </a>',
  '    </div>',
  '  </section>',
  '',
  '  <!-- ================= CLOSING ================= -->',
  '  <footer class="pad" style="box-sizing: border-box; width: 100%; padding: 34px 80px 42px 80px;">',
  '    <div class="wrap"><p style="margin: 0; font-size: 14px; color: var(--ink-2);">© 2026 Mahesh Reddy Remala</p></div>',
  '  </footer>',
  '',
  '  <div class="grain" aria-hidden="true"></div>',
  '  <div class="curring" data-cursor-ring aria-hidden="true"><span class="cl" data-cursor-label></span></div>',
  '  <div class="curdot" data-cursor-dot aria-hidden="true"></div>',
  '',
  '</div>',
  '</div>',
  '</x-dc>',
  '',
  ''
].join('\n');

const css = [
  '',
  '/* ================= EB5 RESOURCES ================= */',
  '.eb-values { display: flex; flex-wrap: wrap; gap: 10px; margin: 6px 0 26px 0; }',
  '.eb-values span { padding: 10px 20px; border-radius: 999px; background: var(--p-peach); font-family: \'Space Grotesk\', sans-serif; font-size: 20px; letter-spacing: -0.015em; color: var(--ink); font-weight: 700; }',
  '.eb-scope { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 14px; margin: 0 0 28px 0; }',
  '.eb-scope .side { padding: 24px 26px; border-radius: 20px; border: 1px solid var(--border-strong); }',
  '.eb-scope .studio { background: transparent; }',
  '.eb-scope .studio .t { color: var(--ink-3); }',
  '.eb-scope .me { background: var(--primary); border-color: var(--primary); }',
  '.eb-scope .me .k, .eb-scope .me .t { color: var(--on-primary); }',
  '.eb-scope .k { margin: 0 0 8px 0; font-family: ui-monospace, \'SF Mono\', Menlo, Consolas, monospace; font-size: 12px; letter-spacing: .05em; color: var(--ink-3); }',
  '.eb-scope .t { margin: 0; font-family: \'Space Grotesk\', sans-serif; font-size: 22px; line-height: 1.25; letter-spacing: -0.02em; color: var(--ink); font-weight: 700; }',
  '.eb-steps { margin: 6px 0 0 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(7, minmax(0,1fr)); gap: 0; position: relative; }',
  '.eb-steps::before { content: ""; position: absolute; left: 14px; right: 14px; top: 13px; height: 2px; background: var(--border-strong); }',
  '.eb-steps li { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding-right: 8px; }',
  '.eb-steps .n { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 999px; background: var(--canvas); border: 2px solid var(--primary); font-family: ui-monospace, \'SF Mono\', Menlo, Consolas, monospace; font-size: 10.5px; color: var(--primary); font-weight: 600; transition: background-color .35s ease, color .35s ease; }',
  '.eb-steps li:hover .n { background: var(--primary); color: var(--on-primary); }',
  '.eb-steps .t { font-size: 14.5px; line-height: 1.35; color: var(--ink); font-weight: 600; }',
  '@media (max-width: 1020px) { .eb-steps { grid-template-columns: repeat(4, minmax(0,1fr)); row-gap: 22px; } .eb-steps::before { display: none; } }',
  '@media (max-width: 700px) { .eb-scope { grid-template-columns: minmax(0,1fr); } .eb-steps { grid-template-columns: minmax(0,1fr); row-gap: 12px; } .eb-steps li { flex-direction: row; align-items: center; } }',
  '</style>',
  '</helmet>',
  ''
].join('\n');

fs.writeFileSync(path.join(dir, 'eb5_body.html'), baseCss + css + body + script);
console.log('eb5_body.html written');
