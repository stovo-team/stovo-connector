#!/usr/bin/env node
import { runCli } from '../src/main.mjs';

runCli().catch((error) => {
  const text = String(error instanceof Error ? error.message : error).replace(/(bearer\s+)[^\s]+/gi, '$1[redacted]').slice(0, 300);
  process.stderr.write(`Connector operation failed: ${text}\n`);
  process.exitCode = 1;
});
