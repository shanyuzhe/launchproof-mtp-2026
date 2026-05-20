#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const APP_URL = 'https://shanyuzhe.github.io/launchproof-mtp-2026/';
const SCREENSHOT = 'novus-pendo-dashboard.png';
const DEMO_VIDEO = 'launchproof-demo-video.webm';
const MAX_DEMO_SECONDS = 180;
const VIDEO_FETCH_TIMEOUT_MS = 20000;
const ALLOWED_VIDEO_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'vimeo.com',
  'www.vimeo.com',
  'youku.com',
  'www.youku.com',
];

main().catch((error) => {
  console.error('[fail] Final submit check crashed.');
  console.error(error);
  process.exit(1);
});

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const videoUrl = options.videoUrl || process.env.DEMO_VIDEO_URL;
  const screenshotSource = options.screenshot || process.env.NOVUS_SCREENSHOT;

  if (!videoUrl) {
    fail(`Missing demo video URL. ${usage()}`);
  }

  if (!/^https?:\/\/\S+\.\S+/.test(videoUrl)) {
    fail(`Demo video URL must be a public http(s) URL: ${videoUrl}`);
  }

  if (!isAllowedDemoVideoHost(videoUrl)) {
    fail(`Demo video URL must be hosted on YouTube, Vimeo, or Youku: ${videoUrl}`);
  }

  const placeholderReason = getPlaceholderDemoVideoReason(videoUrl);

  if (placeholderReason) {
    fail(`Demo video URL still looks like a placeholder: ${placeholderReason}`);
  }

  await assertDemoVideoUrlReachable(videoUrl);
  assertLocalDemoVideo();

  if (screenshotSource) {
    importExplicitScreenshot(screenshotSource);
  }

  importScreenshotIfMissing();

  assertScreenshotImage();

  const args = [
    'run',
    'verify:launchproof',
    '--',
    '--url',
    APP_URL,
    '--dashboard-screenshot',
    SCREENSHOT,
    '--demo-video-url',
    videoUrl,
  ];

  const child = spawn('npm.cmd', args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: false,
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      process.exit(code ?? 1);
    }

    if (options.syncDocs) {
      syncVideoUrlDocs(videoUrl);
    }

    console.log('[pass] Final submit check passed.');
    process.exit(0);
  });
}

function parseArgs(args) {
  const options = {
    screenshot: '',
    syncDocs: false,
    videoUrl: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--sync-docs') {
      options.syncDocs = true;
      continue;
    }

    if (arg === '--screenshot') {
      const next = args[index + 1];

      if (!next) {
        fail(`Missing value for --screenshot. ${usage()}`);
      }

      options.screenshot = next;
      index += 1;
      continue;
    }

    if (arg.startsWith('--screenshot=')) {
      options.screenshot = arg.slice('--screenshot='.length);
      continue;
    }

    if (arg.startsWith('--')) {
      fail(`Unknown option: ${arg}. ${usage()}`);
    }

    if (options.videoUrl) {
      fail(`Unexpected extra argument: ${arg}. ${usage()}`);
    }

    options.videoUrl = arg;
  }

  return options;
}

function usage() {
  return 'Usage: node scripts/final-submit-check.mjs <youtube|vimeo|youku-url> [--screenshot <path>] [--sync-docs]';
}

function fail(message) {
  console.error(`[fail] ${message}`);
  process.exit(1);
}

function isAllowedDemoVideoHost(value) {
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return ALLOWED_VIDEO_HOSTS.includes(hostname);
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function assertDemoVideoUrlReachable(value) {
  const result = await inspectDemoVideoUrl(value);

  if (!result.ok) {
    fail(result.message);
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
  const response = await fetchWithTimeout(endpoint);

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
  const response = await fetchWithTimeout(value);

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

async function fetchWithTimeout(url) {
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
    fail(`Could not fetch demo video evidence URL: ${url}. ${error.message}`);
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

function assertLocalDemoVideo() {
  const videoPath = resolve(process.cwd(), DEMO_VIDEO);

  if (!existsSync(videoPath)) {
    fail(`Missing local demo video file: ${DEMO_VIDEO}`);
  }

  const stat = statSync(videoPath);

  if (!stat.isFile() || stat.size === 0) {
    fail(`Local demo video is empty or not a file: ${DEMO_VIDEO}`);
  }

  const durationSeconds = readWebmDurationSeconds(videoPath);

  if (!Number.isFinite(durationSeconds)) {
    fail(`Could not read WebM duration from: ${DEMO_VIDEO}`);
  }

  if (durationSeconds >= MAX_DEMO_SECONDS) {
    fail(`Local demo video must be under 3 minutes; current duration is ${durationSeconds.toFixed(1)} seconds.`);
  }

  console.log(`[check] Local demo video duration: ${durationSeconds.toFixed(1)} seconds`);
}

function assertScreenshotImage() {
  const screenshotPath = resolve(process.cwd(), SCREENSHOT);

  if (!existsSync(screenshotPath)) {
    fail(`Missing required Novus/Pendo screenshot: ${SCREENSHOT}`);
  }

  const stat = statSync(screenshotPath);

  if (!stat.isFile() || stat.size === 0) {
    fail(`Novus/Pendo screenshot is empty or not a file: ${SCREENSHOT}`);
  }

  const dimensions = readImageDimensions(screenshotPath);

  if (!dimensions) {
    fail(`Novus/Pendo screenshot must be a valid PNG or JPEG image: ${SCREENSHOT}`);
  }

  if (dimensions.width < 600 || dimensions.height < 350) {
    fail(
      `Novus/Pendo screenshot is too small to prove dashboard context: ${dimensions.width}x${dimensions.height}`,
    );
  }

  console.log(`[check] Novus/Pendo screenshot dimensions: ${dimensions.width}x${dimensions.height}`);
}

function importScreenshotIfMissing() {
  const screenshotPath = resolve(process.cwd(), SCREENSHOT);

  if (existsSync(screenshotPath)) {
    return;
  }

  console.log(`[check] ${SCREENSHOT} not found; searching common screenshot folders`);
  const result = spawnSync(process.execPath, ['scripts/import-novus-screenshot.mjs'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: false,
  });

  if (result.status !== 0) {
    console.warn(`[warn] Could not auto-import ${SCREENSHOT}. Save the Novus/Pendo dashboard image, then rerun.`);
  }
}

function importExplicitScreenshot(source) {
  const resolvedSource = resolve(source);
  const screenshotPath = resolve(process.cwd(), SCREENSHOT);

  if (resolvedSource === screenshotPath) {
    return;
  }

  console.log(`[check] Importing explicit Novus/Pendo screenshot: ${resolvedSource}`);
  const result = spawnSync(process.execPath, ['scripts/import-novus-screenshot.mjs', resolvedSource], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: false,
  });

  if (result.status !== 0) {
    fail(`Could not import explicit Novus/Pendo screenshot: ${resolvedSource}`);
  }
}

function syncVideoUrlDocs(videoUrl) {
  updateTextFile('mind-the-product-2026/final-submit-pack.md', (source) =>
    source.replace(/- Demo video: .*/u, `- Demo video: ${videoUrl}`),
  );

  updateTextFile('mind-the-product-2026/devpost-paste-fields.md', (source) =>
    source.replace(
      /## Video Demo Link\r?\n\r?\n.*(?:\r?\n)/u,
      `## Video Demo Link\n\n${videoUrl}\n`,
    ),
  );

  console.log('[check] Synced demo video URL into final-submit-pack.md and devpost-paste-fields.md');
}

function updateTextFile(relativePath, transform) {
  const absolutePath = resolve(process.cwd(), relativePath);

  if (!existsSync(absolutePath)) {
    fail(`Cannot sync docs because file is missing: ${relativePath}`);
  }

  const before = readFileSync(absolutePath, 'utf8');
  const after = transform(before);

  if (after === before) {
    console.log(`[check] No doc sync change needed: ${relativePath}`);
    return;
  }

  writeFileSync(absolutePath, after);
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

function readWebmDurationSeconds(videoPath) {
  const bytes = readFileSync(videoPath);
  const durationId = Buffer.from([0x44, 0x89]);
  const scaleId = Buffer.from([0x2a, 0xd7, 0xb1]);
  const timecodeScale = readTimecodeScale(bytes, scaleId);
  const durationRaw = readDurationRaw(bytes, durationId);

  return (durationRaw * timecodeScale) / 1e9;
}

function readTimecodeScale(bytes, scaleId) {
  const offset = bytes.indexOf(scaleId);

  if (offset < 0) {
    return 1000000;
  }

  const size = readVint(bytes, offset + scaleId.length);

  if (size.value <= 0 || size.value > 8) {
    return 1000000;
  }

  return readUnsigned(bytes, offset + scaleId.length + size.length, size.value);
}

function readDurationRaw(bytes, durationId) {
  const offset = bytes.indexOf(durationId);

  if (offset < 0) {
    fail('No WebM Duration element found in the local demo video.');
  }

  const size = readVint(bytes, offset + durationId.length);
  const dataOffset = offset + durationId.length + size.length;

  if (size.value === 4) {
    return bytes.readFloatBE(dataOffset);
  }

  if (size.value === 8) {
    return bytes.readDoubleBE(dataOffset);
  }

  fail(`Unsupported WebM Duration size: ${size.value}`);
}

function readVint(bytes, offset) {
  const first = bytes[offset];
  let mask = 0x80;
  let length = 1;

  while (length <= 8 && !(first & mask)) {
    mask >>= 1;
    length += 1;
  }

  if (length > 8) {
    fail(`Invalid EBML variable integer at byte ${offset}`);
  }

  let value = first & (mask - 1);

  for (let index = 1; index < length; index += 1) {
    value = value * 256 + bytes[offset + index];
  }

  return { length, value };
}

function readUnsigned(bytes, offset, length) {
  let value = 0;

  for (let index = 0; index < length; index += 1) {
    value = value * 256 + bytes[offset + index];
  }

  return value;
}
