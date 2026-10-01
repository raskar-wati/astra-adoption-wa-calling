# Astra adoption prototype: handoff 2

This picks up from `plans/astra-adoption-handoff.md`, which covers the PRD, the segments, the fatigue rules and approach 1. Everything below happened after it.

## Where it lives

- **Code:** `/Users/raskar.jr/wati/team-inbox-voip`, branch `voip`. Vite 6, React 18, Tailwind 4, and `motion` for animation.
- **GitHub:** https://github.com/raskar-wati/astra-adoption-wa-calling. Push the `voip` branch to `main` through the remote named `astra`. The remote named `origin` is the unrelated email-channel repo, so don't push there.
- **GitHub account:** always use `raskar-wati`. The other account on this machine, `raskarjr`, gets a 403. Push with:
  `git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push astra voip:main`
- **Live site:** https://astra-adoption-wa-calling.vercel.app (Vercel project `astra-adoption-wa-calling`).
  - It isn't connected to GitHub, so pushing doesn't update the site. Run `vercel deploy --prod --yes` from the repo after pushing.
  - `vercel.json` sets the Vite build and the `dist` output folder.
  - The older Vercel project `team-inbox-voip` was left untouched on purpose.
- **Dev server:** `preview_start` with `team-inbox-voip` from `wati-workforce/.claude/launch.json`, on port 5187.

## Gotchas

- **Use px sizes, not rem:** the root font size is 14px, so Tailwind's rem sizes come out about 12% small. Use px values (`h-[56px]`), especially when matching Figma.
- **Hot-reload crash:** editing `astraAdoption.ts` or the context file can blank the page with "useAstraAdoption must be used inside AstraAdoptionProvider". A hard reload fixes it.
- **Animations look slow in the browser pane:** it renders at 2–3 frames per second, so animations play about 8× slow. Check motion in a real browser.
- **A passing `vite build` proves little:** the project has no TypeScript check, so always confirm in the browser.

## Demo controls (bottom-left, black and white only)

They set the **Page** (Team Inbox or Analytics), the **Approach**, the **Customer** (segment 1, 2 or 3) and the **Astra** status, and offer **Show** links that jump to each surface. All state is held in `AstraAdoptionContext` (page, iteration, analyticsIteration, and so on).

## Team Inbox approaches

1. **Pop-ups:** approach 1, unchanged from the first handoff.
2. **Pinned:** an *Introducing Astra Agent* row pinned at the top of the WhatsApp call log. It's styled exactly like the other call rows, with the same green selection; only the avatar is Astra's. It opens `AstraConversation`, a WhatsApp-style thread scripted in `lib/astraChatScript.ts`. Astra opens with the missed calls, the user can reply with quick replies or free text, and an offer card steers them towards connecting.
3. **Brief:** the morning brief. The Wati AI prompt in the header (`WatiAIPrompt.tsx`) expands like a dynamic island and tells yesterday's call story, then hands over with *Talk to Astra*, which opens the voice call. It only plays on Team Inbox.
4. **Banner:** a missed-calls banner above the call log that doesn't mention Astra. It opens the Astra pop-up, which has View demo (a phone icon) and Start 7-day free trial.

## Analytics approaches

The WhatsApp Calls Analytics page is in `WhatsAppCallsAnalytics.tsx`, with 7-day data from `data/callAnalytics.ts` derived from the selected segment.

1. **Banner:** a 480px banner, *You missed N calls in the last 7 days*, with a *Learn how* button that opens the pop-up using weekly figures.
2. **Peek:** a *Never miss a call with Astra* tab that peeks out from behind the Missed Calls card and opens the pop-up.

The user decides what comes next on the analytics page; don't start new analytics nudges unprompted.

## Shared pieces

- **Pop-up** (`AstraNudgeModal`): the stats sit in grey boxes; an ⓘ note replaces the old offer card; there's no body copy when it's opened from a banner.
- **Astra voice call** (`AstraVoiceCall`): an orb that alternates between speaking and listening, with the Astra name and mark at the top, a timer, and End call and Mute buttons. There's no speaking/listening label.
- **App shell:** the header and side rail from the Figma file (`TopNavigation`, `SideNavigation`). Every column header is 56px tall, so their bottom lines form one continuous divider.
- **Shared chat parts:** `ChatBubble` and `ChatComposer`, pulled out of `ChatInterface`.
- **Call log:** flat, one row per interaction, with no drill-in.

## Latest work: not committed yet

The WhatsApp `CallWidget` was rebuilt from `~/Downloads/Astra & Human call transfer ux (standalone) (3).html`:
- **States:** on call → picker → note step → ringing → not answered/declined (Try again) → Call transferred.
- **Simulated answers** (`data/callTransferRoster.ts`): Payments accepts, Support accepts, Sana declines, and Meera and Billing never answer (30s).
- **Toasts:** shown top-centre in dark.
- **Removed:** `TransferPicker` and `IncomingTransferCard`.
- **Not built, as the user asked:** the receiving agent's side, anything after *Call transferred*, minimised mode, and round robin.

Next steps: commit, push and deploy when the user asks.

## Open questions the user hasn't answered

- The folded Brief pill still says *"Meet Astra"* and replays the brief when clicked. Should it change to *Talk to Astra* and open the call?
- Should the Astra thread say "today" or "yesterday" when the user arrives from the morning brief?
- Should "Don't show this again" in the pop-up also hide the banner?
- What should the right-hand panel show while the Astra thread is open (it currently shows the last contact)?
