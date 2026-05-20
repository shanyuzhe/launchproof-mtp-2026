# Submission Checklist

Purpose: final launch gate for Devpost. Public-facing submission assets stay in English, and internal reminders also stay in English to avoid encoding issues.

## Registration

- Joined Mind the Product hackathon on Devpost.
- Saved all hidden participant details locally.
- Confirmed deadline: June 20, 2026 17:00 BST.
- Registered for Novus.ai.
- Captured Novus.ai install instructions.

## Build

- Working app built locally.
- Hosted live demo.
- Public GitHub repository.
- README with setup instructions.
- LaunchProof sample project preloaded.
- Draft persistence added.
- Desktop layout content checked through local HTTP render.
- Novus.ai installed through the Pendo Web SDK.
- Novus.ai/Pendo receives real user events on the currently deployed build.
- Novus.ai dashboard screenshot captured.
- Deploy environment includes `NEXT_PUBLIC_PENDO_API_KEY` or the built-in public install key.

## Devpost Copy

- Project name: `LaunchProof`.
- Tagline: `AI helps you build faster. LaunchProof helps you prove it is ready to ship.`
- Project Story pasted from `devpost-submission-draft.md`.
- Inspiration, What it does, How we built it, Challenges, Accomplishments, What we learned, and What's next are filled.
- Built With field uses: `Next.js, React, Vercel, Novus.ai, Pendo Web SDK, Browser Local Storage, lucide-react, GitHub`.
- Testing Instructions pasted from `devpost-submission-draft.md`.
- Responsible AI note included if Devpost provides a suitable field.
- English-only public submission materials.

## Screenshots And Media

- App screenshot shows the main workflow, not a blank landing page.
- Novus.ai/Pendo dashboard screenshot is included and clearly shows LaunchProof events.
- Demo video is under 3 minutes.
- Demo video uses the public URL.
- Demo video shows the product functioning, not only slides or narration.
- Video upload is public or unlisted on YouTube, Vimeo, or Youku.
- Video description mentions launch packet, evidence board, and Novus/Pendo tracking.

## Judge Testing Path

- Public app URL works in a fresh browser session without login.
- Source repository URL is public.
- Testing instructions mention no credentials are required.
- Seeded example works immediately.
- `Generate Launch Packet` works after changing an intake field.
- `Run Judge Demo` walks through the 90-second proof path.
- `Brief`, `Flows`, `Risks`, `Evidence`, and `Pitch` tabs are visible.
- `Copy packet` works.
- Evidence tab includes hackathon scorecard and event map.
- Novus/Pendo dashboard screenshot corresponds to the tracked events.

## Judge-Facing Positioning

- Lead with Product Thinking: AI builders need launch readiness, not more generic output.
- Explain Craft and Execution: one polished workflow from intake to export.
- Explain Originality and Ambition: product analytics becomes launch evidence for AI-built products.
- Explain Shippedness: public app, no login, persistent draft, tracked events, dashboard screenshot.
- Avoid overclaiming. Say "launch readiness packet" and "evidence signals", not "guaranteed product-market fit".

## Prize Strategy

- Submit early enough to avoid deadline issues.
- Ask for feedback in the event community.
- Watch participant gallery for positioning.
- Tailor final language to judging criteria.
- Keep the demo focused on one impressive workflow.
- Treat Product Thinking as the first tie-breaker.
- Make the Novus dashboard screenshot part of the story, not just a compliance artifact.

## Final Gate

- App URL: `https://shanyuzhe.github.io/launchproof-mtp-2026/`
- Secondary app URL if Vercel catches up to the latest commit: `https://launchproof-mtp.vercel.app`
- Source URL: `https://github.com/shanyuzhe/launchproof-mtp-2026`
- Confirm public deployment contains the latest copy and UI.
- Confirm Devpost links do not point to localhost, private previews, or stale deployments.
- Confirm the final submission can be understood in 30 seconds by a judge skimming quickly.
- Final internal reminder: rerun the public URL, demo video URL, and Novus/Pendo screenshot checks before clicking Submit.

## User Action Needed

- Confirm the chosen public URL deploys the latest GitHub commit before final submission.
- If GitHub Pages returns 404, enable Pages in repository settings and choose branch `gh-pages` / `/root`.
- Run `npm run verify:launchproof -- --url https://shanyuzhe.github.io/launchproof-mtp-2026/ --dashboard-screenshot path/to/novus-dashboard.png --demo-video-url https://...` and require a `[pass]` result.
- Capture a fresh Novus.ai/Pendo dashboard screenshot after the final deployed build receives events.
- Record and upload the demo video to YouTube, Vimeo, or Youku.
- Confirm whether we enter as solo or team.
