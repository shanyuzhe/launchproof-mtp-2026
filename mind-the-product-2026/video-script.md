# LaunchProof Demo Video Plan

Target length: 90 seconds, comfortably under the 3-minute Devpost limit.

## Core Message

AI helps builders create software faster. LaunchProof helps them prove the product is ready to ship.

## Shot List

1. Open LaunchProof on the public GitHub Pages URL.
2. Show the left intake panel: product name, user, problem, solution, metric, demo URL.
3. Make one visible field edit so judges see the packet reacts to real input.
4. Click `Generate Launch Packet`.
5. Click `Run Judge Demo`.
6. Move through `Brief`, `Flows`, `Risks`, `Evidence`, and `Pitch`.
7. Click `Copy packet`.
8. Show the Novus/Pendo dashboard screenshot, including event names that match the app event map.

## Timestamp Outline

0:00-0:10 - Open with the problem: AI made building faster, but launch judgment is still the bottleneck.

0:10-0:25 - Show the intake panel. Point out product, target user, problem, solution, success metric, and demo URL.

0:25-0:35 - Click `Generate Launch Packet`, then `Run Judge Demo`, and frame the output as a launch review, not a generic AI response.

0:35-0:55 - Move through `Brief`, `Flows`, and `Risks`. Emphasize specific flows, acceptance checks, and mitigations.

0:55-1:10 - Open `Evidence`. Show the hackathon scorecard and Novus/Pendo event map.

1:10-1:20 - Click `Copy packet`. Explain that the result can be pasted into Devpost, a launch review, or a team update.

1:20-1:30 - Show the Novus/Pendo dashboard screenshot and close on measurable shippedness.

## Voiceover

Hi, this is LaunchProof. AI builders can now create working prototypes incredibly fast, but shipping still needs product judgment. LaunchProof helps a builder prove that an AI-built product is actually ready to ship.

On the left, I enter the product, target user, problem, solution, success metric, and demo URL. The default example is LaunchProof itself, so a judge can immediately see the workflow without setup. I can also click Run Judge Demo to walk through the full proof path in about 90 seconds.

When I generate a launch packet, LaunchProof creates a concise brief, critical user flows, acceptance checks, launch risks, evidence signals, and a pitch-ready export. The Evidence tab also includes a hackathon scorecard mapped directly to the judging criteria: product thinking, craft, originality, and shippedness.

The Evidence tab maps user actions to Novus/Pendo events, including packet generation, flow review, risk review, evidence review, and export. That means LaunchProof is not only a demo; it is measurable as a shipped product.

Finally, I copy the packet. A builder can paste it into a launch review or Devpost submission, and a judge can test the public URL directly.

LaunchProof helps teams move from "we built something with AI" to "we can explain, test, measure, and ship it."

## Recording Checklist

- Use the verified public URL, not localhost.
- A generated local recording can be created with `node scripts/record-demo-video.mjs`.
- The generated `launchproof-demo-video.webm` is captioned and currently 83.3 seconds.
- Keep browser zoom at 100 percent unless text is hard to read.
- Start with the seeded LaunchProof example so the first screen is already meaningful.
- Make one visible edit before generating the packet.
- Show the `Evidence` tab long enough for judges to see the scorecard and event map.
- Show the Novus/Pendo screenshot as evidence, not as an afterthought.
- End with the one-liner: "AI helps you build faster. LaunchProof helps you prove it is ready to ship."
