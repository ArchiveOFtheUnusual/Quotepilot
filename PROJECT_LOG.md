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
- **Section 3 — PDF quote export: NOT STARTED.** Next up.
- **Section 4 — Email send + follow-up tracking: NOT STARTED.**

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

## How to pick this up in a new session

Give Claude this repo's URL — it can clone/read this log plus `quotepilot.jsx` directly and skip re-explaining any of the above.
