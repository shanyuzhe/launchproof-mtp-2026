# Judging Evidence Matrix

Use this as the final internal audit before submitting on Devpost. The goal is to make every judging criterion visible in the app, the video, the screenshots, and the written submission.

## Criterion Coverage

| Criterion | What judges are scoring | LaunchProof claim | Evidence to show |
| --- | --- | --- | --- |
| Product Thinking | Clear user, worthwhile problem, clear job-to-be-done, why it matters | AI builders can create prototypes faster than they can prove launch readiness | App opening copy, Devpost Inspiration, MeetingBridge sample, Product Thinking card in Evidence |
| Craft and Execution | Coherent end-to-end experience, polished UI, intentional copy | One workflow moves from intake to brief, flows, risks, resilience, evidence, and export | Live app, `Run Judge Demo`, `launchproof-main-workflow.png`, `launchproof-resilience-review.png`, `launchproof-mobile-resilience.png`, AI builder provenance panel, demo video |
| Originality and Ambition | Specific and surprising product idea | LaunchProof treats analytics, resilience, and AI-builder provenance as product proof, not bolt-on story points | Resilience tab, Novus event map, launch proof loop, behavior coverage panel, `ai-builder-provenance.md` |
| Shippedness | Stranger can land on URL and get value now, with measurable behavior | Public app works without login, sample URL loads, behavior coverage reaches 7/7, Novus/Pendo tracks events | GitHub Pages URL, MeetingBridge sample URL, `launchproof-behavior-coverage.png`, Novus/Pendo dashboard screenshot |

## Submission Proof Chain

1. A judge opens `https://shanyuzhe.github.io/launchproof-mtp-2026/`.
2. The first screen already shows a launch readiness packet, not a marketing page.
3. A judge can open `?sample=meetingbridge` to prove the workflow generalizes beyond the LaunchProof self-demo.
4. `Run Judge Demo` walks through the proof path: brief, flows, risks, resilience, evidence, pitch.
5. The Evidence tab shows hackathon scorecard, launch proof loop, Novus event map, local event feed, proof status, and behavior coverage.
6. `Copy packet` exports a paste-ready launch packet; if clipboard permission is blocked, the fallback export text area appears.
7. The demo video shows the same path in under 3 minutes.
8. The Novus/Pendo screenshot proves the required analytics installation was completed.

## Current Verified Evidence

- Public app URL: `https://shanyuzhe.github.io/launchproof-mtp-2026/`
- Direct sample URL: `https://shanyuzhe.github.io/launchproof-mtp-2026/?sample=meetingbridge`
- Source repository: `https://github.com/shanyuzhe/launchproof-mtp-2026`
- Demo video file: `launchproof-demo-video.webm`, 94.4 seconds
- Gallery assets:
  - `launchproof-main-workflow.png`
  - `launchproof-resilience-review.png`
  - `launchproof-mobile-resilience.png`
  - `launchproof-evidence-scorecard.png`
  - `launchproof-behavior-coverage.png`
  - `launchproof-devpost-gallery.png`

## Remaining External Evidence

- Upload `launchproof-demo-video.webm` to YouTube, Vimeo, or Youku and use the real public/unlisted URL.
- Save a real Novus/Pendo dashboard screenshot as `novus-pendo-dashboard.png`.
- Run `node scripts/final-submit-check.mjs <video-url>` and require `[pass] LaunchProof deploy verification passed.`
