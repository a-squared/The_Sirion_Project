/* Exercise the local API in process: no listener and no external email. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Readable } = require('node:stream');

const root = path.join(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'contract-desk-test-'));
fs.mkdirSync(path.join(temp, 'public'), { recursive: true });
for (const name of ['server.js', 'send_email.py']) fs.copyFileSync(path.join(root, name), path.join(temp, name));
fs.copyFileSync(path.join(root, 'public', 'fixtures.js'), path.join(temp, 'public', 'fixtures.js'));

delete process.env.OPENAI_API_KEY;
delete process.env.SMTP_HOST;
delete process.env.SMTP_FROM;
delete process.env.ENABLE_SAMPLE_EMAIL;
process.env.PORT = '3000';

const server = require(path.join(temp, 'server.js'));
const response = () => ({
  headers: {},
  statusCode: 200,
  headersSent: false,
  setHeader(key, value) { this.headers[key.toLowerCase()] = value; },
  writeHead(status, headers = {}) {
    this.statusCode = status;
    this.headersSent = true;
    for (const [key, value] of Object.entries(headers)) this.setHeader(key, value);
  },
  end(body = '') { this.body = Buffer.isBuffer(body) ? body : Buffer.from(String(body)); },
  destroy() { this.destroyed = true; }
});
async function request(method, url, body, extraHeaders = {}) {
  const chunks = body === undefined ? [] : [Buffer.from(JSON.stringify(body))];
  const req = Readable.from(chunks);
  req.method = method;
  req.url = url;
  req.headers = { host: '127.0.0.1:3000', ...(body === undefined ? {} : { 'content-type': 'application/json' }), ...extraHeaders };
  const res = response();
  await server.handleRequest(req, res);
  return {
    status: res.statusCode,
    headers: res.headers,
    body: res.body || Buffer.alloc(0),
    json: () => JSON.parse((res.body || Buffer.alloc(0)).toString('utf8'))
  };
}

(async () => {
  try {
    await server.prepareStorage();
    const status = await request('GET', '/api/status');
    assert.equal(status.status, 200);
    assert.equal(status.json().aiConfigured, false);
    assert.equal(status.json().emailConfigured, false);
    assert.equal((await request('GET', '/api/status', undefined, { host: 'evil.example:3000' })).status, 403);
    assert.equal((await request('POST', '/api/state', { contracts: [] }, { origin: 'https://evil.example' })).status, 403);

    const contract = { id: 'sample', supplier: 'Fictional supplier', title: 'Example', documents: [] };
    assert.equal((await request('POST', '/api/state', { contracts: [contract] })).status, 200);
    assert.equal((await request('GET', '/api/state')).json().contracts[0].supplier, 'Fictional supplier');
    assert.equal(fs.statSync(path.join(temp, '.data', 'state.json')).mode & 0o777, 0o600);

    const text = 'A synthetic agreement says notice is due 30 days before renewal.';
    const upload = await request('POST', '/api/upload', { name: 'example.txt', base64: Buffer.from(text).toString('base64') });
    assert.equal(upload.status, 200);
    assert.equal(upload.json().content, text);
    const original = await request('GET', upload.json().url);
    assert.equal(original.status, 200);
    assert.equal(original.body.toString(), text);

    const sub = await request('POST', '/api/subscriptions', { email: 'person@example.org', assignee: 'Priya Nair' });
    assert.equal(sub.status, 200);
    assert.equal((await request('GET', '/api/subscriptions')).json().subscriptions.length, 1);
    assert.equal((await request('POST', `/api/subscriptions/${sub.json().id}/send`, {})).status, 503);
    assert.equal((await request('GET', '/api/state')).json().sent.length, 0);

    const sources = [{ id: 's1', title: 'Synthetic agreement', content: text }];
    assert.equal((await request('POST', '/api/ask', { question: 'When is notice due?', sources })).status, 503);
    process.env.OPENAI_API_KEY = 'local-test-only';
    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        status: 'completed',
        output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify({
          answer: 'Notice is due 30 days before renewal.',
          evidence: [{ id: 's1', quote: 'notice is due 30 days before renewal' }]
        }) }] }]
      })
    });
    const ai = await request('POST', '/api/ask', { question: 'When is notice due?', sources });
    assert.equal(ai.status, 200);
    assert.deepEqual(ai.json().citations, ['s1']);
    assert.equal(ai.json().evidence[0].quote, 'notice is due 30 days before renewal');
    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        status: 'completed',
        output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify({
          answer: 'Unsupported claim.',
          evidence: [{ id: 's1', quote: 'not in the source' }]
        }) }] }]
      })
    });
    const unsupported = await request('POST', '/api/ask', { question: 'When is notice due?', sources });
    assert.equal(unsupported.status, 200);
    assert.deepEqual(unsupported.json().citations, []);
    assert.match(unsupported.json().answer, /not enough verifiable evidence/i);

    assert.equal(server.reminderStage(90), '90');
    assert.equal(server.reminderStage(30), '30');
    assert.equal(server.reminderStage(7), '7');
    assert.equal(server.reminderStage(-1), 'overdue');
    console.log('PASS: local host/origin restrictions and private state persistence');
    console.log('PASS: text upload and retrieval');
    console.log('PASS: arbitrary-domain email registration; unconfigured delivery fails closed');
    console.log('PASS: mocked model source validation and unsupported-answer fallback');
    console.log('PASS: reminder stages');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
