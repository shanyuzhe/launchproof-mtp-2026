# Demo Video Upload Runbook

Local video file:

`launchproof-demo-video.webm`

Duration: 75.3 seconds.

## Recommended Upload Settings

- Platform: YouTube, Vimeo, or Youku.
- The final checker rejects other video hosts because Devpost rules require YouTube, Vimeo, or Youku.
- Visibility: `Unlisted` is okay if the link is accessible without login.
- Title: `LaunchProof Demo - Mind the Product World Product Day Hackathon`
- Audience: Not made for kids.
- Music: none.
- Captions: the video already includes on-screen captions.

## Video Description

Paste this:

LaunchProof helps AI builders turn a rough prototype into a launch readiness packet. In this demo, we generate a product brief, critical flows, acceptance checks, risks, evidence signals, and a Devpost-ready pitch export. The Evidence tab maps key product actions to Novus.ai/Pendo events so shippedness is measurable, not just narrated.

Public app: https://shanyuzhe.github.io/launchproof-mtp-2026/

Source: https://github.com/shanyuzhe/launchproof-mtp-2026

## After Upload

1. Copy the public or unlisted video URL.
2. Paste it into Devpost's `Video demo link` field.
3. Replace the `TODO` video URL in `mind-the-product-2026/final-submit-pack.md` if you want the local docs fully synced.
4. Run the final verifier:

```bash
npm run verify:launchproof -- --url https://shanyuzhe.github.io/launchproof-mtp-2026/ --dashboard-screenshot novus-pendo-dashboard.png --demo-video-url https://...
```
