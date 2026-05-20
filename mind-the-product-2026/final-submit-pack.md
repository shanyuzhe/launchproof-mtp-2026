# Final Submit Pack

Use this file as the final Devpost assembly checklist.

## Public Links

- App: https://shanyuzhe.github.io/launchproof-mtp-2026/
- MeetingBridge sample: https://shanyuzhe.github.io/launchproof-mtp-2026/?sample=meetingbridge
- Source: https://github.com/shanyuzhe/launchproof-mtp-2026
- Demo video: TODO after upload
- Devpost paste fields: `mind-the-product-2026/devpost-paste-fields.md`
- Novus evidence steps: `mind-the-product-2026/novus-evidence-runbook.md`
- Video upload steps: `mind-the-product-2026/video-upload-runbook.md`
- Final 10-minute submit card: `mind-the-product-2026/final-10-minute-submit-card.md`

## Upload Assets

- First gallery image: `launchproof-main-workflow.png`
- Second gallery image: `launchproof-evidence-scorecard.png`
- Third gallery image: `launchproof-behavior-coverage.png`
- Demo video file before upload: `launchproof-demo-video.webm` (88.0 seconds, captioned, under the 3-minute limit)
- Uploaded demo video URL must be on YouTube, Vimeo, or Youku.
- Required Novus/Pendo screenshot: save as `novus-pendo-dashboard.png`

## Evidence Already Verified

- Public app opens without login.
- Direct MeetingBridge sample URL opens without login and generates a project-specific evidence packet.
- `Run Judge Demo` works on the deployed URL.
- `Copy packet` works on the deployed URL.
- Pendo loads from `cdn.pendo.io`.
- Pendo recording/event requests are sent to `data.pendo.io/data/rec/...` and return HTTP 200.

## Final Judge Checklist

- Product Thinking: the About copy quickly names the AI-builder user, launch-readiness pain, and job-to-be-done.
- Craft and Execution: the app, video, and testing path all show one coherent workflow from intake to export.
- Originality and Ambition: Novus/Pendo is presented as launch evidence, not just a required SDK install.
- Shippedness: the live URL works without login, the seeded example works, the demo video is under 3 minutes, and the Novus/Pendo screenshot is uploaded.
- Honesty: the submission says LaunchProof produces readiness evidence and pitch materials; it does not claim to replace user research, QA, or product-market fit validation.

## Final Gate Command

Run this after the real Novus/Pendo dashboard screenshot and uploaded video URL exist:

```bash
npm run verify:launchproof -- --url https://shanyuzhe.github.io/launchproof-mtp-2026/ --dashboard-screenshot novus-pendo-dashboard.png --demo-video-url https://...
```

Shortcut:

```bash
node scripts/final-submit-check.mjs https://...
```

Do not click Devpost Submit until the command prints `[pass] LaunchProof deploy verification passed.`.
