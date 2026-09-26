import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'esbuild';

const directory = await mkdtemp(join(tmpdir(), 'release-social-action-'));
const candidate = join(directory, 'index.cjs');

try {
  await build({
    entryPoints: ['src/action/main.ts'],
    outfile: candidate,
    bundle: true,
    platform: 'node',
    target: ['node24'],
    format: 'cjs',
    sourcemap: false,
    minify: false,
    legalComments: 'none',
    logLevel: 'silent',
  });
  const [committed, rebuilt] = await Promise.all([
    readFile('action-dist/index.cjs'),
    readFile(candidate),
  ]);
  if (!committed.equals(rebuilt)) {
    process.stderr.write('Committed Action bundle differs from source. Run npm run bundle:action and commit action-dist/index.cjs.\n');
    process.exitCode = 1;
  }
} finally {
  await rm(directory, { recursive: true, force: true });
}
