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

The final checker rejects placeholder links such as `example`, `TODO`, `video-id`, or `https://...`; use the real uploaded watch/share URL.
It also resolves the video page publicly, so a mistyped or unavailable YouTube/Vimeo link will fail before submission.

## 2. Capture Novus/Pendo Screenshot

Open:

https://novus.pendo.io/dashboard

Take a screenshot that shows the Novus sidebar/header and any LaunchProof-connected dashboard, replay, memory, signal, or activity state.

Save it here:

`C:/Users/22684/Documents/vibe_coding/novus-pendo-dashboard.png`

Shortcut: if the screenshot lands in Downloads, Desktop, or Pictures, save or rename it with `novus`, `pendo`, or `dashboard` in the filename, then run this from the repo root:

```bash
npm run import:novus-screenshot
```

Or pass a specific file path:

```bash
npm run import:novus-screenshot -- C:/Users/22684/Downloads/novus-dashboard.png
```

Use a real PNG/JPEG screenshot at normal browser size. The final checker rejects empty, invalid, or tiny image files.

## 3. Fill Devpost

Open:

`mind-the-product-2026/devpost-paste-fields.md`

Paste each field into Devpost.

Use these links:

- App: https://shanyuzhe.github.io/launchproof-mtp-2026/
- MeetingBridge sample: https://shanyuzhe.github.io/launchproof-mtp-2026/?sample=meetingbridge
- Source: https://github.com/shanyuzhe/launchproof-mtp-2026
- Video: paste the uploaded video URL

Upload images:

1. `launchproof-main-workflow.png`
2. `launchproof-resilience-review.png`
3. `launchproof-evidence-scorecard.png`
4. `launchproof-behavior-coverage.png`
5. `novus-pendo-dashboard.png`

## 4. Run Final Gate

Replace `<video-url>` with the uploaded URL:

```bash
npm run verify:launchproof -- --url https://shanyuzhe.github.io/launchproof-mtp-2026/ --dashboard-screenshot novus-pendo-dashboard.png --demo-video-url <video-url>
```

Short version:

```bash
npm run final:check -- <video-url>
```

The short checker also verifies the local `launchproof-demo-video.webm` exists and is under 3 minutes before it runs the full public deploy gate. If `novus-pendo-dashboard.png` is missing, it first tries to import the newest likely Novus/Pendo dashboard screenshot from common folders.

If the screenshot is still under a normal browser screenshot filename, pass it directly and sync the real video URL into the local docs:

```bash
npm run final:check -- <video-url> --screenshot "C:/Users/22684/Downloads/novus-dashboard.png" --sync-docs
```

Only submit when it prints:

`[pass] LaunchProof deploy verification passed.`

and:

`[pass] Final submit check passed.`

## 5. Final Pre-Submit Scan

- App link opens without login.
- MeetingBridge sample link opens without login and shows MeetingBridge immediately.
- Video link opens without login.
- Video link is YouTube, Vimeo, or Youku.
- Source link opens publicly.
- Novus/Pendo screenshot is uploaded.
- Project story is in English.
- About copy names the user, problem, workflow, evidence, and honest limits.
- About copy mentions sample products such as MeetingBridge so the project does not read as only a self-demo.
- Testing instructions walk a judge through Brief, Flows, Risks, Resilience, Evidence, Pitch, and Copy packet.
- The submission visibly covers Product Thinking, Craft and Execution, Originality and Ambition, and Shippedness.
- Submission is not still marked draft.
