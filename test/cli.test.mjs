import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const execFileAsync = promisify(execFile);
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const binPath = join(root, 'bin', 'stovo-connector.mjs');
const mainPath = join(root, 'src', 'main.mjs');

test('CLI --help outputs usage information via bin script', async () => {
  const { stdout } = await execFileAsync(process.execPath, [binPath, '--help']);
  assert.match(stdout, /Usage:/);
  assert.match(stdout, /stovo-connector/);
  assert.match(stdout, /pair/);
  assert.match(stdout, /start/);
});

test('CLI -h outputs usage information via main.mjs', async () => {
  const { stdout } = await execFileAsync(process.execPath, [mainPath, '-h']);
  assert.match(stdout, /Usage:/);
  assert.match(stdout, /stovo-connector/);
});

test('CLI --version outputs version', async () => {
  const { stdout } = await execFileAsync(process.execPath, [binPath, '--version']);
  assert.match(stdout, /@stovo-team\/stovo-connector v0\.1\.0/);
});
