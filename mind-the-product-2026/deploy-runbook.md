# Deploy Runbook

## Goal

Get LaunchProof online, send at least a few behavior events to Novus/Pendo, and capture the dashboard screenshot required by the Mind the Product submission.

## Deprecated Path: Vercel

Do not use Vercel for the Devpost app URL unless it is manually re-verified. The Vercel project has previously served stale builds after `main` was pushed.

Stale production URL: `https://launchproof-mtp.vercel.app`.

Only revisit Vercel as a backup if GitHub Pages becomes unavailable, and rerun the same verifier against the Vercel URL before trusting it.

## Automated Final Gate

After the final deployment, run the deploy verifier from the repo root:

```bash
node scripts/final-submit-check.mjs https://...
```

The script fails loud if:

- the public URL does not return the latest-build strings listed above
- the public bundle does not contain the Pendo CDN loader, `pendo.initialize`, the Novus/Pendo SDK status text, and the expected public install key
- Devpost draft/checklist/video-script materials are missing required sections
- the Novus/Pendo dashboard screenshot path is missing or empty
- the uploaded demo video URL is missing or malformed

Do not paste the URL into Devpost until this command prints `[pass] LaunchProof deploy verification passed.`.

## Primary Path: GitHub Pages

Use GitHub Pages as the Devpost app URL. The deployment uses the `gh-pages` branch, which contains the static export plus `.nojekyll`.

For manual `gh-pages` branch deployment, build with the Pages-aware script:

```bash
npm run build:pages
```

Do not use plain `npm run build` for `gh-pages`; it emits root-relative `/_next/...` asset URLs that are wrong for the project page path.

Current public URL:

`https://shanyuzhe.github.io/launchproof-mtp-2026/`

If the Pages URL 404s:

1. Open the GitHub repository settings.
2. Go to `Pages`.
3. Set `Build and deployment` source to `Deploy from a branch`.
4. Choose branch `gh-pages` and folder `/root`, then save.
5. Wait for the built-in `pages build and deployment` workflow to finish.
6. Run the verifier against the Pages URL:

```bash
node scripts/final-submit-check.mjs https://...
```

Use the Pages URL in Devpost only after the verifier prints `[pass] LaunchProof deploy verification passed.`.

The repo also includes `.github/workflows/pages.yml` as a manual-only alternative for a future GitHub Actions source. If that workflow build succeeds but the deploy job fails with `Ensure GitHub Pages has been enabled`, this is a repository setting issue, not an app build issue. Enable Pages at:

`https://github.com/shanyuzhe/launchproof-mtp-2026/settings/pages`

Then either keep branch deployment on `gh-pages` / `/root`, or switch source to `GitHub Actions` and re-run the manual `Deploy LaunchProof to GitHub Pages` workflow.

## If The Key Is Stuck In The Old Novus PR

The closed `OI-wiki` PR created by Novus contains a Pendo install key in its generated install snippet. That key is already wired as the default public install key. Prefer rotating/resetting the key later if Novus support gives that option.

## Devpost Submission Evidence

Required:

- deployed app URL
- direct MeetingBridge sample URL
- GitHub repo URL
- Novus/Pendo dashboard screenshot
- under-3-minute demo video
- English project description
- testing instructions

## Final Submission Paste Order

1. Project name: `LaunchProof`.
2. Tagline: `AI helps you build faster. LaunchProof helps you prove it is ready to ship.`
3. App URL: `https://shanyuzhe.github.io/launchproof-mtp-2026/`.
4. MeetingBridge sample URL: `https://shanyuzhe.github.io/launchproof-mtp-2026/?sample=meetingbridge`.
5. Source URL: `https://github.com/shanyuzhe/launchproof-mtp-2026`.
6. Built With: `Next.js, React, Codex and GPT-5 AI Builder Workflow, GitHub Pages, Novus.ai, Pendo Web SDK, Browser Local Storage, lucide-react, GitHub`.
7. Project Story: paste from `devpost-submission-draft.md`.
8. Testing Instructions: paste from `devpost-submission-draft.md`.
9. Video URL: paste the public or unlisted YouTube/Vimeo/Youku link.
10. Screenshot uploads: `launchproof-main-workflow.png`, `launchproof-resilience-review.png`, `launchproof-mobile-resilience.png`, `launchproof-evidence-scorecard.png`, `launchproof-behavior-coverage.png`, and `novus-pendo-dashboard.png`.

Before clicking submit, open the app URL in a fresh browser tab and follow the exact testing instructions once.
