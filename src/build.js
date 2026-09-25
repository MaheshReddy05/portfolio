// Assembles every artboard from parts/: the same footer and back-to-top
// button on every page, and the note reader where notes can be opened.
const fs = require('fs');
const path = require('path');
const part = (f) => fs.readFileSync(path.join(__dirname, 'parts', f), 'utf8');

const head = part('a_head_hero.html').split('\n');
const lines = (a, b) => head.slice(a - 1, b).join('\n') + '\n';
const top = (title) => lines(1, 14).replace('<title>Mahesh, product designer</title>', '<title>' + title + '</title>');
// slice shared CSS by marker so adding rules never shifts what other pages get
const slice = (from, to) => {
  const s = head.findIndex((l) => l.startsWith(from));
  const e = head.findIndex((l) => l.startsWith(to));
  if (s < 0 || e < 0) throw new Error('slice markers not found: ' + from);
  return head.slice(s, e).join('\n') + '\n';
};

const pages = {
  'Main.dc.html': { src: part('a_head_hero.html') + part('b_work_think.html') + part('c_rest.html'), from: '  <!-- ================= CONTACT ================= -->', reader: true },
  'Work.dc.html': { src: top('Work by Mahesh') + slice('/* =====================================================================', '/* ================= HERO') + slice('/* ================= SELECTED WORK', '/* ================= PLAYGROUND') + part('work_top.html') + part('work_projects_existing.html') + part('work_projects_new.html') + part('work_tail.html'), from: '  <!-- ================= CLOSING ================= -->' },
  'About.dc.html': { src: top('About Mahesh') + slice('/* =====================================================================', '/* ================= HERO') + part('about_body.html'), from: '  <!-- ================= CLOSING ================= -->' },
  'Skills.dc.html': { src: top('Skill files by Mahesh') + slice('/* =====================================================================', '/* ================= HERO') + part('skills_body.html'), from: '  <!-- ================= CLOSING ================= -->' },
  'Notfound.dc.html': { src: top('Page not found') + slice('/* =====================================================================', '/* ================= HERO') + part('notfound_body.html'), from: '  <!-- ================= CLOSING ================= -->' },
  'EdAbroad.dc.html': { src: top('EdAbroad case study, Mahesh Reddy') + slice('/* =====================================================================', '/* ================= HERO') + part('edabroad_body.html'), from: '  <!-- ================= CLOSING ================= -->' },
  'Texitag.dc.html': { src: top('Texitag case study, Mahesh Reddy') + slice('/* =====================================================================', '/* ================= HERO') + part('texitag_body.html'), from: '  <!-- ================= CLOSING ================= -->' },
  'Optimity.dc.html': { src: top('Optimity case study, Mahesh Reddy') + slice('/* =====================================================================', '/* ================= HERO') + part('optimity_body.html'), from: '  <!-- ================= CLOSING ================= -->' },
  'EB5Resources.dc.html': { src: top('EB5 Resources case study, Mahesh Reddy') + slice('/* =====================================================================', '/* ================= HERO') + part('eb5_body.html'), from: '  <!-- ================= CLOSING ================= -->' },
  'Thoughts.dc.html': { src: top('Thoughts by Mahesh') + slice('/* =====================================================================', '/* ================= HERO') + part('thoughts_body.html'), from: '  <!-- ================= CLOSING ================= -->', reader: true }
};

const shared = {
  css: part('footer.css') + part('totop.css'),
  footer: part('footer.html').replace(/\n$/, ''),
  overlays: part('totop.html'),
  js: part('footer.js') + part('totop.js'),
  mount: '    this.initFooter(root, reduced);\n    this.initToTop(root, reduced);\n'
};
const reader = { css: part('reader.css'), html: part('reader.html'), js: part('reader.js'), mount: '    this.initReader(root, reduced);\n' };

const once = (s, find, label) => {
  const n = s.split(find).length - 1;
  if (n !== 1) throw new Error(label + ': expected 1 match, found ' + n);
};

for (const [name, cfg] of Object.entries(pages)) {
  let s = cfg.src;
  once(s, '</style>\n</helmet>', name + ' style end');
  s = s.replace('</style>\n</helmet>', shared.css + (cfg.reader ? reader.css : '') + '</style>\n</helmet>');

  once(s, cfg.from, name + ' footer start');
  once(s, '  </footer>', name + ' footer end');
  const a = s.indexOf(cfg.from);
  const b = s.indexOf('  </footer>') + '  </footer>'.length;
  s = s.slice(0, a) + shared.footer + s.slice(b);

  once(s, '  <div class="grain" aria-hidden="true"></div>', name + ' overlay anchor');
  s = s.replace('  <div class="grain" aria-hidden="true"></div>', shared.overlays + (cfg.reader ? reader.html : '') + '  <div class="grain" aria-hidden="true"></div>');

  once(s, '    this.initStickyNav(root);\n', name + ' mount hook');
  s = s.replace('    this.initStickyNav(root);\n', '    this.initStickyNav(root);\n' + shared.mount + (cfg.reader ? reader.mount : ''));
  once(s, '  renderVals() {', name + ' renderVals');
  s = s.replace('  renderVals() {', shared.js + (cfg.reader ? reader.js : '') + '  renderVals() {');

  fs.writeFileSync(path.join(__dirname, 'project', name), s);
  const count = (re) => (s.match(re) || []).length;
  console.log(name.padEnd(18), 'lines', String(s.split('\n').length).padStart(5),
    '| footer', count(/class="sitefoot/g), '| totop', count(/data-totop aria/g), '| reader', count(/data-reader hidden/g),
    '| notes', count(/data-note=/g), '| dashes', count(/[—–]/g));
}
