#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const APP_URL = 'https://shanyuzhe.github.io/launchproof-mtp-2026/';
const SCREENSHOT = 'novus-pendo-dashboard.png';
const DEMO_VIDEO = 'launchproof-demo-video.webm';
const MAX_DEMO_SECONDS = 180;
const ALLOWED_VIDEO_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'vimeo.com',
  'www.vimeo.com',
  'youku.com',
  'www.youku.com',
];

main();

function main() {
  const videoUrl = process.argv[2] || process.env.DEMO_VIDEO_URL;

  if (!videoUrl) {
    fail('Missing demo video URL. Usage: node scripts/final-submit-check.mjs https://...');
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

  assertLocalDemoVideo();

  if (!existsSync(resolve(process.cwd(), SCREENSHOT))) {
    fail(`Missing required Novus/Pendo screenshot: ${SCREENSHOT}`);
  }

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
    process.exit(code ?? 1);
  });
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
