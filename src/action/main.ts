import { runAction } from './run.js';

const exitCode = await runAction();
process.exitCode = exitCode;
