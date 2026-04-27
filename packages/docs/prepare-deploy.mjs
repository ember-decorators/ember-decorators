#!/usr/bin/env node

/**
 * Prepare docs build output for gh-pages deployment.
 *
 * Expects a production build in dist/ where rootURL and deploy-version are
 * left as ADDON_DOCS_ROOT_URL / ADDON_DOCS_DEPLOY_VERSION tokens
 * (the default ember-cli-addon-docs production build behaviour).
 *
 * Writes a publish directory containing:
 * - Root files (latest version)
 * - versions/<version>/ (versioned copy)
 * - versions.json (merged with existing manifest from gh-pages)
 * - 404.html (SPA redirect)
 */

import { execSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DOCS_ROOT = __dirname;
const REPO_ROOT = resolve(__dirname, '../..');
const DIST = join(DOCS_ROOT, 'dist');
const ROOT_URL = '/ember-decorators/';
const TEMPLATE_404 = join(
  DOCS_ROOT,
  'node_modules/ember-cli-addon-docs/vendor/ember-cli-addon-docs/404.html',
);

// Three ROOT_URL patterns in order: URL-encoded form in meta tags,
// slash-delimited form, then bare/partial form (catches remaining).
function replaceTokens(contents, rootURL, versionInfo) {
  return contents
    .replace(/%2FADDON_DOCS_ROOT_URL%2F/g, encodeURIComponent(rootURL))
    .replace(/\/ADDON_DOCS_ROOT_URL\//g, rootURL)
    .replace(/\/?ADDON_DOCS_ROOT_URL\/?/g, rootURL)
    .replace(
      /%22ADDON_DOCS_DEPLOY_VERSION%22/g,
      encodeURIComponent(JSON.stringify(versionInfo)),
    );
}

function rewriteDir(dir, rootURL, versionInfo) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      rewriteDir(fullPath, rootURL, versionInfo);
    } else if (entry.isFile()) {
      const before = readFileSync(fullPath, 'utf-8');
      const after = replaceTokens(before, rootURL, versionInfo);
      if (after !== before) writeFileSync(fullPath, after);
    }
  }
}

function resolveDeployInfo() {
  const tagIdx = process.argv.indexOf('--tag');
  const tag = (tagIdx !== -1 ? process.argv[tagIdx + 1] : null) || process.env.DEPLOY_TAG;

  if (!tag) {
    console.error('No tag provided. Pass --tag <tag> or set DEPLOY_TAG.');
    process.exit(1);
  }

  const shaIdx = process.argv.indexOf('--sha');
  const sha =
    (shaIdx !== -1 ? process.argv[shaIdx + 1] : null) ||
    process.env.DEPLOY_SHA ||
    execSync(`git rev-list -1 ${tag}`, { encoding: 'utf-8', cwd: REPO_ROOT }).trim();

  return { tag, sha };
}

function copyBuild(destDir, rootURL, versionInfo) {
  mkdirSync(destDir, { recursive: true });
  cpSync(DIST, destDir, { recursive: true });
  rewriteDir(destDir, rootURL, versionInfo);
}

function updateVersionsJson(outDir, versionInfo, latestInfo) {
  const versions = fetchExistingVersions();

  versions[versionInfo.name] = versionInfo;
  versions['-latest'] = latestInfo;

  writeFileSync(
    join(outDir, 'versions.json'),
    JSON.stringify(versions, null, 2) + '\n',
  );

  return versions;
}

function fetchExistingVersions() {
  try {
    const raw = execSync(
      'git show upstream/gh-pages:versions.json 2>/dev/null || git show origin/gh-pages:versions.json 2>/dev/null',
      { encoding: 'utf-8', cwd: REPO_ROOT },
    );
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function generate404(outDir, versions) {
  const redirects = {};
  for (const entry of Object.values(versions)) {
    if (entry.oldPath) redirects[entry.oldPath] = entry.path;
  }

  const segmentCount = ROOT_URL.replace(/^\/|\/$/g, '').split('/').length;
  const html = readFileSync(TEMPLATE_404, 'utf-8')
    .replace(/\bADDON_DOCS_SEGMENT_COUNT\b/g, String(segmentCount))
    .replace(/\bADDON_DOCS_REDIRECTS\b/, JSON.stringify(redirects));

  writeFileSync(join(outDir, '404.html'), html);
  return redirects;
}

function main() {
  const outIdx = process.argv.indexOf('--out');
  if (outIdx !== -1 && !process.argv[outIdx + 1]) {
    console.error('--out requires a directory path.');
    process.exit(1);
  }
  const outDir = resolve(outIdx !== -1 ? process.argv[outIdx + 1] : 'deploy');

  if (!existsSync(DIST)) {
    console.error(`No build output at ${DIST}. Run "pnpm build" first.`);
    process.exit(1);
  }

  const { tag, sha } = resolveDeployInfo();
  console.log(`Preparing deploy for ${tag} (${sha.slice(0, 8)})`);

  const versionInfo = { path: `versions/${tag}`, name: tag, sha, tag };
  const latestInfo = { path: '', name: 'Latest', sha, tag };

  copyBuild(join(outDir, 'versions', tag), `${ROOT_URL}versions/${tag}/`, versionInfo);
  copyBuild(outDir, ROOT_URL, latestInfo);

  const versions = updateVersionsJson(outDir, versionInfo, latestInfo);
  const redirects = generate404(outDir, versions);

  console.log(`Output: ${outDir}`);
  console.log(`versions.json: ${Object.keys(versions).length} entries`);
  console.log(`404.html: ${Object.keys(redirects).length} redirects`);
}

main();
