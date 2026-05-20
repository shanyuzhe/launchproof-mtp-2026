# Final 10-Minute Submit Card

Use this when Devpost is open and you are ready to finish.

## 1. Upload The Demo Video

Upload this file to YouTube, Vimeo, or Youku. The final checker intentionally rejects other hosts because the rules require one of these platforms:

`C:/Users/22684/Documents/vibe_coding/launchproof-demo-video.webm`

Use:

- Title: `LaunchProof Demo - Mind the Product World Product Day Hackathon`
- Visibility: `Unlisted` or public
- Description: copy from `mind-the-product-2026/video-upload-runbook.md`

Copy the uploaded video URL.

## 2. Capture Novus/Pendo Screenshot

Open:

https://novus.pendo.io/dashboard

Take a screenshot that shows the Novus sidebar/header and any LaunchProof-connected dashboard, replay, memory, signal, or activity state.

Save it here:

`C:/Users/22684/Documents/vibe_coding/novus-pendo-dashboard.png`

## 3. Fill Devpost

Open:

`mind-the-product-2026/devpost-paste-fields.md`

Paste each field into Devpost.

Use these links:

- App: https://shanyuzhe.github.io/launchproof-mtp-2026/
- Source: https://github.com/shanyuzhe/launchproof-mtp-2026
- Video: paste the uploaded video URL

Upload images:

1. `launchproof-main-workflow.png`
2. `launchproof-evidence-scorecard.png`
3. `novus-pendo-dashboard.png`

## 4. Run Final Gate

Replace `<video-url>` with the uploaded URL:

```bash
npm run verify:launchproof -- --url https://shanyuzhe.github.io/launchproof-mtp-2026/ --dashboard-screenshot novus-pendo-dashboard.png --demo-video-url <video-url>
```

Short version:

```bash
node scripts/final-submit-check.mjs <video-url>
```

The short checker also verifies the local `launchproof-demo-video.webm` exists and is under 3 minutes before it runs the full public deploy gate.

Only submit when it prints:

`[pass] LaunchProof deploy verification passed.`

## 5. Final Pre-Submit Scan

- App link opens without login.
- Video link opens without login.
- Video link is YouTube, Vimeo, or Youku.
- Source link opens publicly.
- Novus/Pendo screenshot is uploaded.
- Project story is in English.
- About copy names the user, problem, workflow, evidence, and honest limits.
- About copy mentions sample products such as MeetingBridge so the project does not read as only a self-demo.
- Testing instructions walk a judge through Brief, Flows, Risks, Evidence, Pitch, and Copy packet.
- The submission visibly covers Product Thinking, Craft and Execution, Originality and Ambition, and Shippedness.
- Submission is not still marked draft.
