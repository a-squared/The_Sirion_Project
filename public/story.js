/* Case-study content supplied in the Contract Desk Overview document. */
(() => {
  'use strict';
  const sections = {
  "assumptions": [
    {
      "type": "paragraph",
      "text": "The brief leaves the company, geography and data open, so everything below is our assumption."
    },
    {
      "type": "figure",
      "src": "assets/rationale/tyran-store.png",
      "alt": "Illustration of a fictional Tyran store, showing HVAC, point-of-sale software, security, staffing and delivery contracts.",
      "caption": "The fictional Tyran store and the supplier contracts around it."
    },
    {
      "type": "heading",
      "text": "The company"
    },
    {
      "type": "list",
      "text": "Tyran Electronics is a fictional omnichannel electronics and appliance retailer, modelled on Vijay Sales."
    },
    {
      "type": "list",
      "text": "It has 55 stores in Maharashtra, Gujarat, Karnataka and Delhi NCR, plus tyran.in and an app. It was founded in Pune in 1989 and opens 8–10 stores a year."
    },
    {
      "type": "list",
      "text": "About 3,000 employees: 2,100 in stores, 350 in warehouses, 400 at head office, 150 online and in customer care."
    },
    {
      "type": "list",
      "text": "About 2,500 suppliers and ₹3,960 cr a year of supplier spend."
    },
    {
      "type": "list",
      "text": "India is our choice; the brief names no geography."
    },
    {
      "type": "heading",
      "text": "Contracts and systems"
    },
    {
      "type": "list",
      "text": "No central repository today. Contracts sit in email inboxes, Google Drive or SharePoint, desk files, scanned stamp paper and SAP purchase order attachments."
    },
    {
      "type": "list",
      "text": "About 6,000 signed documents; about 900 new or renewed each year; about 20% are scans; about 40% are on the supplier's own paper."
    },
    {
      "type": "list",
      "text": "Renewals are tracked in an Excel sheet that is about 40% complete."
    },
    {
      "type": "list",
      "text": "Systems in use: SAP S/4HANA, POS software, the e-commerce platform, Microsoft 365 (Teams, Outlook), DocuSign or Aadhaar e-sign."
    },
    {
      "type": "list",
      "text": "Rules that apply: Indian Contract Act, stamp duty, GST invoicing, DPDP Act 2023, and labour law (PF, ESI, PSARA)."
    },
    {
      "type": "heading",
      "text": "Scope"
    },
    {
      "type": "list",
      "text": "We cover indirect procurement: facilities, technology, staffing, logistics, marketing, consultants and packaging."
    },
    {
      "type": "list",
      "text": "Brand and distributor agreements (86% of spend) and store leases are out of scope and on the roadmap."
    },
    {
      "type": "heading",
      "text": "People"
    },
    {
      "type": "list",
      "text": "Procurement has 12 people, with 4 category managers each owning 300–600 suppliers."
    },
    {
      "type": "list",
      "text": "Legal has 8 people; accounts payable has 15."
    },
    {
      "type": "heading",
      "text": "The trigger: an FY25 internal audit (assumed)"
    },
    {
      "type": "list",
      "text": "₹3.2 cr of software and maintenance contracts renewed automatically without review"
    },
    {
      "type": "list",
      "text": "Staffing invoices about 5% above agreed rate cards, about ₹4 cr a year"
    },
    {
      "type": "list",
      "text": "POS licences, internet links and security still billed for closed stores"
    },
    {
      "type": "list",
      "text": "The CFO's instruction: \"Know what we've signed before FY27 planning.\""
    },
    {
      "type": "heading",
      "text": "Evidence and AI"
    },
    {
      "type": "list",
      "text": "All figures, people and audit findings are invented for this assignment."
    },
    {
      "type": "list",
      "text": "The interviews are simulated, used to test our assumptions."
    },
    {
      "type": "list",
      "text": "The prototype uses sample contracts with pre-extracted terms. A live AI model can be connected for Ask; automated extraction is proposed."
    },
    {
      "type": "paragraph",
      "text": "One-line summary: Tyran Electronics (fictional) · 55 stores · 3,000 employees · 2,500 suppliers · ~6,000 contracts · no repository today · all figures assumed."
    }
  ],
  "persona": [
    {
      "type": "paragraph",
      "text": "We built for Priya Nair, Tyran's indirect procurement manager. She scored highest on pain (44 of 65) and owns the suppliers the brief names: software, staffing, logistics, facilities, consultants and marketing."
    },
    {
      "type": "heading",
      "text": "How we chose her"
    },
    {
      "type": "list",
      "text": "Mapped the full contract lifecycle across Create, Store and Manage."
    },
    {
      "type": "list",
      "text": "Mapped who buys what: merchandise buyers, indirect procurement and real estate."
    },
    {
      "type": "list",
      "text": "Built a pain-by-person grid. Priya felt the most pain overall, with Arjun (34) and Raj (31) next."
    },
    {
      "type": "heading",
      "text": "Persona: Priya Nair"
    },
    {
      "type": "list",
      "text": "Owns about 600 suppliers and ₹150 cr of indirect spend"
    },
    {
      "type": "list",
      "text": "Measured on savings, renewals handled on time and supplier performance"
    },
    {
      "type": "list",
      "text": "Today: tracks renewals in an Excel sheet that is 40% complete; learns of renewals from invoices"
    },
    {
      "type": "list",
      "text": "Wants: never to miss a renewal, and evidence to negotiate with"
    },
    {
      "type": "list",
      "text": "Fears: another tool to keep updated; AI getting dates wrong"
    },
    {
      "type": "heading",
      "text": "Stakeholder map (show as a 2×2 grid)"
    },
    {
      "type": "table",
      "rows": [
        [
          "Quadrant",
          "Who"
        ],
        [
          "Manage closely",
          "Meera Iyer (CFO, sponsor); Arjun Desai (IT, co-owner of software contracts)"
        ],
        [
          "Keep satisfied",
          "Kavita Menon (Legal); Vivek Sharma (head of procurement, escalation)"
        ],
        [
          "Core users",
          "Priya Nair (primary); Ayesha Khan (analyst); Raj Mehta (accounts payable); Rohit Kulkarni (store operations)"
        ],
        [
          "Monitor",
          "Neha (HR); internal audit; suppliers"
        ]
      ]
    },
    {
      "type": "figure",
      "src": "assets/rationale/stakeholders.png",
      "alt": "Stakeholder map placing Priya, Ayesha, Raj and Rohit as core users, with the CFO, IT, Legal, procurement leadership, HR, internal audit and suppliers in supporting groups.",
      "caption": "Stakeholder map: who uses, sponsors and influences the product."
    },
    {
      "type": "heading",
      "text": "Conflicts and how the product resolves them"
    },
    {
      "type": "table",
      "rows": [
        [
          "Conflict",
          "Resolution"
        ],
        [
          "Procurement wants to cancel; the budget owner wants to keep the supplier",
          "Shared decision card with evidence; Rohit adds input; deadlocks go to Vivek"
        ],
        [
          "Finance wants to dispute every overcharge; Procurement protects relationships",
          "Variances under ₹500 or 2% are logged; Priya sees disputes first"
        ],
        [
          "Legal wants to review everything; users want instant answers",
          "Only low-confidence or high-risk terms go to Legal"
        ],
        [
          "IT, Procurement and Finance each own a piece of software renewals",
          "One card with an owner, a co-owner and Finance's view"
        ],
        [
          "Tyran enforces terms; suppliers prefer silent renewals",
          "The AI drafts; a person always sends"
        ],
        [
          "The CFO wants proof before paying",
          "One north-star metric, reported quarterly"
        ]
      ]
    }
  ],
  "problem": [
    {
      "type": "paragraph",
      "text": "Tyran cannot see what its contracts commit it to. Contracts are scattered, so renewals slip through unnoticed and invoices exceed agreed rates."
    },
    {
      "type": "figure",
      "src": "assets/rationale/problem.png",
      "alt": "Diagram of Tyran’s problem: scattered contracts lead to missed renewals and invoices above agreed rates.",
      "caption": "The problem, its people and its consequences."
    },
    {
      "type": "heading",
      "text": "Pain points at a glance"
    },
    {
      "type": "paragraph",
      "text": "The three that matter most are in bold. They score highest, and each one causes the next: contracts are scattered, so renewals slip and invoices go unchecked."
    },
    {
      "type": "table",
      "rows": [
        [
          "#",
          "Pain point",
          "What it looks like at Tyran",
          "Who feels it",
          "Score /45"
        ],
        [
          "P6",
          "Contracts scattered and unsearchable",
          "~6,000 documents across email, Drive, desks and SAP; every question goes to Legal",
          "Priya, Kavita, Raj",
          "35"
        ],
        [
          "P1",
          "Auto-renewals and missed notice periods",
          "₹3.2 cr renewed without review; Priya learns from the invoice",
          "Priya, Arjun",
          "35"
        ],
        [
          "P3",
          "Invoices above agreed rates",
          "Staffing invoices ~5% over the rate card, about ₹4 cr a year",
          "Raj",
          "34"
        ],
        [
          "P7",
          "Amendments not linked to the main contract",
          "Minimum-wage rate changes sit apart from the rate card",
          "Priya, Raj",
          "30"
        ],
        [
          "P11",
          "No view of total spend or commitments",
          "No leverage at renewal; CFO can't forecast",
          "Priya, Meera",
          "30"
        ],
        [
          "P13",
          "Approvals stall; Legal bottleneck",
          "Small contracts wait weeks (intake and negotiation, roadmap)",
          "Priya, Kavita",
          "30"
        ],
        [
          "P4",
          "Penalties and credits never claimed",
          "Late installs and downtime go unbilled back",
          "Priya, Rohit",
          "27"
        ],
        [
          "P5",
          "Supplier compliance untracked",
          "PSARA licences, PF and ESI receipts unchecked",
          "Neha, Kavita",
          "27"
        ],
        [
          "P12",
          "Requests lost",
          "Store requests on WhatsApp vanish (intake, roadmap)",
          "Rohit",
          "27"
        ],
        [
          "P2",
          "Contracts for closed stores still billed",
          "POS licences, guards and internet at shut stores",
          "Arjun, Raj",
          "26"
        ],
        [
          "P8",
          "Unused licences and usage overages",
          "Inactive ERP users; chatbot overage charges",
          "Arjun",
          "23"
        ],
        [
          "P9",
          "Data, AI and DPDP clauses unchecked",
          "Kiosk vendor may train its AI on customer data",
          "Kavita",
          "22"
        ],
        [
          "P10",
          "Billing doesn't match milestones",
          "Consultant billed before sign-off",
          "Raj",
          "20"
        ]
      ]
    },
    {
      "type": "paragraph",
      "text": "Who it affects: Priya most of all, then Raj in accounts payable and Arjun in IT. Kavita in Legal carries the hidden cost of answering everyone's questions."
    },
    {
      "type": "heading",
      "text": "Why it matters"
    },
    {
      "type": "list",
      "text": "Procurement contracts lose about 11% of their value to poor contract management (WorldCC, 2025)."
    },
    {
      "type": "list",
      "text": "Tyran's assumed FY25 audit found ₹3.2 cr of contracts renewed without review."
    },
    {
      "type": "list",
      "text": "Staffing invoices run about 5% above the rate card, roughly ₹4 cr a year."
    },
    {
      "type": "list",
      "text": "POS licences, internet links and security are still billed for closed stores."
    },
    {
      "type": "heading",
      "text": "How we know it's real"
    },
    {
      "type": "list",
      "text": "Audit evidence: the assumed FY25 findings above."
    },
    {
      "type": "list",
      "text": "Pattern across journeys: we mapped 13 indirect contract journeys. Closed-store billing, missed renewals and unenforced rates each appear in 7 of 13."
    },
    {
      "type": "list",
      "text": "Voices: four simulated interviews explored the assumed pains and informed four design decisions."
    },
    {
      "type": "list",
      "text": "Industry data: WorldCC research on value leakage, and Sirion's own CLM Navigator series."
    },
    {
      "type": "figure",
      "src": "assets/rationale/evidence.png",
      "alt": "Diagram of the assumptions used to frame the problem: a fictional internal audit, contract journeys, a pain matrix, simulated interviews and cited industry research.",
      "caption": "How the case-study assumptions were developed."
    },
    {
      "type": "paragraph",
      "text": "The 13 conceptual journeys behind it (the working prototype includes eight sample cases): HVAC maintenance, POS software, staffing agency, marketing agency, delivery and installation, security guards, store internet, ERP, inventory software, in-store AI kiosks, CRM and loyalty, GST e-invoicing, and an SAP consultant."
    },
    {
      "type": "heading",
      "text": "The top pains (full matrix in Detail 3)"
    },
    {
      "type": "table",
      "rows": [
        [
          "#",
          "Pain",
          "Score /45",
          "Who feels it most"
        ],
        [
          "P1",
          "Auto-renewals and missed notice periods",
          "35",
          "Priya, Arjun"
        ],
        [
          "P6",
          "Contracts scattered and unsearchable",
          "35",
          "Priya, Kavita"
        ],
        [
          "P3",
          "Invoices above agreed rates",
          "34",
          "Raj"
        ],
        [
          "P7",
          "Amendments not linked to the main contract",
          "30",
          "Priya, Raj"
        ],
        [
          "P11",
          "No view of total spend or commitments",
          "30",
          "Priya, Meera"
        ],
        [
          "P13",
          "Approvals stall; Legal bottleneck",
          "30",
          "Priya, Kavita"
        ]
      ]
    },
    {
      "type": "figure",
      "src": "assets/rationale/lifecycle.png",
      "alt": "Contract lifecycle diagram from request and signing through storage, management, invoicing and renewal; the post-signing stages are highlighted.",
      "caption": "The contract lifecycle and the post-signing breakdown."
    }
  ],
  "why-this-stage": [
    {
      "type": "paragraph",
      "text": "We chose the intelligent repository because it addresses the top 3 pains and 5 of the top 6. All three problems in the brief happen after signing, and Tyran can't act on terms it hasn't extracted."
    },
    {
      "type": "paragraph",
      "text": "Step 1: Score every pain without a scope filter. Each pain was scored 1–5 on time, value, risk, bottleneck, frequency, how hidden it is, how unpredictable it is, ease of adoption and data readiness."
    },
    {
      "type": "table",
      "rows": [
        [
          "#",
          "Pain",
          "Total /45",
          "Stage it belongs to"
        ],
        [
          "P1",
          "Auto-renewals, missed notice",
          "35",
          "Repository"
        ],
        [
          "P6",
          "Contracts scattered",
          "35",
          "Repository"
        ],
        [
          "P3",
          "Invoices above rates",
          "34",
          "Repository"
        ],
        [
          "P7",
          "Amendments not linked",
          "30",
          "Repository"
        ],
        [
          "P11",
          "No spend view",
          "30",
          "Repository"
        ],
        [
          "P13",
          "Approvals stall; Legal bottleneck",
          "30",
          "Intake / negotiation"
        ],
        [
          "P4",
          "Credits never claimed",
          "27",
          "Repository"
        ],
        [
          "P5",
          "Compliance untracked",
          "27",
          "Repository"
        ],
        [
          "P12",
          "Requests lost",
          "27",
          "Intake"
        ],
        [
          "P2",
          "Closed stores billed",
          "26",
          "Repository"
        ]
      ]
    },
    {
      "type": "paragraph",
      "text": "Step 2: Compare the three stages across frameworks."
    },
    {
      "type": "table",
      "rows": [
        [
          "Framework",
          "Intake",
          "Negotiation",
          "Repository",
          "Winner"
        ],
        [
          "RICE",
          "80",
          "30",
          "900",
          "Repository"
        ],
        [
          "ICE",
          "320",
          "160",
          "378",
          "Repository"
        ],
        [
          "Kano",
          "Performance",
          "Delighter",
          "Basic expectation",
          "Negotiation"
        ],
        [
          "Weighted, money first",
          "2.0",
          "3.6",
          "4.4",
          "Repository"
        ],
        [
          "Weighted, speed first",
          "2.4",
          "4.1",
          "3.9",
          "Negotiation"
        ]
      ]
    },
    {
      "type": "paragraph",
      "text": "Step 3: Check for bias. We first leaned towards the repository. So we rebuilt Tyran as a retailer and re-scored with no scope filter. The repository still won, by less than first thought. Negotiation is the honest runner-up: it stands out more on AI but doesn't fix the post-signing problems."
    },
    {
      "type": "paragraph",
      "text": "Step 4: Decide which part of the repository. Of 12 parts, Extract (26/30) and Renewals (26/30) scored highest. Search alone is a basic expectation, so the repository also acts: alerts, decision cards and invoice checks."
    },
    {
      "type": "figure",
      "src": "assets/rationale/repository.png",
      "alt": "Proposed repository workflow: gather and classify, extract terms, review, ask questions, handle renewal alerts and check invoices.",
      "caption": "The proposed store-and-manage workflow."
    },
    {
      "type": "paragraph",
      "text": "Step 5: Scope the features with RICE."
    },
    {
      "type": "table",
      "rows": [
        [
          "Priority",
          "Features"
        ],
        [
          "Must",
          "Ingest, classify and link, extract with citations, review queue, Ask, renewal alerts, renewal decision card"
        ],
        [
          "Should",
          "Rate-card invoice check, supplier spend view"
        ],
        [
          "Could",
          "Store-closure check, compliance expiry"
        ],
        [
          "Roadmap",
          "Penalty claims, clause risk scoring, CFO forecast, role-based access, rebates, lease escalations"
        ]
      ]
    },
    {
      "type": "paragraph",
      "text": "RICE ranked renewals low on reach. We overrode it because renewals carry the most money per event (₹3.2 cr) and drew the strongest reaction in interviews."
    }
  ],
  "metrics": [
    {
      "type": "paragraph",
      "text": "The north-star metric is the % of contract events acted on before their deadline: notice periods, renewals, expiring licences, invoice variances and credits owed. Today it is under 40%; the target is 95%. Priya and her team drive it directly, it moves week by week, and it measures the job the repository does: no commitment slips by unseen. ₹ protected or recovered per quarter (target ₹2 cr in two quarters) is the business outcome the CFO reports. It follows from the north star but depends on negotiations and other teams, so we don't steer by it."
    },
    {
      "type": "heading",
      "text": "The goal we are chasing"
    },
    {
      "type": "paragraph",
      "text": "Give Tyran control of what it has signed, so no commitment slips by unseen and no rupee leaves without matching the contract. Every pain we solve creates contract events the procurement team must act on in time. Acting on them moves four money streams, which add up to the business outcome."
    },
    {
      "type": "heading",
      "text": "Pain to metric map"
    },
    {
      "type": "table",
      "rows": [
        [
          "Pain",
          "Feature that solves it",
          "Metric",
          "Target",
          "Money stream"
        ],
        [
          "P6 Contracts scattered",
          "Ingest, classify and link",
          "% of ~6,000 contracts with verified key terms",
          "90% in 2 quarters",
          "Enabler for all four"
        ],
        [
          "P6 Contracts scattered",
          "Ask with citations",
          "Time to answer a contract question",
          "Under 1 minute",
          "Enabler (time saved for Legal)"
        ],
        [
          "P7 Amendments not linked",
          "Classify and link",
          "% of amendments linked to their parent",
          "95% or more",
          "Overbilling (correct rates)"
        ],
        [
          "P1 Auto-renewals",
          "Renewal alerts",
          "% of alerts acted on within 7 days",
          "70% or more",
          "Renewals"
        ],
        [
          "P1 Auto-renewals",
          "Renewal decision card",
          "% of renewals decided before the deadline",
          "95% (today under 40%)",
          "Renewals"
        ],
        [
          "P11 No spend view",
          "Supplier spend view on the card",
          "% of renewal decisions with spend data",
          "90% or more",
          "Renewals (leverage)"
        ],
        [
          "P3 Invoices above rates",
          "Rate-card invoice check",
          "% of flags that are real overcharges",
          "80% or more",
          "Overbilling"
        ],
        [
          "P2 Closed stores billed",
          "Store-closure check",
          "Closed-store contracts amended within 30 days",
          "100%",
          "Closed-store charges"
        ],
        [
          "P4 Credits never claimed",
          "Extracted service levels, draft claims",
          "₹ of credits and penalties claimed",
          "Tracked from Q1",
          "Credits"
        ],
        [
          "P5 Compliance untracked",
          "Compliance expiry flags",
          "Documents renewed before expiry",
          "100%",
          "Risk avoided"
        ],
        [
          "Trust in the AI (cross-cutting)",
          "Citations, confidence, review queue",
          "% of terms accepted without edits",
          "90% or more",
          "Enabler for all four"
        ]
      ]
    },
    {
      "type": "paragraph",
      "text": "How it adds up: trust (terms accepted without edits) → north star: % of contract events acted on before their deadline → business outcome: renewals cancelled or renegotiated + overbilling caught + closed-store charges stopped + credits claimed = ₹ protected per quarter, target ₹2 cr in two quarters."
    },
    {
      "type": "paragraph",
      "text": "P13 (approvals and Legal bottleneck) and P12 (lost requests) are intake and negotiation pains, outside this stage. They are on the roadmap."
    },
    {
      "type": "heading",
      "text": "Metrics by feature"
    },
    {
      "type": "table",
      "rows": [
        [
          "Feature",
          "Metric",
          "Target"
        ],
        [
          "Ingest",
          "% of ~6,000 contracts in the repository",
          "90% within 2 quarters"
        ],
        [
          "Classify and link",
          "% of amendments correctly linked",
          "95% or more"
        ],
        [
          "Extract terms",
          "% of terms accepted without edits",
          "90% or more"
        ],
        [
          "Review queue",
          "Median age of queue items",
          "Under 2 working days"
        ],
        [
          "Ask",
          "Time to answer a contract question",
          "Under 1 minute"
        ],
        [
          "Renewal alerts",
          "% of alerts acted on within 7 days",
          "70% or more"
        ],
        [
          "Renewal decision card",
          "% of renewals decided before the deadline",
          "95% or more (today under 40%)"
        ],
        [
          "Invoice check",
          "% of flags that are real overcharges",
          "80% or more"
        ],
        [
          "Store-closure check",
          "Closed-store contracts amended within 30 days",
          "100%"
        ]
      ]
    },
    {
      "type": "paragraph",
      "text": "What leads to what: trust (terms accepted without edits) and adoption (alerts acted on) come first. Renewals decided on time follow. Rupees saved is the result. If trust is low, the rupee figure won't move."
    },
    {
      "type": "heading",
      "text": "What would make us rethink"
    },
    {
      "type": "list",
      "text": "Reviewers edit more than 20% of terms: add more human review or narrow the fields."
    },
    {
      "type": "list",
      "text": "More than half of alerts are ignored: they are noisy or reach the wrong person."
    },
    {
      "type": "list",
      "text": "Invoice flag precision falls below 60%: tune tolerances or drop the feature."
    },
    {
      "type": "list",
      "text": "Most savings come from a few contracts: a simpler renewal calendar may be enough."
    }
  ]
};
  sections.assumptions.splice(1, 0, {
    type: 'paragraph',
    text: 'Tyran Electronics is a fictional chain of consumer electronics and appliance stores, like Vijay Sales or Croma. It sells phones, TVs, laptops, kitchen appliances and air conditioners through 55 large-format stores in Maharashtra, Gujarat, Karnataka and Delhi NCR, plus tyran.in and an app. Behind every store sit hundreds of supplier contracts: the HVAC that cools it, the POS software that bills customers, the guards at the door, the staff on the floor and the trucks that deliver and install.'
  });
  const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const tags = () => `<div class="r-tags"><span>For: Procurement team</span><span>Stage: Intelligent repository</span></div>`;
  const cards = [
    { id:'assumptions', num:'01', title:'Assumptions', tag:'Context', headline:'Tyran is a fictional electronics retailer with no contract repository today.', points:['55 stores · 3,000 employees · 2,500 suppliers', 'About 6,000 contracts across email, Drive, desks and SAP', 'Scope: indirect procurement; all figures assumed'], link:'See all assumptions' },
    { id:'persona', num:'02', title:'Persona', tag:'Stakeholder map', headline:'Priya owns 600 indirect suppliers, and every contract decision lands on her.', points:['Primary user: Priya Nair, indirect procurement manager', 'Connected users: Raj, Arjun, Kavita and Ayesha', 'Conflicts mapped with design responses'], link:'Read the stakeholder map' },
    { id:'problem', num:'03', title:'Pain points', tag:'The problem', headline:'Contracts are scattered, so renewals slip and invoices exceed agreed rates.', points:['₹3.2 cr of contracts renewed without review last year', 'Staffing invoices about 5% above the rate card (₹4 cr a year)', 'Patterns mapped across 13 conceptual contract journeys'], link:'See the problem' },
    { id:'why-this-stage', num:'04', title:'Prioritisation', tag:'Why this stage', headline:'The intelligent repository covers the top 3 pains and 5 of the top 6.', points:['13 pains scored on 9 criteria, with no scope filter', 'Repository wins 3 of 5 frameworks; negotiation was the runner-up', 'Bias-checked: re-scored after rebuilding the company'], link:'Why the repository' },
    { id:'metrics', num:'05', title:'Metrics', tag:'Success metrics', headline:'North star: % of contract events acted on before their deadline (assumed baseline under 40%, target 95%).', points:['95% of renewals decided before the notice deadline', '90% of extracted terms accepted without edits', '80% of invoice flags are real overcharges'], link:'How we’ll measure it' }
  ];
  const voices = [
    { initials:'PN', name:'Priya Nair', role:'Indirect procurement manager', quote:'“I found out the HVAC contract had renewed when the invoice arrived, 11 days after the notice deadline. If it’s another login, I won’t open it.”', pain:'P1 · Auto-renewals' },
    { initials:'RM', name:'Raj Mehta', role:'Accounts payable', quote:'“The rate card is a PDF in Priya’s email. I pay whatever the invoice says. If 45 of 50 flags are false alarms, I’ll switch it off.”', pain:'P3 · Invoices above rates' },
    { initials:'AD', name:'Arjun Desai', role:'IT head', quote:'“We paid licences for 70 counters when 6 stores had shut. I don’t trust AI unless it shows me the clause.”', pain:'P2 · Closed stores billed' },
    { initials:'KM', name:'Kavita Menon', role:'Legal', quote:'“Half my week goes on ‘where is the contract?’ and ‘what’s the notice period?’. I’d rather review the five clauses that matter.”', pain:'P6 · Contracts scattered' }
  ];
  const sectionMeta = [
    ['assumptions','01','Assumptions','The company, systems and constraints behind the case study.'],
    ['persona','02','Persona & stakeholder map','The people who use the product, influence it and need to work together.'],
    ['problem','03','The problem & pain points','Where contracts become hard to find, understand and act on.'],
    ['why-this-stage','04','Prioritisation & why this stage','How the repository was chosen and its features prioritised.'],
    ['metrics','05','Success metrics','The proposed north star, supporting measures and rethink criteria.']
  ];
  function table(rows) {
    if (!rows || !rows.length) return '';
    const header = rows[0], body = rows.slice(1);
    const topPains = header.includes('What it looks like at Tyran');
    return `<div class="r-table-wrap" role="region" aria-label="Case study table" tabindex="0"><table><thead><tr>${header.map((cell) => `<th scope="col">${esc(cell)}</th>`).join('')}</tr></thead><tbody>${body.map((row, index) => `<tr${topPains && index < 3 ? ' class="r-top-pain"' : ''}>${row.map((cell) => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function blocks(items) {
    let html='', inList=false;
    const endList = () => { if (inList) { html += '</ul>'; inList=false; } };
    for (const block of items || []) {
      if (block.type==='list') {
        if (!inList) { html += '<ul class="r-list">'; inList=true; }
        html += `<li>${esc(block.text)}</li>`;
        continue;
      }
      endList();
      if (block.type==='heading') html += `<h3 class="r-subhead">${esc(block.text.replace(' (show as a 2×2 grid)', ''))}</h3>`;
      else if (block.type==='paragraph') html += `<p class="r-copy">${esc(block.text)}</p>`;
      else if (block.type==='table') html += table(block.rows);
      else if (block.type==='figure') html += `<figure class="r-figure"><a href="${esc(block.src)}" target="_blank" rel="noopener" aria-label="Open ${esc(block.caption)} at full size"><img src="${esc(block.src)}" alt="${esc(block.alt)}" loading="lazy"></a><figcaption>${esc(block.caption)} <span>Open full size ↗</span></figcaption></figure>`;
    }
    endList();
    return html;
  }
  function renderRationaleSection(root, state, actions) {
    if (!root) return;
    root.innerHTML = `<div class="r-page">
      <header class="r-hero">${tags()}<div class="r-kicker">THE PRODUCT CASE STUDY</div><h2>Tyran can’t see what its contracts commit it to<span>.</span></h2><p>Contract Desk is an intelligent repository for the procurement team, built to help them understand and act on contracts after signing.</p></header>
      <aside class="r-disclosure"><strong>About this case study</strong><span>Tyran, its people, figures, audit findings and interviews are fictional or assumed. Scores and targets are proposed. The diagrams describe the intended product. Industry figures are reproduced from the supplied document and have not been independently verified.<br><br><strong>Current prototype:</strong> Eight sample contracts have pre-extracted terms; AskSirion provides sample answers and can connect to a model for other questions. Automatic extraction, Teams and Outlook alerts, and tolerance-based invoice flags are proposed capabilities.</span></aside>
      <div class="r-section-header"><div><span class="r-kicker">FIVE STEPS</span><h2>The reasoning at a glance</h2></div><p>Start with the company and its people, then follow the decisions that shaped the product.</p></div>
      <div class="r-card-grid">${cards.map((card) => `<article class="r-card">${tags()}<div class="r-card-top"><span>${esc(card.num)}</span><span>${esc(card.tag)}</span></div><h3>${esc(card.title)}</h3><p>${esc(card.headline)}</p><ul>${card.points.map((point) => `<li>${esc(point)}</li>`).join('')}</ul><a href="#${esc(card.id)}">${esc(card.link)} <span aria-hidden="true">→</span></a></article>`).join('')}</div>
      <section class="r-voices"><div class="r-section-header"><div><span class="r-kicker">HEAR THE NEED</span><h2>Voices from the team</h2></div><p>Simulated interviews, used to test our assumptions.</p></div><div class="r-voice-grid">${voices.map((voice) => `<figure class="r-voice"><span class="r-voice-pain">${esc(voice.pain)}</span><blockquote>${esc(voice.quote)}</blockquote><figcaption><span class="r-avatar">${esc(voice.initials)}</span><span><strong>${esc(voice.name)}</strong><small>${esc(voice.role)}</small></span></figcaption></figure>`).join('')}</div><p class="r-voice-note">What changed because of them: alerts in Teams and Outlook, a citation on every answer, tolerance limits on invoice flags, and one shared renewal card. These are proposed design choices.</p></section>
      <div class="r-try"><div><span class="r-kicker">THE WORKING PROTOTYPE</span><strong>See the workspace through Priya’s eyes.</strong></div><button type="button" data-try-board>Try it: open the Team Board as Priya <span aria-hidden="true">→</span></button></div>
      <div class="r-details">${sectionMeta.map(([id,num,title,description]) => `<section class="r-detail" id="${esc(id)}">${tags()}<div class="r-detail-heading"><div><span class="r-detail-number">${esc(num)}</span><h2>${esc(title)}</h2></div><p>${esc(description)}</p></div><div class="r-detail-body">${blocks(sections[id])}</div></section>`).join('')}</div>
    </div>`;
    const button=root.querySelector('[data-try-board]');
    if (button && actions) button.addEventListener('click', () => { if (typeof actions.setRole === 'function') actions.setRole('Priya Nair'); if (typeof actions.navigate === 'function') actions.navigate('board'); });
  }
  window.renderRationaleSection = renderRationaleSection;
  window.renderStory = renderRationaleSection;
})();
