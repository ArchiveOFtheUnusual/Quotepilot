# ScopeSnap — Master Plan & Roadmap

**Guiding rule for everything below:** every channel defaults to a self-serve purchase (Gumroad listing, landing page, or a link sent by email). A phone call is only used as a last-resort close for an outbound lead that didn't convert on its own — never the default path, and never needed at all for inbound/organic traffic.

---

## Phase 0 — Foundation (COMPLETE)

Full detail lives in `PROJECT_LOG.md` and `BUSINESS_PLAN.md`. Summary:

- Product built and tested: `scopesnap.html` (the real, sellable standalone app) and `scopesnap-demo.jsx` (Claude.ai-only demo version)
- Runs on the buyer's own free OpenRouter key — genuinely $0 to operate, for you and them
- `scopesnap-openrouter-setup.pdf` and `scopesnap-quickstart.pdf` — buyer-facing setup docs
- `logo.png` — cover image / brand asset
- Pricing decided: $49 one-time, sold on Gumroad (~$43.60 take-home per sale after fees)
- Sales page copy, demo video script, and initial outreach message drafts all written
- Everything tracked in the GitHub repo (`ArchiveOFtheUnusual/Quotepilot`)

**Nothing left to build here** — this phase is about executing what's already written.

---

## Phase 1 — Self-serve sales infrastructure (DO THIS FIRST)

This unblocks every other phase, since outbound leads get pointed here too.

1. Create the Gumroad account, link payout details (one-time human step, ~10 min)
2. Paste in the listing copy (already written) and upload the 4 product files + logo
3. Record the demo video from the existing script (silent/captioned version — no camera, no voice needed)
4. Build the landing page (free on GitHub Pages, using the repo we already have) — this is what outbound emails and social posts will actually link to, with Gumroad as the final checkout step

**Optional add-on, not required to launch:** the cheap ($9–15) companion template PDF discussed earlier, as a lower-friction Etsy/Gumroad product and upsell funnel into the full app.

---

## Phase 2 — Inbound / organic traffic (start in parallel, low effort each)

All scripts already drafted in `BUSINESS_PLAN.md`.

- Direct outreach to your personal/warm network
- r/smallbusiness-style self-promo post
- Contractor-focused Facebook group posts
- SEO content on the landing page + Pinterest (slower burn — worth starting early since it compounds, but won't produce sales immediately)

These all end at the same place: the landing page → Gumroad. No calls involved anywhere in this phase.

---

## Phase 3 — Outbound B2B pipeline (New Jersey contractors)

1. Build the NJ license-board scraper (Home Improvement, Electrical, Plumbing boards) — sketched, not yet built
2. Build the website/email enrichment agent (only extracts emails businesses already publish themselves; no guessing) — sketched, not yet built
3. First outbound touch (email if a published address exists, otherwise the phone number already on the public license record) — **always leads with the self-serve buy link, never opens with "let's hop on a call"**
4. Light automated follow-up for non-responders
5. **Only if a lead is clearly interested but stalls before buying** → flagged for you to close by call

This is the one phase where your involvement re-enters — but strictly as the exception path, exactly as you described.

---

## Phase 4 — Iterate (after first real sales)

Not detailed yet, deliberately — this depends on what actually happens in Phases 1–3:
- Fold in real testimonials once they exist
- Decide whether the scraper expands past NJ
- Revisit one-time vs. subscription pricing with real conversion data instead of guesses

---

## Recommended order, concretely

1. **Gumroad listing live** — the single highest-priority item; nothing else has anywhere to send a buyer without it
2. **Landing page + demo video**
3. **Phase 2 organic posts** — can run the moment Phase 1 is live, near-zero additional cost
4. **NJ scraper + enrichment agent** — build once there's a real place for those leads to land
5. **First outbound batch**, self-serve link first
6. **Calls** — only for the outbound leads that don't close on their own
