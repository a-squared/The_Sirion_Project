/* Contract Desk: local, illustrative procurement workspace. */
(() => {
  'use strict';

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const root = document.getElementById('view');
  const drawerRoot = document.getElementById('drawer-root');
  const popoverRoot = document.getElementById('popover-root');
  const toastRoot = document.getElementById('toast-root');
  const storageKey = 'contract-desk-prototype-v1';
  const offlineEmailKey = 'contract-desk-demo-email-addresses-v1';

  const state = {
    contracts: clone(window.DEMO_CONTRACTS || []),
    categories: (window.DEMO_CATEGORIES || []).slice(),
    role: 'Everyone',
    aiConfigured: false,
    emailConfigured: false,
    sampleEmailEnabled: false,
    serverConnected: false
  };
  let activeView = 'overview';
  let saveQueue = Promise.resolve();
  let toastTimer;

  // A curated demo answer is used only while all its source documents remain
  // exactly as supplied. Added or edited amendments invalidate the answer.
  const demoSignatures = new Map(state.contracts.map((contract) => [
    String(contract.id),
    JSON.stringify((contract.documents || []).map((document) => [document.id, document.name, document.content]))
  ]));
  const demoQuestions = [
    {
      question: 'When is the AC maintenance notice deadline?',
      contractId: 'ac-maintenance',
      answer: 'The illustrative notice deadline is 15 January 2027. The sample agreement says it renews for a further twelve months unless written notice is given by that date.',
      sources: [{
        documentId: 'ac-master',
        quote: 'Unless either party gives written notice by 15 January 2027, the agreement renews for a further twelve months.'
      }]
    },
    {
      question: 'What is the staffing shift rate?',
      contractId: 'staffing',
      answer: 'For a standard weekday sales-assistant shift in Zone A, the illustrative amendment sets a rate of ₹650 before tax from 1 August 2026. The original sample rate was ₹600. Other shift types and authorised extras need separate review.',
      sources: [
        {
          documentId: 'staffing-master',
          quote: 'A standard weekday sales-assistant shift in Zone A is ₹600 before tax, subject to any signed amendment.'
        },
        {
          documentId: 'staffing-amendment',
          quote: 'From 1 August 2026, the rate for a standard weekday sales-assistant shift in Zone A changes to ₹650 before tax.'
        },
        {
          documentId: 'staffing-amendment',
          quote: 'Other shift types and authorised extras remain governed by the applicable rate card.'
        }
      ]
    },
    {
      question: 'What service level applies to delivery and installation?',
      contractId: 'delivery',
      answer: 'The illustrative agreement says at least 98% of eligible installations in each calendar month must be completed within two business days of the agreed appointment date. Customer-requested rescheduling is excluded. A qualifying credit claim has a 30-day deadline; actual performance evidence is not included.',
      sources: [
        {
          documentId: 'delivery-master',
          quote: 'At least 98% of eligible installations in each calendar month must be completed within two business days of the agreed appointment date.'
        },
        {
          documentId: 'delivery-master',
          quote: 'Customer-requested rescheduling is excluded.'
        },
        {
          documentId: 'delivery-master',
          quote: 'Where the stated service level is missed, the retailer may request a credit equal to 2% of the affected month\'s service fee by submitting a qualifying claim within 30 days.'
        },
        {
          documentId: 'delivery-master',
          quote: 'No delivery log, service report, or claim record is included.'
        }
      ]
    },
    {
      question: 'What is the billing software price cap?',
      contractId: 'billing-software',
      answer: 'The illustrative agreement permits a proposed increase of up to 3% of the existing subscription fee at renewal, subject to its notice and other conditions. No proposed increase or invoice has been supplied.',
      sources: [
        {
          documentId: 'billing-master',
          quote: 'At renewal the supplier may propose an increase of up to 3% of the existing subscription fee, subject to the notice and other conditions in this agreement.'
        },
        {
          documentId: 'billing-master',
          quote: 'No actual usage records, proposed increase, or invoice is included.'
        }
      ]
    }
  ];
  const normaliseQuestion = (text) => String(text || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const getContract = (id) => state.contracts.find((contract) => String(contract.id) === String(id));
  const getDocument = (contractId, documentId) => {
    const contract = getContract(contractId);
    return contract && (contract.documents || []).find((document) => String(document.id) === String(documentId));
  };
  const currentSignature = (contract) => JSON.stringify((contract.documents || []).map((document) => [document.id, document.name, document.content]));
  const sourceId = (contract, document) => `${contract.id}--${document.id}`;
  const allSources = (scopeId) => state.contracts
    .filter((contract) => !scopeId || String(contract.id) === String(scopeId))
    .flatMap((contract) => (contract.documents || []).map((document) => ({
      id: sourceId(contract, document),
      title: `${contract.supplier} · ${document.name}`,
      content: String(document.content || ''),
      contractId: String(contract.id),
      documentId: String(document.id)
    })))
    .filter((source) => source.content);

  function toast(message) {
    clearTimeout(toastTimer);
    toastRoot.innerHTML = `<div class="toast" role="status">${esc(message)}</div>`;
    toastTimer = setTimeout(() => { toastRoot.innerHTML = ''; }, 4200);
  }

  async function api(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) }
    });
    let data;
    try { data = await response.json(); } catch (_) { throw new Error('The local service is unavailable.'); }
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
    return data;
  }

  function persist() {
    const snapshot = clone(state.contracts);
    try { localStorage.setItem(storageKey, JSON.stringify(snapshot)); } catch (_) { /* Server remains primary. */ }
    if (!state.serverConnected) return;
    saveQueue = saveQueue.catch(() => {}).then(async () => {
      try {
        await api('/api/state', { method: 'POST', body: JSON.stringify({ contracts: snapshot }) });
      } catch (_) {
        toast('Could not save to the local server. Your browser may retain this session.');
      }
    });
  }

  function setView(view) {
    if (!['overview', 'library', 'board', 'story'].includes(view)) view = 'overview';
    activeView = view;
    document.querySelectorAll('[data-view]').forEach((button) => {
      const selected = button.dataset.view === view;
      button.classList.toggle('is-active', selected);
      if (selected) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    const titles = { overview: 'Overview', library: 'Contracts Library', board: 'Team Board', story: 'Story' };
    document.getElementById('page-title').textContent = titles[view];
    popoverRoot.innerHTML = '';
    if (view === 'overview') window.renderOverview(root, state, actions);
    else if (view === 'library') window.renderLibrary(root, state, actions);
    else if (view === 'board') window.renderBoard(root, state, actions);
    else window.renderStory(root);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function updateContract(id, patch) {
    const index = state.contracts.findIndex((contract) => String(contract.id) === String(id));
    if (index < 0) return;
    state.contracts[index] = { ...state.contracts[index], ...patch };
    applyAutomaticTransitions();
    persist();
    setView(activeView);
  }

  function showSources(output, sources) {
    output.querySelectorAll('[data-source-contract]').forEach((button) => {
      button.addEventListener('click', () => openContract(button.dataset.sourceContract, button.dataset.sourceDocument));
    });
  }

  function evidenceHtml(items) {
    if (!items.length) return '<p class="app-result-note">No matching source was returned. Check the documents before acting.</p>';
    return `<div class="app-evidence"><span class="app-evidence-label">SOURCE EVIDENCE</span>${items.map((item) => `
      <button type="button" class="app-evidence-item" data-source-contract="${esc(item.contractId)}" data-source-document="${esc(item.documentId)}">
        <span><strong>${esc(item.title)}</strong><small>${esc(item.quote || 'Open the source document')}</small></span><span aria-hidden="true">↗</span>
      </button>`).join('')}</div>`;
  }

  function sampleAnswer(question, scopeId) {
    const example = demoQuestions.find((item) => normaliseQuestion(item.question) === normaliseQuestion(question));
    if (!example || (scopeId && scopeId !== example.contractId)) return null;
    const contract = getContract(example.contractId);
    if (!contract || currentSignature(contract) !== demoSignatures.get(example.contractId)) return null;
    const evidence = [];
    for (const item of example.sources) {
      const document = getDocument(example.contractId, item.documentId);
      if (!document || !String(document.content || '').includes(item.quote)) return null;
      evidence.push({
        contractId: example.contractId,
        documentId: item.documentId,
        title: `${contract.supplier} · ${document.name}`,
        quote: item.quote
      });
    }
    return { answer: example.answer, evidence };
  }

  function searchSources(question, sources) {
    const ignored = new Set(['what', 'when', 'where', 'which', 'does', 'have', 'about', 'with', 'that', 'this', 'from', 'into', 'the', 'and', 'our', 'for', 'are', 'was', 'has', 'how', 'contract', 'contracts', 'agreement']);
    const terms = normaliseQuestion(question).split(' ').filter((word) => word.length > 2 && !ignored.has(word));
    const results = [];
    for (const source of sources) {
      const chunks = source.content.split(/\n{2,}|\f+/).map((value) => value.replace(/\s+/g, ' ').trim()).filter(Boolean);
      for (const chunk of chunks) {
        const text = `${source.title} ${chunk}`.toLowerCase();
        const hits = terms.filter((term) => text.includes(term)).length;
        if (hits > 0) results.push({ ...source, quote: chunk.length > 300 ? `${chunk.slice(0, 297)}…` : chunk, hits });
      }
    }
    return results.sort((a, b) => b.hits - a.hits).slice(0, 5);
  }

  async function ask(question, output, scopeId = null) {
    const query = String(question || '').trim();
    if (!output || !query) return;
    output.innerHTML = '<div class="app-result-loading" role="status">Looking through the available documents…</div>';
    const sources = allSources(scopeId);
    const example = sampleAnswer(query, scopeId);
    if (example) {
      output.innerHTML = `<div class="app-result"><div class="app-result-top"><span class="badge badge-violet">Example answer · synthetic data</span></div><p>${esc(example.answer)}</p>${evidenceHtml(example.evidence)}</div>`;
      showSources(output, example.evidence);
      return;
    }
    if (!state.aiConfigured) {
      const matches = searchSources(query, sources);
      output.innerHTML = `<div class="app-result"><div class="app-result-top"><span class="badge badge-info">Document search · AI not connected</span></div><p>${matches.length ? 'These source passages may help. This is a keyword search, not an AI-generated answer.' : 'No matching passage was found in the available documents. An absent result does not establish that a term is missing.'}</p>${evidenceHtml(matches)}</div>`;
      showSources(output, matches);
      return;
    }
    try {
      const response = await api('/api/ask', {
        method: 'POST',
        body: JSON.stringify({
          question: query,
          sources: sources.map((source) => ({ id: source.id, title: source.title, content: source.content }))
        })
      });
      const matches = (response.evidence || []).map((item) => {
        const source = sources.find((candidate) => candidate.id === item.id);
        return source && item.quote && source.content.includes(item.quote) ? { ...source, quote: item.quote } : null;
      }).filter(Boolean);
      output.innerHTML = `<div class="app-result"><div class="app-result-top"><span class="badge badge-success">AI response · review sources</span></div><p class="app-answer">${esc(response.answer || 'No answer was returned.')}</p>${evidenceHtml(matches)}<p class="app-result-note">Review the applicable agreement and any amendments before acting.</p></div>`;
      showSources(output, matches);
    } catch (error) {
      output.innerHTML = `<div class="app-result app-result--error"><strong>Could not reach the AI model.</strong><p>${esc(error.message)}</p></div>`;
    }
  }

  function closeDrawer() { drawerRoot.innerHTML = ''; }

  function openContract(id, selectedDocument) {
    const contract = getContract(id);
    if (!contract) return;
    const documents = Array.isArray(contract.documents) ? contract.documents : [];
    const support = Array.isArray(contract.supportingEvidence) ? contract.supportingEvidence : [];
    const flags = Array.isArray(contract.flags) ? contract.flags : [];
    drawerRoot.innerHTML = `<div class="drawer-overlay" data-app-overlay>
      <section class="drawer" role="dialog" aria-modal="true" aria-labelledby="app-drawer-title" tabindex="-1">
        <header class="drawer-header"><div><div class="eyebrow">CONTRACTS LIBRARY</div><h2 id="app-drawer-title" class="app-drawer-title">${esc(contract.supplier)}</h2><p class="muted app-drawer-subtitle">${esc(contract.title)}</p></div><button class="icon-button app-close" type="button" data-close-drawer aria-label="Close">×</button></header>
        <div class="drawer-body">
          <div class="app-chips">${flags.map((flag) => `<span class="badge ${flag.severity === 'danger' ? 'badge-danger' : flag.severity === 'warning' ? 'badge-warning' : 'badge-violet'}">${esc(flag.label || flag)}</span>`).join('')}</div>
          <div class="app-facts">
            <div><span>Category</span><strong>${esc(contract.category || 'Unknown')}</strong></div>
            <div><span>Contract value</span><strong>${contract.valueCr == null || contract.valueCr === '' ? 'Not recorded' : `₹${esc(contract.valueCr)} cr`}</strong></div>
            <div><span>Owner</span><strong>${esc(contract.owner || 'Unassigned')}</strong></div>
            <div><span>Notice deadline</span><strong>${contract.noticeVerified && contract.noticeDate ? esc(formatDate(contract.noticeDate)) : 'Not verified'}</strong></div>
          </div>
          <p class="app-disclosure">Illustrative contract records are not signed or verified agreements. Check the applicable source and amendments before acting.</p>
          <section><div class="app-section-head"><h3>Agreement &amp; related documents</h3><button class="button button-ghost" type="button" id="app-add-amendment">+ Add document</button></div>
            ${documents.length ? `<div class="app-documents">${documents.map((document) => `<details class="app-document" data-document-id="${esc(document.id)}"${String(document.id) === String(selectedDocument || '') ? ' open' : ''}><summary><span class="app-doc-icon">▤</span><span><strong>${esc(document.name)}</strong><small>${esc(document.kind || 'Linked document')}</small></span><span aria-hidden="true">⌄</span></summary><div class="app-document-content">${document.url && /^\/api\/file\/[a-zA-Z0-9-]+$/.test(document.url) ? `<a class="app-source-link" href="${esc(document.url)}" target="_blank" rel="noopener">Open original document ↗</a>` : ''}<pre>${esc(document.content || 'No extracted text is available.')}</pre></div></details>`).join('')}</div>` : '<p class="app-empty">No source documents are linked yet.</p>'}
          </section>
          ${support.length ? `<section><h3>Supporting evidence</h3><p class="muted">These illustrative records are separate from the agreement.</p>${support.map((item) => `<details class="app-document"><summary><span class="app-doc-icon">▤</span><span><strong>${esc(item.name)}</strong><small>${esc(item.kind || 'Supporting evidence')}</small></span><span aria-hidden="true">⌄</span></summary><div class="app-document-content"><pre>${esc(item.content)}</pre></div></details>`).join('')}</section>` : ''}
          <div class="app-drawer-actions"><button type="button" class="button button-primary" id="app-ask-contract">Ask about this contract</button><button type="button" class="button button-outline" id="app-board-contract">Open Team Board</button></div>
        </div>
      </section>
    </div>`;
    const overlay = drawerRoot.querySelector('[data-app-overlay]');
    drawerRoot.querySelector('[data-close-drawer]').addEventListener('click', closeDrawer);
    overlay.addEventListener('click', (event) => { if (event.target === overlay) closeDrawer(); });
    drawerRoot.querySelector('.drawer').addEventListener('keydown', (event) => { if (event.key === 'Escape') closeDrawer(); });
    drawerRoot.querySelector('#app-ask-contract').addEventListener('click', () => openAiDrawer(id));
    drawerRoot.querySelector('#app-board-contract').addEventListener('click', () => { closeDrawer(); setView('board'); });
    drawerRoot.querySelector('#app-add-amendment').addEventListener('click', () => showAddDocument(id));
    drawerRoot.querySelector('.drawer').focus();
  }

  function formatDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return 'Unknown';
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function dayDiff(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return null;
    const parsed = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) return null;
    const now = new Date();
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((parsed.getTime() - today) / 86400000);
  }

  function applyAutomaticTransitions() {
    state.contracts = state.contracts.map((contract) => {
      const days = contract.noticeVerified ? dayDiff(contract.noticeDate) : null;
      if (contract.status !== 'Monitoring' || days === null || days > 90) return contract;
      const flags = Array.isArray(contract.flags) ? contract.flags : [];
      const hasRenewalFlag = flags.some((flag) => /renewal due/i.test(String(flag.label || flag)));
      return {
        ...contract,
        status: 'Action due',
        flags: hasRenewalFlag ? flags : [...flags, { label: 'Renewal due', severity: 'danger' }],
        auditLog: [...(Array.isArray(contract.auditLog) ? contract.auditLog : []), {
          at: new Date().toISOString(),
          actor: 'System',
          action: 'Moved to Action due because a verified notice date is within 90 days or overdue.'
        }]
      };
    });
  }

  function openReminders() {
    const due = state.contracts.filter((contract) => contract.noticeVerified && contract.noticeDate)
      .map((contract) => ({ contract, days: dayDiff(contract.noticeDate) }))
      .filter((entry) => entry.days !== null && entry.days <= 90)
      .sort((a, b) => a.days - b.days);
    const unknown = state.contracts.filter((contract) => !contract.noticeVerified || !contract.noticeDate).length;
    popoverRoot.innerHTML = `<section class="popover app-reminders" role="dialog" aria-label="Reminders">
      <div class="app-popover-head"><div><span class="eyebrow">NOTIFICATION CENTRE</span><h2>Reminders</h2></div><button class="icon-button" type="button" id="app-close-popover" aria-label="Close">×</button></div>
      <p class="muted">Verified sample notice dates within 90 days, including overdue items.</p>
      <div class="app-reminder-list">${due.length ? due.map(({ contract, days }) => `<button type="button" class="app-reminder" data-reminder-id="${esc(contract.id)}"><span><strong>${esc(contract.title)}</strong><small>${esc(contract.supplier)} · ${esc(formatDate(contract.noticeDate))}</small></span><span class="badge ${days <= 30 ? 'badge-danger' : 'badge-warning'}">${days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `In ${days}d`}</span></button>`).join('') : '<p class="app-empty">No verified notice deadlines are due within 90 days.</p>'}</div>
      <p class="app-result-note">${unknown} contract${unknown === 1 ? '' : 's'} have an unknown or unverified notice date.</p>
      <button class="button button-outline app-wide" type="button" id="app-email-settings">Email notifications</button>
    </section>`;
    document.getElementById('reminders-button').setAttribute('aria-expanded', 'true');
    popoverRoot.querySelector('#app-close-popover').addEventListener('click', closePopover);
    popoverRoot.querySelector('#app-email-settings').addEventListener('click', () => { closePopover(); openEmailSettings(); });
    popoverRoot.querySelectorAll('[data-reminder-id]').forEach((button) => button.addEventListener('click', () => { closePopover(); openContract(button.dataset.reminderId); }));
  }

  function closePopover() {
    popoverRoot.innerHTML = '';
    document.getElementById('reminders-button').setAttribute('aria-expanded', 'false');
  }

  async function openEmailSettings() {
    let subscriptions = [];
    if (state.serverConnected) {
      try {
        const response = await api('/api/subscriptions');
        subscriptions = response.subscriptions || [];
      } catch (_) { /* A disconnected server is explained in the view. */ }
    } else {
      try { subscriptions = JSON.parse(localStorage.getItem(offlineEmailKey) || '[]'); } catch (_) { subscriptions = []; }
    }
    const available = state.emailConfigured && state.sampleEmailEnabled;
    drawerRoot.innerHTML = `<div class="drawer-overlay" data-app-overlay>
      <section class="drawer" role="dialog" aria-modal="true" aria-labelledby="app-email-title" tabindex="-1">
        <header class="drawer-header"><div><div class="eyebrow">NOTIFICATIONS</div><h2 id="app-email-title" class="app-drawer-title">Email updates</h2><p class="muted app-drawer-subtitle">Get assigned card details and upcoming notice reminders.</p></div><button class="icon-button app-close" type="button" data-close-drawer aria-label="Close">×</button></header>
        <div class="drawer-body">
          <p class="app-disclosure">${available ? 'Sample email delivery is configured for this local prototype.' : state.serverConnected ? 'Email delivery is not configured. Addresses can be saved on this computer; no email will be sent until a mail service is configured and sample email is enabled.' : 'This file preview can save an address in this browser but cannot send email. Start the local server and add the address again to configure delivery.'} Email contains only the original illustrative sample cards, not edits or uploaded documents. Real contract data requires authenticated access controls.</p>
          <form id="app-email-form" class="app-form">
            <label class="field"><span>Email address</span><input class="input" type="email" name="email" placeholder="you@example.com" required autocomplete="email"></label>
            <label class="field"><span>Team member name</span><input class="input" name="assignee" placeholder="Enter the name on your assigned cards" list="app-role-options" required><datalist id="app-role-options">${(window.DEMO_ROLES || []).filter((role) => role !== 'Everyone').map((role) => `<option value="${esc(role)}"></option>`).join('')}</datalist></label>
            <p class="app-result-note">Any valid email domain can be used. Match the name to the contract owner or co-owner.</p>
            <button class="button button-primary" type="submit">${available ? 'Add email &amp; send details' : 'Add email'}</button>
          </form>
          <section><div class="app-section-head"><h3>Added addresses</h3><span class="badge">${subscriptions.length}</span></div>
            ${subscriptions.length ? `<div class="app-subscriptions">${subscriptions.map((item) => `<div class="app-subscription"><span><strong>${esc(item.assignee)}</strong><small>${esc(item.email)}</small></span><div><button type="button" class="button button-ghost" data-send-subscription="${esc(item.id)}"${available ? '' : ' disabled'}>Send details</button><button type="button" class="button button-ghost" data-delete-subscription="${esc(item.id)}" aria-label="Remove ${esc(item.email)}">Remove</button></div></div>`).join('')}</div>` : '<p class="app-empty">No email addresses added yet.</p>'}
          </section>
          <p class="app-result-note">When configured and running, the sample service checks notice dates at 90, 60, 30 and 7 days. The role selector is a demo filter, not an access-control system.</p>
        </div>
      </section>
    </div>`;
    const overlay = drawerRoot.querySelector('[data-app-overlay]');
    drawerRoot.querySelector('[data-close-drawer]').addEventListener('click', closeDrawer);
    overlay.addEventListener('click', (event) => { if (event.target === overlay) closeDrawer(); });
    const form = drawerRoot.querySelector('#app-email-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const submit = form.querySelector('[type=submit]');
      submit.disabled = true;
      try {
        const entry = { email: String(data.get('email')).trim(), assignee: String(data.get('assignee')).trim() };
        let subscription;
        if (state.serverConnected) {
          subscription = await api('/api/subscriptions', { method: 'POST', body: JSON.stringify(entry) });
        } else {
          const saved = JSON.parse(localStorage.getItem(offlineEmailKey) || '[]');
          if (!saved.some((item) => item.email.toLowerCase() === entry.email.toLowerCase() && item.assignee.toLowerCase() === entry.assignee.toLowerCase())) {
            saved.push({ ...entry, id: `preview-${Date.now()}-${Math.random().toString(36).slice(2)}` });
            localStorage.setItem(offlineEmailKey, JSON.stringify(saved));
          }
        }
        if (available && subscription && subscription.id) {
          try {
            await api(`/api/subscriptions/${encodeURIComponent(subscription.id)}/send`, { method: 'POST', body: '{}' });
            toast('Email address added; the mail service accepted the card details.');
          } catch (error) {
            toast(`Address saved, but email delivery failed: ${error.message}`);
          }
        } else {
          toast(state.serverConnected ? 'Email saved. Delivery still needs to be configured.' : 'Address saved in this browser preview. No email was sent.');
        }
        await openEmailSettings();
      } catch (error) { toast(error.message); submit.disabled = false; }
    });
    drawerRoot.querySelectorAll('[data-delete-subscription]').forEach((button) => button.addEventListener('click', async () => {
      try {
        if (state.serverConnected) {
          await api(`/api/subscriptions/${encodeURIComponent(button.dataset.deleteSubscription)}`, { method: 'DELETE' });
        } else {
          const saved = JSON.parse(localStorage.getItem(offlineEmailKey) || '[]');
          localStorage.setItem(offlineEmailKey, JSON.stringify(saved.filter((item) => String(item.id) !== String(button.dataset.deleteSubscription))));
        }
        toast('Email address removed.');
        await openEmailSettings();
      } catch (error) { toast(error.message); }
    }));
    drawerRoot.querySelectorAll('[data-send-subscription]').forEach((button) => button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        await api(`/api/subscriptions/${encodeURIComponent(button.dataset.sendSubscription)}/send`, { method: 'POST', body: '{}' });
        toast('The email service accepted the message.');
      } catch (error) { toast(error.message); button.disabled = false; }
    }));
    drawerRoot.querySelector('.drawer').focus();
  }

  function openAiDrawer(scopeId = null) {
    const contract = scopeId ? getContract(scopeId) : null;
    drawerRoot.innerHTML = `<div class="drawer-overlay" data-app-overlay>
      <section class="drawer" role="dialog" aria-modal="true" aria-labelledby="app-ai-title" tabindex="-1">
        <header class="drawer-header"><div><div class="eyebrow">CONTRACT INTELLIGENCE</div><h2 id="app-ai-title" class="app-drawer-title">Ask AI</h2><p class="muted app-drawer-subtitle">${contract ? `Searching ${esc(contract.supplier)}'s linked documents.` : 'Searching the available contract documents.'}</p></div><button class="icon-button app-close" type="button" data-close-drawer aria-label="Close">×</button></header>
        <div class="drawer-body">
          <p class="app-disclosure">${state.aiConfigured ? 'Questions and selected contract text are sent to the configured model provider. Review the returned sources.' : 'AI is not connected. Curated sample questions and clearly labeled document search are available.'}</p>
          <form id="app-ai-form" class="app-form"><label class="field"><span>Your question</span><textarea class="input" name="question" placeholder="What would you like to know?" required></textarea></label><button class="button button-primary" type="submit">Ask about contracts</button></form>
          <div id="app-ai-output" aria-live="polite"></div>
        </div>
      </section>
    </div>`;
    const overlay = drawerRoot.querySelector('[data-app-overlay]');
    drawerRoot.querySelector('[data-close-drawer]').addEventListener('click', closeDrawer);
    overlay.addEventListener('click', (event) => { if (event.target === overlay) closeDrawer(); });
    const form = drawerRoot.querySelector('#app-ai-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      ask(data.get('question'), drawerRoot.querySelector('#app-ai-output'), scopeId);
    });
    drawerRoot.querySelector('.drawer').focus();
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Could not read the selected file.'));
      reader.onload = () => resolve(String(reader.result).split(',').slice(1).join(','));
      reader.readAsDataURL(file);
    });
  }

  async function uploadFile(file) {
    if (file.size > 8 * 1024 * 1024) throw new Error('Please choose a PDF or text file under 8 MB.');
    if (!state.serverConnected) {
      if (!/\.txt$/i.test(file.name)) throw new Error('Start the local server to add a PDF. Text files can be added in this browser preview.');
      const content = await file.text();
      if (!content.trim()) throw new Error('The selected text document is empty.');
      const id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `document-${Date.now()}`;
      return { id, name: file.name, content, kind: 'Text document · browser preview' };
    }
    const base64 = await fileToBase64(file);
    return api('/api/upload', { method: 'POST', body: JSON.stringify({ name: file.name, base64 }) });
  }

  function showAddDocument(id) {
    const contract = getContract(id);
    if (!contract) return;
    drawerRoot.innerHTML = `<div class="drawer-overlay" data-app-overlay>
      <section class="drawer" role="dialog" aria-modal="true" aria-labelledby="app-add-doc-title" tabindex="-1">
        <header class="drawer-header"><div><div class="eyebrow">CONTRACTS LIBRARY</div><h2 id="app-add-doc-title" class="app-drawer-title">Add a related document</h2><p class="muted app-drawer-subtitle">${esc(contract.supplier)} · ${esc(contract.title)}</p></div><button class="icon-button app-close" type="button" data-close-drawer aria-label="Close">×</button></header>
        <div class="drawer-body"><p class="app-disclosure">Linking a document does not automatically change the agreement’s governing terms. Review its applicability separately.</p><form id="app-doc-form" class="app-form"><label class="field"><span>PDF or text document</span><input class="input" type="file" name="document" accept=".pdf,.txt,application/pdf,text/plain" required></label><p class="app-result-note">Files stay in the local prototype. If you ask the configured AI a question, selected extracted text is sent to the model provider.</p><button type="submit" class="button button-primary">Add document</button></form></div>
      </section>
    </div>`;
    const overlay = drawerRoot.querySelector('[data-app-overlay]');
    drawerRoot.querySelector('[data-close-drawer]').addEventListener('click', closeDrawer);
    overlay.addEventListener('click', (event) => { if (event.target === overlay) closeDrawer(); });
    const form = drawerRoot.querySelector('#app-doc-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const file = new FormData(form).get('document');
      const submit = form.querySelector('[type=submit]');
      submit.disabled = true;
      submit.textContent = 'Adding…';
      try {
        const document = await uploadFile(file);
        updateContract(id, {
          documents: [...(contract.documents || []), document],
          flags: [...(contract.flags || []), { label: 'New document to review', severity: 'violet' }],
          status: 'Needs review'
        });
        toast('Document added. Review its terms before relying on them.');
        openContract(id, document.id);
      } catch (error) { toast(error.message); submit.disabled = false; submit.textContent = 'Add document'; }
    });
    drawerRoot.querySelector('.drawer').focus();
  }

  function addContract() {
    drawerRoot.innerHTML = `<div class="drawer-overlay" data-app-overlay>
      <section class="drawer" role="dialog" aria-modal="true" aria-labelledby="app-add-title" tabindex="-1">
        <header class="drawer-header"><div><div class="eyebrow">CONTRACTS LIBRARY</div><h2 id="app-add-title" class="app-drawer-title">Add a contract</h2><p class="muted app-drawer-subtitle">Add an agreement to the local workspace.</p></div><button class="icon-button app-close" type="button" data-close-drawer aria-label="Close">×</button></header>
        <div class="drawer-body"><p class="app-disclosure">This is a local prototype with illustrative data. Real deployment requires authenticated access and appropriate controls.</p>
          <form id="app-add-form" class="app-form">
            <label class="field"><span>Supplier</span><input class="input" name="supplier" required></label>
            <label class="field"><span>Contract title</span><input class="input" name="title" required></label>
            <label class="field"><span>Category</span><select class="input" name="category">${state.categories.map((category) => `<option>${esc(category)}</option>`).join('')}</select></label>
            <label class="field"><span>Contract value in ₹ crore <small class="muted">optional</small></span><input class="input" name="valueCr" type="number" min="0" step="0.01"></label>
            <label class="field"><span>Owner <small class="muted">optional</small></span><input class="input" name="owner"></label>
            <label class="field"><span>Signed agreement, PDF or text <small class="muted">optional</small></span><input class="input" type="file" name="document" accept=".pdf,.txt,application/pdf,text/plain"></label>
            <p class="app-result-note">Documents are stored locally. Asking a configured AI sends the selected extracted text to the model provider.</p>
            <button type="submit" class="button button-primary">Add to library</button>
          </form>
        </div>
      </section>
    </div>`;
    const overlay = drawerRoot.querySelector('[data-app-overlay]');
    drawerRoot.querySelector('[data-close-drawer]').addEventListener('click', closeDrawer);
    overlay.addEventListener('click', (event) => { if (event.target === overlay) closeDrawer(); });
    const form = drawerRoot.querySelector('#app-add-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const submit = form.querySelector('[type=submit]');
      submit.disabled = true;
      submit.textContent = 'Adding…';
      try {
        const file = data.get('document');
        const documents = file && file.size ? [await uploadFile(file)] : [];
        const id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `contract-${Date.now()}`;
        const value = String(data.get('valueCr') || '').trim();
        state.contracts.push({
          id,
          supplier: String(data.get('supplier') || '').trim(),
          title: String(data.get('title') || '').trim(),
          category: String(data.get('category') || ''),
          valueCr: value ? Number(value) : null,
          status: 'New in repository',
          owner: String(data.get('owner') || '').trim(),
          coOwner: '',
          flags: [{ label: 'Needs review', severity: 'violet' }],
          noticeDate: '',
          noticeVerified: false,
          expiryDate: '',
          documents,
          terms: [],
          notes: ''
        });
        persist();
        closeDrawer();
        setView('library');
        toast('Contract added. Review its documents and terms.');
      } catch (error) { toast(error.message); submit.disabled = false; submit.textContent = 'Add to library'; }
    });
    drawerRoot.querySelector('.drawer').focus();
  }

  const actions = {
    navigate: setView,
    openContract,
    ask,
    openReminders,
    addContract,
    openEmailSettings,
    updateContract,
    setRole: (role) => { state.role = role; setView(activeView); }
  };

  async function initialise() {
    try {
      const [statusResult, stateResult] = await Promise.all([
        api('/api/status'),
        api('/api/state')
      ]);
      state.serverConnected = true;
      state.aiConfigured = Boolean(statusResult.aiConfigured);
      state.emailConfigured = Boolean(statusResult.emailConfigured);
      state.sampleEmailEnabled = Boolean(statusResult.sampleEmailEnabled);
      if (Array.isArray(stateResult.contracts) && stateResult.contracts.length) state.contracts = stateResult.contracts;
      else {
        try {
          const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
          if (Array.isArray(saved) && saved.length) state.contracts = saved;
        } catch (_) { /* Use supplied samples. */ }
        persist();
      }
    } catch (_) {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
        if (Array.isArray(saved) && saved.length) state.contracts = saved;
      } catch (_) { /* Use supplied samples. */ }
    }
    applyAutomaticTransitions();
    persist();
    document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
    document.getElementById('add-contract').addEventListener('click', addContract);
    document.getElementById('global-ai-button').addEventListener('click', () => openAiDrawer());
    document.getElementById('reminders-button').addEventListener('click', () => {
      if (popoverRoot.innerHTML) closePopover(); else openReminders();
    });
    setView('overview');
  }

  initialise();
})();
