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

## What It Does

LaunchProof turns a rough product idea into a launch readiness packet. A builder enters their product concept, target user, problem, success metric, and demo URL. LaunchProof generates:

- a crisp product brief
- core user flows
- acceptance checks
- launch risks and mitigations
- a Novus-measurable evidence board
- a hackathon scorecard mapped to the judging criteria
- testing instructions
- an exportable Devpost-ready pitch packet

The result is a clearer launch decision and a stronger hackathon submission.

## Project Story

LaunchProof is a launch readiness workspace for solo AI builders and PMs preparing a launch or hackathon submission. It helps a builder move from "I have a prototype" to "I know what must work, what could fail, what I can measure, and how to pitch it."

The product guides a user through one focused workflow:

1. Enter the product concept, target user, problem, solution, success metric, and demo URL.
2. Generate a structured launch packet.
3. Review the brief, flows, risks, evidence, and pitch.
4. Use the evidence board to connect product actions with Novus/Pendo events.
5. Copy a polished packet that can be pasted into Devpost, a launch review, or a team update.

The key design choice is that LaunchProof is not another open-ended AI chat box. It is opinionated about what "ready to ship" means. A good launch packet must be specific, testable, measurable, and short enough to use under deadline pressure.

## Judge-Facing Positioning

LaunchProof should be judged as a product layer for the AI-builder era.

- Product Thinking: the target user is clear: builders and PMs who can now create prototypes faster than they can validate launch readiness.
- Craft and Execution: the app gives one complete workflow rather than a collection of unrelated generators.
- Originality and Ambition: it connects AI-assisted building, product judgment, QA-style acceptance checks, analytics evidence, and submission storytelling.
- Shippedness: the public app is usable without login, includes a seeded example, persists drafts locally, and tracks meaningful behavior through Novus.ai/Pendo.

## How We Built It

We built LaunchProof during the hackathon submission window using an AI-assisted builder workflow to rapidly shape the product workflow, prototype the interface, and iterate on the submission story. The core product is designed around structured product reasoning rather than open-ended chat: every output maps to a launch artifact a real builder needs.

The app is built with:

- Next.js and React for the public web app
- GitHub Pages for the public deployment
- Novus.ai / Pendo Web SDK for product behavior tracking
- local browser storage for draft persistence
- lucide-react for interface icons
- GitHub for source control

## Built With

Devpost field copy:

Next.js, React, GitHub Pages, Novus.ai, Pendo Web SDK, Browser Local Storage, lucide-react, GitHub

## Challenges

The main challenge was avoiding "AI text soup". The product needed to produce artifacts that are short, structured, measurable, and useful under time pressure. We focused on the launch workflow: idea, flows, risks, evidence, pitch.

A second challenge was making Novus.ai feel like part of the product rather than a compliance checkbox. LaunchProof treats behavior tracking as launch evidence: did the builder generate a packet, review flows, inspect risks, review evidence, and export the pitch?

## Accomplishments

- Created a workflow that connects product thinking with AI-assisted shipping.
- Designed outputs that directly support demo preparation and launch review.
- Added behavior tracking so "ready to ship" can be tied to real usage signals.
- Mapped the product evidence directly to Product Thinking, Craft and Execution, Originality and Ambition, and Shippedness.
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
2. Use the preloaded LaunchProof example, or edit the intake fields to describe another AI-built product.
3. Click `Generate Launch Packet`.
4. Click `Run Judge Demo` to step through the 90-second proof path.
5. Open each tab: `Brief`, `Flows`, `Risks`, `Evidence`, and `Pitch`.
6. In `Flows`, confirm that the app turns the idea into critical user paths and acceptance checks.
7. In `Risks`, review the launch risks and mitigations.
8. In `Evidence`, review the hackathon scorecard and the Novus/Pendo event map.
9. Click `Copy packet` to copy the pitch-ready launch packet and confirm the `Copied` state appears.
10. Compare the local event feed and tracked actions with the Novus.ai/Pendo dashboard screenshot included in the submission.

No login is required. The app stores draft changes in browser local storage. A successful test should show a local event feed update, a visible `Novus/Pendo connected` state, and the copied launch packet. If the public deployment looks stale, refresh once and verify that the page includes `Launch decision`, `Hackathon scorecard`, and `Testing instructions`.

## Video Outline

1. Show the default LaunchProof packet on the public URL.
2. Edit one field to show the product reacts to real input.
3. Click Generate Launch Packet.
4. Click Run Judge Demo and advance through proof points.
5. Review Brief, Flows, Risks, Evidence, and Pitch.
6. Show the local event feed and Novus event map.
7. Point to the hackathon scorecard inside Evidence.
8. Copy the exportable packet.
9. Cut to the Novus/Pendo dashboard screenshot.
10. Close on the value: builders get from prototype to credible launch faster.

## Demo Video Description

LaunchProof helps AI builders turn a rough prototype into a launch readiness packet. In the demo, we generate a product brief, critical flows, acceptance checks, risks, evidence signals, and a Devpost-ready pitch export. We also show how key product actions are mapped to Novus.ai/Pendo events so launch readiness is measurable, not just narrated.

## Responsible AI Note

LaunchProof uses AI-assisted development and structured product reasoning, but it does not ask users to blindly trust generated output. The workflow makes launch assumptions visible: user, problem, flows, acceptance checks, risks, mitigations, and evidence signals. The intended use is to help builders review and improve a product before launch, not to replace user research or quality assurance.

## Try It Out

- App: https://shanyuzhe.github.io/launchproof-mtp-2026/
- Secondary deployment if it catches up to the latest commit: https://launchproof-mtp.vercel.app
- Source: https://github.com/shanyuzhe/launchproof-mtp-2026
