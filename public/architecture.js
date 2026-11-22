/* The supplied architecture diagram describes the intended product vision. */
(() => {
  'use strict';

  function renderArchitectureSection(root) {
    if (!root) return;
    root.innerHTML = `
      <section class="arch-page" aria-labelledby="arch-title">
        <header class="arch-header">
          <div>
            <span class="arch-eyebrow">HOW IT FITS TOGETHER</span>
            <h2 id="arch-title">Architecture</h2>
            <p>A view of how the contract library, AskSirion, and the team dashboard fit together.</p>
          </div>
          <a class="arch-open" href="assets/architecture-overview.jpeg" target="_blank" rel="noopener noreferrer">Open full-size diagram <span aria-hidden="true">↗</span></a>
        </header>

        <div class="arch-disclosure">
          <span class="arch-disclosure-icon" aria-hidden="true">i</span>
          <p><strong>Concept architecture.</strong> Some capabilities shown, including automated ingestion and Teams or Outlook alerts, are proposed and are not connected in this prototype.</p>
        </div>

        <figure class="arch-figure">
          <a href="assets/architecture-overview.jpeg" target="_blank" rel="noopener noreferrer" aria-label="Open the architecture diagram at full size">
            <img src="assets/architecture-overview.jpeg" width="1280" height="720" alt="Concept architecture showing contracts arriving from a procurement mailbox, shared drives, e-signature and scans into an AI contract library. The library supports AskSirion, a team dashboard and proposed Teams and Outlook alerts.">
          </a>
          <figcaption>The supplied vision for Tyran’s post-signature contract workspace. Select the diagram to view it at full size.</figcaption>
        </figure>

        <details class="arch-description">
          <summary>Read the diagram description</summary>
          <div class="arch-description-body">
            <p>The design is for the procurement team and focuses on the intelligent repository stage after signing.</p>
            <div class="arch-description-grid">
              <section>
                <h3>Contracts come in</h3>
                <p>Procurement mailbox, Drive or SharePoint, DocuSign or other e-signature, and scanned stamp paper.</p>
              </section>
              <section>
                <h3>AI contract library</h3>
                <p>Ingest an estimated 6,000 contracts, classify and link them by type, supplier and stores, extract terms with citations and confidence, and have Ayesha and Kavita review them.</p>
              </section>
              <section>
                <h3>AskSirion</h3>
                <p>Ask questions in plain language, see cited clauses, and receive a “not found” response when the information is unavailable. The concept shows access in the app or Teams.</p>
              </section>
              <section>
                <h3>Team dashboard</h3>
                <p>Work by stage and flag, with renewal decision cards, invoice and store-closure checks, and views for Priya, Raj and Arjun. The concept also shows alerts in Teams and Outlook.</p>
              </section>
            </div>
            <p>The diagram maps the library and assistant to scattered contracts and unlinked amendments, and the dashboard to missed renewals, invoices above rates, closed-store billing, credits and compliance. People make decisions; the concept proposes AI-assisted drafts and human-controlled supplier communication.</p>
          </div>
        </details>
      </section>`;
  }

  window.renderArchitectureSection = renderArchitectureSection;
})();
