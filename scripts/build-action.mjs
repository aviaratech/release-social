import { build } from 'esbuild';

const outfile = process.argv[2] ?? 'action-dist/index.cjs';

await build({
  entryPoints: ['src/action/main.ts'],
  outfile,
  bundle: true,
  platform: 'node',
  target: ['node24'],
  format: 'cjs',
  sourcemap: false,
  minify: false,
  legalComments: 'none',
  logLevel: 'warning',
});
