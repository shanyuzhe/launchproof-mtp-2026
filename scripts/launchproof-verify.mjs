#!/usr/bin/env node

import { existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_URL = 'https://launchproof-mtp.vercel.app';
const DEFAULT_PENDO_KEY = 'e8d019ac-2123-45c3-80b7-a171a94a8fb0';

const requiredPublicStrings = [
  'Launch decision',
  'Run Judge Demo',
  '90-second judge path',
  'Reset Demo',
  'Hackathon scorecard',
  'Testing instructions',
];

const requiredDevpostSections = [
  '# Devpost Submission Draft',
  '## Project Name',
  '## Tagline',
  '## What It Does',
  '## How We Built It',
  '## Testing Instructions',
  '## Video Outline',
  '## Try It Out',
  '- App:',
  '- Source:',
];

const requiredChecklistItems = [
  'Hosted live demo',
  'Public GitHub repository',
  'Novus.ai installed through the Pendo Web SDK',
  'Novus.ai/Pendo receives real user events on the currently deployed build',
  'Novus.ai dashboard screenshot captured',
  'Demo video is under 3 minutes',
  'Testing instructions',
];

const failures = [];
const warnings = [];
const args = parseArgs(process.argv.slice(2));
const publicUrl = args.url || DEFAULT_URL;
const pendoKey = args.pendoKey || process.env.NEXT_PUBLIC_PENDO_API_KEY || DEFAULT_PENDO_KEY;
const dashboardScreenshot = args.dashboardScreenshot || args.novusScreenshot;
const demoVideoUrl = args.demoVideoUrl || args.videoUrl;
const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');

main().catch((error) => {
  console.error('[fail] LaunchProof verification crashed.');
  console.error(error);
  process.exit(1);
});

async function main() {
  console.log(`[check] Public URL: ${publicUrl}`);
  const pageBundle = await loadPublicPageBundle(publicUrl);
  checkPublicStrings(pageBundle.combinedSource);
  checkPendoInstall(pageBundle.combinedSource, pendoKey);

  console.log('[check] Devpost material files');
  await checkDevpostMaterials();
  checkExternalSubmissionEvidence();

  if (warnings.length) {
    console.warn('\n[warn] Review before final submission:');
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
  }

  if (failures.length) {
    console.error('\n[fail] LaunchProof deploy verification failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log('\n[pass] LaunchProof deploy verification passed.');
}

function parseArgs(rawArgs) {
  const parsed = {};

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];

    if (!arg.startsWith('--')) {
      failures.push(`Unknown positional argument: ${arg}`);
      continue;
    }

    const [key, inlineValue] = arg.slice(2).split('=', 2);
    const value = inlineValue ?? rawArgs[index + 1];

    if (!inlineValue) {
      index += 1;
    }

    if (!value || value.startsWith('--')) {
      failures.push(`Missing value for --${key}`);
      index -= value?.startsWith('--') ? 1 : 0;
      continue;
    }

    parsed[toCamelCase(key)] = value;
  }

  return parsed;
}

function toCamelCase(value) {
  return value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

async function loadPublicPageBundle(url) {
  const pageUrl = new URL(url);
  const response = await fetch(pageUrl, { redirect: 'follow' });

  if (!response.ok) {
    failures.push(`Public URL returned HTTP ${response.status}: ${url}`);
    return { visibleText: '', combinedSource: '' };
  }

  const html = await response.text();
  const scriptUrls = collectNextScriptUrls(html, pageUrl);
  const scripts = await Promise.all(scriptUrls.map(fetchText));
  const readableHtml = html.replace(/<script[\s\S]*?<\/script>/gi, ' ');

  console.log(`[check] Downloaded ${scriptUrls.length} same-origin Next.js script assets`);
  return {
    visibleText: decodeHtmlEntities(stripTags(readableHtml)),
    combinedSource: [html, ...scripts.filter(Boolean)].join('\n'),
  };
}

function collectNextScriptUrls(html, pageUrl) {
  const urls = new Set();
  const scriptSrcPattern = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  let match = scriptSrcPattern.exec(html);

  while (match) {
    const candidate = new URL(match[1], pageUrl);

    if (candidate.origin === pageUrl.origin && candidate.pathname.includes('/_next/static/')) {
      urls.add(candidate.href);
    }

    match = scriptSrcPattern.exec(html);
  }

  return [...urls];
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: 'follow' });

  if (!response.ok) {
    failures.push(`Could not fetch script asset HTTP ${response.status}: ${url}`);
    return '';
  }

  return response.text();
}

function stripTags(html) {
  return html.replace(/<[^>]*>/g, ' ');
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function checkPublicStrings(visibleText) {
  for (const expected of requiredPublicStrings) {
    if (!visibleText.includes(expected)) {
      failures.push(`Public URL is missing latest-build string: "${expected}"`);
    }
  }
}

function checkPendoInstall(source, expectedKey) {
  const checks = [
    ['Pendo CDN loader', 'cdn.pendo.io/agent/static'],
    ['Pendo initialize call', 'pendo.initialize'],
    ['Novus/Pendo status text', 'Novus/Pendo connected'],
    ['Pendo install key', expectedKey],
  ];

  for (const [label, expected] of checks) {
    if (!source.includes(expected)) {
      failures.push(`Public bundle is missing ${label}: "${expected}"`);
    }
  }
}

async function checkDevpostMaterials() {
  const draftPath = resolve(repoRoot, 'mind-the-product-2026/devpost-submission-draft.md');
  const checklistPath = resolve(repoRoot, 'mind-the-product-2026/submission-checklist.md');
  const videoScriptPath = resolve(repoRoot, 'mind-the-product-2026/video-script.md');
  const galleryImagePath = resolve(repoRoot, 'launchproof-devpost-gallery.png');

  const draft = await readRequiredFile(draftPath);
  const checklist = await readRequiredFile(checklistPath);
  const videoScript = await readRequiredFile(videoScriptPath);

  for (const section of requiredDevpostSections) {
    if (!draft.includes(section)) {
      failures.push(`Devpost draft is missing section or field: ${section}`);
    }
  }

  for (const item of requiredChecklistItems) {
    if (!checklist.includes(item)) {
      failures.push(`Submission checklist is missing required item: ${item}`);
    }
  }

  if (!videoScript.includes('Novus/Pendo dashboard screenshot')) {
    failures.push('Video script does not mention the Novus/Pendo dashboard screenshot.');
  }

  if (!isNonEmptyFile(galleryImagePath)) {
    failures.push(`Devpost gallery image is missing or empty: ${galleryImagePath}`);
  }

  if (!draft.includes(publicUrl)) {
    warnings.push(`Devpost draft App URL does not exactly match checked URL: ${publicUrl}`);
  }
}

async function readRequiredFile(path) {
  if (!isNonEmptyFile(path)) {
    failures.push(`Required material file is missing or empty: ${path}`);
    return '';
  }

  return readFile(path, 'utf8');
}

function checkExternalSubmissionEvidence() {
  if (!dashboardScreenshot) {
    failures.push('Missing --dashboard-screenshot path for the Novus/Pendo dashboard evidence.');
  } else if (!isNonEmptyFile(resolve(repoRoot, dashboardScreenshot))) {
    failures.push(`Novus/Pendo dashboard screenshot is missing or empty: ${dashboardScreenshot}`);
  }

  if (!demoVideoUrl) {
    failures.push('Missing --demo-video-url for the uploaded under-3-minute demo video.');
  } else if (!/^https?:\/\/\S+\.\S+/.test(demoVideoUrl)) {
    failures.push(`Demo video URL is not a valid http(s) URL: ${demoVideoUrl}`);
  }
}

function isNonEmptyFile(path) {
  try {
    return existsSync(path) && statSync(path).isFile() && statSync(path).size > 0;
  } catch (error) {
    console.error(`[fail] Could not inspect file: ${path}`);
    console.error(error);
    return false;
  }
}
