const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert');
const path = require('node:path');
const base = path.join(__dirname, '..', 'public') + path.sep;

class Element {
  constructor(id = '') {
    this.id = id;
    this.dataset = {};
    this.handlers = {};
    this.children = {};
    this.html = '';
    this.attrs = {};
    this.classList = { toggle() {} };
  }
  set innerHTML(value) { this.html = String(value); this.children = {}; }
  get innerHTML() { return this.html; }
  addEventListener(name, handler) { this.handlers[name] = handler; }
  setAttribute(name, value) { this.attrs[name] = value; }
  removeAttribute(name) { delete this.attrs[name]; }
  focus() {}
  querySelector(selector) { return this.children[selector] || (this.children[selector] = new Element(selector)); }
  querySelectorAll() { return []; }
}

(async () => {
  const expected = [
    ['overview', 'Home', 'home'],
    ['library', 'Contracts Library', 'library'],
    ['board', 'Team Board', 'board'],
    ['story', 'Rationale & Insights', 'rationale'],
    ['architecture', 'Architecture', 'architecture'],
  ];
  const html = fs.readFileSync(base + 'index.html', 'utf8');
  const navMarkup = html.match(/<nav class="primary-nav"[\s\S]*?<\/nav>/);
  assert.ok(navMarkup, 'The primary navigation should be present');
  const controls = [...navMarkup[0].matchAll(/<button\b[^>]*\bdata-view="([^"]+)"[^>]*>[\s\S]*?<span>([^<]+)<\/span>[\s\S]*?<\/button>/g)]
    .map((match) => [match[1], match[2].replace(/&amp;/g, '&')]);
  assert.deepStrictEqual(controls, expected.map(([id, title]) => [id, title]));

  const ids = ['view', 'drawer-root', 'popover-root', 'toast-root', 'page-title', 'add-contract', 'global-ai-button', 'reminders-button'];
  const elements = Object.fromEntries(ids.map((id) => [id, new Element(id)]));
  const nav = expected.map(([id]) => { const element = new Element(); element.dataset.view = id; return element; });
  const document = {
    getElementById(id) { return elements[id]; },
    querySelectorAll(selector) { return selector === '[data-view]' ? nav : []; },
  };
  let last = '';
  const window = {
    scrollTo() {},
    renderOverview(root) { last = 'home'; root.innerHTML = '<h2>Home</h2>'; },
    renderLibrary(root) { last = 'library'; root.innerHTML = '<h2>Contracts Library</h2>'; },
    renderBoard(root) { last = 'board'; root.innerHTML = '<h2>Team Board</h2>'; },
  };
  const localStorage = { getItem() { return null; }, setItem() {} };
  const context = { window, document, localStorage, fetch: async () => { throw Error('offline'); }, Date, JSON,
    Promise, Map, Set, Number, String, Array, RegExp, Error, Math, setTimeout: () => 0, clearTimeout() {}, console };
  vm.createContext(context);
  for (const file of ['fixtures.js', 'story.js', 'architecture.js']) vm.runInContext(fs.readFileSync(base + file, 'utf8'), context);
  const renderRationale = window.renderRationaleSection;
  const renderArchitecture = window.renderArchitectureSection;
  window.renderRationaleSection = (...args) => { last = 'rationale'; renderRationale(...args); };
  window.renderArchitectureSection = (...args) => { last = 'architecture'; renderArchitecture(...args); };
  vm.runInContext(fs.readFileSync(base + 'app.js', 'utf8'), context);
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));

  assert.strictEqual(last, 'home');
  assert.strictEqual(elements['page-title'].textContent, 'Home');
  for (let index = 0; index < expected.length; index += 1) {
    const [id, title, page] = expected[index];
    nav[index].handlers.click();
    assert.strictEqual(last, page, `${title} should render its own page`);
    assert.strictEqual(elements['page-title'].textContent, title);
    assert.strictEqual(nav[index].attrs['aria-current'], 'page');
    for (let other = 0; other < nav.length; other += 1) {
      if (other !== index) assert.ok(!nav[other].attrs['aria-current'], `${id} should be the only selected primary tab`);
    }
    if (id === 'story') {
      assert.ok(elements.view.innerHTML.includes('Tyran'));
      assert.ok(!elements.view.innerHTML.includes('data-rationale-page'), 'Rationale should not contain nested page tabs');
    }
    if (id === 'architecture') {
      assert.ok(elements.view.innerHTML.includes('assets/architecture-overview.jpeg'), 'Architecture should display the provided diagram');
      assert.ok(!elements.view.innerHTML.includes('data-rationale-page'), 'Architecture should be its own primary tab');
    }
  }
  console.log('PASS: all five primary tabs render their own pages with the correct title and selected state');
  console.log('PASS: the Architecture tab shows the supplied diagram and Rationale has no nested navigation');
})().catch((error) => { console.error(error); process.exit(1); });
