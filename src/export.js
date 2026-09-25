// Turns the .dc.html artboards into an ordinary static website.
//
// The pages keep their own runtime: each .dc.html is already a complete HTML
// document, and the design runtime boots it straight from <x-dc>. So the export
// is a copy with three changes — vendor scripts added, links between artboards
// pointed at real pages, and /_blob/ ids pointed at files in assets/.
const fs = require('fs');
const path = require('path');

const here = __dirname;
const out = path.join(here, '..', 'docs');
const src = path.join(here, 'project');

/* artboard -> published page */
const PAGES = {
  'Main.dc.html': 'index.html',
  'Work.dc.html': 'work.html',
  'About.dc.html': 'about.html',
  'Thoughts.dc.html': 'thoughts.html',
  'Skills.dc.html': 'playground.html',
  'EdAbroad.dc.html': 'work/edabroad.html',
  'Texitag.dc.html': 'work/texitag.html',
  'Optimity.dc.html': 'work/optimity.html',
  'EB5Resources.dc.html': 'work/eb5-resources.html',
  'Notfound.dc.html': '404.html'
};

/* blob id -> path inside assets/, and where the file comes from now */
const ASSETS = {
  '78a60fc2e5b6615a039d5467358cb67d': ['portrait.webp', 'assets/'+'portrait.webp'],
  '1dc51ee14803055076c330b1cecd71c9': ['logos/black.webp', 'assets/'+'logos/black.webp'],
  '1eedbc90d84e2f8eaeeedef4982330cd': ['logos/white.webp', 'assets/'+'logos/white.webp'],
  'ca5d19d0709653cac4b90f0a2090e512': ['logos/violet.webp', 'assets/'+'logos/violet.webp'],
  '3fe48ebd774e2e720a4c4411d439c294': ['edabroad/ed-cover.png', 'assets/'+'edabroad/ed-cover.png'],
  '4e041ab2f3e2944dd69ec0ba2c8a9b43': ['edabroad/ed-venn.png', 'assets/'+'edabroad/ed-venn.png'],
  '27b43b10c760d637c04ee63b0a6ca445': ['edabroad/ed-application.png', 'assets/'+'edabroad/ed-application.png'],
  'e830f2f64fc1d65e128e043f114e480c': ['edabroad/ed-testing.png', 'assets/'+'edabroad/ed-testing.png'],
  '9f821fb834112888514da9d5d2cf9810': ['edabroad/ed-task-match.png', 'assets/'+'edabroad/ed-task-match.png'],
  'dae45aa8c905988bca60e65b36e90fa2': ['edabroad/ed-task-mentor.png', 'assets/'+'edabroad/ed-task-mentor.png'],
  '97adec2265a2ec251d3eb62e651b947e': ['edabroad/ed-task-walkthrough.png', 'assets/'+'edabroad/ed-task-walkthrough.png'],
  '6c27cb3c4a54cd6bcaf33ce91a7c6d21': ['texitag/tx-screens.png', 'assets/'+'texitag/tx-screens.png'],
  'd06ba297ff82480a74763f9473568902': ['optimity/op-cover.webp', 'assets/'+'optimity/op-cover.webp'],
  '76e42fa0332b45286b6374724fcaa307': ['optimity/op-live.webp', 'assets/'+'optimity/op-live.webp'],
  '885720a5a3f8e6636f7aaf86711dc826': ['optimity/op-mobile.webp', 'assets/'+'optimity/op-mobile.webp'],
  '04c35f9d0b632658cf05ed9f7ad0530e': ['optimity/op-system.webp', 'assets/'+'optimity/op-system.webp'],
  '6913b6efd3ab097263fc63f5bf3c9b3c': ['optimity/op-brand.webp', 'assets/'+'optimity/op-brand.webp'],
  '59f5bca8e6e38f17a3a93013f841a535': ['optimity/op-wireframes.webp', 'assets/'+'optimity/op-wireframes.webp'],
  'f2db24ce560af36945c92f528a5787dc': ['eb5/eb5-desktop.webp', 'assets/'+'eb5/eb5-desktop.webp'],
  'f6fb9e553793fab14e3a0c64ef39ab56': ['eb5/eb5-mobile.webp', 'assets/'+'eb5/eb5-mobile.webp'],
  'ecc4a80b765aa1743947bda9c7567efd': ['eb5/eb5-live.webp', 'assets/'+'eb5/eb5-live.webp'],
  '341b3175735f56d1c75bf5aeb5250a36': ['grain.png', 'assets/'+'grain.png'],
  '532bd04a314bea40837dfdce81e1235e': ['lenis.js', 'assets/'+'lenis.js'],
  '5be2cfbafeb25b968976c214d6b78d74': ['about/cinema.jpg', 'assets/'+'about/cinema.jpg'],
  '810c46854dab01ac9f8e80aba32fb969': ['about/comics.jpg', 'assets/'+'about/comics.jpg'],
  '6277ef89a97948bb6420e33354d881f8': ['about/sketchbook.jpg', 'assets/'+'about/sketchbook.jpg']
};

const VENDOR = ['react.production.min.js', 'react-dom.production.min.js', 'dc-runtime.js'];

/* a page one folder deep reaches the root with ../ */
const up = (page) => '../'.repeat(page.split('/').length - 1);

/* ---------- assets ---------- */
fs.rmSync(out, { recursive: true, force: true });
let copied = 0;
for (const [, [name, from]] of Object.entries(ASSETS)) {
  const a = path.join(here, from);
  if (!fs.existsSync(a)) throw new Error('missing asset: ' + from);
  const b = path.join(out, 'assets', name);
  fs.mkdirSync(path.dirname(b), { recursive: true });
  fs.copyFileSync(a, b);
  copied += 1;
}
for (const v of VENDOR) {
  fs.mkdirSync(path.join(out, 'vendor'), { recursive: true });
  fs.copyFileSync(path.join(here, '..', 'vendor', v), path.join(out, 'vendor', v));
}

/* ---------- pages ---------- */
let built = 0;
const report = [];
for (const [board, page] of Object.entries(PAGES)) {
  let html = fs.readFileSync(path.join(src, board), 'utf8');
  const root = up(page);

  /* the runtime and its two dependencies, before the page's own script */
  const tags = VENDOR.map((v) => '  <script src="' + root + 'vendor/' + v + '"></script>').join('\n');
  if (!html.includes('</head>')) throw new Error(board + ': no </head>');
  html = html.replace('</head>', tags + '\n</head>');

  /* links to other artboards */
  for (const [b, p] of Object.entries(PAGES)) {
    html = html.split('"' + b + '"').join('"' + root + p + '"');
  }

  /* assets */
  const seen = new Set();
  html = html.replace(/\/_blob\/([0-9a-f]{32})/g, (m, id) => {
    if (!ASSETS[id]) throw new Error(page + ': unmapped asset ' + id);
    seen.add(id);
    return root + 'assets/' + ASSETS[id][0];
  });

  /* nothing should still point at an artboard or a blob */
  const leftBoards = (html.match(/"[A-Za-z0-9]+\.dc\.html"/g) || []);
  const leftBlobs = (html.match(/_blob\//g) || []);
  if (leftBoards.length || leftBlobs.length) {
    throw new Error(page + ': leftovers ' + leftBoards.join(',') + ' blobs:' + leftBlobs.length);
  }

  const dest = path.join(out, page);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
  report.push('  ' + page.padEnd(24) + (html.length / 1024).toFixed(0) + ' KB, ' + seen.size + ' images');
  built += 1;
}

fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log('assets: ' + copied + ' | vendor: ' + VENDOR.length + ' | pages: ' + built);
console.log(report.join('\n'));
