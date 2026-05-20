#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = process.cwd();
const nextBin = resolve(repoRoot, 'node_modules/next/dist/bin/next');

if (!existsSync(nextBin)) {
  console.error(`[fail] Next.js binary not found: ${nextBin}`);
  process.exit(1);
}

const result = spawnSync(process.execPath, [nextBin, 'build'], {
  cwd: repoRoot,
  env: {
    ...process.env,
    GITHUB_PAGES: 'true',
    NEXT_PUBLIC_APP_URL: 'https://shanyuzhe.github.io/launchproof-mtp-2026',
  },
  stdio: 'inherit',
});

if (result.error) {
  console.error('[fail] GitHub Pages build failed to start.');
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
