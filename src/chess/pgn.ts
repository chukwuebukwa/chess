import type { Opening, OpeningLine, Side } from './types';
import { compileLine } from './tree';

/**
 * Parse PGN movetext (with nested variations) into a flat list of root-to-leaf
 * SAN lines.
 *
 * chess.js's own `loadPgn` only follows the mainline and silently discards
 * variations, which is exactly the interesting part of a repertoire. So we parse
 * the movetext ourselves: build the move tree the parentheses describe, then
 * enumerate every root-to-leaf path. Each path is one drillable line.
 *
 * Supported: move numbers (`1.`, `1...`, glued `1.e4`), `{ }` and `;` comments,
 * `$nn` NAGs, results (`1-0` etc.), and arbitrarily nested `( )` variations.
 */

interface PgnNode {
  san: string;
  children: PgnNode[];
}

const RESULTS = new Set(['1-0', '0-1', '1/2-1/2', '*']);

/** Strip header tags, comments, and NAGs, then tokenize into moves and parens. */
function tokenize(movetext: string): string[] {
  const cleaned = movetext
    .replace(/\{[^}]*\}/g, ' ') // brace comments
    .replace(/;[^\n]*/g, ' ') // line comments
    .replace(/\$\d+/g, ' ') // NAGs
    .replace(/[()]/g, (p) => ` ${p} `); // isolate parens

  const out: string[] = [];
  for (const raw of cleaned.split(/\s+/)) {
    if (!raw) continue;
    if (raw === '(' || raw === ')') {
      out.push(raw);
      continue;
    }
    if (RESULTS.has(raw)) continue;
    // Strip a leading move number ("12." / "12..." / glued "12.e4").
    const move = raw.replace(/^\d+\.+/, '');
    if (!move || /^\d+\.*$/.test(move)) continue; // bare number or empty
    out.push(move);
  }
  return out;
}

/** Drop everything before the first blank line that separates tags from moves. */
function stripHeaders(pgn: string): string {
  // Remove [Tag "value"] lines wherever they appear; movetext is what's left.
  return pgn.replace(/^\s*\[[^\]]*\]\s*$/gm, ' ');
}

/**
 * Build the move tree from a token stream. A `(` opens an alternative to the
 * move immediately before it, branching from that move's parent; `)` returns to
 * the mainline. Mirrors how a PGN reader walks RAVs.
 */
function buildPgnTree(tokens: string[]): PgnNode {
  const root: PgnNode = { san: '', children: [] };
  let current = root; // node the next move attaches under
  let parentOfLast = root; // parent of the most recent move
  let last: PgnNode = root; // most recent move node
  const stack: Array<{ current: PgnNode; parentOfLast: PgnNode; last: PgnNode }> = [];

  for (const tok of tokens) {
    if (tok === '(') {
      stack.push({ current, parentOfLast, last });
      current = parentOfLast; // variation branches as a sibling of `last`
      continue;
    }
    if (tok === ')') {
      const s = stack.pop();
      if (!s) throw new Error('Unbalanced ")" in PGN variations');
      ({ current, parentOfLast, last } = s);
      continue;
    }
    const node: PgnNode = { san: tok, children: [] };
    current.children.push(node);
    parentOfLast = current;
    last = node;
    current = node;
  }
  if (stack.length) throw new Error('Unbalanced "(" in PGN variations');
  return root;
}

/** Enumerate every root-to-leaf path as an array of SAN moves. */
function enumeratePaths(root: PgnNode): string[][] {
  const lines: string[][] = [];
  const walk = (node: PgnNode, prefix: string[]): void => {
    const path = node.san ? [...prefix, node.san] : prefix;
    if (node.children.length === 0) {
      if (path.length) lines.push(path);
      return;
    }
    for (const child of node.children) walk(child, path);
  };
  walk(root, []);
  return lines;
}

/** Parse a PGN string into its constituent SAN lines (mainline + variations). */
export function parsePgnLines(pgn: string): string[][] {
  const tokens = tokenize(stripHeaders(pgn));
  if (tokens.length === 0) throw new Error('No moves found in PGN');
  return enumeratePaths(buildPgnTree(tokens));
}

export interface PgnOpeningMeta {
  id: string;
  name: string;
  side: Side;
  description?: string;
  /** Optional names for each line, in enumeration order; missing ones get "Line N". */
  lineNames?: string[];
}

/**
 * Convert a PGN into a drillable {@link Opening}. Every line is validated through
 * the same `compileLine` the authored repertoires use, so an illegal/ambiguous
 * move throws here rather than producing a broken trainer.
 */
export function pgnToOpening(pgn: string, meta: PgnOpeningMeta): Opening {
  const paths = parsePgnLines(pgn);
  const lines: OpeningLine[] = paths.map((moves, i) => {
    const line: OpeningLine = {
      name: meta.lineNames?.[i] ?? `Line ${i + 1}`,
      moves,
    };
    compileLine(line); // throws on the first illegal move, with context
    return line;
  });
  return {
    id: meta.id,
    name: meta.name,
    side: meta.side,
    description: meta.description ?? 'Imported from PGN.',
    lines,
  };
}
