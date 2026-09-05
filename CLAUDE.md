# Bidoro Business — Handoff / Agent Context

Read this whole file first. This supersedes the version of CLAUDE.md that was in the repo before — a lot has happened since (Gumroad went live, a full product-idea pipeline was built and tightened through several rounds, and three new products were built end-to-end). Deep historical detail still lives in `PROJECT_LOG.md`, `BUSINESS_PLAN.md`, `MASTER_PLAN.md`, `NAMING_STRATEGY.md`, and `TASKS.md` — this file is the current-state summary that ties everything together.

---

## 1. Bidoro — status: LIVE

Bidoro (formerly QuotePilot, then ScopeSnap — see `NAMING_STRATEGY.md` for why each name changed) is **published and live on Gumroad.** $49 one-time. AI quote-scoping tool for contractors, runs on the buyer's own free OpenRouter/Groq/NVIDIA-NIM key — genuinely $0 to operate for both seller and buyer.

- Full rebrand complete and verified (all files, all references, byte-for-byte confirmed in the repo)
- Gumroad listing published: category set, tags filled, Discover enabled, Commercial license selected, structured attributes (JavaScript/React/source-code-included) filled in
- Business email: `bidoro.contact@gmail.com`
- Companion product `bidoro-paperwork-kit.pdf` ($12, fillable estimate/invoice/change-order templates) built and listing-ready, not yet confirmed published
- The bigger "Bidoro Jobs" desktop-app concept (full estimate→job→change-order lifecycle, no AI) is deliberately **deferred** until Bidoro has real revenue traction — see `MASTER_PLAN.md`. Do not start building it without the user explicitly re-confirming.

---

## 2. The product-idea pipeline (Hermes + Cowork) — how it works today

Two AI agents (Hermes Agent, running on Groq or NVIDIA NIM; Claude Cowork, running on the user's Pro plan) independently research and draft new digital-product concepts, feeding into one shared approval workflow. **The current, complete instructions for both are in `PASTE_THIS_INTO_HERMES_FIRST.txt`** — that single file is the authoritative ruleset; paste its full contents into any fresh Hermes or Cowork session.

**The workflow:**
1. **Gathering** (fires on its own — schedule or manual start): researches real niches via actual web search, produces **multiple** concepts per run (typically 2-3), each internally self-argued-against before being saved. Each concept lands as `PRODUCT_CONCEPT_YYYY-MM-DD_HHMM.md` in its own niche subfolder, `STATUS: PENDING APPROVAL`.
2. **Human review** — concepts get pasted into a Claude chat (this one, or a fresh one) for a second opinion before deciding.
3. **Approve or reject:**
   - `approve <niche>/<filename>` → triggers the **Checker** (an independent re-verification pass) → if it passes cleanly, copied into `approved/<niche>-<name>/CONCEPT.md`, ready for a coding agent to build
   - `reject <niche>/<filename>` → marked `STATUS: REJECTED`, filed into `rejected/<niche>-<name>/` so the decision is on record
4. **Build** — `CODING_AGENT_BRIEF.txt` scopes a coding agent (Claude Code recommended) to only ever build what's sitting in `approved/`, never invent its own ideas.

**Current ruleset baked into the pipeline** (all learned the hard way, from real bad outputs — worth knowing why each exists so nobody "fixes" them back out):
- **Product type must be real software**, not static asset bundles (design templates, LUT packs, font packs). Two early concepts (an Affinity Designer template kit, a Premiere Pro LUT bundle) got build-ready-looking treatment despite being things a coding agent literally can't build — that's what this rule closed.
- **No uncited numbers.** Any specific-sounding statistic ("demand density of 22," "difficulty 28/100") needs a named, linkable source or it can't be stated at all. Two concepts slipped in fabricated-looking precise stats with zero source — this looked *more* credible than an obviously-unsupported claim, which is why it's treated as a hard rule now, not a style note.
- **Must be $0 to build AND $0 to run.** A mockup-generator concept (MockuGenie) quietly switched to $39/month pricing — the tell that its core feature (AI image generation) has no sustainable free tier the way text-AI does. Every product in this pipeline is one-time-priced by design; a concept proposing a subscription is a red flag to investigate, not a pricing choice to accept.
- **Pricing rule:** default $29+. Only $5-10 if ALL three are true: (1) no existing product solves this even partially, (2) value obvious in one sentence, (3) market is broad, not a narrow sub-group. **Important nuance:** "no competition" only gates the $5-10 exception — it does NOT mean a niche with any existing competitor should be discarded entirely. Early runs over-applied this and kept finding zero viable niches; the fix was making explicit that competition existing is normal, and the real bar is a specific differentiation angle (the way Wispring/Braidal/EncoreEarn/Chalkside all found one despite adjacent competitors existing).
- **Research should target software-specific sources** (Gumroad's own tools categories, Product Hunt, Indie Hackers) rather than generic "digital product trends," which mostly surfaces Etsy's crafts/printables ecosystem and pulls concepts toward the asset-bundle shape this pipeline explicitly avoids.
- Every concept requires: name-availability check (real search, this run), alternatives considered, and an honest caveats section — a concept missing any of these is incomplete, not just imperfect.

---

## 3. Three new products — built, verified, not yet published

Built end-to-end from Cowork's most recent (and best-quality) batch of concepts. All three are genuinely lower-risk than Bidoro: **zero AI dependency** — rule-based matchers/mergers, no API key setup for buyers at all.

- **Braidal** ($29) — merges two wedding traditions (10 built-in options) into one coordinated checklist/timeline/budget.
- **EncoreEarn** ($29) — matches retirees/near-retirees to realistic supplemental income options by background, free hours, and Social Security status.
- **Chalkside** ($29) — matches teachers to realistic side-income options by certification, free hours, and summer availability, with a projected monthly total.

Each was actually functionally tested (real DOM execution of the matching/merging logic, not just visual inspection) before delivery — one real bug (a clipped logo) was caught and fixed in this process. Delivered as `three-new-products.zip`, each in its own folder with the app file, a logo, and a complete Gumroad listing draft (`GUMROAD_LISTING.md`). **Not yet published** — that's the next human action needed.

---

## 4. What's actually pending right now

- [ ] Publish Braidal, EncoreEarn, and Chalkside to Gumroad (listing copy is ready, just needs uploading)
- [ ] Publish the Bidoro paperwork kit as its own $12 listing
- [ ] Re-run Cowork (and/or Hermes) for another batch of 2-3 concepts, using the current `PASTE_THIS_INTO_HERMES_FIRST.txt` — the ruleset has been substantially tightened since earlier runs, and the Braidal/EncoreEarn/Chalkside batch is the proof it's working well now
- [ ] Continue the standing rule for all sales: every channel defaults to self-serve purchase; a phone call is only a last-resort close for outbound leads, never the default

## Standing rules that apply to everything above
- Every sales channel defaults to self-serve purchase (Gumroad or a link sent by email) — a call is last-resort only.
- Nothing gets published/listed without the human reviewing it first — the approval pipeline exists specifically so quality gets checked before publishing, not after.
- Keep this file updated as the single current-state summary — don't let detail sprawl back across many separate docs that need to be pieced together to understand where things stand.
