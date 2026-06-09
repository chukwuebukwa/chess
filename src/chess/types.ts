import type { Color, Square } from 'chess.js';

/** The side a player trains. The app plays "the book" for the opposite side. */
export type Side = 'white' | 'black';

/**
 * A single named line of an opening, authored as a sequence of SAN moves from
 * the initial position. This is the human-friendly authoring format — exactly
 * what you copy out of a book, a Lichess study, or an analysis board.
 */
export interface OpeningLine {
  /** Variation name, e.g. "Advance Variation". */
  name: string;
  /** Optional ECO code, e.g. "B12". */
  eco?: string;
  /** Full move sequence in SAN, starting from the initial position. */
  moves: string[];
  /** Optional teaching note, shown when the line is completed. */
  comment?: string;
}

/** A complete opening repertoire that the user drills from one side. */
export interface Opening {
  /** Stable identifier used in URLs / localStorage keys. */
  id: string;
  /** Display name, e.g. "Caro-Kann Defense". */
  name: string;
  /** The side the user plays. The app auto-plays the other side from the book. */
  side: Side;
  /** One-line description shown in the picker. */
  description: string;
  /** The variations that make up the repertoire. */
  lines: OpeningLine[];
}

/**
 * A node in the compiled move tree (a trie of SAN moves). The root represents
 * the start position; every other node represents the position reached after a
 * specific move. Lines that share a prefix share nodes, so the whole repertoire
 * collapses into one tree that branches exactly where the theory branches.
 */
export interface MoveNode {
  /** Stable id: the SAN path from the root joined by spaces ("" for the root). */
  id: string;
  /** SAN of the move that produced this node; `null` at the root. */
  san: string | null;
  /** Origin square of the move; `null` at the root. */
  from: Square | null;
  /** Destination square of the move; `null` at the root. */
  to: Square | null;
  /** Promotion piece if the move was a promotion (e.g. "q"). */
  promotion?: string;
  /** Side that made the move that produced this node; `null` at the root. */
  movedBy: Color | null;
  /** FEN of the position AT this node (after `san` has been played). */
  fen: string;
  /** Side to move in this position. */
  turn: Color;
  /** Half-move depth from the root (root = 0). */
  ply: number;
  /** Names of every line that passes through this node. */
  variations: string[];
  /** Child nodes, one per distinct continuation present in the repertoire. */
  children: MoveNode[];
  /** Names of lines that terminate exactly at this node (true leaves of theory). */
  endsLines: string[];
  /** Teaching comments attached to lines that end at this node. */
  comments: string[];
}
