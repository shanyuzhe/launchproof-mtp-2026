# Devpost Submission Draft

## Project Name

LaunchProof

## Tagline

AI helps you build faster. LaunchProof helps you prove it is ready to ship.

## Inspiration

AI coding tools changed the speed of software creation. A solo builder can now create a working prototype in an afternoon, but shipping still requires product judgment: who is this for, what problem does it solve, what flow must work, what risks remain, and what evidence shows that it is ready?

LaunchProof was built for that gap.

## What It Does

LaunchProof turns a rough product idea into a launch readiness packet. A builder enters their product concept, target user, problem, success metric, and demo URL. LaunchProof generates:

- a crisp product brief
- core user flows
- acceptance checks
- launch risks and mitigations
- a Novus-measurable evidence board
- testing instructions
- an exportable Devpost-ready pitch packet

The result is a clearer launch decision and a stronger hackathon submission.

## How We Built It

We used AI-assisted development to rapidly shape the product workflow, prototype the interface, and iterate on the submission story. The core product is designed around structured product reasoning rather than open-ended chat: every output maps to a launch artifact a real builder needs.

The app is built with:

- Next.js and React for the public web app
- Vercel for deployment
- Novus.ai / Pendo Web SDK for product behavior tracking
- local browser storage for draft persistence
- lucide-react for interface icons
- GitHub for source control

## Challenges

The main challenge was avoiding "AI text soup". The product needed to produce artifacts that are short, structured, measurable, and useful under time pressure. We focused on the launch workflow: idea, flows, risks, evidence, pitch.

## Accomplishments

- Created a workflow that connects product thinking with AI-assisted shipping.
- Designed outputs that directly support demo preparation and launch review.
- Added behavior tracking so "ready to ship" can be tied to real usage signals.
- Added draft persistence so builders can return to a packet without losing work.
- Built the project so it can be useful beyond one hackathon.

## What We Learned

AI can speed up implementation, but product clarity still comes from making decisions. The best AI tools for builders should not only generate more ideas; they should help teams decide what matters and prove that the product works.

## What's Next

- Add live browser validation for submitted URLs.
- Add integrations with GitHub issues and PRs.
- Let teams collaborate on launch readiness packets.
- Publish templates for common product types.

## Demo Script

1. Show the default LaunchProof packet on the public URL.
2. Edit one field to show the product reacts to real input.
3. Click Generate Launch Packet.
4. Review Brief, Flows, Risks, Evidence, and Pitch.
5. Show the local event feed and Novus event map.
6. Copy the exportable packet.
7. Cut to the Novus/Pendo dashboard screenshot.
8. Close on the value: builders get from prototype to credible launch faster.

## Try It Out

- App: https://launchproof-mtp.vercel.app
- Source: https://github.com/shanyuzhe/launchproof-mtp-2026
