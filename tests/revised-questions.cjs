const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');
const base = path.join(__dirname, '..', 'public');
const turn = () => new Promise((resolve) => setImmediate(resolve));
const copy = (value) => JSON.parse(JSON.stringify(value));

class Element {
  constructor(id = '') {
    this.id = id; this.html = ''; this.textContent = ''; this.dataset = {};
    this.handlers = {}; this.children = {}; this.value = ''; this.disabled = false;
    this.classList = { toggle() {} };
  }
  set innerHTML(value) { this.html = String(value); this.children = {}; }
  get innerHTML() { return this.html; }
  addEventListener(name, callback) { this.handlers[name] = callback; }
  setAttribute() {}
  removeAttribute() {}
  querySelector(selector) { return this.children[selector] || (this.children[selector] = new Element(selector)); }
  querySelectorAll() { return []; }
  focus() {}
}

async function boot(saved) {
  const elements = Object.fromEntries(['view', 'drawer-root', 'popover-root', 'toast-root', 'page-title', 'add-contract', 'global-ai-button', 'reminders-button'].map((id) => [id, new Element(id)]));
  const nav = ['overview', 'library', 'board', 'story'].map((view) => { const node = new Element(); node.dataset.view = view; return node; });
  const memory = {};
  const localStorage = { getItem(key) { return memory[key] || null; }, setItem(key, value) { memory[key] = String(value); } };
  const document = { getElementById(id) { return elements[id]; }, querySelectorAll(selector) { return selector === '[data-view]' ? nav : []; } };
  let rendered;
  const window = { scrollTo() {}, renderLibrary() {}, renderBoard() {}, renderStory() {} };
  const context = { window, document, localStorage, fetch: async () => { throw new Error('offline'); }, console,
    Date, Map, Set, JSON, Promise, Number, String, Array, RegExp, Error, Math, setTimeout: () => 0, clearTimeout: () => {} };
  vm.createContext(context);
  for (const file of ['legacy-demo-sources.js', 'fixtures.js', 'views.js']) vm.runInContext(fs.readFileSync(path.join(base, file), 'utf8'), context);
  window.renderOverview = (root, state, actions) => { rendered = { state, actions }; };
  if (saved) memory['contract-desk-prototype-v1'] = JSON.stringify(saved(window));
  let app = fs.readFileSync(path.join(base, 'app.js'), 'utf8');
  assert(app.includes('  initialise();'));
  app = app.replace('  initialise();', '  window.__audit = { state, sampleAnswer, demoQuestions, revisedDemoQuestions, allSources };\n  initialise();');
  vm.runInContext(app, context);
  await turn(); await turn(); await turn();
  return { window, elements, memory, rendered };
}

(async () => {
  const demo = await boot();
  const { window, rendered, elements } = demo;
  const questions = window.ASKSIRION_QUESTIONS;
  assert.strictEqual(questions.length, 14);
  assert.strictEqual(questions.filter((item) => item.featured).length, 4);
  assert.strictEqual(new Set(questions.map((item) => item.question)).size, questions.length);
  const find = (id) => rendered.state.contracts.find((contract) => contract.id === id);
  for (const { question } of questions) {
    const result = window.__audit.sampleAnswer(question, null);
    assert.ok(result, `Missing revised answer: ${question}`);
    assert.ok(result.answer && result.answer.trim(), `Empty revised answer: ${question}`);
    for (const evidence of result.evidence) {
      const contract = find(evidence.contractId);
      assert.ok(contract, `Missing contract for ${question}`);
      const source = [...(contract.documents || []), ...(contract.supportingEvidence || [])].find((item) => item.id === evidence.documentId);
      assert.ok(source, `Missing source ${evidence.documentId} for ${question}`);
      assert.ok(source.content.includes(evidence.quote), `Unmatched quote in ${evidence.documentId} for ${question}`);
    }
    const output = new Element();
    await rendered.actions.ask(question, output, null);
    assert.ok(output.innerHTML.includes(result.label || 'Example answer · synthetic data'), `Expected demo answer in output for: ${question}`);
  }
  const staffingQuestion = questions.find((item) => item.contractId === 'staffing').question;
  const staffing = find('staffing');
  const answer = window.__audit.sampleAnswer(staffingQuestion, null);
  assert.ok(answer.answer.includes('2,500'));
  assert.ok(answer.evidence.some((item) => item.documentId === 'staffing-invoice'));
  assert.ok(answer.evidence.some((item) => item.documentId === 'staffing-amendment'));
  rendered.actions.openContract('staffing', 'staffing-invoice');
  assert.ok(elements['drawer-root'].innerHTML.includes('data-document-id="staffing-invoice" open'), 'Supporting-evidence citation must open the selected record');
  const altered = copy(staffing.supportingEvidence);
  altered.find((item) => item.id === 'staffing-invoice').content += ' Revised invoice.';
  rendered.actions.updateContract('staffing', { supportingEvidence: altered });
  assert.strictEqual(window.__audit.sampleAnswer(staffingQuestion, null), null);
  const fallback = new Element();
  await rendered.actions.ask(staffingQuestion, fallback, null);
  assert.ok(fallback.innerHTML.includes('Document search · AI not connected'));
  assert.ok(!fallback.innerHTML.includes('Example answer · synthetic data'));
  console.log('PASS: all 14 revised questions return source-backed demo answers');
  console.log('PASS: citations include and open supporting records; edited evidence invalidates the sample answer');

  const previous = await boot((globals) => {
    const records = copy(globals.DEMO_CONTRACTS);
    for (const record of records) {
      const old = globals.LEGACY_DEMO_SOURCES[record.id];
      if (old) Object.assign(record, copy(old));
    }
    const ac = records.find((record) => record.id === 'ac-maintenance');
    ac.owner = 'Changed by user'; ac.status = 'Decision in progress'; ac.notes = 'User note to preserve';
    const billing = records.find((record) => record.id === 'billing-software');
    billing.documents.push({ id: 'user-added-document', name: 'User document', content: 'Preserve this document.' });
    const security = records.find((record) => record.id === 'security');
    security.terms[0].reviewed = true;
    records.push({ id: 'custom-contract', title: 'User contract', owner: 'User owner', documents: [{ id: 'user-source', content: 'Preserve.' }] });
    return records;
  });
  const previousContracts = previous.rendered.state.contracts;
  const oldAc = previousContracts.find((item) => item.id === 'ac-maintenance');
  assert.ok(oldAc.documents.some((item) => item.id === 'ac-site-variation'), 'Unchanged AC sources should upgrade');
  assert.strictEqual(oldAc.owner, 'Changed by user');
  assert.strictEqual(oldAc.status, 'Decision in progress');
  assert.strictEqual(oldAc.notes, 'User note to preserve');
  const oldBilling = previousContracts.find((item) => item.id === 'billing-software');
  assert.ok(oldBilling.documents.some((item) => item.id === 'user-added-document'));
  assert.ok(!oldBilling.supportingEvidence.some((item) => item.id === 'billing-usage'), 'Edited source collection must not be overwritten');
  const oldSecurity = previousContracts.find((item) => item.id === 'security');
  assert.ok(oldSecurity.supportingEvidence.some((item) => item.id === 'security-licence'));
  assert.strictEqual(oldSecurity.terms[0].reviewed, true);
  assert.ok(previousContracts.some((item) => item.id === 'custom-contract'));
  console.log('PASS: older untouched demo sources upgrade without overwriting user edits or uploaded records');
})().catch((error) => { console.error(error); process.exit(1); });
