// Renders a page and then boots its real component code (componentDidMount)
// against the rendered DOM, so interactions can be tested in a browser.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const [, , input, output] = process.argv;
execFileSync(process.execPath, [path.join(__dirname, 'render.js'), input, output]);
const src = fs.readFileSync(input, 'utf8');
const js = src.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
const boot = '<script>(function(){'
  + 'window.requestAnimationFrame=function(cb){return setTimeout(function(){cb(performance.now());},16);};'
  + 'window.cancelAnimationFrame=function(id){clearTimeout(id);};'
  + 'var DCLogic=function(p){this.props=p||{};this.state={};};'
  + 'DCLogic.prototype.setState=function(s,cb){Object.assign(this.state,typeof s==="function"?s(this.state):s);if(cb)cb();};'
  + 'var Component=new Function("DCLogic",' + JSON.stringify(js + '\nreturn Component;') + ')(DCLogic);'
  + 'var c=new Component({});c.rootEl=document.getElementById("home-root");c.componentDidMount();window.__page=c;'
  + '})();</script>';
let html = fs.readFileSync(output, 'utf8').replace('</body>', boot + '</body>');
fs.writeFileSync(output, html);
console.log('booted', path.basename(output));
