# Devpost Paste Fields

Use these fields directly in Devpost.

## Project Name

LaunchProof

## Elevator Pitch

AI helps you build faster. LaunchProof helps you prove the product is ready to ship.

## Built With

Next.js, React, GitHub Pages, Novus.ai, Pendo Web SDK, Browser Local Storage, lucide-react, GitHub

## Try It Out Links

App: https://shanyuzhe.github.io/launchproof-mtp-2026/

MeetingBridge sample: https://shanyuzhe.github.io/launchproof-mtp-2026/?sample=meetingbridge

Source: https://github.com/shanyuzhe/launchproof-mtp-2026

## Video Demo Link

TODO: paste public or unlisted YouTube, Vimeo, or Youku URL after upload.

## Image Gallery

Upload in this order:

1. `launchproof-main-workflow.png`
2. `launchproof-evidence-scorecard.png`
3. `launchproof-behavior-coverage.png`
4. `novus-pendo-dashboard.png`

## About The Project

## Inspiration

AI coding tools changed the speed of software creation. A solo builder can now create a working prototype in an afternoon, but shipping still requires product judgment: who is this for, what problem does it solve, what flow must work, what risks remain, and what evidence shows that it is ready?

LaunchProof was built for that gap. In the AI-builder era, the bottleneck is no longer "can I make something?" It is "can I explain, test, measure, and responsibly ship the thing I made?" LaunchProof gives builders that missing product layer.

## What it does

LaunchProof turns a rough product idea into a launch readiness packet that a judge, teammate, or founder can actually use. A builder enters their product concept, target user, problem, success metric, and demo URL. LaunchProof generates a crisp product brief, core user flows, acceptance checks, launch risks and mitigations, a readiness rationale, a Novus-measurable proof loop, a behavior coverage panel, a hackathon scorecard, testing instructions, and an exportable Devpost-ready pitch packet.

The result is a concrete answer to the question every AI-built prototype faces: what must work, what evidence do we have, and what should we say when we ask someone to believe this is ready?

The app also includes multiple sample products, including MeetingBridge and IssuePilot, so judges can see the workflow generalize beyond LaunchProof's own submission story. Judges can open the MeetingBridge sample directly at `https://shanyuzhe.github.io/launchproof-mtp-2026/?sample=meetingbridge`.

## How we built it

We built LaunchProof during the hackathon submission window using an AI-assisted builder workflow to rapidly shape the product workflow, prototype the interface, and iterate on the submission story. The core product is designed around structured product reasoning rather than open-ended chat: every output maps to a launch artifact a real builder needs.

The app uses Next.js and React for the public web app, GitHub Pages for deployment, Novus.ai / Pendo Web SDK for product behavior tracking, local browser storage for draft persistence, lucide-react for interface icons, and GitHub for source control.

## Challenges we ran into

The main challenge was avoiding "AI text soup". The product needed to produce artifacts that are short, structured, measurable, and useful under time pressure. We focused on the launch workflow: user, job, flows, risks, evidence, pitch.

A second challenge was making Novus.ai feel like part of the product rather than a compliance checkbox. LaunchProof treats behavior tracking as launch evidence: did the builder generate a packet, review flows, inspect risks, review evidence, and export the pitch?

## Accomplishments that we're proud of

- Created a workflow that connects product thinking with AI-assisted shipping.
- Designed outputs that directly support demo preparation and launch review.
- Added multiple sample products to show the workflow works beyond the LaunchProof self-demo.
- Added behavior tracking so "ready to ship" can be tied to real usage signals.
- Added a behavior coverage panel that shows which proof actions have happened in the current session.
- Mapped the product evidence directly to Product Thinking, Craft and Execution, Originality and Ambition, and Shippedness.
- Added a readiness rationale and launch proof loop so the score is explainable instead of decorative.
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
6. Open each tab: `Brief`, `Flows`, `Risks`, `Evidence`, and `Pitch`.
7. In `Brief`, confirm the packet identifies a target user, problem, solution, success metric, and launch decision.
8. In `Flows`, confirm that the app turns the idea into critical user paths and acceptance checks.
9. In `Risks`, review the launch risks and mitigations.
10. In `Evidence`, review the hackathon scorecard, readiness rationale, launch proof loop, proof status, behavior coverage, and Novus/Pendo event map.
11. Click `Copy packet` to copy the pitch-ready launch packet and confirm the `Copied` state appears.
12. Compare the local event feed and tracked actions with the Novus.ai/Pendo dashboard screenshot included in the submission.

No login is required. The app stores draft changes in browser local storage. A successful test should show a local event feed update, a visible `Novus/Pendo connected` state, and the copied launch packet.

## Final Judge Checklist

- Product Thinking: clear user, pain, job-to-be-done, and launch-readiness outcome.
- Craft and Execution: one end-to-end workflow from intake to packet export.
- Originality and Ambition: product judgment, acceptance checks, analytics evidence, and pitch export are connected in one tool.
- Shippedness: public app works without login, seeded example works immediately, demo video shows the live product, and Novus/Pendo evidence is included.
- Honesty: LaunchProof is a launch readiness assistant, not a guarantee of product-market fit, QA completion, or user research.
