# Contract workspace prototype

A local procurement workspace for the assignment: Overview, Contracts Library, Team Board, and Story. The eight bundled supplier records and their terms, dates, and board states are **synthetic examples**, not verified signed agreements or actual financial outcomes. The example contract values are not annual spend or confirmed savings.

## Preview without a server

Open `public/index.html` in a browser. The four example questions, contract library, board, and Story work in this local preview; changes are stored in the browser. You can add a text file as a source. PDF extraction, general model-generated answers, and email delivery require the local server and appropriate configuration.

Email addresses added in the file preview are stored only in that browser's file-origin storage. They are not delivered and do not transfer automatically to the server-backed app. Use fictional data only in the preview.

## Start locally

Requires Node.js 20 or later. No npm packages need to be installed.

```sh
npm start
```

Open `http://127.0.0.1:3000` on the same computer. `PORT` can select a different local port. The server always binds to `127.0.0.1` and is not a public or shareable deployment.

Run `npm test` for the offline UI, mocked integration, and in-process backend checks. These do not start a listener, contact an AI provider, or send email.

Local changes and uploaded files are stored in `.data/`, which is excluded from Git. The server creates private directories and files with permissions `0700` and `0600` respectively. PDF text extraction requires `pdftotext`; PDFs without machine-readable text need OCR before upload. UTF-8 text uploads are also supported.

## AI answers

For real model-generated answers, provide `OPENAI_API_KEY` in the server's environment and restart it. The optional `OPENAI_MODEL` variable defaults to `gpt-4.1-mini`. Without a key, the application reports that AI is not configured. It also offers four explicitly labelled, fixed demonstration answers for the unchanged built-in fixtures and a keyword document search; those demonstrations are not model-generated answers. Arbitrary questions and uploaded documents require a configured model for AI answers.

Each question and the selected source excerpts are sent to OpenAI. Use only content you are authorized to send. The server asks the model to treat source instructions as untrusted, and returns only source IDs and verbatim excerpts that are present in the supplied text. These checks do not prove that a model's interpretation is correct. Human review remains important, especially for dates, financial comparisons, and legal terms.

## Sample-only email

Email is disabled by default. To enable delivery of **bundled synthetic sample cards only**, configure the following environment variables and restart the server:

- `ENABLE_SAMPLE_EMAIL=1`
- `SMTP_HOST` and `SMTP_FROM`
- Optionally `SMTP_PORT` (defaults to `587`), `SMTP_USERNAME`, and `SMTP_PASSWORD`.

SMTP requires TLS: port `465` uses implicit TLS; other ports use STARTTLS. SMTP credentials must be supplied together where the provider requires them. Any valid recipient domain can be entered. A local user can register a recipient and explicitly request a sample email; while the server is running, the scheduler checks sample notice dates once per minute and can send one reminder per subscription and stage at 90, 60, 30, and 7 days or once overdue. If the server was offline when a threshold passed, it sends the nearest applicable stage rather than all missed stages.

There is **no mailbox verification, login, or access control** in this local prototype. To prevent disclosure of uploaded or edited content, outgoing emails are constructed exclusively from the bundled synthetic fixtures; user-uploaded documents, changes to cards, and real contract information are never included. Emails do not include a misleading localhost link. Email delivery needs a real configured SMTP provider; an unconfigured or failed send is reported as such. Teams and Outlook-specific integrations are not included.

## Security and production limitations

- Use synthetic data in this prototype. The role switcher is a demonstration filter, not authentication or authorization.
- Before handling restricted real contracts or making the application reachable by anyone else, implement a maintained authentication provider, enforce user- and contract-level authorization, and verify unauthorized access is denied. Do not publish the local listener or storage as-is.
- Real email notifications require authenticated recipient identity, authorization to view each card, consent/preferences, a production mail service, and a durable scheduler. The sample-only mail gate is not a substitute for these controls.
- The scheduler and local JSON store are for a single-computer demonstration, not a durable multi-user service. A crash after a mail server accepts a message and before its sent state is recorded can lead to a duplicate after restart.
- Dates and extracted fields require review. An invoice mismatch, service breach, or saving cannot be confirmed from contract text alone. Sending a draft, marking an item sent, holding a payment, and completing a real supplier action require appropriate external evidence or integrations.

## Main local endpoints

- `GET /api/status` reports AI and email configuration without exposing credentials.
- `GET /api/state` and `POST /api/state` load and save contract records.
- `POST /api/ask` asks the configured model about supplied source excerpts.
- `POST /api/upload` extracts text from a PDF or UTF-8 text document; `GET /api/file/:id` retrieves its locally stored original.
- `GET /api/subscriptions`, `POST /api/subscriptions`, `DELETE /api/subscriptions/:id`, and `POST /api/subscriptions/:id/send` manage sample-only email subscriptions.
