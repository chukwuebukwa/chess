import { Chess } from 'chess.js';
import type { Color, Square } from 'chess.js';
import type { MoveNode, OpeningLine } from './types';

/** Per-ply metadata captured while replaying (and validating) a line. */
export interface CompiledMove {
  san: string;
  from: Square;
  to: Square;
  promotion?: string;
  movedBy: Color;
  fenAfter: string;
  turnAfter: Color;
}

/**
 * Replay a line's SAN moves through chess.js, validating that every move is
 * legal and capturing the resulting square/FEN metadata. Throws a descriptive
 * error if a move is illegal — this is what guarantees authored repertoires are
 * sound (and is exercised directly by the test suite).
 */
export function compileLine(line: OpeningLine): CompiledMove[] {
  const game = new Chess();
  const out: CompiledMove[] = [];
  for (const san of line.moves) {
    try {
      const move = game.move(san);
      out.push({
        san: move.san,
        from: move.from,
        to: move.to,
        promotion: move.promotion,
        movedBy: move.color,
        fenAfter: game.fen(),
        turnAfter: game.turn(),
      });
    } catch {
      const played = out.map((m) => m.san).join(' ') || '(start)';
      throw new Error(
        `Illegal move "${san}" in line "${line.name}" after ${played}`,
      );
    }
  }
  return out;
}

function createRoot(): MoveNode {
  const game = new Chess();
  return {
    id: '',
    san: null,
    from: null,
    to: null,
    movedBy: null,
    fen: game.fen(),
    turn: game.turn(),
    ply: 0,
    variations: [],
    children: [],
    endsLines: [],
    comments: [],
  };
}

/**
 * Compile a set of lines into a single move tree, merging shared prefixes so the
 * tree branches exactly where the variations diverge.
 */
export function buildTree(lines: OpeningLine[]): MoveNode {
  const root = createRoot();

  for (const line of lines) {
    const compiled = compileLine(line);
    let node = root;
    pushUnique(node.variations, line.name);

    for (const mv of compiled) {
      const childId = node.id === '' ? mv.san : `${node.id} ${mv.san}`;
      let child = node.children.find((c) => c.san === mv.san);
      if (!child) {
        child = {
          id: childId,
          san: mv.san,
          from: mv.from,
          to: mv.to,
          promotion: mv.promotion,
          movedBy: mv.movedBy,
          fen: mv.fenAfter,
          turn: mv.turnAfter,
          ply: node.ply + 1,
          variations: [],
          children: [],
          endsLines: [],
          comments: [],
        };
        node.children.push(child);
      }
      pushUnique(child.variations, line.name);
      node = child;
    }

    node.endsLines.push(line.name);
    if (line.comment) node.comments.push(line.comment);
  }

  return root;
}

function pushUnique<T>(arr: T[], value: T): void {
  if (!arr.includes(value)) arr.push(value);
}

/** Depth-first list of every leaf (a node with no children). */
export function getLeaves(root: MoveNode): MoveNode[] {
  const leaves: MoveNode[] = [];
  const walk = (n: MoveNode): void => {
    if (n.children.length === 0) {
      leaves.push(n);
    } else {
      for (const c of n.children) walk(c);
    }
  };
  walk(root);
  return leaves;
}

/** Find a node by its id, or `null` if not present. */
export function findNode(root: MoveNode, id: string): MoveNode | null {
  if (root.id === id) return root;
  for (const c of root.children) {
    const found = findNode(c, id);
    if (found) return found;
  }
  return null;
}

/** The path of nodes from the root to the node with the given id (inclusive). */
export function pathToNode(root: MoveNode, id: string): MoveNode[] | null {
  if (root.id === id) return [root];
  for (const c of root.children) {
    const sub = pathToNode(c, id);
    if (sub) return [root, ...sub];
  }
  return null;
}

/** Follow first children until a leaf — the canonical "main" leaf under a node. */
export function firstLeafUnder(node: MoveNode): MoveNode {
  let n = node;
  while (n.children.length > 0) n = n.children[0]!;
  return n;
}

/** Total number of distinct leaves (drillable lines) in a tree. */
export function countLeaves(root: MoveNode): number {
  return getLeaves(root).length;
}
