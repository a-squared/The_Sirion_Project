/* Original synthetic sources used only to safely upgrade unchanged demo records. */
window.LEGACY_DEMO_SOURCES = {
  "ac-maintenance": {
    "documents": [
      {
        "id": "ac-master",
        "name": "Illustrative maintenance agreement",
        "kind": "Synthetic agreement excerpt",
        "content": "SYNTHETIC EXAMPLE — not a signed or verified agreement.\n\nRenewal: The initial term ends on 15 April 2027. Unless either party gives written notice by 15 January 2027, the agreement renews for a further twelve months.\n\nSite changes: The retailer may request removal of a store from the maintenance schedule. The supplier and retailer will confirm the effective date and any applicable minimum commitment in writing.\n\nImportant: No store register, closure notice, or invoice is included with this example."
      }
    ],
    "supportingEvidence": [],
    "terms": [
      {
        "label": "Notice date",
        "value": "15 Jan 2027",
        "source": "Illustrative maintenance agreement, Renewal",
        "reviewed": true
      },
      {
        "label": "Closed-store treatment",
        "value": "Written notice and a contract-specific review are required.",
        "source": "Illustrative maintenance agreement, Site changes",
        "reviewed": false
      }
    ],
    "flags": [
      {
        "label": "Renewal due",
        "severity": "danger"
      },
      {
        "label": "Store coverage review",
        "severity": "warning"
      }
    ],
    "notes": "Demo workflow: review renewal terms and obtain supporting site records before assessing any charge."
  },
  "billing-software": {
    "documents": [
      {
        "id": "billing-master",
        "name": "Illustrative subscription terms",
        "kind": "Synthetic agreement excerpt",
        "content": "SYNTHETIC EXAMPLE — not a signed or verified agreement.\n\nScope: The subscription covers up to 400 named users, subject to a minimum commitment of 300 licences. Unused licences do not automatically reduce the commitment.\n\nPricing: At renewal the supplier may propose an increase of up to 3% of the existing subscription fee, subject to the notice and other conditions in this agreement.\n\nRenewal: The current term ends on 29 August 2027. Written non-renewal notice is due by 31 May 2027.\n\nImportant: No actual usage records, proposed increase, or invoice is included."
      }
    ],
    "supportingEvidence": [],
    "terms": [
      {
        "label": "Renewal notice",
        "value": "31 May 2027",
        "source": "Illustrative subscription terms, Renewal",
        "reviewed": true
      },
      {
        "label": "Price increase",
        "value": "Subject to the conditions in the sample renewal clause.",
        "source": "Illustrative subscription terms, Pricing",
        "reviewed": false
      }
    ],
    "flags": [
      {
        "label": "Terms need review",
        "severity": "violet"
      },
      {
        "label": "Usage evidence needed",
        "severity": "info"
      }
    ],
    "notes": "Demo workflow: obtain usage and invoice evidence before concluding whether any fee is avoidable."
  },
  "staffing": {
    "documents": [
      {
        "id": "staffing-master",
        "name": "Illustrative staffing agreement",
        "kind": "Synthetic agreement excerpt",
        "content": "SYNTHETIC EXAMPLE — not a signed or verified agreement.\n\nRate card: A standard weekday sales-assistant shift in Zone A is ₹600 before tax, subject to any signed amendment. Different rates may apply to overtime or other shift types.\n\nCompliance: The supplier must maintain any licences and insurance required under the agreement and provide evidence on request.\n\nRenewal: The term ends on 30 September 2027. Written non-renewal notice is due by 1 July 2027."
      },
      {
        "id": "staffing-amendment",
        "name": "Illustrative rate amendment",
        "kind": "Synthetic amendment excerpt",
        "effectiveDate": "2026-08-01",
        "content": "SYNTHETIC EXAMPLE — not a signed or verified agreement.\n\nRate change: From 1 August 2026, the rate for a standard weekday sales-assistant shift in Zone A changes to ₹650 before tax. Other shift types and authorised extras remain governed by the applicable rate card.\n\nThis illustrative amendment must be read alongside the synthetic staffing agreement."
      }
    ],
    "supportingEvidence": [
      {
        "id": "staffing-invoice",
        "name": "Illustrative invoice line",
        "kind": "Synthetic supporting evidence — not a contract",
        "content": "SYNTHETIC EXAMPLE — a November 2026 invoice line records 25 standard weekday Zone A shifts at ₹750 each before tax, totalling ₹18,750. Verify any authorised extras and classification before drawing a conclusion."
      },
      {
        "id": "staffing-attendance",
        "name": "Illustrative attendance summary",
        "kind": "Synthetic supporting evidence — not a contract",
        "content": "SYNTHETIC EXAMPLE — the sample attendance summary lists 25 standard weekday sales-assistant shifts in Zone A during November 2026."
      }
    ],
    "terms": [
      {
        "label": "Standard weekday shift rate",
        "value": "₹650 from 1 Aug 2026, subject to applicability.",
        "source": "Illustrative rate amendment, Rate change",
        "reviewed": false
      },
      {
        "label": "Renewal notice",
        "value": "1 Jul 2027",
        "source": "Illustrative staffing agreement, Renewal",
        "reviewed": true
      }
    ],
    "flags": [
      {
        "label": "Rate terms to review",
        "severity": "violet"
      },
      {
        "label": "Potential rate variance",
        "severity": "warning"
      }
    ],
    "notes": "If the sample records and applicable conditions are confirmed, the arithmetic suggests a possible ₹2,500 difference. This is not a verified loss."
  },
  "marketing": {
    "documents": [
      {
        "id": "marketing-master",
        "name": "Illustrative agency agreement",
        "kind": "Synthetic agreement excerpt",
        "content": "SYNTHETIC EXAMPLE — not a signed or verified agreement.\n\nScope: The agency will provide the services described in the agreed statement of work. Changes to deliverables or fees must follow the written variation procedure.\n\nRetainer: The agreed retainer remains payable unless changed under an applicable signed variation.\n\nImportant: No approved scope change or invoice is included in this example. A reduction in work alone does not establish a reduction in the fee."
      }
    ],
    "supportingEvidence": [],
    "terms": [
      {
        "label": "Scope changes",
        "value": "Fee changes require the applicable signed variation.",
        "source": "Illustrative agency agreement, Scope",
        "reviewed": false
      }
    ],
    "flags": [
      {
        "label": "Owner needs confirmation",
        "severity": "info"
      },
      {
        "label": "Scope evidence needed",
        "severity": "violet"
      }
    ],
    "notes": "Demo workflow: confirm an owner and look for a signed scope variation before assessing the retainer."
  },
  "delivery": {
    "documents": [
      {
        "id": "delivery-master",
        "name": "Illustrative delivery agreement",
        "kind": "Synthetic agreement excerpt",
        "content": "SYNTHETIC EXAMPLE — not a signed or verified agreement.\n\nService level: At least 98% of eligible installations in each calendar month must be completed within two business days of the agreed appointment date. Customer-requested rescheduling is excluded.\n\nService credit: Where the stated service level is missed, the retailer may request a credit equal to 2% of the affected month's service fee by submitting a qualifying claim within 30 days. Other claim conditions may apply.\n\nTerm: The current term ends on 30 September 2027; written non-renewal notice is due by 1 July 2027.\n\nImportant: No delivery log, service report, or claim record is included."
      }
    ],
    "supportingEvidence": [],
    "terms": [
      {
        "label": "Installation service level",
        "value": "98% within two business days, subject to stated exclusions.",
        "source": "Illustrative delivery agreement, Service level",
        "reviewed": false
      },
      {
        "label": "Renewal notice",
        "value": "1 Jul 2027",
        "source": "Illustrative delivery agreement, Term",
        "reviewed": true
      }
    ],
    "flags": [
      {
        "label": "Service terms to review",
        "severity": "violet"
      },
      {
        "label": "Performance evidence needed",
        "severity": "info"
      }
    ],
    "notes": "Demo workflow: obtain a service report before suggesting an SLA failure or a claim."
  },
  "security": {
    "documents": [
      {
        "id": "security-master",
        "name": "Illustrative security agreement",
        "kind": "Synthetic agreement excerpt",
        "content": "SYNTHETIC EXAMPLE — not a signed or verified agreement.\n\nDocuments: The supplier must maintain the licences and insurance specified in the agreement and provide current copies when requested.\n\nSite schedule: Service is provided for the sites listed in the applicable schedule. The effect of a site closure depends on the notice and site-change provisions.\n\nImportant: No licence, insurance certificate, store register, notice, or invoice is included. An absent document here does not establish that a licence has expired."
      }
    ],
    "supportingEvidence": [],
    "terms": [
      {
        "label": "Licence evidence",
        "value": "Current evidence must be requested from the supplier.",
        "source": "Illustrative security agreement, Documents",
        "reviewed": false
      }
    ],
    "flags": [
      {
        "label": "Licence evidence needed",
        "severity": "violet"
      },
      {
        "label": "Site coverage review",
        "severity": "warning"
      }
    ],
    "notes": "Demo workflow: request current documents and store records before reaching a conclusion."
  },
  "internet": {
    "documents": [
      {
        "id": "internet-master",
        "name": "Illustrative connectivity agreement",
        "kind": "Synthetic agreement excerpt",
        "content": "SYNTHETIC EXAMPLE — not a signed or verified agreement.\n\nSite exit: Each circuit is subject to its applicable order and minimum term. Early-disconnection fees and written-notice requirements may apply; a store closure does not by itself establish that all charges stop.\n\nTerm: The current agreement ends on 31 October 2027. Written non-renewal notice is due by 1 August 2027.\n\nImportant: The site-level circuit inventory, closure notices, and invoices are not included."
      }
    ],
    "supportingEvidence": [],
    "terms": [
      {
        "label": "Site disconnection",
        "value": "Check lock-in and written notice for each site.",
        "source": "Illustrative connectivity agreement, Site exit",
        "reviewed": false
      },
      {
        "label": "Agreement notice",
        "value": "1 Aug 2027",
        "source": "Illustrative connectivity agreement, Term",
        "reviewed": true
      }
    ],
    "flags": [
      {
        "label": "Site exit terms",
        "severity": "warning"
      },
      {
        "label": "Circuit evidence needed",
        "severity": "info"
      }
    ],
    "notes": "The 'Decision in progress' state is illustrative. Check each circuit order and applicable evidence."
  },
  "sap": {
    "documents": [
      {
        "id": "sap-master",
        "name": "Illustrative consulting agreement",
        "kind": "Synthetic agreement excerpt",
        "content": "SYNTHETIC EXAMPLE — not a signed or verified agreement.\n\nPayment: Fees for a milestone are due after the retailer accepts the deliverable in accordance with the applicable work order. Any permitted advance payment must be expressly stated in that work order.\n\nTerm: The current term ends on 31 August 2027. Written non-renewal notice is due by 1 June 2027.\n\nImportant: No work order, acceptance record, or invoice is included, so payment timing cannot be assessed from this excerpt alone."
      }
    ],
    "supportingEvidence": [],
    "terms": [
      {
        "label": "Milestone payment",
        "value": "Payment follows the acceptance condition in the relevant work order.",
        "source": "Illustrative consulting agreement, Payment",
        "reviewed": true
      },
      {
        "label": "Renewal notice",
        "value": "1 Jun 2027",
        "source": "Illustrative consulting agreement, Term",
        "reviewed": true
      }
    ],
    "flags": [
      {
        "label": "Milestone terms",
        "severity": "info"
      }
    ],
    "notes": "Demo workflow: review the applicable work order, acceptance, and invoice before assessing a payment."
  }
};
