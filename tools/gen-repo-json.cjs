#!/usr/bin/env node

// Generates repo.json (the webOS Homebrew Repository manifest) from the
// IPK built in the current working directory. Expects REPO_NAME and
// TAG_NAME in the environment so version metadata tracks the release
// being published rather than whatever happens to be checked out — this
// matters when the workflow switches branches between build and commit.

const fs = require('fs');
const crypto = require('crypto');

const appinfo = require('../assets/appinfo.json');

const repoName = process.env.REPO_NAME;
const tagName = process.env.TAG_NAME;

if (!repoName) {
  console.error('REPO_NAME env var required');
  process.exit(1);
}
if (!tagName) {
  console.error('TAG_NAME env var required');
  process.exit(1);
}

const ipkFile = `${appinfo.id}_${tagName}_all.ipk`;
if (!fs.existsSync(ipkFile)) {
  console.error(`IPK file not found in cwd: ${ipkFile}`);
  process.exit(1);
}

const sha256 = crypto
  .createHash('sha256')
  .update(fs.readFileSync(ipkFile))
  .digest('hex');

const ipkUrl = `https://github.com/${repoName}/releases/download/${tagName}/${ipkFile}`;
const iconUri = `https://raw.githubusercontent.com/${repoName}/main/assets/icon.png`;
const sourceUrl = `https://github.com/${repoName}`;

const manifest = {
  id: appinfo.id,
  version: tagName,
  type: appinfo.type || 'web',
  title: appinfo.title,
  appDescription: appinfo.title,
  iconUri,
  sourceUrl,
  rootRequired: false,
  ipkUrl,
  ipkHash: { sha256 }
};

const repoData = {
  paging: { page: 1, count: 1, maxPage: 1, itemsTotal: 1 },
  packages: [
    {
      id: appinfo.id,
      title: appinfo.title,
      description: appinfo.title,
      iconUri,
      manifest
    }
  ]
};

fs.writeFileSync('repo.json', JSON.stringify(repoData, null, 2) + '\n');
console.log(`repo.json updated for ${tagName} (sha256: ${sha256})`);
