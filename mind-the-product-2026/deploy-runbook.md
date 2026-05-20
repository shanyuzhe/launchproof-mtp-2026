# Deploy Runbook

## Goal

Get LaunchProof online, send at least a few behavior events to Novus/Pendo, and capture the dashboard screenshot required by the Mind the Product submission.

## Recommended Path: Vercel

Current local winning branch: `codex-launchproof-prize-polish`.

Current production URL: `https://launchproof-mtp.vercel.app`.

Important: the production URL has previously returned the older build even after `main` was pushed. Before using the URL in Devpost, verify that the page contains:

- `Launch decision`
- `Run Judge Demo`
- `90-second judge path`
- `Reset Demo`
- `Hackathon scorecard`
- `Testing instructions`

If any of those are missing, the public site is not on the prize-polish build yet.

1. Open `https://vercel.com/new`.
2. Continue with GitHub.
3. Import `shanyuzhe/launchproof-mtp-2026`.
4. Keep the detected framework as Next.js.
5. Deploy. The repo already includes the public Novus/Pendo install key generated during setup.
6. Open the deployment URL.
7. Click through the product:
   - Generate Launch Packet
   - Brief
   - Flows
   - Risks
   - Evidence
   - Copy pitch packet
8. Open Novus/Pendo dashboard and confirm events arrive.
9. Screenshot the dashboard for Devpost.

## Automated Final Gate

After the final deployment, run the deploy verifier from the repo root:

```bash
npm run verify:launchproof -- --url https://launchproof-mtp.vercel.app --dashboard-screenshot path/to/novus-dashboard.png --demo-video-url https://...
```

The script fails loud if:

- the public URL does not return the latest-build strings listed above
- the public bundle does not contain the Pendo CDN loader, `pendo.initialize`, the Novus/Pendo connected status, and the expected public install key
- Devpost draft/checklist/video-script materials are missing required sections
- the Novus/Pendo dashboard screenshot path is missing or empty
- the uploaded demo video URL is missing or malformed

Do not paste the URL into Devpost until this command prints `[pass] LaunchProof deploy verification passed.`.

## If Vercel Does Not Auto-Deploy

1. Open `https://vercel.com/shanyuzhes-projects/launchproof-mtp`.
2. Go to `Deployments`.
3. Check whether the latest deployment uses the newest GitHub commit.
4. If there is no new deployment after a GitHub push, go to `Settings` -> `Git` and confirm the connected repository is `shanyuzhe/launchproof-mtp-2026` and the production branch is `main`.
5. If the repo is connected but stale, use `Redeploy` from the latest deployment after the newest commit is on `main`.
6. Re-open `https://launchproof-mtp.vercel.app` and confirm the latest-build strings above are present before recording the demo video.

## If The Key Is Stuck In The Old Novus PR

The closed `OI-wiki` PR created by Novus contains a Pendo install key in its generated install snippet. That key is already wired as the default public install key. Prefer rotating/resetting the key later if Novus support gives that option.

## Devpost Submission Evidence

Required:

- deployed app URL
- GitHub repo URL
- Novus/Pendo dashboard screenshot
- under-3-minute demo video
- English project description
- testing instructions

## Final Submission Paste Order

1. Project name: `LaunchProof`.
2. Tagline: `AI helps you build faster. LaunchProof helps you prove it is ready to ship.`
3. App URL: `https://launchproof-mtp.vercel.app`.
4. Source URL: `https://github.com/shanyuzhe/launchproof-mtp-2026`.
5. Built With: `Next.js, React, Vercel, Novus.ai, Pendo Web SDK, Browser Local Storage, lucide-react, GitHub`.
6. Project Story: paste from `devpost-submission-draft.md`.
7. Testing Instructions: paste from `devpost-submission-draft.md`.
8. Video URL: paste the public or unlisted YouTube/Vimeo/Youku link.
9. Screenshot uploads: app screenshot plus Novus/Pendo dashboard screenshot.

Before clicking submit, open the app URL in a fresh browser tab and follow the exact testing instructions once.
