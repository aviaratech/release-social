import { runAction } from './run.js';

void runAction()
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unexpected action failure.';
    process.stderr.write(JSON.stringify({ error: message.slice(0, 1000) }) + '\n');
    process.exitCode = 1;
  });
