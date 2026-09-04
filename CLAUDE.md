# Bidoro — Agent Context

Read this whole file before making any changes. It consolidates everything from `PROJECT_LOG.md`, `BUSINESS_PLAN.md`, `MASTER_PLAN.md`, and `NAMING_STRATEGY.md` into one current reference. Those files still exist for historical detail, but this one is the source of truth for current state.

---

## ✅ Rename to Bidoro: complete

The product name is locked as "Bidoro," and the full rename has been done and verified — this is no longer a pending task. What changed:

1. `scopesnap.html` → `bidoro.html`: page title, `<h1>` header, the `Bidoro()` component name, the render call, mailto body text, Settings-screen copy, and the `localStorage` keys (`bidoro-quotes`, `bidoro-business`, `bidoro-settings` — note these are new keys, so any old test data saved under the previous `quotepilot-*` keys won't carry over, which is fine since nothing has shipped to a real customer).
2. `scopesnap-demo.jsx` → `bidoro-demo.jsx`: same text changes. **The protected Claude.ai API call (model `claude-sonnet-4-6`, no extra headers) was explicitly verified untouched** — see the warning below, which still applies.
3. All three PDFs regenerated under `bidoro-` filenames with "BIDORO" branding, each re-rendered and visually checked page-by-page after rebuilding (not just assumed correct from the text swap).
4. `logo.png` regenerated with a "BIDORO" wordmark. One real bug was caught and fixed during this: an initial two-color split of the logo text (using an SVG `tspan` with `text-anchor="middle"`) caused overlapping letters between "BID" and "ORO" — fixed by rendering the wordmark as a single solid color instead of guessing at manual offsets.
5. All planning docs (`PROJECT_LOG.md`, `BUSINESS_PLAN.md`, `MASTER_PLAN.md`, `PAPERWORK_KIT_LISTING.md`, `website-preview.html`) updated to reference Bidoro and the new filenames throughout.
6. `NAMING_STRATEGY.md` was deliberately **not** rebranded — it's a historical record of the naming decision process and should keep referring to "ScopeSnap" (and the other rejected candidates) as what they were at the time.

Everything above was verified the same way the rest of this project has been: JSX syntax-checked after every text change, PDFs re-rendered to images and visually inspected (catching a couple of real bugs along the way, not just assumed correct), and the protected API call explicitly grepped-for to confirm it wasn't touched.

---

## Naming history (why we're on attempt #3)

1. **QuotePilot** — original name. Dropped for leaning on the overused "-pilot" AI-naming pattern.
2. **ScopeSnap** — second name, built around the blueprint/chalk-line visual brand. Dropped after verification found two live, direct competitors already using it: `scopesnap.app` (a contractor billing/invoicing app) and `scopesnap.io` (an AI notes-to-scope tool). Confusingly close on both counts.
3. **Bidoro** — current, locked name. Verified clean: no software, SaaS, or contractor-tool use found anywhere. Only existing uses are unrelated — a traditional Japanese glassware craft term (Tsugaru Bidoro), an African marketplace app, and a small manufacturing-parts company. None in our category.

Six other candidates (ChalkLine, Bidwright, Trady, Estimio, Quovex, Trebix) were checked and rejected — all collided with real, active competitors or companies. Full detail in `NAMING_STRATEGY.md` if useful, but the outcome above is what matters going forward.

---

## What the product actually is

An AI tool for small-service contractors (plumbers, electricians, flooring, roofing, HVAC) that turns a customer's messy text/email request into a structured, priced, professional estimate — in about a minute instead of typing one up from scratch.

**Two versions exist, for different purposes:**
- **`bidoro.html`** (rename pending, currently `scopesnap.html`) — the real, sellable, standalone product. Runs entirely client-side: no server, no account with us. Storage via `localStorage`. AI scope-extraction calls OpenRouter directly using the buyer's own free API key (see Settings screen in-app). This is what gets sold on Gumroad.
- **`bidoro-demo.jsx`** (rename pending, currently `scopesnap-demo.jsx`) — a Claude.ai-artifact-only demo version, used for live in-chat demonstrations. **Do not confuse the two or merge their architectures.**

**All 4 build sections are complete and tested:**
1. Intake form + AI scope extraction
2. Pricing calculator (materials, labor, markup → total)
3. PDF-quality preview + download (browser print-to-PDF approach, since no PDF library is available in the Claude-artifact build environment) + email-to-customer via `mailto:`
4. Status tracking (Draft/Sent/Accepted/Declined) with automatic "follow up" flagging after 3+ days sitting at Sent

---

## ⚠️ Critical: do not "fix" the AI call in the Claude.ai demo file

Inside `bidoro-demo.jsx` (the Claude.ai-only version), the `fetch('https://api.anthropic.com/v1/messages', ...)` call is intentional and only works inside a real Claude.ai artifact — the platform proxies it and handles auth automatically, but only when the request matches the original shape exactly: `model: 'claude-sonnet-4-6'`, no `anthropic-version` or `x-api-key` headers. A general-purpose coding agent will very reasonably flag this as broken (no auth header, unfamiliar model string) and try to "fix" it by adding a header and swapping the model — this happened once already with Claude Code. That fix will look correct against a mock test but breaks the real feature. **Do not change the model string or add API headers to that specific fetch call.** This warning does not apply to `bidoro.html` (the standalone version), which correctly uses OpenRouter with a real user-supplied key.

---

## Brand identity

- **Visual direction:** "Blueprint & chalk line" — evokes plan sheets and snapped chalk lines, deliberately avoiding both generic SaaS-dashboard look and (after an earlier miss) anything resembling UPS's brown/gold branding.
- **Colors:** background `#101B2E`, surface `#17223A`, border `#283A57`, text primary `#EEF2FA`, text secondary `#8492AD`, accent (chalk-line yellow) `#F5B942`, success `#6FBF8B`, danger `#E2574C`.
- **Typography:** "Big Shoulders Display" for headlines (industrial/work-order-ticket signage feel), "Inter" for body/UI text.
- **Positioning line:** *"The $49 quoting tool for solo contractors who don't need — or want to pay monthly for — a whole business platform."*

---

## Business model (verified, not estimated)

- **Price:** $49 one-time (not subscription) — deliberate contrast with every competitor found, all of which are monthly subscriptions.
- **Sold on:** Gumroad. Fee structure verified: 10% platform fee + 2.9% + $0.30 processing ≈ 13.2% effective, netting **~$42.38 per $49 sale**.
- **Payout:** Direct deposit/ACH to a US bank account (not PayPal — PayPal adds extra fees that only make sense for sellers without US banking access). Weekly payouts every Friday, $10 minimum balance, 7-day hold on new-seller sales.
- **Companion product:** `bidoro-paperwork-kit.pdf` (rename pending) — a $12 fillable Estimate/Invoice/Change-Order/Checklist bundle, sold separately as a lower-friction product and upsell funnel into the main app. Listing copy in `PAPERWORK_KIT_LISTING.md`.
- **Business email:** a dedicated Gmail address (not personal) recommended for the Gumroad account and customer contact; Zoho Mail recommended as the free custom-domain upgrade once a landing page domain exists.

---

## Verified competitive landscape

| Competitor | Model | Price | Notes |
|---|---|---|---|
| Tradify | Subscription/user | $47–61/mo | Full job-management suite (quoting, invoicing, scheduling, timesheets). NZ, since 2013, ~20,000 customers, acquired by Access Group 2024. AI features gated to top tier. |
| Bidwright | Subscription/self-hosted | Varies | AI construction estimating for larger/commercial takeoffs (2D/3D/BIM) — different segment than us. |
| Estimio | Subscription (trial) | Undisclosed | Closest direct functional competitor — AI job-description-to-estimate, mobile-first. |
| B2W Software | Enterprise | Undisclosed | Heavy/civil construction estimating since 1993 — different segment. |
| Chalkline, Inc. | Enterprise | Undisclosed | BIM/spec document management — different function entirely. |

**Our four verified differentiators:**
1. Only one with a genuine one-time price (competitors are all subscriptions, several costing more per month than our full price).
2. Only one where the AI itself costs nothing to anyone, ever — runs on the buyer's own free OpenRouter key, not our infrastructure.
3. Only one with no account and no platform lock-in — a single file the buyer owns outright.
4. Deliberately narrow — one job done well, not a full business-management platform like Tradify/Bidwright.

---

## Current status (as of naming lock)

**Done:** full 4-section app (both versions), setup guide, quick-start guide, paperwork kit, listing copy for both products, business plan, master plan/roadmap, naming research, Gumroad payment setup explained, business email guidance, website preview (HTML file, **not deployed** — explicit hold until approval), GitHub repo set up and verified in sync.

**Not started / explicitly on hold:**
- The rename described at the top of this file (highest priority next step)
- Actually deploying the website (preview-only until explicit go-ahead)
- NJ contractor license-board scraper + email/website enrichment agent (sketched only, Phase 3 in `MASTER_PLAN.md` — deliberately sequenced *after* the Gumroad listing goes live, since outbound leads need somewhere to be sent)
- Gumroad listing itself is mid-setup on the human side

**Standing rule for any agent working on this project:** every sales channel defaults to a self-serve purchase (Gumroad or a link sent by email). A phone call is only used as a last-resort close for an outbound lead that doesn't convert on its own — never the default path.
