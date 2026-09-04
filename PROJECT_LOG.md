# QuotePilot — Project Log

**What it is:** A tool for small-service contractors (plumbers, electricians, flooring, roofing, HVAC) that turns a customer's messy text request into a structured, priced quote — fast, with AI doing the scope extraction and the contractor reviewing/adjusting before anything goes out.

**Why this product:** Built as the first of several money-making product ideas explored (see "Ideas considered but shelved" below), chosen specifically because it's the only one that's genuinely $0 to build *and* $0 to run at any scale — no telephony, no per-message costs, no paid infrastructure hiding underneath it.

**Constraints driving every decision:** 100% free to create and operate, buildable/maintainable by a non-developer with an AI assistant doing the actual coding, stay within normal Claude usage.

---

## Current status

- **Section 1 — Intake + AI scope extraction: DONE, tested working.**
  Customer name, trade dropdown, job description textarea → "Extract scope" calls the AI live (not a mock) and returns an editable line-item scope list. Save/load persists via artifact storage — confirmed working across sessions.
- **Section 2 — Pricing calculator: DONE, built, not yet confirmed tested.**
  Materials / labor hours / labor rate / markup % → auto-computed labor total, subtotal, markup amount, grand total. Saved quotes list shows the computed total per quote.
- **Section 3 — PDF quote export: DONE, built, not yet confirmed tested.**
  Added a one-time "Your business" panel (name/phone/email, persisted separately from quotes so it's filled in once). "Preview & print quote" switches to a clean, light-themed printable document (business header, ESTIMATE title + date, customer + scope + pricing breakdown, 30-day validity note). "Download PDF" calls the browser's native print dialog (`window.print()`) — no PDF library dependency, since the artifact environment doesn't have one available; the browser's own "Save as PDF" handles the export. CSS isolates the print output to just the quote document, hiding the app UI.
- **Section 4 — Email send + follow-up tracking: DONE, built, not yet confirmed tested.**
  Added customer email field. "Email to customer" (in the preview view) marks the quote "Sent" and opens the user's own email client via a `mailto:` link with a pre-drafted message (mailto can't attach files, so the message reminds them to attach the already-downloaded quote). Saved quotes now show a status badge (Draft/Sent/Accepted/Declined); a quote sitting at "Sent" for 3+ days gets visually flagged with a one-click "Follow up" button that drafts a polite nudge email the same way. "Accepted"/"Declined" are one-click status updates from the saved list. Also fixed a latent bug from Section 1: saving used to always create a duplicate record — quotes now have a stable id and editing/re-saving updates the same record instead of cloning it.

**All 4 planned sections are now built.** Remaining work is testing (each section has been syntax-checked but not all been click-tested by the user) and any polish that surfaces from that.

Current file: `quotepilot.jsx` (single React component artifact).

---

## Design decisions (the "why," not just the "what")

- **Rejected the generic SaaS-dashboard look on purpose** — this is a tool a tradesperson opens between jobs, not a boardroom analytics dashboard.
- **First palette (dark brown/charcoal background + amber-orange accent) was scrapped** — user flagged it read as "too UPS" (brown + gold is literally UPS's brand). 
- **Current palette — "Blueprint & chalk line":**
  - Background `#101B2E`, surface `#17223A`, border `#283A57`
  - Text primary `#EEF2FA`, text secondary `#8492AD`
  - Accent (chalk-line yellow) `#F5B942`
  - Success `#6FBF8B`, danger `#E2574C`
  - Rationale: evokes blueprints/plan sheets and snapped chalk lines — trade-relevant without being literal or cliché, and clearly distinct from the UPS-coded brown/gold combo.
- **Typography:** "Big Shoulders Display" for headlines (industrial/work-order-ticket signage feel), "Inter" for body/UI.
- **Trade dropdown exists because of a discarded repo's good idea** — see below.

## Technical approach

- Built as a Claude artifact (React), not a native app or separate web deploy — avoids code-signing costs, OS-specific packaging, and hosting bills entirely.
- AI scope extraction calls the Anthropic API directly from the client (model: `claude-sonnet-4-6`), prompted with the selected trade for more relevant scope items.
- Persistence via the artifact's built-in key-value storage (personal, not shared) — quotes survive across sessions without any backend of our own.
- Every build is syntax-checked with Babel before being handed over, since there's no live browser here to click-test with — real interaction testing still needs to happen in the user's own session.

## Investigated and rejected as a base: ContractorKeith/contractor-bid

Looked like a fit from its GitHub description, but on actual inspection it's a Python CLI tool for organizing large *commercial* construction bid documents (architectural plan sets, CSI divisions) — explicitly states it does not price jobs, has no UI, and requires real command-line/Python setup. Not usable as a base; retrofitting it would mean discarding ~90%+ of it anyway. **One idea salvaged from it:** per-trade "scope profiles" (different expected scope items per trade) — this is why QuotePilot has a Trade dropdown that feeds into the AI prompt, instead of one generic extraction prompt for every job type.

## Ideas considered but shelved (for context if priorities change)

- **LocalLead OS** — full CRM ("the CRM that lives on your computer") with pipeline, email AI, and a Calls module. Good long-term platform vision, but a native Windows/Mac app + call/SMS features reintroduce real costs (code-signing certs, Twilio/SMS fees). Treated as a phase-2 rollup once revenue exists, not a v1.
- **InboxCloser** — AI email responder, can run on a local LLM for true $0 operating cost. Strong second build candidate, main risk is setup friction for non-technical buyers.
- **MissedCall Rescue** — auto-text-back after a missed call. Best-proven willingness to pay (real competitor pricing: $35–$97/mo) but requires a paid SMS provider from message #1 — can't be demoed at $0, only economical once a paying customer's subscription covers the per-message cost.
- **Lead Machine Kit** — generic lead-capture quiz + mini-CRM for local businesses (Tally + Google Sheets + Brevo, all free tiers), sold on Gumroad. Fully free, more of a "productized template" than custom software.
- **Booking/deposit app** — market is saturated (Calendly/Square/Setmore have strong free tiers); the real angle is a no-show deposit layer, not another calendar.

## Supporting tools

- **Hermes Agent** (Nous Research's open-source terminal agent) set up locally, connected to OpenRouter using a free-tier NVIDIA Nemotron model — used for research, learning/explaining code, and drafting first-pass copy. Deliberately kept separate from this build: it runs as its own local process and has no access to this artifact.
- **Claude Pro / Claude Code** — upgraded mid-project. Worth moving remaining work here: this chat-artifact environment has no PDF library available (Section 3's export uses a browser-print workaround instead) and runs in a sandbox that blocked a popup-based approach along the way. Claude Code removes both limitations — real npm packages, a real local browser, and direct git access to this repo.

## ⚠️ Known false-positive: don't "fix" the Anthropic fetch call

The `fetch('https://api.anthropic.com/v1/messages', ...)` call inside `extractScope()` is **intentional** and only works inside a real Claude.ai artifact — the platform proxies it and handles auth automatically, but only when the request matches the original shape exactly: `model: 'claude-sonnet-4-6'` and no `anthropic-version`/`x-api-key` headers. A general-purpose coding agent (this bit us once with Claude Code) will very reasonably flag this as broken — no auth header, an unfamiliar model string — and "fix" it by adding an `anthropic-version` header and swapping to a real model id like `claude-sonnet-5`. That fix will look correct if tested against a mock, but breaks the real feature, which can never authenticate as a standalone API call anyway (no key is ever present in this code). **Do not change the model string or add API headers to this specific fetch call.**

## How to pick this up in a new session

Give Claude this repo's URL — it can clone/read this log plus `quotepilot.jsx` directly and skip re-explaining any of the above.
