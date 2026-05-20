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

The hackathon requires Novus.ai installation and a dashboard screenshot. LaunchProof loads the Pendo/Novus Web SDK when `NEXT_PUBLIC_PENDO_API_KEY` is present, initializes a stable anonymous visitor, and emits product events through `window.pendo.track(...)`.

Create a local `.env.local` file or set the same environment variable in your deploy host:

```bash
NEXT_PUBLIC_PENDO_API_KEY=your-novus-or-pendo-install-key
```

Tracked event examples:

- `brief_generated`
- `flows_reviewed`
- `risks_reviewed`
- `evidence_reviewed`
- `export_clicked`

The SDK loader lives in `app/pendo-install.jsx`, and the event calls live in `app/page.jsx`.

## Hackathon Notes

Detailed planning and submission notes live in `mind-the-product-2026/`.
