import type { Opening, Side } from './types';
import { parsePgnLines, pgnToOpening } from './pgn';
import { buildTree } from './tree';

/** Turn a display name into a URL/storage-safe id. */
export function slugify(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'opening';
}

/** Return `base`, or `base-2`, `base-3`, … until it is not already taken. */
export function uniqueId(base: string, taken: Set<string>): string {
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

/**
 * Give each line a readable name based on the move where it last branches away
 * from its siblings — e.g. "3...Bf5" or "4.Ng5". A lone line is the "Main line".
 * Collisions get a numeric suffix so names stay unique within an opening.
 */
export function deriveLineNames(paths: string[][]): string[] {
  if (paths.length === 1) return ['Main line'];

  const raw = paths.map((path) => {
    let divergeAt = 0;
    for (let d = 0; d < path.length; d += 1) {
      const branches = paths.some(
        (other) =>
          other !== path &&
          other.length > d &&
          other.slice(0, d).every((m, k) => m === path[k]) &&
          other[d] !== path[d],
      );
      if (branches) divergeAt = d;
    }
    const san = path[divergeAt];
    if (san === undefined) return 'Main line';
    const moveNo = Math.floor(divergeAt / 2) + 1;
    return divergeAt % 2 === 0 ? `${moveNo}.${san}` : `${moveNo}...${san}`;
  });

  return dedupeNames(raw);
}

function dedupeNames(names: string[]): string[] {
  const seen = new Map<string, number>();
  return names.map((name) => {
    const count = seen.get(name) ?? 0;
    seen.set(name, count + 1);
    return count === 0 ? name : `${name} (${count + 1})`;
  });
}

export interface ImportInput {
  name: string;
  side: Side;
  pgn: string;
}

/**
 * Build a drillable {@link Opening} from a pasted PGN. Lines are named by their
 * divergence point, the id is slugified and de-duplicated against `takenIds`,
 * and every move is validated (illegal/ambiguous moves throw with context).
 */
export function buildImportedOpening(
  input: ImportInput,
  takenIds: Set<string>,
): Opening {
  const name = input.name.trim() || 'Imported opening';
  const paths = parsePgnLines(input.pgn); // throws "No moves found in PGN" if empty
  const lineNames = deriveLineNames(paths);
  const id = uniqueId(slugify(name), takenIds);

  const opening = pgnToOpening(input.pgn, { id, name, side: input.side, lineNames });
  buildTree(opening.lines); // belt-and-braces: ensure the whole tree assembles
  return opening;
}

export type PgnPreview =
  | { ok: true; lines: number; moves: number; names: string[] }
  | { ok: false; error: string };

/** Validate a PGN for the import UI without committing it. */
export function previewPgn(pgn: string): PgnPreview {
  if (!pgn.trim()) return { ok: false, error: 'Paste a PGN to import.' };
  try {
    const opening = buildImportedOpening({ name: 'preview', side: 'white', pgn }, new Set());
    const moves = opening.lines.reduce((sum, l) => sum + l.moves.length, 0);
    return {
      ok: true,
      lines: opening.lines.length,
      moves,
      names: opening.lines.map((l) => l.name),
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Could not parse PGN.' };
  }
}
