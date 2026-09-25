// Minimal local renderer for a .dc.html artboard: runs its Component's
// renderVals() and fills the template, so layout can be checked in a browser.
const fs = require('fs');
const path = require('path');

function render(file, stateOverrides) {
  const src = fs.readFileSync(file, 'utf8');
  const script = src.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
  const DCLogic = class { constructor(p) { this.props = p || {}; this.state = {}; } setState() {} };
  const Component = new Function('DCLogic', script + '\nreturn Component;')(DCLogic);
  const c = new Component({});
  Object.assign(c.state, stateOverrides || {});
  const vals = c.renderVals();

  const get = (scope, p) => p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);
  const fill = (tpl, scope) => {
    tpl = tpl.replace(/<sc-for list="\{\{([\w.]+)\}\}" as="(\w+)"[^>]*>([\s\S]*?)<\/sc-for>/g, (m, list, as, inner) =>
      (get(scope, list) || []).map((item) => fill(inner, { ...scope, [as]: item })).join(''));
    tpl = tpl.replace(/<sc-if value="\{\{([\w.]+)\}\}"[^>]*>([\s\S]*?)<\/sc-if>/g, (m, v, inner) => (get(scope, v) ? inner : ''));
    tpl = tpl.replace(/\s(?:on[A-Z]\w*|ref)="\{\{[\w.]+\}\}"/g, '');
    tpl = tpl.replace(/\shidden="\{\{([\w.]+)\}\}"/g, (m, v) => (get(scope, v) ? ' hidden' : ''));
    return tpl.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, p) => { const v = get(scope, p); return v == null ? '' : String(v); });
  };

  let body = src.match(/<x-dc>([\s\S]*?)<\/x-dc>/)[1].replace(/<\/?helmet>/g, '');
  body = fill(body, vals);
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
}

const [, , input, output, stateJson] = process.argv;
fs.writeFileSync(output, render(input, stateJson ? JSON.parse(stateJson) : {}));
console.log('rendered', path.basename(input), '->', path.basename(output));
