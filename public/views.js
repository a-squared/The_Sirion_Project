/* Overview and Contracts Library views. Records are illustrative unless added by the user. */
(() => {
  'use strict';

  const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const dateValue = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) ? String(value) : '';
  const parseDate = (value) => {
    const iso = dateValue(value);
    if (!iso) return null;
    const [year, month, day] = iso.split('-').map(Number);
    const result = new Date(year, month - 1, day);
    return result.getFullYear() === year && result.getMonth() === month - 1 && result.getDate() === day ? result : null;
  };
  const daysUntil = (value) => {
    const date = parseDate(value);
    if (!date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((date.getTime() - today.getTime()) / 86400000);
  };
  const formatDate = (value) => {
    const date = parseDate(value);
    return date ? date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not available';
  };
  const noticeVerified = (contract) => contract.noticeVerified === true;
  const contractArray = (state) => Array.isArray(state.contracts) ? state.contracts : [];
  const flagName = (flag) => typeof flag === 'string' ? flag : String((flag && (flag.label || flag.name)) || '');
  const documentCount = (contract) => Array.isArray(contract.documents) ? contract.documents.length : 0;
  const numberValue = (value) => {
    if (value == null || value === '') return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  };
  const money = (number) => `₹${Number(number).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  const contractsWithDates = (contracts) => contracts.filter((contract) => noticeVerified(contract) && daysUntil(contract.noticeDate) !== null).map((contract) => ({ contract, days: daysUntil(contract.noticeDate) })).sort((a, b) => a.days - b.days);
  const contractButton = (contract, text, className) => `<button type="button" class="${className || 'v-text-link'}" data-v-open-contract="${esc(contract.id)}">${esc(text)}</button>`;
  const wireOpenButtons = (root, actions) => root.querySelectorAll('[data-v-open-contract]').forEach((button) => button.addEventListener('click', () => actions.openContract(button.dataset.vOpenContract)));

  function renderOverview(root, state, actions) {
    if (!root || !state || !actions) return;
    const contracts = contractArray(state);
    const values = contracts.map((contract) => numberValue(contract.valueCr)).filter((value) => value !== null);
    const total = values.reduce((sum, value) => sum + value, 0);
    const notices = contractsWithDates(contracts);
    const upcoming = notices.filter((item) => item.days >= 0);
    const dueCount = upcoming.filter((item) => item.days <= 90).length;
    const overdue = notices.filter((item) => item.days < 0);
    const dateGaps = contracts.filter((contract) => !noticeVerified(contract) || daysUntil(contract.noticeDate) === null).length;
    const unreviewedTerms = contracts.flatMap((contract) => Array.isArray(contract.terms) ? contract.terms : []).filter((term) => term && term.reviewed !== true).length;
    const needsAttention = contracts.filter((contract) => ['New in repository', 'Needs review', 'Action due'].includes(contract.status) || (Array.isArray(contract.terms) && contract.terms.some((term) => term && term.reviewed !== true))).slice(0, 4);
    const visibleReminders = [...overdue, ...upcoming].slice(0, 3);
    const categoryCounts = new Map();
    contracts.forEach((contract) => {
      const name = String(contract.category || 'Uncategorised');
      categoryCounts.set(name, (categoryCounts.get(name) || 0) + 1);
    });
    const categoryRows = Array.from(categoryCounts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 5);
    const reminderMarkup = visibleReminders.map(({contract, days}) => {
      const label = days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `In ${days}d`;
      const variant = days <= 30 ? 'urgent' : days <= 90 ? 'soon' : 'later';
      return `<button type="button" class="v-reminder-item" data-v-open-contract="${esc(contract.id)}"><span class="v-reminder-dot v-reminder-dot--${variant}"></span><span class="v-reminder-text"><strong>${esc(contract.title || 'Untitled contract')}</strong><small>${esc(contract.supplier || 'Unknown supplier')} · Notice ${esc(formatDate(contract.noticeDate))}</small></span><span class="v-reminder-age v-reminder-age--${variant}">${esc(label)}</span></button>`;
    }).join('');
    const attentionMarkup = needsAttention.map((contract) => {
      const firstFlag = Array.isArray(contract.flags) && contract.flags.length ? flagName(contract.flags[0]) : (contract.status || 'Review contract');
      return `<button type="button" class="v-attention-row" data-v-open-contract="${esc(contract.id)}"><span class="v-attention-icon" aria-hidden="true">↗</span><span class="v-attention-copy"><strong>${esc(contract.title || 'Untitled contract')}</strong><small>${esc(contract.supplier || 'Unknown supplier')}</small></span><span class="v-attention-status">${esc(firstFlag)}</span><span class="v-attention-arrow" aria-hidden="true">→</span></button>`;
    }).join('');
    root.innerHTML = `<div class="v-page v-overview">
      <section class="v-intro"><div><div class="v-eyebrow"><span class="v-eyebrow-dot"></span> THE PROCUREMENT WORKSPACE</div><h2>Clarity, across every contract<span>.</span></h2><p>A clearer view of your agreements, obligations and next decisions.</p></div><span class="v-demo-pill"><span></span> ILLUSTRATIVE PROTOTYPE</span></section>
      <div class="v-demo-disclosure"><span class="v-demo-disclosure-icon" aria-hidden="true">i</span><span>Example contracts, dates and flags are synthetic. They are not signed agreements or verified business findings.</span></div>
      <div class="v-overview-top">
        <section class="v-ai-card" aria-labelledby="v-ai-title"><div class="v-ai-orb v-ai-orb--one"></div><div class="v-ai-orb v-ai-orb--two"></div><div class="v-ai-content"><div class="v-ai-heading"><div class="v-sparkle" aria-hidden="true">✦</div><div><span class="v-mini-label">YOUR CONTRACT ASSISTANT</span><h3 id="v-ai-title">What would you like to know?</h3></div><span class="v-ai-status ${state.aiConfigured === true ? 'v-ai-status--ready' : ''}"><span></span>${state.aiConfigured === true ? 'Model connected' : 'Demo mode · model not connected'}</span></div><p>Ask across your contracts and find the terms behind the answer.</p><form id="v-ai-form" class="v-ai-form"><label class="v-visually-hidden" for="v-ai-question">Ask a question about your contracts</label><input id="v-ai-question" name="question" autocomplete="off" placeholder="Ask a question about your contracts…" /><button type="submit" aria-label="Ask AI">Ask <span aria-hidden="true">↗</span></button></form><div class="v-suggestion-line"><span>EXAMPLE QUESTIONS</span><button type="button" data-v-question="When is the AC maintenance notice deadline?">When is the AC maintenance notice deadline?</button><button type="button" data-v-question="What is the staffing shift rate?">What is the staffing shift rate?</button><button type="button" data-v-question="What service level applies to delivery and installation?">What service level applies to delivery and installation?</button><button type="button" data-v-question="What is the billing software price cap?">What is the billing software price cap?</button></div><div id="v-ai-output" class="v-ai-output" aria-live="polite"></div><p class="v-ai-caption">${state.aiConfigured === true ? 'Answers should be checked against the cited source.' : 'Example questions use labelled demo answers. Connect an AI model for generated answers.'}</p></div></section>
        <section class="v-reminder-card" aria-labelledby="v-reminders-title"><div class="v-panel-header"><div><span class="v-mini-label">STAY AHEAD</span><h3 id="v-reminders-title">Reminders <span class="v-heading-icon" aria-hidden="true">↗</span></h3></div><span class="v-outline-icon" aria-hidden="true">◷</span></div><p class="v-reminder-intro">Notice deadlines in your loaded contracts.</p><div class="v-reminders-list">${reminderMarkup || '<div class="v-empty-message">No verified notice dates are available yet.</div>'}</div><div class="v-reminder-footer"><span>${dateGaps ? `${dateGaps} ${dateGaps === 1 ? 'date needs' : 'dates need'} review` : 'Dates shown are verified'}</span><button type="button" class="v-text-link" data-v-open-reminders>View all <span aria-hidden="true">→</span></button></div></section>
      </div>
      <div class="v-section-heading"><div><span class="v-mini-label">YOUR PORTFOLIO</span><h3>At a glance</h3></div><button type="button" class="v-text-link" data-v-navigate-library>View contracts <span aria-hidden="true">→</span></button></div>
      <div class="v-stats"><div class="v-stat"><div class="v-stat-label">CONTRACTS <span aria-hidden="true">▤</span></div><strong>${contracts.length}</strong><small>in this workspace</small></div><div class="v-stat"><div class="v-stat-label">RECORDED CONTRACT VALUE <span aria-hidden="true">↗</span></div><strong>${values.length ? `${esc(money(total))} <em>cr</em>` : '—'}</strong><small>${values.length ? 'Combined values, not annualised' : 'No values recorded'}</small></div><div class="v-stat"><div class="v-stat-label">NOTICES IN NEXT 90 DAYS <span aria-hidden="true">◷</span></div><strong>${dueCount}</strong><small>${dateGaps ? `${dateGaps} dates unverified or missing` : 'Verified notice dates only'}</small></div><div class="v-stat"><div class="v-stat-label">TERMS TO REVIEW <span aria-hidden="true">◇</span></div><strong>${unreviewedTerms}</strong><small>Across loaded records</small></div></div>
      <div class="v-overview-bottom"><section class="v-content-card"><div class="v-panel-header"><div><span class="v-mini-label">CONTRACT CATEGORIES</span><h3>Your portfolio</h3></div><button type="button" class="v-text-link" data-v-navigate-library>Explore <span aria-hidden="true">→</span></button></div><p class="v-card-description">A snapshot of the contracts loaded into this workspace.</p><div class="v-categories">${categoryRows.length ? categoryRows.map(([name, count]) => `<div class="v-category-row"><div><span>${esc(name)}</span><strong>${count}</strong></div><div class="v-category-track"><span style="width:${Math.round((count / Math.max(contracts.length, 1)) * 100)}%"></span></div></div>`).join('') : '<div class="v-empty-message">Add a contract to begin.</div>'}</div></section><section class="v-content-card"><div class="v-panel-header"><div><span class="v-mini-label">YOUR NEXT STEPS</span><h3>Needs attention</h3></div><button type="button" class="v-text-link" data-v-navigate-board>Team board <span aria-hidden="true">→</span></button></div><p class="v-card-description">Illustrative items to review, not confirmed losses or breaches.</p><div class="v-attention-list">${attentionMarkup || '<div class="v-empty-message">No items are currently flagged for review.</div>'}</div></section></div>
    </div>`;
    const form = root.querySelector('#v-ai-form');
    const question = root.querySelector('#v-ai-question');
    const output = root.querySelector('#v-ai-output');
    const submit = form.querySelector('button[type="submit"]');
    const runAsk = async (value) => {
      if (!value) { question.focus(); return; }
      submit.disabled = true;
      try { await actions.ask(value, output, null); }
      catch (error) { output.textContent = 'Unable to retrieve an answer. Please try again.'; }
      finally { submit.disabled = false; }
    };
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      runAsk(question.value.trim());
    });
    root.querySelectorAll('[data-v-question]').forEach((button) => button.addEventListener('click', () => { question.value = button.dataset.vQuestion || ''; runAsk(question.value); }));
    root.querySelectorAll('[data-v-navigate-library]').forEach((button) => button.addEventListener('click', () => actions.navigate('library')));
    root.querySelectorAll('[data-v-navigate-board]').forEach((button) => button.addEventListener('click', () => actions.navigate('board')));
    root.querySelectorAll('[data-v-open-reminders]').forEach((button) => button.addEventListener('click', () => actions.openReminders()));
    wireOpenButtons(root, actions);
  }

  function renderLibrary(root, state, actions) {
    if (!root || !state || !actions) return;
    const contracts = contractArray(state);
    const categories = Array.from(new Set([...(Array.isArray(state.categories) ? state.categories : []), ...contracts.map((contract) => contract.category).filter(Boolean)])).sort((a, b) => String(a).localeCompare(String(b)));
    const statuses = Array.from(new Set(contracts.map((contract) => contract.status).filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b)));
    const documents = contracts.reduce((sum, contract) => sum + documentCount(contract), 0);
    root.innerHTML = `<div class="v-page v-library"><div class="v-library-intro"><div><div class="v-eyebrow"><span class="v-eyebrow-dot"></span> YOUR AGREEMENTS, TOGETHER</div><h2>Contracts Library<span>.</span></h2><p>Find the agreements, amendments and terms behind every decision.</p></div><button type="button" class="v-primary-button" data-v-add-contract><span aria-hidden="true">＋</span> Add contract</button></div>
      <div class="v-demo-disclosure"><span class="v-demo-disclosure-icon" aria-hidden="true">i</span><span>The sample records and their dates are illustrative. Sample excerpts are not signed or verified agreements.</span></div>
      <section class="v-library-panel"><div class="v-library-panel-top"><div><span class="v-mini-label">DOCUMENT COLLECTION</span><h3>All contracts <span class="v-count-chip">${contracts.length}</span></h3><p>${documents} linked document${documents === 1 ? '' : 's'} across the loaded records</p></div><div class="v-library-meta"><span class="v-meta-dot"></span> SEARCHABLE COLLECTION</div></div>
        <div class="v-library-controls"><label class="v-search-field"><span aria-hidden="true">⌕</span><span class="v-visually-hidden">Search contracts and terms</span><input id="v-library-search" type="search" placeholder="Search suppliers, contracts or terms…" autocomplete="off" /></label><label><span class="v-visually-hidden">Filter by category</span><select id="v-library-category"><option value="">All categories</option>${categories.map((category) => `<option value="${esc(category)}">${esc(category)}</option>`).join('')}</select></label><label><span class="v-visually-hidden">Filter by board stage</span><select id="v-library-status"><option value="">All stages</option>${statuses.map((status) => `<option value="${esc(status)}">${esc(status)}</option>`).join('')}</select></label></div>
        <div class="v-results-heading"><span id="v-library-result-count"></span><span>Search includes linked contract text</span></div><div id="v-library-results"></div></section>
    </div>`;
    const search = root.querySelector('#v-library-search');
    const category = root.querySelector('#v-library-category');
    const status = root.querySelector('#v-library-status');
    const results = root.querySelector('#v-library-results');
    const count = root.querySelector('#v-library-result-count');
    const searchable = (contract) => [contract.supplier, contract.title, contract.category, contract.owner, contract.status, ...(Array.isArray(contract.documents) ? contract.documents.flatMap((document) => [document.name, document.content]) : []), ...(Array.isArray(contract.terms) ? contract.terms.flatMap((term) => [term.label, term.value, term.source]) : [])].map((value) => String(value || '')).join(' ').toLocaleLowerCase();
    const update = () => {
      const needle = search.value.trim().toLocaleLowerCase();
      const visible = contracts.filter((contract) => (!needle || searchable(contract).includes(needle)) && (!category.value || contract.category === category.value) && (!status.value || contract.status === status.value));
      count.textContent = `${visible.length} ${visible.length === 1 ? 'contract' : 'contracts'} shown`;
      if (!visible.length) { results.innerHTML = '<div class="v-library-empty"><strong>No matching contracts</strong><p>Try another supplier, term, or filter.</p></div>'; return; }
      results.innerHTML = `<div class="v-table-scroll"><table class="v-contract-table"><thead><tr><th>SUPPLIER &amp; CONTRACT</th><th>CATEGORY</th><th>VALUE</th><th>DOCUMENTS</th><th>NOTICE DEADLINE</th><th>STAGE</th><th><span class="v-visually-hidden">Open</span></th></tr></thead><tbody>${visible.map((contract) => {
        const countDocs = documentCount(contract);
        const verified = noticeVerified(contract) && parseDate(contract.noticeDate);
        const value = numberValue(contract.valueCr);
        return `<tr><td><div class="v-contract-name"><span class="v-contract-icon" aria-hidden="true">▤</span><span><strong>${esc(contract.supplier || 'Unknown supplier')}</strong><small>${esc(contract.title || 'Untitled contract')}</small></span></div></td><td><span class="v-category-pill">${esc(contract.category || 'Uncategorised')}</span></td><td class="v-value-cell">${value === null ? '—' : `${esc(money(value))} cr`}</td><td class="v-doc-count">${countDocs} linked</td><td>${verified ? `<span class="v-date">${esc(formatDate(contract.noticeDate))}</span>` : '<span class="v-date v-date--unknown">Not verified</span>'}</td><td><span class="v-stage-pill">${esc(contract.status || 'New in repository')}</span></td><td>${contractButton(contract, 'Open →', 'v-open-button')}</td></tr>`;
      }).join('')}</tbody></table></div>`;
      wireOpenButtons(results, actions);
    };
    [search, category, status].forEach((element) => element.addEventListener(element === search ? 'input' : 'change', update));
    root.querySelector('[data-v-add-contract]').addEventListener('click', () => actions.addContract());
    update();
  }

  window.renderOverview = renderOverview;
  window.renderLibrary = renderLibrary;
})();
