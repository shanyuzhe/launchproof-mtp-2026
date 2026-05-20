# LaunchProof

LaunchProof is a launch readiness workspace for AI builders, created for the Mind the Product World Product Day Hackathon 2026.

AI helps builders make software faster. LaunchProof helps them prove the product is ready to ship by turning a rough idea into:

- a concise launch brief
- critical user flows
- acceptance checks
- launch risks and mitigations
- Novus-ready behavior events
- an exportable pitch packet

## Local Development

```bash
npm install
npm run dev
```

## Novus.ai

The hackathon requires Novus.ai installation and a dashboard screenshot. This app already emits product events through `window.pendo.track(...)` or `window.novus.track(...)` when either SDK is available.

Tracked event examples:

- `brief_generated`
- `flows_reviewed`
- `risks_reviewed`
- `evidence_reviewed`
- `export_clicked`

Add the official Novus/Pendo install snippet to `index.html` once the dashboard provides it.

## Hackathon Notes

Detailed planning and submission notes live in `mind-the-product-2026/`.
