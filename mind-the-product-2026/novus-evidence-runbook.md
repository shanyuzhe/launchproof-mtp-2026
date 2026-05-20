# Novus/Pendo Evidence Runbook

Purpose: create the dashboard screenshot required by the hackathon and make sure the screenshot honestly supports the submission.

## Generate Fresh Events

Use the public app, not localhost:

https://shanyuzhe.github.io/launchproof-mtp-2026/

Direct sample URL:

https://shanyuzhe.github.io/launchproof-mtp-2026/?sample=meetingbridge

In one browser session:

1. Open the public URL or the direct MeetingBridge sample URL.
2. Change one intake field, such as `Success metric`.
3. Click `Generate Launch Packet`.
4. Click `Run Judge Demo`.
5. Click `Next Proof Point` until the judge path reaches `6/6`.
6. Click tabs in this order: `Flows`, `Risks`, `Resilience`, `Evidence`, `Pitch`.
7. Click `Copy packet`.
8. Return to `Evidence` and confirm behavior coverage reaches `100%`.
9. Leave the tab open for 30 seconds so Pendo can flush events.

Browser network evidence already observed on the deployed app:

- `cdn.pendo.io/agent/static/e8d019ac-2123-45c3-80b7-a171a94a8fb0/pendo.js` returned HTTP 304/200.
- `data.pendo.io/data/rec/e8d019ac-2123-45c3-80b7-a171a94a8fb0...` returned HTTP 200.

## Capture The Required Dashboard Screenshot

1. Open https://novus.pendo.io/dashboard.
2. Make sure the browser is logged into the same Novus account used for the hackathon.
3. Prefer a page that shows at least one of:
   - LaunchProof / repository/product memory
   - Recent activity, replay, event, or recording evidence
   - Signals/status that proves the Novus workspace is connected
4. Keep the left Novus navigation and account visible in the screenshot.
5. Save the file as:

`novus-pendo-dashboard.png`

Shortcut: if the screenshot lands in Downloads, Desktop, or Pictures, save or rename it with `novus`, `pendo`, or `dashboard` in the filename, then run:

```bash
npm run import:novus-screenshot
```

Or pass a specific file path:

```bash
npm run import:novus-screenshot -- C:/Users/22684/Downloads/novus-dashboard.png
```

The importer validates the image size and copies the newest likely Novus/Pendo dashboard image to the required filename.

Use a real PNG/JPEG screenshot at normal browser size. The final checker rejects empty, invalid, or tiny image files.

If Novus still says signals may take 24 hours, screenshot the dashboard state anyway, then rerun the app event path above and check again later. Do not rename product screenshots as Novus evidence.

## Final Verification

After `novus-pendo-dashboard.png` exists and the demo video is uploaded, run:

```bash
npm run final:check -- https://...
```

If the screenshot is still in Downloads/Desktop under another filename, pass it directly:

```bash
npm run final:check -- https://youtu.be/REAL_ID --screenshot "C:/Users/22684/Downloads/novus-dashboard.png" --sync-docs
```

The verifier should print:

`[pass] LaunchProof deploy verification passed.`

and:

`[pass] Final submit check passed.`
