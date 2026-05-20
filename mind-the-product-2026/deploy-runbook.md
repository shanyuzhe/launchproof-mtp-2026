# Deploy Runbook

## Goal

Get LaunchProof online, send at least a few behavior events to Novus/Pendo, and capture the dashboard screenshot required by the Mind the Product submission.

## Recommended Path: Vercel

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
