#!/usr/bin/env node

import { existsSync, readFileSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_URL = 'https://shanyuzhe.github.io/launchproof-mtp-2026/';
const DEFAULT_PENDO_KEY = 'e8d019ac-2123-45c3-80b7-a171a94a8fb0';
const FETCH_ATTEMPTS = 3;
const FETCH_TIMEOUT_MS = 20000;
const VIDEO_FETCH_TIMEOUT_MS = 20000;
const allowedVideoHosts = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'vimeo.com',
  'www.vimeo.com',
  'youku.com',
  'www.youku.com',
];

const requiredPublicStrings = [
  'Launch decision',
  'Run Judge Demo',
  '90-second judge path',
  'Reset Demo',
  'Sample products',
  'MeetingBridge',
  '?sample=meetingbridge',
  'Resilience',
  'Resilience before shippedness',
  'Hackathon scorecard',
  'Readiness rationale',
  'Launch proof loop',
  'Proof status',
  'Behavior coverage',
  'AI builder provenance',
  'Codex and GPT-5',
  'Why this should win',
  'Measurable shippedness',
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
  '- MeetingBridge sample:',
  '- Source:',
];

const requiredChecklistItems = [
  'Hosted live demo',
  'Public GitHub repository',
  'Novus.ai installed through the Pendo Web SDK',
  'Novus.ai/Pendo receives real user events on the currently deployed build',
  'Novus.ai dashboard screenshot captured',
  'AI Builder provenance doc reviewed',
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
  await checkExternalSubmissionEvidence();

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
  const response = await fetchWithRetry(pageUrl.href);

  if (!response) {
    failures.push(`Public URL could not be fetched after ${FETCH_ATTEMPTS} attempts: ${url}`);
    return { visibleText: '', combinedSource: '' };
  }

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
  const response = await fetchWithRetry(url);

  if (!response) {
    failures.push(`Could not fetch script asset after ${FETCH_ATTEMPTS} attempts: ${url}`);
    return '';
  }

  if (!response.ok) {
    failures.push(`Could not fetch script asset HTTP ${response.status}: ${url}`);
    return '';
  }

  return response.text();
}

async function fetchWithRetry(url) {
  let lastError;

  for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      return await fetch(url, {
        redirect: 'follow',
        signal: controller.signal,
      });
    } catch (error) {
      lastError = error;
      console.warn(`[warn] Fetch attempt ${attempt}/${FETCH_ATTEMPTS} failed for ${url}: ${error.message}`);
      if (attempt < FETCH_ATTEMPTS) {
        await sleep(1000 * attempt);
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  console.error(`[fail] Fetch failed for ${url}`);
  console.error(lastError);
  return null;
}

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
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
    ['Novus/Pendo status text', 'Novus/Pendo SDK initialized'],
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
  const judgingMatrixPath = resolve(repoRoot, 'mind-the-product-2026/judging-evidence-matrix.md');
  const provenancePath = resolve(repoRoot, 'mind-the-product-2026/ai-builder-provenance.md');
  const eventRefreshPath = resolve(repoRoot, 'mind-the-product-2026/latest-public-event-refresh.json');
  const videoScriptPath = resolve(repoRoot, 'mind-the-product-2026/video-script.md');
  const galleryImagePath = resolve(repoRoot, 'launchproof-devpost-gallery.png');
  const resilienceImagePath = resolve(repoRoot, 'launchproof-resilience-review.png');
  const mobileResilienceImagePath = resolve(repoRoot, 'launchproof-mobile-resilience.png');
  const behaviorCoverageImagePath = resolve(repoRoot, 'launchproof-behavior-coverage.png');

  const draft = await readRequiredFile(draftPath);
  const checklist = await readRequiredFile(checklistPath);
  const judgingMatrix = await readRequiredFile(judgingMatrixPath);
  const provenance = await readRequiredFile(provenancePath);
  const eventRefresh = await readRequiredFile(eventRefreshPath);
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

  for (const expected of ['Codex and GPT-5', 'not presented as an autonomous runtime AI agent', 'Reproducible artifacts']) {
    if (!provenance.includes(expected)) {
      failures.push(`AI builder provenance doc is missing required proof text: ${expected}`);
    }
  }

  checkEventRefreshEvidence(eventRefreshPath, eventRefresh);

  for (const criterion of ['Product Thinking', 'Craft and Execution', 'Originality and Ambition', 'Shippedness']) {
    if (!judgingMatrix.includes(criterion)) {
      failures.push(`Judging evidence matrix is missing criterion: ${criterion}`);
    }
  }

  if (!isNonEmptyFile(galleryImagePath)) {
    failures.push(`Devpost gallery image is missing or empty: ${galleryImagePath}`);
  }

  if (!isNonEmptyFile(resilienceImagePath)) {
    failures.push(`Resilience gallery image is missing or empty: ${resilienceImagePath}`);
  }

  if (!isNonEmptyFile(mobileResilienceImagePath)) {
    failures.push(`Mobile resilience evidence image is missing or empty: ${mobileResilienceImagePath}`);
  }

  if (!isNonEmptyFile(behaviorCoverageImagePath)) {
    failures.push(`Behavior coverage gallery image is missing or empty: ${behaviorCoverageImagePath}`);
  }

  if (!draft.includes(publicUrl)) {
    warnings.push(`Devpost draft App URL does not exactly match checked URL: ${publicUrl}`);
  }
}

function checkEventRefreshEvidence(path, source) {
  let evidence;

  try {
    evidence = JSON.parse(source);
  } catch (error) {
    failures.push(`Latest public event refresh evidence is not valid JSON: ${path}`);
    console.error(error);
    return;
  }

  if (evidence.passed !== true) {
    failures.push('Latest public event refresh evidence did not pass.');
  }

  if (!evidence.pageEvidence?.coverageText?.includes('7/7')) {
    failures.push('Latest public event refresh evidence does not show 7/7 behavior coverage.');
  }

  if (evidence.pendo?.scriptLoaded !== true) {
    failures.push('Latest public event refresh evidence did not observe a successful Pendo script load.');
  }

  if (evidence.pendo?.dataAccepted !== true) {
    failures.push('Latest public event refresh evidence did not observe successful Pendo data acceptance.');
  }

  const dataResponse = evidence.pendo?.responses?.some(
    (response) => response.url?.includes('data.pendo.io/data/rec') && response.status >= 200 && response.status < 400,
  );

  if (!dataResponse) {
    failures.push('Latest public event refresh evidence is missing a successful data.pendo.io/data/rec response.');
  }

  if (evidence.checkedAt) {
    const ageMs = Date.now() - Date.parse(evidence.checkedAt);

    if (Number.isFinite(ageMs) && ageMs > 7 * 24 * 60 * 60 * 1000) {
      warnings.push(`Latest public event refresh evidence is older than 7 days: ${evidence.checkedAt}`);
    }
  }
}

async function readRequiredFile(path) {
  if (!isNonEmptyFile(path)) {
    failures.push(`Required material file is missing or empty: ${path}`);
    return '';
  }

  return readFile(path, 'utf8');
}

async function checkExternalSubmissionEvidence() {
  if (!dashboardScreenshot) {
    failures.push('Missing --dashboard-screenshot path for the Novus/Pendo dashboard evidence.');
    return;
  }

  const screenshotName = basename(dashboardScreenshot).toLowerCase();

  if (!screenshotName.includes('novus') && !screenshotName.includes('pendo')) {
    failures.push(`Dashboard screenshot filename should clearly identify Novus/Pendo evidence: ${dashboardScreenshot}`);
  }

  const screenshotPath = resolve(repoRoot, dashboardScreenshot);

  if (!isNonEmptyFile(screenshotPath)) {
    failures.push(`Novus/Pendo dashboard screenshot is missing or empty: ${dashboardScreenshot}`);
  } else {
    const dimensions = readImageDimensions(screenshotPath);

    if (!dimensions) {
      failures.push(`Novus/Pendo dashboard screenshot must be a valid PNG or JPEG image: ${dashboardScreenshot}`);
    } else if (dimensions.width < 600 || dimensions.height < 350) {
      failures.push(
        `Novus/Pendo dashboard screenshot is too small to prove dashboard context: ${dimensions.width}x${dimensions.height}`,
      );
    }
  }

  if (!demoVideoUrl) {
    failures.push('Missing --demo-video-url for the uploaded under-3-minute demo video.');
  } else if (!/^https?:\/\/\S+\.\S+/.test(demoVideoUrl)) {
    failures.push(`Demo video URL is not a valid http(s) URL: ${demoVideoUrl}`);
  } else if (!isAllowedDemoVideoHost(demoVideoUrl)) {
    failures.push(`Demo video URL must be hosted on YouTube, Vimeo, or Youku: ${demoVideoUrl}`);
  } else {
    const placeholderReason = getPlaceholderDemoVideoReason(demoVideoUrl);

    if (placeholderReason) {
      failures.push(`Demo video URL still looks like a placeholder: ${placeholderReason}`);
    } else {
      await checkDemoVideoUrlReachable(demoVideoUrl);
    }
  }
}

function isAllowedDemoVideoHost(value) {
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return allowedVideoHosts.includes(hostname);
  } catch (error) {
    console.error(`[fail] Could not parse demo video URL: ${value}`);
    console.error(error);
    return false;
  }
}

async function checkDemoVideoUrlReachable(value) {
  const result = await inspectDemoVideoUrl(value);

  if (!result.ok) {
    failures.push(result.message);
    return;
  }

  console.log(`[check] Demo video URL resolves publicly: ${result.label}`);
}

async function inspectDemoVideoUrl(value) {
  let url;

  try {
    url = new URL(value);
  } catch (error) {
    return {
      ok: false,
      message: `Could not parse demo video URL: ${error.message}`,
    };
  }

  const hostname = url.hostname.toLowerCase();

  if (hostname === 'youtu.be' || hostname === 'youtube.com' || hostname === 'www.youtube.com') {
    return checkOEmbedUrl(
      'YouTube',
      `https://www.youtube.com/oembed?url=${encodeURIComponent(value)}&format=json`,
    );
  }

  if (hostname === 'vimeo.com' || hostname === 'www.vimeo.com') {
    return checkOEmbedUrl('Vimeo', `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(value)}`);
  }

  return checkPublicVideoPage('Youku', value);
}

async function checkOEmbedUrl(label, endpoint) {
  const response = await fetchVideoEvidence(endpoint);

  if (!response.ok) {
    return {
      ok: false,
      message: `${label} could not resolve the demo video via oEmbed (HTTP ${response.status}). Confirm the URL is real and public or unlisted.`,
    };
  }

  const text = await response.text();
  let payload;

  try {
    payload = JSON.parse(text);
  } catch (error) {
    return {
      ok: false,
      message: `${label} oEmbed returned invalid JSON: ${error.message}`,
    };
  }

  if (!payload.title || !payload.html) {
    return {
      ok: false,
      message: `${label} oEmbed response is missing title/html metadata.`,
    };
  }

  return {
    ok: true,
    label: `${label} - ${payload.title}`,
  };
}

async function checkPublicVideoPage(label, value) {
  const response = await fetchVideoEvidence(value);

  if (!response.ok) {
    return {
      ok: false,
      message: `${label} demo video page returned HTTP ${response.status}. Confirm the URL is real and public.`,
    };
  }

  const source = (await response.text()).toLowerCase();
  const unavailableMarkers = [
    'video unavailable',
    'video not found',
    'page not found',
    'private video',
    'this video is unavailable',
  ];
  const marker = unavailableMarkers.find((candidate) => source.includes(candidate));

  if (marker) {
    return {
      ok: false,
      message: `${label} demo video page appears unavailable: ${marker}`,
    };
  }

  return {
    ok: true,
    label,
  };
}

async function fetchVideoEvidence(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), VIDEO_FETCH_TIMEOUT_MS);

  try {
    return await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 LaunchProof final checker',
      },
    });
  } catch (error) {
    return {
      ok: false,
      status: `fetch failed: ${error.message}`,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function getPlaceholderDemoVideoReason(value) {
  const normalized = value.toLowerCase();
  const placeholderTokens = ['example', 'placeholder', 'todo', 'your-', 'video-id', '<', '>', '...'];
  const token = placeholderTokens.find((candidate) => normalized.includes(candidate));

  if (token) {
    return `contains "${token}"`;
  }

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    const pathParts = url.pathname.split('/').filter(Boolean);

    if (hostname === 'youtu.be' && pathParts.length === 0) {
      return 'missing youtu.be video id';
    }

    if (hostname.endsWith('youtube.com') && url.pathname === '/watch' && !url.searchParams.get('v')) {
      return 'missing YouTube watch v parameter';
    }

    if ((hostname.includes('vimeo.com') || hostname.includes('youku.com')) && pathParts.length === 0) {
      return `missing ${hostname} video path`;
    }
  } catch (error) {
    return `could not parse URL: ${error.message}`;
  }

  return '';
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

function readImageDimensions(imagePath) {
  const bytes = readFileSync(imagePath);

  if (bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return {
      width: bytes.readUInt32BE(16),
      height: bytes.readUInt32BE(20),
    };
  }

  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    return readJpegDimensions(bytes);
  }

  return null;
}

function readJpegDimensions(bytes) {
  let offset = 2;

  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      return null;
    }

    const marker = bytes[offset + 1];
    const length = bytes.readUInt16BE(offset + 2);

    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        height: bytes.readUInt16BE(offset + 5),
        width: bytes.readUInt16BE(offset + 7),
      };
    }

    offset += 2 + length;
  }

  return null;
}
