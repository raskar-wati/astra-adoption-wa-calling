# Astra Voice Agent Adoption — handoff

Context for continuing the Astra adoption work. Scoped to Astra only.

## Goal

Drive adoption of **Astra Voice AI for WhatsApp calling** through contextual in-product
nudges, and supply a dev tool for switching between customer segments so each segment's
journey can be demoed.

**PRD:** [Plan For Astra Voice Agent Adoption](https://app.notion.com/p/wati/Plan-For-Astra-Voice-Agent-Adoption-30a9243e2911805aa5efc97ed5000995)
(Notion → Wati / Product - R&D / Q3 2026)

The business case: Wati's Q4 OKR is **100,000 calling minutes/month**. Highest-volume
customers answer only 50–60% of inbound attempts; a meaningful segment answers under 25%.
Astra recovers those as a 100% pickup rate. Astra-answered minutes **do** count toward the OKR.

## Where the work lives

- **Repo:** `/Users/raskar.jr/wati/team-inbox-voip`, branch `voip` (a worktree of the
  team-inbox repo). Vite 6 + React 18 + Tailwind 4. `@` aliases to `src/app`.
- **Nothing is committed.** Everything is uncommitted working-tree changes on top of
  `89f57b9`. Commit before building further if you want a checkpoint.
- **Dev server:** `preview_start` with the `team-inbox-voip` entry in
  `/Users/raskar.jr/wati/wati-workforce/.claude/launch.json`. Other chats hold ports in the
  5170s–5180s; pick a free port and pin it with `--port N --strictPort`.
- ⚠️ **`vite build` passing proves very little.** There is no `typescript` installed, so no
  `tsc --noEmit`. esbuild treats an unknown JSX identifier as a global, so a missing import
  builds clean and crashes at runtime. Always verify in the browser.
- ⚠️ HMR breaks React context identity — `useAstraAdoption must be used inside
  AstraAdoptionProvider` errors after an edit are usually stale. Hard-reload and re-check
  with a `console.error` marker before believing a console error.

## Answers already given by the user

1. **Enabling Astra is a toggle in Wati**, but setup must happen on Astra first.
2. **Separate subscription**, with a **7-day free trial**.
3. Assume the pickup-rate data (answered ÷ all inbound attempts, live per workspace) **is
   available**. (The PRD flags that the `missed_calls` field undercounts — it excludes
   declined, out-of-hours and no-agent-online — so triggers key off pickup rate, not that field.)
4. **Fatigue rules were delegated** to design judgement. See below for what was chosen.
5. Astra minutes count toward the OKR.
6. Astra **can transfer mid-call** to a human.

## What is built

### State layer

- **`src/app/lib/astraAdoption.ts`** — types, segment profiles, trigger evaluation, fatigue
  policy, `astraSetupUrl()`, routing copy.
- **`src/app/lib/AstraAdoptionContext.tsx`** — `AstraAdoptionProvider` + `useAstraAdoption()`.
  Single source of truth; the dev switcher writes to the same state every surface reads.

**Segments** (`SEGMENT_PROFILES`), from the PRD's data analysis:

| # | Name | Today's numbers | Offer |
|---|---|---|---|
| 1 | Low intent | 2 of 6 answered | **Never nudged** — calling is incidental, avoids pop-up fatigue |
| 2 | Engaged but capacity-constrained | 28 of 62 (45%) | **Overflow protection** |
| 3 | High demand, barely answering | 9 of 78 (12%) | **AI-first** |

**Astra status** (`AstraStatus`): `not-set-up` → `trial` → `subscribed-off` → `subscribed-on`.
CTA changes accordingly: *Start 7-day free trial* (hands off to Astra) vs *Turn on …*
(in-Wati toggle). All nudges stop at `subscribed-on`.

### Surfaces

| Component | What it is |
|---|---|
| `AstraNudgeModal.tsx` | One template behind all three triggers. Headline + evidence change per trigger; the offer changes per segment. |
| `AstraStarButton.tsx` | Passive inline mark beside unanswered calls. User-initiated, so it **ignores fatigue caps** — stays available after modals retire. |
| `AstraDevSwitcher.tsx` | Demo controls (see below). |
| `AstraLogo.tsx` | Brand mark, `brand` and `mono` variants. |
| `CallHandlerLabel.tsx` | Credits who took a call — Astra (brand mark, Astra blue) vs a human teammate (headset, grey). |

Triggered modals fire on inbox load after a 1200 ms delay (so you don't land on a cold
modal). Wired in `App.tsx`, which is wrapped in `AstraAdoptionProvider`.

### Fatigue policy (my call, item 4 above)

- **One interruptive modal per day**, shared across all triggers.
- **Each trigger capped to once every 7 days.** Segment 3 sits below the threshold nearly
  every day, so without this the alert would fire daily on exactly the accounts we most need
  on side.
- **"Not now"** snoozes 14 days. **"Don't show this again"** ×3 retires it permanently.
- Segment 1 and `subscribed-on` see nothing.
- Star icon and (future) settings toggle are uncapped — the always-on path once modals retire.
- **Suppression is session-scoped** (React state, not persisted) so the demo stays walkable.
  Real rules, but a reload resets. Move to storage when it matters.

### Segment-aware offers — a design decision worth re-examining

The PRD's launch plan offers **Phase 1 (AI-first)** to everyone the nudge catches. But the
trigger (pickup < 50%, ≥10 attempts) mostly catches **Segment 2**, who want to answer their
own calls. Telling a team that answered 810 calls to hand everything to AI is how you get
"the AI hijacked our phone line" complaints, aimed at the highest-volume accounts.

So the build gives Segment 3 **AI-first** and Segment 2 **Overflow protection**, with an
extra reassurance line: *"Your team keeps answering first — Astra only picks up what they
cannot."*

**Raised but not resolved with the user:** Phase 2 bundles two conditions of very different
cost — *after-hours* needs only a business-hours schedule, while *all operators busy* needs
real-time presence detection. Shipping the after-hours half first would give Segment 2 a safe
"yes" at launch without waiting for busy-state detection.

### Dev switcher

Floating panel, bottom-left, collapses to a `Segment N` pill. Three steps:

1. **Who is this customer?** — the three segments with their pickup/unanswered figures.
2. **How far along are they?** — the four Astra states, plus a line saying what the CTA will do.
3. **Show me a surface** — one button per nudge. Each **navigates to the call log, collapses
   the panel, and shows the surface**, overriding fatigue. Blocked triggers still work and
   carry an amber line explaining why.

Plus nudge history with a **Reset**, and an event log showing the attribution hand-off URL
(e.g. `astra.ai/setup?source=wati_after_hours`).

Two things learned by using it: the panel must **collapse itself on jump** (it sat on top of
the list it navigated to), and the star **pulses for 4 s** on arrival (otherwise "show me"
lands on a page with nothing obviously different).

## Astra branding

Pulled from Figma via MCP — [Astra DSM 2.0](https://www.figma.com/design/4Qnz6LBgqUdhDOE6SNrONX/Astra-DSM-2.0?node-id=102470-2710)
(`fileKey 4Qnz6LBgqUdhDOE6SNrONX`, mark nodes `102470:2716` brand / `102470:2765` mono).
Exact values, not eyedropped.

Tokens in `src/styles/globals.css`:

```
--color-astra-blue: #366BFF   --color-astra-blue-deep: #0034C5
--color-astra-blue-mid: #5875EC   --color-astra-blue-light: #5BAEF7
--color-astra-word: #527BEF   --color-astra-ink: #111111
```

The mark is four paths across four gradients: two facets `#0034C5 → #5875EC → #0034C5`,
two `#5BAEF7 → #366BFF`. The wordmark is `#1A42B1 → #527BEF`.

`AstraLogo` has `variant="brand"` (official gradient fill) and `variant="mono"` (same
geometry stroked in `currentColor`). **Gradient IDs are per-instance via `useId`** — SVG
gradient IDs are global, so a fixed ID makes the second mark on a page adopt the first's fill.

**The line drawn:** Astra branding marks *Astra's identity* (logo, the badge crediting a call,
the nudge header). **Wati Green `#23A455` stays on Wati's CTAs** — "Start 7-day free trial",
"Turn on AI-first" are all green. Mixing them muddles whose action is whose.

Not brought in: the **"astra" wordmark lockup** (mark only), and transcript speaker avatars
stayed mono so the brand mark doesn't repeat in colour down every turn.

## Not built

- **Call Routing toggle in Settings** — user said skip. `Settings.tsx` is a shell with one
  real section and placeholders; there is no Call Settings home yet, and the real app has two
  unlinked Settings trees (rail = account, avatar = workspace) so placement is unresolved.
- **ROI dashboard**, post-enablement emails, weekly ops summary email.
- **WhatsApp Calls Analytics** as a promo surface — user flagged it as a future area where
  Astra could be promoted wherever the unanswered rate is high.
- Astra-side onboarding (SSO, agent creation, playground) — out of scope, Astra's own.

## Open questions never answered

- **Synthetic CSAT** is described in the PRD as "allowing PMs to monitor quality" but sits in
  a customer-facing dashboard. Internal-only, or do customers see an AI-estimated CSAT?
- **Two weekly emails** (pre-enablement Operations Summary, post-enablement AI Impact) —
  confirm the first stops when the second starts.
- **Where Astra call records live** — "chat thread and call log" could mean either surface.
- The six PRD screenshots were never reviewed — unclear if they are intended direction or
  placeholders.
