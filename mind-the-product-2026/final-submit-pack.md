# Final Submit Pack

Use this file as the final Devpost assembly checklist.

## Public Links

- App: https://shanyuzhe.github.io/launchproof-mtp-2026/
- Source: https://github.com/shanyuzhe/launchproof-mtp-2026
- Demo video: TODO after upload
- Devpost paste fields: `mind-the-product-2026/devpost-paste-fields.md`
- Novus evidence steps: `mind-the-product-2026/novus-evidence-runbook.md`
- Video upload steps: `mind-the-product-2026/video-upload-runbook.md`
- Final 10-minute submit card: `mind-the-product-2026/final-10-minute-submit-card.md`

## Upload Assets

- First gallery image: `launchproof-main-workflow.png`
- Second gallery image: `launchproof-evidence-scorecard.png`
- Demo video file before upload: `launchproof-demo-video.webm` (74.9 seconds, captioned, under the 3-minute limit)
- Required Novus/Pendo screenshot: save as `novus-pendo-dashboard.png`

## Evidence Already Verified

- Public app opens without login.
- `Run Judge Demo` works on the deployed URL.
- `Copy packet` works on the deployed URL.
- Pendo loads from `cdn.pendo.io`.
- Pendo recording/event requests are sent to `data.pendo.io/data/rec/...` and return HTTP 200.

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
