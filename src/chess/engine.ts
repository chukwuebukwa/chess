import { Chess } from 'chess.js';
import type { Color, Square } from 'chess.js';
import type { MoveNode, Opening, Side } from './types';
import {
  findNode,
  firstLeafUnder,
  getLeaves,
  pathToNode,
} from './tree';

export type Mode = 'learn' | 'drill';

export type Phase =
  | 'awaitingUser' // it is the trainee's turn to recall a move
  | 'opponentThinking' // the book is about to reply
  | 'lineComplete' // the current line has been finished
  | 'repertoireComplete'; // every line in the queue has been drilled

export type FeedbackKind = 'correct' | 'wrong' | 'revealed' | null;

export type HintLevel = 0 | 1 | 2;

/** The result of the trainee attempting a move. */
export type AttemptResult = 'correct' | 'complete' | 'wrong' | 'ignored';

/**
 * The full serialisable state of a training session. Everything here is plain
 * data — the move tree itself is kept separately (it is large and static) and
 * passed into every function, which keeps this module a pure, testable core.
 */
export interface EngineState {
  openingId: string;
  side: Side;
  mode: Mode;
  randomizeOpponent: boolean;

  /** Id of the node the board is currently showing. */
  currentId: string;
  /** Id of the leaf this run is drilling toward. */
  targetLeafId: string;
  /** Ordered list of every leaf id — the coverage queue. */
  leafQueue: string[];
  queueIndex: number;

  phase: Phase;
  feedback: FeedbackKind;
  feedbackSquare: Square | null;
  lastMove: { from: Square; to: Square } | null;

  /** Wrong attempts on the current decision. */
  attempts: number;
  hintLevel: HintLevel;
  /** Set when a hint, a wrong guess, or a reveal spoils the current decision. */
  decisionTainted: boolean;

  // Session statistics
  completedLeaves: string[];
  decisions: number;
  firstTryCorrect: number;
  streak: number;
  bestStreak: number;
}

export interface InitOptions {
  mode?: Mode;
  randomizeOpponent?: boolean;
}

const letterFor = (side: Side): Color => (side === 'white' ? 'w' : 'b');
const normPromotion = (p?: string): string | null => p ?? null;

/** True when `ancestorId` is the node `descendantId` itself or one of its ancestors. */
function isAncestorOrSelf(ancestorId: string, descendantId: string): boolean {
  if (ancestorId === '') return true; // the root is an ancestor of everything
  return (
    descendantId === ancestorId || descendantId.startsWith(`${ancestorId} `)
  );
}

function computePhase(
  node: MoveNode,
  userLetter: Color,
  targetLeafId: string,
): Phase {
  if (node.children.length === 0 || node.id === targetLeafId) {
    return 'lineComplete';
  }
  return node.turn === userLetter ? 'awaitingUser' : 'opponentThinking';
}

/** The next node along the path from `fromId` toward the target leaf, if any. */
function nextOnTargetPath(
  tree: MoveNode,
  fromId: string,
  targetLeafId: string,
): MoveNode | null {
  const path = pathToNode(tree, targetLeafId);
  if (!path) return null;
  const idx = path.findIndex((n) => n.id === fromId);
  if (idx === -1) return null;
  return path[idx + 1] ?? null;
}

/** Create a fresh session for an opening's move tree. */
export function initState(
  tree: MoveNode,
  opening: Opening,
  opts: InitOptions = {},
): EngineState {
  const leafQueue = getLeaves(tree).map((l) => l.id);
  const targetLeafId = leafQueue[0] ?? '';
  const userLetter = letterFor(opening.side);

  const state: EngineState = {
    openingId: opening.id,
    side: opening.side,
    mode: opts.mode ?? 'drill',
    randomizeOpponent: opts.randomizeOpponent ?? false,
    currentId: tree.id,
    targetLeafId,
    leafQueue,
    queueIndex: 0,
    phase: 'awaitingUser',
    feedback: null,
    feedbackSquare: null,
    lastMove: null,
    attempts: 0,
    hintLevel: 0,
    decisionTainted: false,
    completedLeaves: [],
    decisions: 0,
    firstTryCorrect: 0,
    streak: 0,
    bestStreak: 0,
  };

  state.phase = computePhase(tree, userLetter, targetLeafId);
  return state;
}

/**
 * Move the board to `child`, recomputing phase, retargeting if the trainee
 * branched off the current target line, and resetting per-decision bookkeeping
 * whenever a new "your move" decision begins.
 */
function transitionTo(state: EngineState, child: MoveNode): EngineState {
  const userLetter = letterFor(state.side);

  // If the chosen move leaves the current target line, retarget to the main
  // leaf beneath it so the rest of the session stays coherent.
  let targetLeafId = state.targetLeafId;
  if (!isAncestorOrSelf(child.id, targetLeafId)) {
    targetLeafId = firstLeafUnder(child).id;
  }

  const phase = computePhase(child, userLetter, targetLeafId);
  const next: EngineState = {
    ...state,
    currentId: child.id,
    targetLeafId,
    phase,
    feedback: null,
    feedbackSquare: null,
    lastMove:
      child.from && child.to ? { from: child.from, to: child.to } : null,
  };

  if (phase === 'lineComplete') {
    const reachedLeaf =
      child.children.length === 0 ? child.id : targetLeafId;
    if (!next.completedLeaves.includes(reachedLeaf)) {
      next.completedLeaves = [...next.completedLeaves, reachedLeaf];
    }
  }

  if (phase === 'awaitingUser') {
    next.attempts = 0;
    next.hintLevel = 0;
    next.decisionTainted = false;
  }

  return next;
}

/** Register a wrong guess without leaving the current position. */
function registerWrong(state: EngineState, from: Square | null): EngineState {
  return {
    ...state,
    feedback: 'wrong',
    feedbackSquare: from,
    attempts: state.attempts + 1,
    decisionTainted: true,
    streak: 0,
  };
}

/** Resolve the current decision into the session statistics. */
function scoreDecision(state: EngineState): Pick<
  EngineState,
  'decisions' | 'firstTryCorrect' | 'streak' | 'bestStreak'
> {
  const success = !state.decisionTainted;
  const streak = success ? state.streak + 1 : 0;
  return {
    decisions: state.decisions + 1,
    firstTryCorrect: state.firstTryCorrect + (success ? 1 : 0),
    streak,
    bestStreak: Math.max(state.bestStreak, streak),
  };
}

/**
 * The trainee attempts a move from `from` to `to`. Returns the next state and a
 * result tag. Illegal moves and off-book (legal but not in the repertoire) moves
 * are both rejected with a `wrong` result and leave the board untouched.
 */
export function attemptUserMove(
  tree: MoveNode,
  state: EngineState,
  from: Square,
  to: Square,
  promotion?: string,
): { state: EngineState; result: AttemptResult } {
  if (state.phase !== 'awaitingUser') {
    return { state, result: 'ignored' };
  }

  const node = findNode(tree, state.currentId);
  if (!node) return { state, result: 'ignored' };

  // Validate legality against a throwaway position.
  const probe = new Chess(node.fen);
  let from_to_promotion: string | undefined;
  let legalTo: Square;
  let legalFrom: Square;
  try {
    const move = probe.move({ from, to, promotion: promotion ?? 'q' });
    legalFrom = move.from;
    legalTo = move.to;
    from_to_promotion = move.promotion;
  } catch {
    return { state: registerWrong(state, from), result: 'wrong' };
  }

  const child = node.children.find(
    (c) =>
      c.from === legalFrom &&
      c.to === legalTo &&
      normPromotion(c.promotion) === normPromotion(from_to_promotion),
  );

  if (!child) {
    // Legal chess move, but not part of the repertoire.
    return { state: registerWrong(state, legalFrom), result: 'wrong' };
  }

  const scored = { ...state, ...scoreDecision(state) };
  const moved = transitionTo(scored, child);
  const next: EngineState = {
    ...moved,
    feedback: 'correct',
    feedbackSquare: legalTo,
  };
  return {
    state: next,
    result: next.phase === 'lineComplete' ? 'complete' : 'correct',
  };
}

/** Play the book's reply. Driven by the target line, or randomised in drill mode. */
export function applyOpponentMove(
  tree: MoveNode,
  state: EngineState,
): EngineState {
  if (state.phase !== 'opponentThinking') return state;
  const node = findNode(tree, state.currentId);
  if (!node || node.children.length === 0) return state;

  let child: MoveNode;
  if (state.randomizeOpponent && node.children.length > 1) {
    child = node.children[Math.floor(Math.random() * node.children.length)]!;
  } else {
    child =
      nextOnTargetPath(tree, node.id, state.targetLeafId) ?? node.children[0]!;
  }

  return transitionTo(state, child);
}

/** Reveal and play the trainee's correct move, counting the decision as missed. */
export function revealMove(tree: MoveNode, state: EngineState): EngineState {
  if (state.phase !== 'awaitingUser') return state;
  const next = nextOnTargetPath(tree, state.currentId, state.targetLeafId);
  if (!next) return state;

  const tainted = { ...state, decisionTainted: true };
  const scored = { ...tainted, ...scoreDecision(tainted) };
  const moved = transitionTo(scored, next);
  return {
    ...moved,
    feedback: 'revealed',
    feedbackSquare: next.to,
  };
}

/** Escalate the on-board hint (1 = origin square, 2 = full arrow). */
export function bumpHint(state: EngineState): EngineState {
  if (state.phase !== 'awaitingUser') return state;
  const hintLevel: HintLevel = state.hintLevel >= 2 ? 2 : ((state.hintLevel + 1) as HintLevel);
  return { ...state, hintLevel, decisionTainted: true };
}

/** Advance to the next line in the coverage queue (or finish the repertoire). */
export function nextLine(tree: MoveNode, state: EngineState): EngineState {
  const queueIndex = state.queueIndex + 1;
  if (queueIndex >= state.leafQueue.length) {
    return { ...state, phase: 'repertoireComplete' };
  }
  const targetLeafId = state.leafQueue[queueIndex]!;
  const base: EngineState = {
    ...state,
    queueIndex,
    targetLeafId,
    currentId: tree.id,
    lastMove: null,
    feedback: null,
    feedbackSquare: null,
    attempts: 0,
    hintLevel: 0,
    decisionTainted: false,
  };
  base.phase = computePhase(tree, letterFor(state.side), targetLeafId);
  return base;
}

/** Restart the current line from move one, keeping the target and statistics. */
export function resetLine(tree: MoveNode, state: EngineState): EngineState {
  const base: EngineState = {
    ...state,
    currentId: tree.id,
    lastMove: null,
    feedback: null,
    feedbackSquare: null,
    attempts: 0,
    hintLevel: 0,
    decisionTainted: false,
  };
  base.phase = computePhase(tree, letterFor(state.side), state.targetLeafId);
  return base;
}

// ---------------------------------------------------------------------------
// Selectors — pure read helpers used by the UI.
// ---------------------------------------------------------------------------

export function currentNode(tree: MoveNode, state: EngineState): MoveNode {
  return findNode(tree, state.currentId) ?? tree;
}

/** The trainee's correct move in the current position (for hints / reveal). */
export function userTargetMove(
  tree: MoveNode,
  state: EngineState,
): { from: Square; to: Square } | null {
  const next = nextOnTargetPath(tree, state.currentId, state.targetLeafId);
  if (!next || !next.from || !next.to) return null;
  if (next.movedBy !== letterFor(state.side)) return null;
  return { from: next.from, to: next.to };
}

/** The moves played so far in the current line (root excluded). */
export function breadcrumb(tree: MoveNode, state: EngineState): MoveNode[] {
  const path = pathToNode(tree, state.currentId);
  return path ? path.slice(1) : [];
}

/** Every move of the line currently being drilled (root excluded). */
export function targetLine(tree: MoveNode, state: EngineState): MoveNode[] {
  const path = pathToNode(tree, state.targetLeafId);
  return path ? path.slice(1) : [];
}

export function accuracy(state: EngineState): number {
  if (state.decisions === 0) return 1;
  return state.firstTryCorrect / state.decisions;
}
