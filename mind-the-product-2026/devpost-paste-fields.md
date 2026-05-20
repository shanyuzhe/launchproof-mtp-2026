# Devpost Paste Fields

Use these fields directly in Devpost.

## Project Name

LaunchProof

## Elevator Pitch

AI helps you build faster. LaunchProof helps you prove the product is ready to ship.

## Built With

Next.js, React, Codex and GPT-5 AI Builder Workflow, GitHub Pages, Novus.ai, Pendo Web SDK, Browser Local Storage, lucide-react, GitHub

## Try It Out Links

App: https://shanyuzhe.github.io/launchproof-mtp-2026/

MeetingBridge sample: https://shanyuzhe.github.io/launchproof-mtp-2026/?sample=meetingbridge

Source: https://github.com/shanyuzhe/launchproof-mtp-2026

## Video Demo Link

TODO: paste public or unlisted YouTube, Vimeo, or Youku URL after upload.

## Image Gallery

Upload in this order:

1. `launchproof-main-workflow.png`
2. `launchproof-resilience-review.png`
3. `launchproof-mobile-resilience.png`
4. `launchproof-evidence-scorecard.png`
5. `launchproof-behavior-coverage.png`
6. `novus-pendo-dashboard.png`

## About The Project

## Inspiration

AI coding tools changed the speed of software creation. A solo builder can now create a working prototype in an afternoon, but shipping still requires product judgment: who is this for, what problem does it solve, what flow must work, what risks remain, and what evidence shows that it is ready?

LaunchProof was built for that gap. In the AI-builder era, the bottleneck is no longer "can I make something?" It is "can I explain, test, measure, and responsibly ship the thing I made?" LaunchProof gives builders that missing product layer.

This also fits the World Product Day 2026 theme of resilience. Product teams are being asked to do more with less, and AI makes it easier to create more prototypes than a team can responsibly evaluate. LaunchProof supports the quiet product work that still matters under pressure: clarifying the user, naming the risk, defining first value, checking the workflow, and proving behavior before calling something shipped.

## What it does

LaunchProof turns a rough product idea into a launch readiness packet that a judge, teammate, or founder can actually use. A builder enters their product concept, target user, problem, success metric, and demo URL. LaunchProof generates a crisp product brief, core user flows, acceptance checks, launch risks and mitigations, a resilience stress test, a readiness rationale, a Novus-measurable proof loop, a behavior coverage panel, a hackathon scorecard, testing instructions, and an exportable Devpost-ready pitch packet.

The result is a concrete answer to the question every AI-built prototype faces: what must work, what evidence do we have, and what should we say when we ask someone to believe this is ready?

The app also includes multiple sample products, including MeetingBridge and IssuePilot, so judges can see the workflow generalize beyond LaunchProof's own submission story. Judges can open the MeetingBridge sample directly at `https://shanyuzhe.github.io/launchproof-mtp-2026/?sample=meetingbridge`.

## How we built it

We built LaunchProof during the hackathon submission window using Codex and GPT-5 as the AI builder workflow to rapidly shape the product workflow, prototype the interface, implement the Next.js app, write verification scripts, and iterate on the submission story. The core product is designed around structured product reasoning rather than open-ended chat: every output maps to a launch artifact a real builder needs. LaunchProof itself does not claim to be an autonomous AI agent at runtime; its value is the structured product reasoning layer created through the AI builder process.

The app uses Next.js and React for the public web app, Codex and GPT-5 as the AI builder workflow, GitHub Pages for deployment, Novus.ai / Pendo Web SDK for product behavior tracking, local browser storage for draft persistence, lucide-react for interface icons, and GitHub for source control.

We also keep the AI-builder provenance inspectable in the live Evidence tab, the packet export, the repository, and `mind-the-product-2026/ai-builder-provenance.md`, so the submission can show how the AI builder requirement was satisfied without overstating runtime AI capabilities.

## Challenges we ran into

The main challenge was avoiding "AI text soup". The product needed to produce artifacts that are short, structured, measurable, and useful under time pressure. We focused on the launch workflow: user, job, flows, risks, resilience, evidence, pitch.

A second challenge was making Novus.ai feel like part of the product rather than a compliance checkbox. LaunchProof treats behavior tracking as launch evidence: did the builder generate a packet, review flows, inspect risks, stress-test resilience, review evidence, and export the pitch?

## Accomplishments that we're proud of

- Created a workflow that connects product thinking with AI-assisted shipping.
- Designed outputs that directly support demo preparation, launch review, and resilience stress-testing.
- Added multiple sample products to show the workflow works beyond the LaunchProof self-demo.
- Added behavior tracking so "ready to ship" can be tied to real usage signals.
- Added a behavior coverage panel that shows which proof actions have happened in the current session.
- Made Codex/GPT-5 builder provenance visible in the app, export packet, and submission docs.
- Mapped the product evidence directly to Product Thinking, Craft and Execution, Originality and Ambition, and Shippedness.
- Added a readiness rationale and launch proof loop so the score is explainable instead of decorative.
- Added a Judge evidence trace so every judging criterion maps to visible product evidence, a quick judge test, and an honest limit.
- Added draft persistence so builders can return to a packet without losing work.
- Built the project so it can be useful beyond one hackathon.

## What we learned

AI can speed up implementation, but product clarity still comes from making decisions. The best AI tools for builders should not only generate more ideas; they should help teams decide what matters and prove that the product works.

We also learned that the best hackathon demos are not just feature tours. They are proof chains: a real user, a clear pain, a working workflow, and evidence that the workflow happened.

## What's next for LaunchProof

- Add live browser validation for submitted URLs.
- Add integrations with GitHub issues and PRs.
- Let teams collaborate on launch readiness packets.
- Publish templates for common product types.

## Testing Instructions

Judges can test LaunchProof without creating an account.

1. Open the public app: https://shanyuzhe.github.io/launchproof-mtp-2026/
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

No login is required. The app stores draft changes in browser local storage. A successful test should show a local event feed update, a visible Novus/Pendo SDK state, and the copied or fallback launch packet. The included Novus.ai/Pendo dashboard screenshot is the final confirmation that tracked events reached the external analytics system.

## Final Judge Checklist

- Product Thinking: clear user, pain, job-to-be-done, and launch-readiness outcome.
- Craft and Execution: one end-to-end workflow from intake to resilience check to packet export.
- Originality and Ambition: product judgment, acceptance checks, analytics evidence, and pitch export are connected in one tool.
- Shippedness: public app works without login, seeded example works immediately, demo video shows the live product, and Novus/Pendo evidence is included.
- Honesty: LaunchProof is a launch readiness assistant, not a guarantee of product-market fit, QA completion, or user research.
