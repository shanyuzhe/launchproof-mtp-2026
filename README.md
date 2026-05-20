# LaunchProof

LaunchProof is a launch readiness workspace for AI builders, created for the Mind the Product World Product Day Hackathon 2026.

AI helps builders make software faster. LaunchProof helps them prove the product is ready to ship.

The product turns a rough idea or demo URL into a judge-ready launch packet:

- a concise launch brief
- critical user flows
- acceptance checks
- launch risks and mitigations
- a resilience stress test for the launch
- Novus-ready behavior events
- behavior coverage for the current proof path
- an exportable Devpost and pitch packet

## Product Story

AI coding tools have changed the bottleneck. A solo builder can now create a working prototype in hours, but the hard product questions still remain:

- Who is this for?
- What job does it solve?
- Which flow must work?
- What can break at launch?
- What evidence proves users can get value?

LaunchProof is built for that gap. It gives AI builders a structured product review before they submit, demo, or launch. Instead of generating more open-ended text, it creates the artifacts a real launch review needs: brief, flows, checks, resilience stress test, risks, behavior evidence, and a pitch-ready export.

## Judge-Facing Positioning

**One-liner:** AI helps you build faster. LaunchProof helps you prove it is ready to ship.

**Why it matters:** The next wave of products will not fail because teams could not produce code. They will fail because they shipped unclear products with untested flows and no evidence of user behavior. LaunchProof turns launch readiness into a repeatable workflow.

**Hackathon fit:** Mind the Product judges are scoring Product Thinking, Craft and Execution, Originality and Ambition, and Shippedness. LaunchProof is designed around those criteria: a clear user problem, a polished end-to-end workflow, an original product layer for AI builders, and measurable behavior through Novus.ai/Pendo.

**World Product Day fit:** The 2026 theme is resilience. LaunchProof helps builders do the quiet product work that keeps launches resilient under pressure: clarify the user, inspect the risks, prove the workflow, and turn behavior into evidence before shipping.

## Testing Instructions

Judges can test the app without login.

1. Open the live app: `https://shanyuzhe.github.io/launchproof-mtp-2026/`.
2. Review the preloaded LaunchProof sample packet, or open the direct MeetingBridge sample: `https://shanyuzhe.github.io/launchproof-mtp-2026/?sample=meetingbridge`.
3. Change one or more intake fields, such as target user, product problem, success metric, or demo URL.
4. Click `Generate Launch Packet`.
5. Click `Run Judge Demo` to step through the 90-second proof path.
6. Review the `Brief`, `Flows`, `Risks`, `Resilience`, `Evidence`, and `Pitch` tabs.
7. In `Resilience`, confirm the packet names a pressure case, recovery move, evidence signal, and no-ship condition.
8. In `Evidence`, check the hackathon scorecard, behavior coverage, and the Novus/Pendo event map.
8. Click `Copy packet` to copy the Devpost-ready launch packet and see the `Copied` confirmation.
9. If clipboard permission is blocked, use the fallback export text area that appears below the top bar.
10. Confirm the interaction events in the included Novus.ai/Pendo dashboard screenshot.

Expected result: within a few minutes, a judge should see a complete launch readiness packet, a local event feed update, a visible Novus/Pendo SDK state, and a clear explanation of how the product converts a rough AI-built prototype into a testable, measurable shipping story. The external Novus/Pendo dashboard screenshot is the final confirmation that the tracked events reached the hackathon analytics system.

## Built With

- Next.js
- React
- Codex and GPT-5 AI builder workflow
- GitHub Pages
- Novus.ai / Pendo Web SDK
- Browser local storage
- lucide-react
- GitHub

## Public URLs

- Primary submission URL: `https://shanyuzhe.github.io/launchproof-mtp-2026/`
- Direct sample URL: `https://shanyuzhe.github.io/launchproof-mtp-2026/?sample=meetingbridge`
- Do not use the stale Vercel preview in the Devpost submission unless it is separately re-verified.

## Local Development

```bash
npm install
npm run dev
node scripts/final-submit-check.mjs https://...
```

## Novus.ai

The hackathon requires Novus.ai installation and a dashboard screenshot. LaunchProof loads the Pendo/Novus Web SDK, initializes a stable anonymous visitor, and emits product events through `window.pendo.track(...)`.

After taking a Novus/Pendo dashboard screenshot, save or rename it with `novus`, `pendo`, or `dashboard` in the filename, then run:

```bash
npm run import:novus-screenshot
```

You can also pass a specific file path:

```bash
npm run import:novus-screenshot -- C:/Users/22684/Downloads/novus-dashboard.png
```

The importer validates that the image is a normal-size PNG/JPEG and saves it as `novus-pendo-dashboard.png`, which is the filename used by the final submission gate.

The app includes the public install key generated by the Novus setup PR so a default deployment can send events immediately. If Novus provides a replacement key, create a local `.env.local` file or set the same environment variable in your deploy host:

```bash
NEXT_PUBLIC_PENDO_API_KEY=your-novus-or-pendo-install-key
```

Tracked event examples:

- `brief_generated`
- `flows_reviewed`
- `risks_reviewed`
- `resilience_reviewed`
- `evidence_reviewed`
- `export_clicked`

The Evidence tab also shows behavior coverage for the current session, so judges can see whether the proof path has actually happened before checking the external Novus/Pendo dashboard screenshot.

The SDK loader lives in `app/pendo-install.jsx`, and the event calls live in `app/page.jsx`.

## Hackathon Notes

Detailed planning and submission notes live in `mind-the-product-2026/`.
