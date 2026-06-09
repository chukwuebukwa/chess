import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import type {
  PieceDropHandlerArgs,
  PieceHandlerArgs,
  SquareHandlerArgs,
} from 'react-chessboard';
import { buildTree, findNode, getLeaves } from '../chess/tree';
import { getOpening, OPENINGS } from '../chess/openings';
import * as engine from '../chess/engine';
import type { EngineState, Mode } from '../chess/engine';
import { useLocalStorage } from './useLocalStorage';

/** How long the book "thinks" before replying, in milliseconds. */
const OPPONENT_DELAY_MS = 450;
const PROGRESS_KEY = 'opening-trainer:progress';

export interface ProgressRecord {
  completed: string[];
  bestStreak: number;
}
type ProgressMap = Record<string, ProgressRecord>;

export type StatusTone = 'neutral' | 'good' | 'bad' | 'win';
export interface Status {
  text: string;
  tone: StatusTone;
}

function computeStatus(state: EngineState, opponentName: string): Status {
  switch (state.phase) {
    case 'repertoireComplete':
      return { text: 'Repertoire complete — every line drilled! 🎉', tone: 'win' };
    case 'lineComplete':
      return { text: 'Line complete! ✓', tone: 'win' };
    case 'opponentThinking':
      if (state.feedback === 'revealed')
        return { text: 'Shown for you — keep the line going.', tone: 'bad' };
      if (state.feedback === 'correct') return { text: 'Correct!', tone: 'good' };
      return { text: `${opponentName} is replying…`, tone: 'neutral' };
    case 'awaitingUser':
    default:
      if (state.feedback === 'wrong')
        return { text: 'Not the book move — try again.', tone: 'bad' };
      return { text: 'Your move.', tone: 'neutral' };
  }
}

export function useTrainer() {
  const [openingId, setOpeningId] = useState<string>(OPENINGS[0]!.id);
  const opening = useMemo(() => getOpening(openingId)!, [openingId]);
  const tree = useMemo(() => buildTree(opening.lines), [opening]);
  const leafIds = useMemo(() => new Set(getLeaves(tree).map((l) => l.id)), [tree]);
  const totalLines = leafIds.size;

  const [state, setState] = useState<EngineState>(() =>
    engine.initState(tree, opening),
  );
  const [selected, setSelected] = useState<Square | null>(null);
  const [progress, setProgress] = useLocalStorage<ProgressMap>(PROGRESS_KEY, {});

  // Mirror the latest state into a ref so asynchronous callbacks (the opponent
  // timer, drop handlers) never read a stale closure — the footgun called out
  // in the react-chessboard docs.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const userLetter = state.side === 'white' ? 'w' : 'b';

  // Re-initialise whenever the opening changes (preserving the mode/randomise
  // toggles). Skips the first mount, which the lazy initializer already covers.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setState((prev) =>
      engine.initState(tree, opening, {
        mode: prev.mode,
        randomizeOpponent: prev.randomizeOpponent,
      }),
    );
    setSelected(null);
  }, [tree, opening]);

  // The book auto-replies after a short, human-feeling delay.
  useEffect(() => {
    if (state.phase !== 'opponentThinking') return;
    const id = setTimeout(() => {
      setState((prev) =>
        prev.phase === 'opponentThinking'
          ? engine.applyOpponentMove(tree, prev)
          : prev,
      );
    }, OPPONENT_DELAY_MS);
    return () => clearTimeout(id);
  }, [state.phase, state.currentId, tree]);

  // Let a "wrong" flash fade so the trainee can try again on a clean board.
  useEffect(() => {
    if (state.feedback !== 'wrong') return;
    const id = setTimeout(() => {
      setState((prev) =>
        prev.feedback === 'wrong'
          ? { ...prev, feedback: null, feedbackSquare: null }
          : prev,
      );
    }, 600);
    return () => clearTimeout(id);
  }, [state.feedback, state.feedbackSquare]);

  // Clear any click-to-move selection whenever the board position changes.
  useEffect(() => {
    setSelected(null);
  }, [state.currentId]);

  // Persist completed lines + best streak per opening.
  useEffect(() => {
    if (state.phase !== 'lineComplete') return;
    const justCompleted = state.completedLeaves[state.completedLeaves.length - 1];
    if (!justCompleted) return;
    setProgress((prev) => {
      const rec = prev[openingId] ?? { completed: [], bestStreak: 0 };
      const completed = rec.completed.includes(justCompleted)
        ? rec.completed
        : [...rec.completed, justCompleted];
      const bestStreak = Math.max(rec.bestStreak, state.bestStreak);
      if (
        completed.length === rec.completed.length &&
        bestStreak === rec.bestStreak
      ) {
        return prev;
      }
      return { ...prev, [openingId]: { completed, bestStreak } };
    });
  }, [state.phase, state.completedLeaves, state.bestStreak, openingId, setProgress]);

  // --- Move handlers -------------------------------------------------------

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
      if (!targetSquare) return false;
      const { result, state: next } = engine.attemptUserMove(
        tree,
        stateRef.current,
        sourceSquare as Square,
        targetSquare as Square,
      );
      setState(next);
      setSelected(null);
      return result === 'correct' || result === 'complete';
    },
    [tree],
  );

  const onSquareClick = useCallback(
    ({ square }: SquareHandlerArgs) => {
      const cur = stateRef.current;
      if (cur.phase !== 'awaitingUser') return;
      const sq = square as Square;
      const probe = new Chess(engine.currentNode(tree, cur).fen);
      const owner = (s: Square) => probe.get(s)?.color;

      if (selected) {
        if (selected === sq) {
          setSelected(null);
          return;
        }
        // Clicking another of your own pieces reselects it.
        if (owner(sq) === userLetter) {
          setSelected(sq);
          return;
        }
        const { state: next } = engine.attemptUserMove(tree, cur, selected, sq);
        setState(next);
        setSelected(null);
        return;
      }

      if (owner(sq) === userLetter) setSelected(sq);
    },
    [tree, selected, userLetter],
  );

  const canDragPiece = useCallback(
    ({ piece }: PieceHandlerArgs) => piece.pieceType[0] === userLetter,
    [userLetter],
  );

  // --- Actions -------------------------------------------------------------

  const hint = useCallback(() => setState((s) => engine.bumpHint(s)), []);
  const reveal = useCallback(
    () => setState((s) => engine.revealMove(tree, s)),
    [tree],
  );
  const doNextLine = useCallback(
    () => setState((s) => engine.nextLine(tree, s)),
    [tree],
  );
  const doResetLine = useCallback(
    () => setState((s) => engine.resetLine(tree, s)),
    [tree],
  );
  const restart = useCallback(
    () =>
      setState((prev) =>
        engine.initState(tree, opening, {
          mode: prev.mode,
          randomizeOpponent: prev.randomizeOpponent,
        }),
      ),
    [tree, opening],
  );
  const selectOpening = useCallback((id: string) => setOpeningId(id), []);
  const setMode = useCallback(
    (mode: Mode) => setState((s) => ({ ...s, mode })),
    [],
  );
  const setRandomize = useCallback(
    (randomizeOpponent: boolean) =>
      setState((s) => ({ ...s, randomizeOpponent })),
    [],
  );
  const resetProgress = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      [openingId]: { completed: [], bestStreak: 0 },
    }));
    restart();
  }, [openingId, setProgress, restart]);

  // --- Derived values for the view ----------------------------------------

  const node = engine.currentNode(tree, state);
  const hintMove = engine.userTargetMove(tree, state);
  const targetNode = findNode(tree, state.targetLeafId);
  const opponentName = state.side === 'white' ? 'Black' : 'White';

  const showArrow =
    state.phase === 'awaitingUser' &&
    hintMove != null &&
    (state.mode === 'learn' || state.hintLevel >= 2);
  const showOriginHint =
    state.phase === 'awaitingUser' && hintMove != null && state.hintLevel >= 1;

  const completedForOpening = (progress[openingId]?.completed ?? []).filter((id) =>
    leafIds.has(id),
  );

  // A summary of every opening for the sidebar navigation (name, side, and how
  // many of its lines have been completed).
  const openingSummaries = useMemo(
    () =>
      OPENINGS.map((o) => {
        const t = buildTree(o.lines);
        const leaves = new Set(getLeaves(t).map((l) => l.id));
        const completed = (progress[o.id]?.completed ?? []).filter((id) =>
          leaves.has(id),
        ).length;
        return { id: o.id, name: o.name, side: o.side, total: leaves.size, completed };
      }),
    [progress],
  );

  return {
    // configuration
    openings: OPENINGS,
    openingSummaries,
    opening,
    openingId,
    totalLines,

    // raw state
    state,
    mode: state.mode,
    randomizeOpponent: state.randomizeOpponent,

    // board view-model
    fen: node.fen,
    orientation: state.side,
    lastMove: state.lastMove,
    selected,
    feedback: state.feedback,
    feedbackSquare: state.feedbackSquare,
    interactive: state.phase === 'awaitingUser',
    hintOrigin: showOriginHint ? hintMove?.from ?? null : null,
    arrow: showArrow ? hintMove : null,

    // panel view-model
    status: computeStatus(state, opponentName),
    breadcrumb: engine.breadcrumb(tree, state),
    line: engine.targetLine(tree, state),
    targetName: targetNode?.endsLines[0] ?? '',
    comment: targetNode?.comments[0] ?? '',
    currentPly: node.ply,
    completedCount: completedForOpening.length,
    accuracyPct: Math.round(engine.accuracy(state) * 100),
    streak: state.streak,
    bestStreak: Math.max(state.bestStreak, progress[openingId]?.bestStreak ?? 0),

    // handlers + actions
    onPieceDrop,
    onSquareClick,
    canDragPiece,
    hint,
    reveal,
    doNextLine,
    doResetLine,
    restart,
    resetProgress,
    selectOpening,
    setMode,
    setRandomize,
  };
}

export type Trainer = ReturnType<typeof useTrainer>;
