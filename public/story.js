/*
 * The Story is deliberately explicit about what came from the assignment,
 * what is a design hypothesis, and what has not been validated.
 */
(() => {
  window.renderStory = (root) => {
    root.innerHTML = `
      <article class="story">
        <header class="story-hero">
          <div class="story-hero__main">
            <div class="story-eyebrow"><span aria-hidden="true"></span> THE PROJECT STORY</div>
            <h1>Contracts still matter<br><em>after they are signed.</em></h1>
            <p class="story-hero__intro">
              This is the story of how we framed a contract-management assignment,
              chose a problem, and designed a workspace around the people who need
              to act on agreed terms.
            </p>
          </div>
          <div class="story-hero__aside">
            <span class="story-mini-label">OUR CHOSEN STAGE</span>
            <strong>Intelligent<br>repository</strong>
            <p>One searchable place for contract evidence, with a clearer path from understanding to action.</p>
          </div>
        </header>

        <div class="story-disclosure" role="note">
          <span class="story-disclosure__mark" aria-hidden="true">i</span>
          <div><strong>A note on evidence</strong>
            The company, named people, suppliers, terms, dates and board states are illustrative.
            The brief describes the problems; we have not conducted user interviews or verified losses.
          </div>
        </div>

        <section class="story-section" aria-labelledby="story-context-heading">
          <div class="story-section__heading">
            <span class="story-step">01</span>
            <div>
              <div class="story-kicker">THE BRIEF</div>
              <h2 id="story-context-heading">A growing company, scattered agreements.</h2>
            </div>
          </div>
          <div class="story-copy">
            <p>
              The assignment describes a company with <strong>3,000 employees</strong> and
              <strong>about 2,500 suppliers</strong>. Requests and agreements are spread across
              email, documents, shared drives, and spreadsheets. It reports unreviewed renewals,
              missed service levels, and invoices that do not match agreed prices.
            </p>
            <p>
              We imagined an electronics and appliances retailer to make the context tangible.
              It is a fictional scenario inspired by the shape of the business—not a claim about
              any real retailer’s operations.
            </p>
          </div>
          <div class="story-facts">
            <div class="story-fact"><strong>3,000</strong><span>employees in the brief</span></div>
            <div class="story-fact"><strong>~2,500</strong><span>suppliers in the brief</span></div>
            <div class="story-fact"><strong>3 stages</strong><span>the assignment asked us to choose from</span></div>
          </div>
        </section>

        <section class="story-section" aria-labelledby="story-focus-heading">
          <div class="story-section__heading">
            <span class="story-step">02</span>
            <div>
              <div class="story-kicker">THE CHOICE</div>
              <h2 id="story-focus-heading">Start with what was agreed.</h2>
            </div>
          </div>
          <div class="story-two-col">
            <div class="story-copy">
              <p>
                We considered intake, negotiation, and an intelligent repository. We chose
                the repository because the brief’s post-signature problems point to a common
                question: <em>where is the applicable agreement, and what does it actually say?</em>
              </p>
              <p>
                This is a product hypothesis, not a proven ranking. Signed terms can make
                renewals, pricing, service levels, and obligations easier to understand.
                Determining what happened in practice may also require invoices, usage,
                service records, or other evidence.
              </p>
            </div>
            <blockquote class="story-quote">
              <span>THE JOB TO BE DONE</span>
              “Help our team find the applicable terms, understand them with confidence,
              and know what needs attention.”
            </blockquote>
          </div>
        </section>

        <section class="story-section" aria-labelledby="story-people-heading">
          <div class="story-section__heading">
            <span class="story-step">03</span>
            <div>
              <div class="story-kicker">THE PEOPLE</div>
              <h2 id="story-people-heading">One team. Different decisions.</h2>
            </div>
          </div>
          <p class="story-section__lead">
            We chose the procurement management team as the primary audience. The names
            are illustrative personas, and responsibilities would need validation.
          </p>
          <div class="story-table-wrap">
            <table class="story-table">
              <thead><tr><th>Stakeholder</th><th>What matters to them</th><th>Possible tension</th></tr></thead>
              <tbody>
                <tr><td><strong>Priya · Procurement</strong></td><td>Renewals, supplier decisions, and cost visibility</td><td>Acting quickly while involving the right owners</td></tr>
                <tr><td><strong>Ayesha · Analyst</strong></td><td>Find, link, and verify the right terms</td><td>Completeness and accuracy versus review time</td></tr>
                <tr><td><strong>Raj · Accounts payable</strong></td><td>Evidence for invoice questions and payment decisions</td><td>Payment speed versus confirming an exception</td></tr>
                <tr><td><strong>Arjun · IT</strong></td><td>Software usage, service continuity, and supplier performance</td><td>Cost decisions versus business continuity</td></tr>
                <tr><td><strong>Kavita · Legal</strong></td><td>Correct interpretation of risk and obligations</td><td>Thorough review versus urgent action</td></tr>
                <tr><td><strong>Business and store teams</strong></td><td>Reliable services and practical operating evidence</td><td>Gathering records alongside daily operations</td></tr>
                <tr><td><strong>Suppliers</strong></td><td>Predictable terms, notice, and commercial relationships</td><td>The retailer’s review or change in requirements</td></tr>
                <tr><td><strong>Procurement leadership</strong></td><td>Visibility, accountability, and measured outcomes</td><td>Aggregate reporting without overstating savings</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="story-section" aria-labelledby="story-design-heading">
          <div class="story-section__heading">
            <span class="story-step">04</span>
            <div>
              <div class="story-kicker">FROM THINKING TO DESIGN</div>
              <h2 id="story-design-heading">One experience, many questions.</h2>
            </div>
          </div>
          <div class="story-timeline">
            <div class="story-timeline__item">
              <span>01</span><div><h3>Choose a context</h3><p>Use an illustrative retailer, then consider the people and supplier categories involved.</p></div>
            </div>
            <div class="story-timeline__item">
              <span>02</span><div><h3>Map the questions</h3><p>Look across pricing, scope, service levels, renewal, obligations, and supplier risk.</p></div>
            </div>
            <div class="story-timeline__item">
              <span>03</span><div><h3>Shape the journey</h3><p>Find the agreement, inspect cited terms, surface important dates, and keep next steps visible.</p></div>
            </div>
            <div class="story-timeline__item">
              <span>04</span><div><h3>Make the work visible</h3><p>Bring a portfolio overview, a contracts library, and a contract-based team board together.</p></div>
            </div>
          </div>
          <div class="story-categories">
            <span>MERCHANDISE</span><span>STORES &amp; FACILITIES</span><span>TECHNOLOGY</span>
            <span>LOGISTICS</span><span>WORKFORCE</span><span>PROFESSIONAL SERVICES</span>
          </div>
        </section>

        <section class="story-section" aria-labelledby="story-measure-heading">
          <div class="story-section__heading">
            <span class="story-step">05</span>
            <div>
              <div class="story-kicker">SUCCESS &amp; LEARNING</div>
              <h2 id="story-measure-heading">Make the outcome count.</h2>
            </div>
          </div>
          <div class="story-metric">
            <div>
              <span class="story-mini-label">PROPOSED NORTH STAR</span>
              <h3>₹ protected or found this quarter</h3>
              <p>
                Separate identified opportunities from independently verified protected
                or realised value. Keep the calculation and evidence visible; a contract’s
                face value is not itself a saving.
              </p>
            </div>
            <div class="story-metric__icon" aria-hidden="true">↗</div>
          </div>
          <div class="story-two-col story-measures">
            <div>
              <h3>Signals we would also follow</h3>
              <p>Correct, source-backed answers; time to locate terms; timely decisions; document coverage; and unresolved or unsupported answers.</p>
            </div>
            <div>
              <h3>When we would rethink</h3>
              <p>If the right agreements cannot be assembled, answers cannot be trusted, or the work does not help the team act in time, we would revisit the approach.</p>
            </div>
          </div>
        </section>

        <footer class="story-footer">
          <div><strong>Built around an assumption worth testing.</strong>
            <p>The eight example contract values and scenarios help illustrate the experience. They do not establish actual coverage, user demand, savings, or supplier issues.</p>
          </div>
          <span>THE STORY SO FAR <span aria-hidden="true">↗</span></span>
        </footer>
      </article>
    `;
  };
})();
