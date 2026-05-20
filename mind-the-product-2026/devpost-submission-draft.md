# Devpost Submission Draft

Use the sections below as direct Devpost copy. Keep the final submission in English.

## Project Name

LaunchProof

## Tagline

AI helps you build faster. LaunchProof helps you prove it is ready to ship.

## Inspiration

AI coding tools changed the speed of software creation. A solo builder can now create a working prototype in an afternoon, but shipping still requires product judgment: who is this for, what problem does it solve, what flow must work, what risks remain, and what evidence shows that it is ready?

LaunchProof was built for that gap.

The project started from a simple observation: in the AI-builder era, the bottleneck is no longer "can I make something?" It is "can I explain, test, measure, and responsibly ship the thing I made?" LaunchProof gives builders that missing product layer.

It is also designed for the World Product Day 2026 theme of resilience. Product teams are being asked to do more with less, and AI makes it easier to create more prototypes than a team can responsibly evaluate. LaunchProof supports the quiet product work that still matters under pressure: clarifying the user, naming the risk, defining first value, checking the workflow, and proving behavior before calling something shipped.

## What It Does

LaunchProof turns a rough product idea into a launch readiness packet that a judge, teammate, or founder can actually use. A builder enters their product concept, target user, problem, success metric, and demo URL. LaunchProof generates:

- a crisp product brief
- core user flows
- acceptance checks
- launch risks and mitigations
- a resilience stress test with pressure, recovery, proof signal, and no-ship condition
- a readiness rationale and Novus-measurable proof loop
- a behavior coverage panel for the current session
- a hackathon scorecard mapped to the judging criteria
- testing instructions
- an exportable Devpost-ready pitch packet

The result is a concrete answer to the question every AI-built prototype faces: what must work, what evidence do we have, and what should we say when we ask someone to believe this is ready?

The app also includes multiple sample products, including MeetingBridge and IssuePilot, so judges can see the workflow generalize beyond LaunchProof's own submission story. The MeetingBridge sample is directly linkable at `https://shanyuzhe.github.io/launchproof-mtp-2026/?sample=meetingbridge`.

## Project Story

LaunchProof is a launch readiness workspace for solo AI builders, PMs, and small teams preparing a launch or hackathon submission. It helps a builder move from "I have a prototype" to "I know who it is for, what job it does, what could fail, what I can measure, and how to pitch it honestly."

The product guides a user through one focused workflow:

1. Enter the product concept, target user, problem, solution, success metric, and demo URL.
2. Generate a structured launch packet.
3. Review the brief, flows, risks, resilience check, evidence, and pitch.
4. Use the evidence board to connect product actions with Novus/Pendo events.
5. Copy a polished packet that can be pasted into Devpost, a launch review, or a team update.

The key design choice is that LaunchProof is not another open-ended AI chat box. It is opinionated about what "ready to ship" means. A useful launch packet must be specific, testable, measurable, and short enough to use under deadline pressure.

## Judge-Facing Positioning

LaunchProof should be judged as a product layer for the AI-builder era, where making a prototype is getting easier but proving readiness is still hard.

- Product Thinking: the target user is specific: AI builders and PMs who can create prototypes faster than they can validate the launch story. The job is clear: turn a messy build into a concise readiness packet.
- Craft and Execution: the app is one coherent workflow from intake to brief, flows, risks, resilience, evidence, and export. The UI is built for a judge or builder to scan under time pressure.
- Originality and Ambition: LaunchProof treats analytics as product evidence. Novus/Pendo events are not just installed; they are mapped to the actions that show whether a builder used the launch workflow.
- Shippedness: the public app is usable without login, includes a seeded example and direct sample URL, persists drafts locally, exposes behavior coverage and a local event feed, and tracks meaningful behavior through Novus.ai/Pendo.

## How We Built It

We built LaunchProof during the hackathon submission window using Codex and GPT-5 as the AI builder workflow to rapidly shape the product workflow, prototype the interface, implement the Next.js app, write verification scripts, and iterate on the submission story. The core product is designed around structured product reasoning rather than open-ended chat: every output maps to a launch artifact a real builder needs. LaunchProof itself does not claim to be an autonomous AI agent at runtime; its value is the structured product reasoning layer created through the AI builder process.

The AI-builder provenance is intentionally inspectable in the live Evidence tab, the packet export, the repository, and `mind-the-product-2026/ai-builder-provenance.md`, so the submission can show the AI Builder workflow without overstating runtime AI capabilities.

The app is built with:

- Next.js and React for the public web app
- Codex and GPT-5 as the AI builder workflow used during design, implementation, verification, and submission iteration
- GitHub Pages for the public deployment
- Novus.ai / Pendo Web SDK for product behavior tracking
- local browser storage for draft persistence
- lucide-react for interface icons
- GitHub for source control

## Built With

Devpost field copy:

Next.js, React, Codex and GPT-5 AI Builder Workflow, GitHub Pages, Novus.ai, Pendo Web SDK, Browser Local Storage, lucide-react, GitHub

## Challenges

The main challenge was avoiding "AI text soup". The product needed to produce artifacts that are short, structured, measurable, and useful under time pressure. We focused on the launch workflow: user, job, flows, risks, resilience, evidence, pitch.

A second challenge was making Novus.ai feel like part of the product rather than a compliance checkbox. LaunchProof treats behavior tracking as launch evidence: did the builder generate a packet, review flows, inspect risks, stress-test resilience, review evidence, and export the pitch?

## Accomplishments

- Created a workflow that connects product thinking with AI-assisted shipping.
- Designed outputs that directly support demo preparation, launch review, and resilience stress-testing.
- Added multiple sample products to show the workflow works beyond the LaunchProof self-demo.
- Added behavior tracking so "ready to ship" can be tied to real usage signals.
- Added a behavior coverage panel that makes the current session's proof path visible before the Novus/Pendo dashboard screenshot is reviewed.
- Made Codex/GPT-5 builder provenance visible in the app, export packet, and submission docs.
- Mapped the product evidence directly to Product Thinking, Craft and Execution, Originality and Ambition, and Shippedness.
- Added a readiness rationale and launch proof loop so the score is explainable instead of decorative.
- Added a Judge evidence trace so every judging criterion maps to visible product evidence, a quick judge test, and an honest limit.
- Added draft persistence so builders can return to a packet without losing work.
- Built the project so it can be useful beyond one hackathon.

## What We Learned

AI can speed up implementation, but product clarity still comes from making decisions. The best AI tools for builders should not only generate more ideas; they should help teams decide what matters and prove that the product works.

We also learned that the best hackathon demos are not just feature tours. They are proof chains: a real user, a clear pain, a working workflow, and evidence that the workflow happened.

## What's Next

- Add live browser validation for submitted URLs.
- Add integrations with GitHub issues and PRs.
- Let teams collaborate on launch readiness packets.
- Publish templates for common product types.

## Testing Instructions

Judges can test LaunchProof without creating an account.

1. Open the public app: `https://shanyuzhe.github.io/launchproof-mtp-2026/`.
2. Use the preloaded LaunchProof example, click a sample product such as `MeetingBridge`, or open the direct sample URL: `https://shanyuzhe.github.io/launchproof-mtp-2026/?sample=meetingbridge`.
3. Optionally change one field, such as the target user or success metric, so the generated packet reflects a real edit.
4. Click `Generate Launch Packet`.
5. Click `Run Judge Demo` to step through the 90-second proof path.
6. Open each tab: `Brief`, `Flows`, `Risks`, `Resilience`, `Evidence`, and `Pitch`.
7. In `Brief`, confirm the packet identifies a target user, problem, solution, success metric, and launch decision.
8. In `Flows`, confirm that the app turns the idea into critical user paths and acceptance checks.
9. In `Risks`, review the launch risks and mitigations.
10. In `Resilience`, confirm the packet names the pressure case, recovery move, evidence signal, and no-ship condition.
11. In `Evidence`, review the hackathon scorecard, readiness rationale, launch proof loop, proof status, behavior coverage, and Novus/Pendo event map.
12. In `Pitch`, review `Why this should win`, the Judge evidence trace, the 90-second demo script, and submission next steps.
13. Click `Copy packet` to copy the pitch-ready launch packet and confirm the `Copied` state appears. If clipboard permission is blocked, use the fallback export text area.
14. Compare the local event feed and tracked actions with the Novus.ai/Pendo dashboard screenshot included in the submission.

No login is required. The app stores draft changes in browser local storage. A successful test should show a local event feed update, a visible Novus/Pendo SDK state, and the copied or fallback launch packet. The included Novus.ai/Pendo dashboard screenshot is the final confirmation that tracked events reached the external analytics system. If the public deployment looks stale, refresh once and verify that the page includes `Launch decision`, `Hackathon scorecard`, and `Testing instructions`.

## Final Judge Checklist

- Product Thinking: the submission names a clear user, pain, job-to-be-done, and launch-readiness outcome.
- Craft and Execution: the live app shows one end-to-end workflow, not disconnected AI outputs.
- Originality and Ambition: the product connects product judgment, acceptance checks, evidence, analytics, and pitch export.
- Shippedness: the app URL works without login, the seeded example works immediately, the demo video shows the live product, and Novus/Pendo evidence is included.
- Honesty: LaunchProof is positioned as a launch readiness assistant, not a guarantee of product-market fit, QA completion, or user research.

## Video Outline

1. Show the default LaunchProof packet on the public URL.
2. Edit one field to show the product reacts to real input.
3. Click Generate Launch Packet.
4. Click Run Judge Demo and advance through proof points.
5. Review Brief, Flows, Risks, Resilience, Evidence, and Pitch.
6. Show the local event feed and Novus event map.
7. Point to the hackathon scorecard and behavior coverage inside Evidence.
8. Copy the exportable packet, with the fallback export path available if clipboard permissions block copy.
9. Cut to the Novus/Pendo dashboard screenshot.
10. Close on the value: builders get from prototype to credible launch faster.

## Demo Video Description

LaunchProof helps AI builders turn a rough prototype into a launch readiness packet. In the demo, we generate a product brief, critical flows, acceptance checks, risks, resilience checks, behavior coverage, evidence signals, and a Devpost-ready pitch export. We also show how key product actions are mapped to Novus.ai/Pendo events so launch readiness is measurable, not just narrated.

## Responsible AI Note

LaunchProof uses AI-assisted development and structured product reasoning, but it does not ask users to blindly trust generated output. The workflow makes launch assumptions visible: user, problem, flows, acceptance checks, risks, mitigations, resilience checks, and evidence signals. The intended use is to help builders review and improve a product before launch, not to replace user research or quality assurance.

## Try It Out

- App: https://shanyuzhe.github.io/launchproof-mtp-2026/
- MeetingBridge sample: https://shanyuzhe.github.io/launchproof-mtp-2026/?sample=meetingbridge
- Do not use the stale Vercel preview for Devpost unless it is separately re-verified.
- Source: https://github.com/shanyuzhe/launchproof-mtp-2026
