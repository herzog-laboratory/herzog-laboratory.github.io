// Hugo >= 0.16x requires the `tailwindcss` binary it executes to be a real
// Node.js script. pnpm installs a POSIX shell shim instead, which Hugo rejects
// with: `binary "tailwindcss" is not a Node.js script`.
//
// Replace the shim with a symlink to the actual CLI entrypoint. Runs on every
// install so the fix survives `pnpm install` wiping node_modules.
import { existsSync, lstatSync, rmSync, symlinkSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const bin = join(root, 'node_modules', '.bin', 'tailwindcss');
const cli = join(root, 'node_modules', '@tailwindcss', 'cli', 'dist', 'index.mjs');

if (!existsSync(cli)) {
  console.log('[fix-tailwind-bin] @tailwindcss/cli not installed; skipping.');
  process.exit(0);
}
if (existsSync(bin) && lstatSync(bin).isSymbolicLink()) {
  process.exit(0); // already linked
}
try {
  rmSync(bin, { force: true });
  symlinkSync(relative(dirname(bin), cli), bin);
  console.log('[fix-tailwind-bin] linked node_modules/.bin/tailwindcss -> @tailwindcss/cli');
} catch (err) {
  console.warn(`[fix-tailwind-bin] could not link tailwindcss binary: ${err.message}`);
}
