const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const base = require('path').join(__dirname, '..', 'public') + require('path').sep;
const turns = () => new Promise((resolve) => setImmediate(resolve));

class Element {
  constructor(id = '') {
    this.id = id; this.html = ''; this.textContent = ''; this.dataset = {}; this.handlers = {};
    this.children = {}; this.value = ''; this.disabled = false; this.classList = { toggle() {} };
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

(async () => {
  const elements = Object.fromEntries(['view','drawer-root','popover-root','toast-root','page-title','add-contract','global-ai-button','reminders-button'].map((id) => [id, new Element(id)]));
  const nav = ['overview','library','board','story'].map((view) => { const e = new Element(); e.dataset.view = view; return e; });
  const memory = {};
  const storage = { getItem(key) { return memory[key] || null; }, setItem(key, value) { memory[key] = String(value); } };
  const document = { getElementById(id) { return elements[id]; }, querySelectorAll(selector) { return selector === '[data-view]' ? nav : []; } };
  let rendered;
  const window = {
    scrollTo() {},
    renderOverview(root, state, actions) { rendered = { name: 'overview', state, actions }; },
    renderLibrary(root, state, actions) { rendered = { name: 'library', state, actions }; },
    renderBoard(root, state, actions) { rendered = { name: 'board', state, actions }; },
    renderStory() { rendered = { name: 'story' }; }
  };
  class FakeFormData { get(key) { return ({ email: 'person@outside.example', assignee: 'Priya Nair' })[key]; } }
  const context = { window, document, localStorage: storage, fetch: async () => { throw new Error('offline'); }, FormData: FakeFormData,
    console, Date, Map, Set, JSON, Promise, Number, String, Array, RegExp, Error, Math,
    setTimeout: () => 0, clearTimeout: () => {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(base + 'fixtures.js', 'utf8'), context);
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 10);
  const date = [tomorrow.getFullYear(), String(tomorrow.getMonth() + 1).padStart(2, '0'), String(tomorrow.getDate()).padStart(2, '0')].join('-');
  const saved = JSON.parse(JSON.stringify(window.DEMO_CONTRACTS));
  saved.push({ id:'audit-verified', supplier:'Synthetic audit', title:'Transition test', status:'Monitoring', noticeVerified:true, noticeDate:date, flags:[], documents:[] });
  saved.push({ id:'audit-unverified', supplier:'Synthetic audit', title:'Unverified test', status:'Monitoring', noticeVerified:false, noticeDate:date, flags:[], documents:[] });
  memory['contract-desk-prototype-v1'] = JSON.stringify(saved);
  let source = fs.readFileSync(base + 'app.js', 'utf8');
  assert(source.includes('  initialise();'));
  source = source.replace('  initialise();', '  window.__audit = { state, sampleAnswer, demoQuestions, allSources };\n  initialise();');
  vm.runInContext(source, context);
  await turns(); await turns();
  assert.strictEqual(rendered.name, 'overview');
  assert.strictEqual(rendered.state.serverConnected, false);
  const item = (id) => rendered.state.contracts.find((contract) => contract.id === id);
  assert.strictEqual(item('audit-verified').status, 'Action due');
  assert.ok(item('audit-verified').flags.some((flag) => flag.label === 'Renewal due'));
  assert.strictEqual(item('audit-verified').auditLog.length, 1);
  assert.strictEqual(item('audit-unverified').status, 'Monitoring');
  assert.strictEqual(JSON.parse(memory['contract-desk-prototype-v1']).find((contract) => contract.id === 'audit-verified').status, 'Action due');
  rendered.actions.updateContract('audit-unverified', { noticeVerified:true });
  assert.strictEqual(item('audit-unverified').status, 'Action due');
  assert.strictEqual(JSON.parse(memory['contract-desk-prototype-v1']).find((contract) => contract.id === 'audit-unverified').status, 'Action due');
  rendered.actions.updateContract('audit-verified', { notes:'subsequent edit' });
  assert.strictEqual(item('audit-verified').auditLog.length, 1);
  for (const example of window.__audit.demoQuestions) {
    const result = window.__audit.sampleAnswer(example.question, null);
    assert.ok(result, `Missing sample answer: ${example.question}`);
    for (const evidence of result.evidence) {
      const contract = item(evidence.contractId);
      const document = contract.documents.find((doc) => doc.id === evidence.documentId);
      assert.ok(document.content.includes(evidence.quote));
    }
    const output = new Element();
    await rendered.actions.ask(example.question, output, null);
    assert.ok(output.innerHTML.includes('Example answer · synthetic data'));
    assert.ok(output.innerHTML.includes('SOURCE EVIDENCE'));
  }
  const staffing = item('staffing');
  rendered.actions.updateContract('staffing', { documents:[...staffing.documents, { id:'new-amendment', name:'New amendment', content:'Test amendment to staffing rate.' }] });
  assert.strictEqual(window.__audit.sampleAnswer('What is the staffing shift rate?', null), null);
  const output = new Element();
  await rendered.actions.ask('What is the staffing shift rate?', output, null);
  assert.ok(output.innerHTML.includes('Document search · AI not connected'));
  for (const view of ['library','board','story']) { nav.find((e) => e.dataset.view === view).handlers.click(); assert.strictEqual(rendered.name, view); }
  nav.find((e) => e.dataset.view === 'overview').handlers.click();
  await rendered.actions.openEmailSettings();
  assert.ok(elements['drawer-root'].innerHTML.includes('cannot send email'));
  const form = elements['drawer-root'].querySelector('#app-email-form');
  await form.handlers.submit({ preventDefault() {} });
  const emailRecords = JSON.parse(memory['contract-desk-demo-email-addresses-v1']);
  assert.strictEqual(emailRecords[0].email, 'person@outside.example');
  assert.strictEqual(emailRecords[0].assignee, 'Priya Nair');
  console.log('PASS: offline bootstrap and four-tab routing');
  console.log('PASS: notice transitions persist, verified-only, without duplicate audit entries');
  console.log('PASS: all four curated answers have exact existing source excerpts');
  console.log('PASS: adding an amendment invalidates a curated answer');
  console.log('PASS: offline email preference saves locally and reports no email sent');
})().catch((error) => { console.error(error); process.exit(1); });
