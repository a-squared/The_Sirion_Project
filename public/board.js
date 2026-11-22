/* Team Board: contract-centric triage over the same records as the library. */
(() => {
  'use strict';

  const COLUMNS = ['New in repository', 'Needs review', 'Action due', 'Decision in progress', 'Monitoring', 'Done'];
  const ROLE_INFO = {
    'Everyone': 'A portfolio view of the contracts in this prototype.',
    'Priya Nair': 'Contracts Priya owns or co-owns.',
    'Ayesha Khan': 'New contracts and business terms that need review.',
    'Arjun Desai': 'Software, technology and connectivity agreements.',
    'Raj Mehta': 'Contracts with pricing, credit or billing flags.',
    'Kavita Menon': 'Contracts with legal, data or compliance flags.'
  };
  const ROLES = Object.keys(ROLE_INFO);
  let categoryFilter = 'All categories';

  const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const safeId = (value) => esc(value);
  const flagLabel = (flag) => typeof flag === 'string' ? flag : String((flag && (flag.label || flag.name)) || '');
  const flagsOf = (contract) => Array.isArray(contract.flags) ? contract.flags : [];
  const roleName = (value) => Array.isArray(value) ? value.join(' ') : String(value || '');
  const isVerifiedNotice = (contract) => contract.noticeVerified === true;
  const dateValue = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) ? String(value) : '';
  const parseDate = (value) => {
    const iso = dateValue(value);
    if (!iso) return null;
    const [year, month, day] = iso.split('-').map(Number);
    const parsed = new Date(year, month - 1, day);
    if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) return null;
    return parsed;
  };
  const dayDiff = (value) => {
    const parsed = parseDate(value);
    if (!parsed) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((parsed.getTime() - today.getTime()) / 86400000);
  };
  const formatDate = (value) => {
    const parsed = parseDate(value);
    return parsed ? parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not available';
  };
  const initials = (value) => String(value || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word.charAt(0).toUpperCase()).join('') || '—';
  const moneyCr = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number) || value === null || value === '' || typeof value === 'undefined') return 'Not recorded';
    return `₹${number.toLocaleString('en-IN', { maximumFractionDigits: 2 })} cr`;
  };
  const infoForRole = (role) => ROLE_INFO[role] || 'A filtered view of the contracts in this prototype.';
  const isRoleVisible = (contract, role) => {
    if (!role || role === 'Everyone') return true;
    const assigned = [roleName(contract.owner), roleName(contract.coOwner)].some((name) => name.toLowerCase().includes(role.toLowerCase()));
    if (assigned) return true;
    const labels = flagsOf(contract).map(flagLabel).join(' ').toLowerCase();
    const details = `${contract.category || ''} ${contract.title || ''} ${contract.supplier || ''}`.toLowerCase();
    if (role === 'Ayesha Khan') return ['New in repository', 'Needs review'].includes(contract.status) ||
      /needs? review|low confidence|link to parent|unverified/.test(labels) ||
      (Array.isArray(contract.terms) && contract.terms.some((term) => term && term.reviewed !== true));
    if (role === 'Arjun Desai') return /software|telecom|connectivity|technology|internet|billing|sap|cloud/.test(details);
    if (role === 'Raj Mehta') return /rate variance|uplift cap|closed.store billing|credit unclaimed|invoice/.test(labels);
    if (role === 'Kavita Menon') return /data|privacy|ai clause|compliance|legal|liability|indemnity|high.risk/.test(labels);
    return false;
  };
  const boardStatus = (contract) => {
    const explicit = COLUMNS.includes(contract.status) ? contract.status : 'New in repository';
    /* A verified approaching notice can surface a monitored contract; active
       decisions and manual triage states remain where the user placed them. */
    const days = isVerifiedNotice(contract) ? dayDiff(contract.noticeDate) : null;
    if (explicit === 'Monitoring' && days !== null && days <= 90) return 'Action due';
    return explicit;
  };
  const severityClass = (flag) => {
    const severity = String((typeof flag === 'object' && flag && flag.severity) || '').toLowerCase();
    if (['danger', 'red', 'critical', 'high'].includes(severity)) return 'danger';
    if (['warning', 'amber', 'orange', 'medium'].includes(severity)) return 'warning';
    if (['violet', 'purple', 'review'].includes(severity)) return 'violet';
    if (['success', 'green'].includes(severity)) return 'success';
    return 'info';
  };
  const flagMarkup = (flag) => {
    const label = flagLabel(flag);
    return label ? `<span class="b-flag b-flag--${severityClass(flag)}">${esc(label)}</span>` : '';
  };
  const noticeMarkup = (contract) => {
    if (!dateValue(contract.noticeDate)) return '<span class="b-due b-due--unknown">Notice date unknown</span>';
    if (!isVerifiedNotice(contract)) return '<span class="b-due b-due--unknown">Notice date not verified</span>';
    const days = dayDiff(contract.noticeDate);
    if (days === null) return '<span class="b-due b-due--unknown">Notice date unknown</span>';
    const text = days < 0 ? `Notice ${Math.abs(days)}d overdue` : days === 0 ? 'Notice due today' : `Notice in ${days}d`;
    const severity = days <= 30 ? 'critical' : days <= 90 ? 'soon' : 'normal';
    return `<span class="b-due b-due--${severity}" title="${esc(formatDate(contract.noticeDate))}">${esc(text)}</span>`;
  };
  const roleOptions = (current) => ROLES.map((role) => `<option value="${esc(role)}"${role === current ? ' selected' : ''}>${esc(role)}</option>`).join('');

  function boardCard(contract) {
    const flags = flagsOf(contract);
    const owner = roleName(contract.owner) || 'Unassigned';
    const coOwner = roleName(contract.coOwner);
    const people = [owner, coOwner].filter((value) => value && value !== 'Unassigned');
    const avatars = people.length ? people.map((person) => `<span class="b-avatar" title="${esc(person)}" aria-label="${esc(person)}">${esc(initials(person))}</span>`).join('') : '<span class="b-avatar b-avatar--empty" title="Unassigned">—</span>';
    return `<article class="b-card" draggable="true" data-board-card="${safeId(contract.id)}" tabindex="0" role="button" aria-label="Open ${esc(contract.supplier || contract.title || 'contract')} contract details">
      <div class="b-card-top"><span class="b-card-category">${esc(contract.category || 'Uncategorised')}</span><span class="b-card-menu" aria-hidden="true">⋯</span></div>
      <h3 class="b-card-supplier">${esc(contract.supplier || 'Unknown supplier')}</h3>
      <p class="b-card-title">${esc(contract.title || 'Untitled contract')}</p>
      <div class="b-card-flags">${flags.slice(0, 4).map(flagMarkup).join('')}${flags.length > 4 ? `<span class="b-flag b-flag--info">+${flags.length - 4} more</span>` : ''}</div>
      <div class="b-card-value"><span>Contract value</span><strong>${esc(moneyCr(contract.valueCr))}</strong></div>
      <div class="b-card-bottom"><div class="b-avatar-stack" aria-label="Contract owners">${avatars}</div>${noticeMarkup(contract)}</div>
    </article>`;
  }

  function termMarkup(term, index, documents) {
    const value = term && (term.value ?? term.extractedValue ?? '');
    const name = term && (term.label || term.name || term.key) || `Term ${index + 1}`;
    const source = term && (term.sourceDoc || term.source || term.documentName) || '';
    const page = term && (term.sourcePage || term.page) || '';
    const sourceIndex = source ? documents.findIndex((doc) => doc && doc.name && String(source).toLowerCase().includes(String(doc.name).toLowerCase())) : -1;
    const verified = Boolean(term && term.reviewed === true);
    const reviewer = term && (term.reviewer || term.reviewedBy) || '';
    const quote = term && (term.sourceQuote || term.quote) || '';
    return `<div class="b-term" data-term-row="${index}">
      <div class="b-term-head"><strong>${esc(name)}</strong><span class="b-term-state ${verified ? 'b-term-state--verified' : ''}">${verified ? `Reviewed${reviewer ? ` by ${esc(reviewer)}` : ''}` : 'Needs review'}</span></div>
      ${source ? sourceIndex >= 0 ? `<button type="button" class="b-term-source b-term-source--link" data-doc-source="${sourceIndex}">${esc(source)}${page ? ` · page ${esc(page)}` : ''} ↗</button>` : `<p class="b-term-source">${esc(source)}${page ? ` · page ${esc(page)}` : ''}</p>` : '<p class="b-term-source">Source not linked</p>'}
      ${quote ? `<blockquote class="b-term-quote">${esc(quote)}</blockquote>` : ''}
      <label class="b-sr-only" for="b-term-${index}">${esc(name)}</label><input class="b-input" id="b-term-${index}" data-term-value="${index}" value="${esc(value)}" />
      <div class="b-term-actions"><button type="button" class="b-button b-button--small" data-term-action="accept" data-term-index="${index}">Accept</button><button type="button" class="b-button b-button--small b-button--outline" data-term-action="edit" data-term-index="${index}">Save edit</button></div>
    </div>`;
  }
  const auditEntry = (state, action) => ({ at: new Date().toISOString(), actor: state.role && state.role !== 'Everyone' ? state.role : 'Team member', action });
  const auditList = (contract) => Array.isArray(contract.auditLog) ? contract.auditLog : [];
  const closeDrawer = () => { const holder = document.getElementById('drawer-root'); if (holder) holder.innerHTML = ''; };

  /* Only the exact bundled staffing excerpts can drive the illustrative
     arithmetic below. A new or edited document invalidates the example. */
  const staffingSignature = (contract) => JSON.stringify({
    documents: contract && contract.documents,
    supportingEvidence: contract && contract.supportingEvidence
  });
  const bundledStaffing = Array.isArray(window.DEMO_CONTRACTS) ? window.DEMO_CONTRACTS.find((contract) => contract.id === 'staffing') : null;
  const bundledStaffingSignature = bundledStaffing ? staffingSignature(bundledStaffing) : null;
  function illustrativeStaffingInvoice(contract) {
    if (!bundledStaffingSignature || !contract || contract.id !== 'staffing' || staffingSignature(contract) !== bundledStaffingSignature) return null;
    const documents = Array.isArray(contract.documents) ? contract.documents : [];
    const evidence = Array.isArray(contract.supportingEvidence) ? contract.supportingEvidence : [];
    const master = documents.findIndex((document) => document.id === 'staffing-master' && String(document.content || '').includes('A standard weekday sales-assistant shift in Zone A is ₹600 before tax'));
    const amendment = documents.findIndex((document) => document.id === 'staffing-amendment' && String(document.content || '').includes('From 1 August 2026, the rate for a standard weekday sales-assistant shift in Zone A changes to ₹650 before tax.'));
    const invoice = evidence.findIndex((item) => item.id === 'staffing-invoice' && String(item.content || '').includes('25 standard weekday Zone A shifts at ₹750 each before tax, totalling ₹18,750'));
    const attendance = evidence.findIndex((item) => item.id === 'staffing-attendance' && String(item.content || '').includes('25 standard weekday sales-assistant shifts in Zone A during November 2026'));
    return [master, amendment, invoice, attendance].every((index) => index >= 0) ? { master, amendment, invoice, attendance } : null;
  }
  function transitionAfterTermReview(contract, changedTerms) {
    if (contract.status !== 'Needs review' || !changedTerms.length || !changedTerms.every((term) => term && term.reviewed === true)) return {};
    const isTermReviewFlag = (flag) => /^(?:needs review|low confidence|terms? needs? review|(?:rate|service|payment) terms? to review)$/i.test(flagLabel(flag).trim());
    const remainingFlags = flagsOf(contract).filter((flag) => !isTermReviewFlag(flag));
    const actionFlag = remainingFlags.some((flag) => {
      const label = flagLabel(flag).trim();
      const severity = typeof flag === 'object' && flag ? String(flag.severity || '').toLowerCase() : '';
      return !(typeof flag === 'object' && flag && flag.resolved === true) && severity !== 'success' && !/^(?:auto-renews|saving booked)$/i.test(label);
    });
    const days = isVerifiedNotice(contract) ? dayDiff(contract.noticeDate) : null;
    return { flags: remainingFlags, status: actionFlag || (days !== null && days <= 90) ? 'Action due' : 'Monitoring' };
  }

  function openDrawer(contract, state, actions) {
    const holder = document.getElementById('drawer-root');
    if (!holder || !contract) return;
    const c = contract;
    const docs = Array.isArray(c.documents) ? c.documents : [];
    const supportingEvidence = Array.isArray(c.supportingEvidence) ? c.supportingEvidence : [];
    const terms = Array.isArray(c.terms) ? c.terms : [];
    const audit = auditList(c);
    const invoiceExample = illustrativeStaffingInvoice(c);
    const hasRenewal = c.autoRenews === true || flagsOf(c).some((flag) => /renew/i.test(flagLabel(flag))) || Boolean(c.noticeDate);
    const renewalDecision = c.renewalDecision || '';
    const selectedStatus = boardStatus(c);
    const recommendation = c.aiRecommendation && typeof c.aiRecommendation === 'object' ? c.aiRecommendation : null;
    holder.innerHTML = `<div class="b-overlay" data-b-overlay>
      <section class="b-drawer" role="dialog" aria-modal="true" aria-labelledby="b-drawer-title" tabindex="-1">
        <header class="b-drawer-head"><div><p class="b-eyebrow">CONTRACT DETAILS</p><h2 id="b-drawer-title">${esc(c.supplier || 'Unknown supplier')}</h2><p>${esc(c.title || 'Untitled contract')}</p></div><button type="button" class="b-icon-button" data-drawer-close aria-label="Close contract details">×</button></header>
        <div class="b-drawer-body">
          <div class="b-drawer-flags">${flagsOf(c).map(flagMarkup).join('') || '<span class="b-drawer-help">No flags recorded</span>'}</div>
          <div class="b-facts"><div><span>Contract value</span><strong>${esc(moneyCr(c.valueCr))}</strong></div><div><span>Notice deadline</span><strong>${isVerifiedNotice(c) ? esc(formatDate(c.noticeDate)) : 'Not verified'}</strong></div><div><span>Expiry</span><strong>${esc(formatDate(c.expiryDate))}</strong></div></div>
          <p class="b-sample-note">Illustrative prototype. Review the linked agreement and amendments before acting; an unverified date is not a confirmed deadline.</p>
          <section class="b-detail-section"><div class="b-detail-heading"><h3>Linked documents</h3>${typeof actions.openContract === 'function' ? '<button type="button" class="b-text-button" data-open-library>Open in library →</button>' : ''}</div>
            ${docs.length ? `<div class="b-doc-list">${docs.map((doc, index) => `<details class="b-doc" data-doc-index="${index}"><summary><span class="b-doc-icon">▤</span><span>${esc(doc.name || `Document ${index + 1}`)}</span><span class="b-doc-view">View source</span></summary><div class="b-doc-body">${esc(doc.content || 'No extracted text is available for this document.')}</div></details>`).join('')}</div>` : '<p class="b-empty-detail">No documents are linked yet.</p>'}
          </section>
          ${supportingEvidence.length ? `<section class="b-detail-section"><div class="b-detail-heading"><h3>Supporting evidence</h3></div><p class="b-drawer-help">These records are separate from the agreement.</p><div class="b-doc-list">${supportingEvidence.map((item, index) => `<details class="b-doc" data-support-index="${index}"><summary><span class="b-doc-icon">▤</span><span>${esc(item.name || `Supporting record ${index + 1}`)}</span><span class="b-doc-view">View record</span></summary><div class="b-doc-body">${esc(item.content || 'No supporting text is available.')}</div></details>`).join('')}</div></section>` : ''}
          ${invoiceExample ? `<section class="b-detail-section"><div class="b-detail-heading"><h3>Illustrative invoice review</h3><span class="b-flag b-flag--violet">SYNTHETIC EXAMPLE</span></div><p class="b-drawer-help">The sample invoice and attendance list 25 qualifying shifts. The sample amendment sets the applicable rate for the specified shift type and period.</p><div class="b-invoice"><div><span>Invoice</span><strong>25 × ₹750 = ₹18,750</strong></div><div><span>Sample contract rate</span><strong>25 × ₹650 = ₹16,250</strong></div><div class="b-invoice-result"><span>Possible difference</span><strong>₹2,500</strong></div></div><p class="b-drawer-help b-invoice-caveat">Before tax. Check the shift type, location, period and any authorised extras. This is not a confirmed overcharge or saving.</p><div class="b-invoice-sources"><span>VIEW SOURCES</span><button type="button" data-jump-doc="${invoiceExample.master}">Agreement ↗</button><button type="button" data-jump-doc="${invoiceExample.amendment}">Amendment ↗</button><button type="button" data-jump-support="${invoiceExample.invoice}">Invoice ↗</button><button type="button" data-jump-support="${invoiceExample.attendance}">Attendance ↗</button></div><div class="b-term-actions"><button type="button" class="b-button b-button--outline" data-request-ap${c.apReviewRequested ? ' disabled' : ''}>${c.apReviewRequested ? 'AP review requested' : 'Mark for AP review'}</button></div><p class="b-drawer-help b-invoice-caveat">${c.apReviewRequested ? 'The review request is recorded in this prototype.' : 'This records a review request in the prototype; it does not hold payment or send a notification.'}</p></section>` : ''}
          <section class="b-detail-section"><div class="b-detail-heading"><h3>Terms to review</h3><span class="b-section-count">${terms.length}</span></div>
            ${terms.length ? `<p class="b-drawer-help">Check the source before accepting or editing a term.</p><div class="b-terms">${terms.map((term, index) => termMarkup(term, index, docs)).join('')}</div>` : '<p class="b-empty-detail">No extracted terms are ready for review. Missing terms remain unknown.</p>'}
          </section>
          ${hasRenewal ? `<section class="b-detail-section"><div class="b-detail-heading"><h3>Renewal decision</h3></div><p class="b-drawer-help">Record the next step for review. This does not send a notice or change the agreement.</p>${renewalDecision ? `<p class="b-decision-current">Recorded next step: <strong>${esc(renewalDecision)}</strong></p>` : ''}${recommendation ? `<div class="b-recommendation"><strong>AI recommendation · review required</strong><p>${esc(recommendation.text || recommendation.recommendation || '')}</p>${recommendation.reason ? `<p>${esc(recommendation.reason)}</p>` : ''}</div>` : ''}<div class="b-decision-buttons"><button type="button" class="b-button b-button--outline" data-decision="Renew as is">Renew as is</button><button type="button" class="b-button b-button--outline" data-decision="Renegotiate">Renegotiate</button><button type="button" class="b-button b-button--outline" data-decision="Cancel">Cancel</button></div></section>` : ''}
          <section class="b-detail-section"><div class="b-detail-heading"><h3>Assignment &amp; board status</h3></div>
            <form id="b-contract-form" class="b-form"><label>Owner<input class="b-input" name="owner" autocomplete="off" placeholder="Add a team member" value="${esc(roleName(c.owner))}" /></label><label>Co-owner <span class="b-optional">optional</span><input class="b-input" name="coOwner" autocomplete="off" placeholder="Add a co-owner" value="${esc(roleName(c.coOwner))}" /></label><label>Board column<select class="b-input" name="status">${COLUMNS.map((column) => `<option value="${esc(column)}"${column === selectedStatus ? ' selected' : ''}>${esc(column)}</option>`).join('')}</select></label><label>Notice deadline<input class="b-input" type="date" name="noticeDate" value="${esc(dateValue(c.noticeDate))}" /></label><label class="b-checkbox"><input type="checkbox" name="noticeVerified"${isVerifiedNotice(c) ? ' checked' : ''} /><span>I have checked this date against the source</span></label><label>Notes<textarea class="b-input b-textarea" name="notes" rows="3" placeholder="Add context for the team">${esc(typeof c.notes === 'string' ? c.notes : '')}</textarea></label><div class="b-form-actions"><button type="button" class="b-button b-button--outline" data-drawer-close>Cancel</button><button type="submit" class="b-button b-button--primary">Save changes</button></div></form>
          </section>
          <section class="b-detail-section b-detail-section--last"><div class="b-detail-heading"><h3>Decision log</h3></div>${audit.length ? `<ol class="b-audit">${audit.slice().reverse().map((entry) => `<li><strong>${esc(entry.actor || 'Team member')}</strong> · ${esc(entry.action || 'Updated contract')}<span>${esc(entry.at ? new Date(entry.at).toLocaleString('en-IN') : '')}</span></li>`).join('')}</ol>` : '<p class="b-empty-detail">No actions recorded yet.</p>'}</section>
        </div>
      </section>
    </div>`;
    const overlay = holder.querySelector('[data-b-overlay]');
    const drawer = holder.querySelector('.b-drawer');
    holder.querySelectorAll('[data-drawer-close]').forEach((button) => button.addEventListener('click', closeDrawer));
    overlay.addEventListener('click', (event) => { if (event.target === overlay) closeDrawer(); });
    drawer.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeDrawer(); });
    const libraryButton = holder.querySelector('[data-open-library]');
    if (libraryButton) libraryButton.addEventListener('click', () => { closeDrawer(); actions.openContract(c.id); });
    holder.querySelectorAll('[data-doc-source]').forEach((button) => button.addEventListener('click', () => {
      const source = holder.querySelector(`[data-doc-index="${Number(button.dataset.docSource)}"]`);
      if (source) {
        source.open = true;
        source.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }));
    holder.querySelectorAll('[data-jump-doc], [data-jump-support]').forEach((button) => button.addEventListener('click', () => {
      const attribute = button.hasAttribute('data-jump-doc') ? 'data-doc-index' : 'data-support-index';
      const index = Number(button.hasAttribute('data-jump-doc') ? button.dataset.jumpDoc : button.dataset.jumpSupport);
      const source = holder.querySelector(`[${attribute}="${index}"]`);
      if (source) {
        source.open = true;
        source.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }));
    const form = holder.querySelector('#b-contract-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const noticeDate = dateValue(data.get('noticeDate'));
      const patch = {
        owner: String(data.get('owner') || '').trim(),
        coOwner: String(data.get('coOwner') || '').trim(),
        status: COLUMNS.includes(data.get('status')) ? String(data.get('status')) : selectedStatus,
        noticeDate,
        noticeVerified: Boolean(noticeDate && data.get('noticeVerified')),
        notes: String(data.get('notes') || '').trim(),
        auditLog: auditList(c).concat(auditEntry(state, 'Updated contract details'))
      };
      actions.updateContract(c.id, patch);
      closeDrawer();
    });
    holder.querySelectorAll('[data-term-action]').forEach((button) => button.addEventListener('click', () => {
      const index = Number(button.dataset.termIndex);
      if (!Number.isInteger(index) || !terms[index]) return;
      const input = holder.querySelector(`[data-term-value="${index}"]`);
      const value = input ? input.value.trim() : '';
      const changedTerms = terms.map((term, i) => i === index ? { ...term, value, reviewed: true, reviewer: state.role && state.role !== 'Everyone' ? state.role : 'Team member', reviewedAt: new Date().toISOString() } : term);
      const actionText = `${button.dataset.termAction === 'edit' ? 'Edited and reviewed' : 'Accepted'} ${terms[index].label || terms[index].name || 'term'}`;
      const transition = transitionAfterTermReview(c, changedTerms);
      const transitionText = transition.status ? `; moved to ${transition.status}` : '';
      const patch = { terms: changedTerms, ...transition, auditLog: auditList(c).concat(auditEntry(state, `${actionText}${transitionText}`)) };
      actions.updateContract(c.id, patch);
      openDrawer({ ...c, ...patch }, state, actions);
    }));
    const requestAp = holder.querySelector('[data-request-ap]');
    if (requestAp) requestAp.addEventListener('click', () => {
      const patch = {
        apReviewRequested: true,
        apReviewRequestedBy: state.role && state.role !== 'Everyone' ? state.role : 'Team member',
        apReviewRequestedAt: new Date().toISOString(),
        auditLog: auditList(c).concat(auditEntry(state, 'Marked illustrative invoice for AP review'))
      };
      actions.updateContract(c.id, patch);
      openDrawer({ ...c, ...patch }, state, actions);
    });
    holder.querySelectorAll('[data-decision]').forEach((button) => button.addEventListener('click', () => {
      const decision = button.dataset.decision;
      const patch = { renewalDecision: decision, status: 'Decision in progress', auditLog: auditList(c).concat(auditEntry(state, `Recorded next step: ${decision}`)) };
      actions.updateContract(c.id, patch);
      openDrawer({ ...c, ...patch }, state, actions);
    }));
    drawer.focus();
  }

  function renderBoard(root, state, actions) {
    if (!root || !state || !actions || typeof actions.updateContract !== 'function' || typeof actions.setRole !== 'function') return;
    const all = Array.isArray(state.contracts) ? state.contracts : [];
    const role = ROLE_INFO[state.role] ? state.role : 'Everyone';
    const availableCategories = Array.from(new Set([...(Array.isArray(state.categories) ? state.categories : []), ...all.map((c) => c.category).filter(Boolean)])).sort((a, b) => String(a).localeCompare(String(b)));
    if (categoryFilter !== 'All categories' && !availableCategories.includes(categoryFilter)) categoryFilter = 'All categories';
    const visible = all.filter((contract) => isRoleVisible(contract, role) && (categoryFilter === 'All categories' || contract.category === categoryFilter));
    const noticeCount = visible.filter((contract) => { const days = isVerifiedNotice(contract) ? dayDiff(contract.noticeDate) : null; return days !== null && days >= 0 && days <= 30; }).length;
    const terms = visible.flatMap((contract) => Array.isArray(contract.terms) ? contract.terms : []);
    const awaitingCount = terms.filter((term) => term && term.reviewed !== true).length;
    const termDisplay = terms.length ? String(awaitingCount) : '—';
    const today = new Date();
    const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
    const nextQuarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3 + 3, 1);
    const qualifyingSavings = visible.filter((contract) => {
      const date = parseDate(contract.verifiedSavingsDate || contract.savingsDate);
      const amount = Number(contract.verifiedSavingsCr);
      return contract.savingsVerified === true && date && date >= quarterStart && date < nextQuarter &&
        contract.verifiedSavingsCr != null && contract.verifiedSavingsCr !== '' && Number.isFinite(amount);
    });
    const savingsCr = qualifyingSavings.reduce((sum, contract) => sum + Number(contract.verifiedSavingsCr), 0);
    const categories = ['All categories', ...availableCategories];
    root.innerHTML = `<div class="b-page">
      <div class="b-intro"><div><p class="b-eyebrow">WORKSPACE / TEAM BOARD</p><h1>Work, in motion.</h1><p>One card per contract. See what needs attention and move work forward together.</p></div><div class="b-view-controls"><label><span>ROLE VIEW</span><select class="b-select" id="board-role" aria-label="Role view">${roleOptions(role)}</select></label><label><span>CATEGORY</span><select class="b-select" id="board-category" aria-label="Filter by category">${categories.map((category) => `<option value="${esc(category)}"${category === categoryFilter ? ' selected' : ''}>${esc(category)}</option>`).join('')}</select></label></div></div>
      <div class="b-view-note"><span class="b-view-note-icon">i</span><span><strong>${esc(role)}</strong> · ${esc(infoForRole(role))} Role views filter illustrative data; they do not grant access.</span></div>
      <div class="b-stats"><div class="b-stat"><span>CONTRACTS IN VIEW</span><strong>${visible.length}</strong><small>Across this selection</small></div><div class="b-stat"><span>NOTICE DEADLINES · 30 DAYS</span><strong>${noticeCount}</strong><small>Verified dates only</small></div><div class="b-stat"><span>TERMS WAITING FOR REVIEW</span><strong>${termDisplay}</strong><small>${terms.length ? 'From loaded term records' : 'No term details loaded'}</small></div><div class="b-stat"><span>₹ PROTECTED OR FOUND · THIS QUARTER</span><strong>${qualifyingSavings.length ? esc(moneyCr(savingsCr)) : '—'}</strong><small>${qualifyingSavings.length ? 'Verified value with a recorded date' : 'No verified value recorded'}</small></div></div>
      <div class="b-board-head"><div><h2>Contract board</h2><p>Drag a card to move it, or open a card to update its status.</p></div><span class="b-count-label">${visible.length} ${visible.length === 1 ? 'contract' : 'contracts'} in view</span></div>
      <div class="b-board-scroll"><div class="b-board">${COLUMNS.map((column, index) => { const items = visible.filter((contract) => boardStatus(contract) === column); return `<section class="b-column" data-board-column="${esc(column)}"><header class="b-column-head"><span class="b-column-dot b-column-dot--${index}"></span><h2>${esc(column)}</h2><span class="b-column-count">${items.length}</span></header><div class="b-column-cards">${items.map(boardCard).join('')}${items.length ? '' : '<div class="b-column-empty">No contracts here</div>'}</div></section>`; }).join('')}</div></div>
      <p class="b-board-footnote">Illustrative records. A contract can have multiple flags, even while its card appears in one column. Approaching verified notice dates surface under Action due.</p>
    </div>`;
    root.querySelector('#board-role').addEventListener('change', (event) => actions.setRole(event.target.value));
    root.querySelector('#board-category').addEventListener('change', (event) => { categoryFilter = event.target.value; renderBoard(root, state, actions); });
    root.querySelectorAll('[data-board-card]').forEach((card) => {
      const open = () => openDrawer(all.find((c) => String(c.id) === card.dataset.boardCard), state, actions);
      card.addEventListener('click', open);
      card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
      card.addEventListener('dragstart', (event) => { event.dataTransfer.setData('text/plain', card.dataset.boardCard); event.dataTransfer.effectAllowed = 'move'; card.classList.add('b-card--dragging'); });
      card.addEventListener('dragend', () => card.classList.remove('b-card--dragging'));
    });
    root.querySelectorAll('[data-board-column]').forEach((column) => {
      column.addEventListener('dragover', (event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; column.classList.add('b-column--over'); });
      column.addEventListener('dragleave', (event) => { if (!column.contains(event.relatedTarget)) column.classList.remove('b-column--over'); });
      column.addEventListener('drop', (event) => {
        event.preventDefault(); column.classList.remove('b-column--over');
        const id = event.dataTransfer.getData('text/plain');
        const contract = all.find((c) => String(c.id) === id);
        const status = column.dataset.boardColumn;
        if (!contract || !COLUMNS.includes(status)) return;
        actions.updateContract(contract.id, { status, auditLog: auditList(contract).concat(auditEntry(state, `Moved to ${status}`)) });
      });
    });
  }
  window.renderBoard = renderBoard;
})();
