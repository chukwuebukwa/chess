/**
 * Convert a PGN file into a committed opening module — the build-time companion
 * to the in-app paste box, for curated/bundled content.
 *
 * Usage:
 *   npm run pgn:convert -- <file.pgn> --name "Caro-Kann Defense" --side black \
 *     [--out src/chess/openings/caroKann.ts]
 *
 * Prints the generated TypeScript to stdout, or writes it to --out. Every move
 * is validated through the same compileLine the app uses, so a bad PGN fails
 * here instead of shipping a broken opening.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { buildImportedOpening } from '../src/chess/importOpening';
import type { Side } from '../src/chess/types';

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

const args = process.argv.slice(2);
let input: string | undefined;
let name = '';
let side: Side = 'white';
let out: string | undefined;

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i]!;
  if (arg === '--name') name = args[(i += 1)] ?? '';
  else if (arg === '--out') out = args[(i += 1)];
  else if (arg === '--side') {
    const value = args[(i += 1)];
    if (value !== 'white' && value !== 'black') fail('--side must be "white" or "black"');
    side = value;
  } else if (!arg.startsWith('--')) input = arg;
  else fail(`unknown option: ${arg}`);
}

if (!input) fail('provide a path to a .pgn file');
if (!name) name = input.replace(/.*[/\\]/, '').replace(/\.pgn$/i, '');

const pgn = readFileSync(input, 'utf8');
const opening = buildImportedOpening({ name, side, pgn }, new Set());

const varName = opening.id.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
const ts =
  `import type { Opening } from '../types';\n\n` +
  `export const ${varName}: Opening = ${JSON.stringify(opening, null, 2)};\n`;

if (out) {
  writeFileSync(out, ts);
  console.error(`Wrote ${opening.lines.length} lines → ${out}`);
} else {
  process.stdout.write(ts);
}
