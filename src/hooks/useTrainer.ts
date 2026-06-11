import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import type {
  PieceDropHandlerArgs,
  PieceHandlerArgs,
  SquareHandlerArgs,
} from 'react-chessboard';
import { buildTree, findNode, getLeaves } from '../chess/tree';
import { OPENINGS } from '../chess/openings';
import { buildImportedOpening } from '../chess/importOpening';
import {
  countDue,
  dueLabel,
  dueState,
  gradeLine,
  orderLeavesForReview,
} from '../chess/srs';
import type { ReviewMap } from '../chess/srs';
import type { Side } from '../chess/types';
import * as engine from '../chess/engine';
import type { EngineState, Mode } from '../chess/engine';
import { useLocalStorage } from './useLocalStorage';
import { useCustomOpenings } from './useCustomOpenings';

/** How long the book "thinks" before replying, in milliseconds. */
const OPPONENT_DELAY_MS = 450;
const PROGRESS_KEY = 'opening-trainer:progress';
const SRS_KEY = 'opening-trainer:srs';

/** Review records for every opening, keyed by opening id then leaf id. */
type SrsMap = Record<string, ReviewMap>;

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
  const {
    customOpenings,
    addOpening,
    removeOpening: removeCustomOpening,
  } = useCustomOpenings();
  const allOpenings = useMemo(() => [...OPENINGS, ...customOpenings], [customOpenings]);
  const customIds = useMemo(
    () => new Set(customOpenings.map((o) => o.id)),
    [customOpenings],
  );

  const [openingId, setOpeningId] = useState<string>(OPENINGS[0]!.id);
  const opening = useMemo(
    () => allOpenings.find((o) => o.id === openingId) ?? OPENINGS[0]!,
    [allOpenings, openingId],
  );
  const tree = useMemo(() => buildTree(opening.lines), [opening]);
  const leafIds = useMemo(() => new Set(getLeaves(tree).map((l) => l.id)), [tree]);
  const totalLines = leafIds.size;

  const [srs, setSrs] = useLocalStorage<SrsMap>(SRS_KEY, {});
  const srsRef = useRef(srs);
  useEffect(() => {
    srsRef.current = srs;
  }, [srs]);

  /**
   * Build a fresh session. In drill mode the queue is ordered by spaced
   * repetition (overdue lines first, then new, then future-scheduled) so a
   * session always trains the weakest material first; learn mode keeps the
   * systematic tree order.
   */
  const makeSession = useCallback(
    (mode: Mode, randomizeOpponent: boolean): EngineState => {
      const leafOrder =
        mode === 'drill'
          ? orderLeavesForReview(
              getLeaves(tree).map((l) => l.id),
              srsRef.current[opening.id] ?? {},
              Date.now(),
            )
          : undefined;
      return engine.initState(tree, opening, { mode, randomizeOpponent, leafOrder });
    },
    [tree, opening],
  );

  const [state, setState] = useState<EngineState>(() => {
    const records = srs[opening.id] ?? {};
    const leafOrder = orderLeavesForReview(
      getLeaves(tree).map((l) => l.id),
      records,
      Date.now(),
    );
    return engine.initState(tree, opening, { leafOrder });
  });
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
    setState((prev) => makeSession(prev.mode, prev.randomizeOpponent));
    setSelected(null);
  }, [tree, opening, makeSession]);

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

  // Grade a line into the spaced-repetition schedule the moment it completes.
  // A transition guard (rather than a "seen" set) means replaying a line
  // re-grades it, while React StrictMode's double-run of effects grades once.
  const prevPhaseRef = useRef<EngineState['phase'] | null>(null);
  useEffect(() => {
    const prevPhase = prevPhaseRef.current;
    prevPhaseRef.current = state.phase;
    if (state.phase !== 'lineComplete' || prevPhase === 'lineComplete') return;
    // At lineComplete the board sits on the reached leaf.
    const leafId = state.currentId;
    if (!leafIds.has(leafId)) return;
    const pass = state.lineMistakes === 0;
    setSrs((prev) => {
      const forOpening = prev[openingId] ?? {};
      return {
        ...prev,
        [openingId]: {
          ...forOpening,
          [leafId]: gradeLine(forOpening[leafId], pass, Date.now()),
        },
      };
    });
  }, [state.phase, state.currentId, state.lineMistakes, openingId, leafIds, setSrs]);

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
  const doSelectLine = useCallback(
    (leafId: string) => setState((s) => engine.selectLine(tree, s, leafId)),
    [tree],
  );
  const restart = useCallback(
    () => setState((prev) => makeSession(prev.mode, prev.randomizeOpponent)),
    [makeSession],
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

  /** Import a pasted PGN as a new custom opening, then switch to it. */
  const importOpening = useCallback(
    (input: { name: string; side: Side; pgn: string }) => {
      try {
        const taken = new Set(allOpenings.map((o) => o.id));
        const created = buildImportedOpening(input, taken);
        addOpening(created);
        setOpeningId(created.id);
        return { ok: true as const, opening: created };
      } catch (e) {
        return {
          ok: false as const,
          error: e instanceof Error ? e.message : 'Import failed.',
        };
      }
    },
    [allOpenings, addOpening],
  );

  /** Delete a custom opening, drop its saved progress, and fall back to default. */
  const deleteOpening = useCallback(
    (id: string) => {
      removeCustomOpening(id);
      setProgress((prev) => {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setOpeningId((cur) => (cur === id ? OPENINGS[0]!.id : cur));
    },
    [removeCustomOpening, setProgress],
  );

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

  // One entry per drillable line in the active opening, in queue order, so the
  // sidebar can offer a direct pick (name, whether it's done, whether it's the
  // line currently being drilled).
  const lineSummaries = useMemo(() => {
    const done = new Set(
      (progress[openingId]?.completed ?? []).filter((id) => leafIds.has(id)),
    );
    const records = srs[openingId] ?? {};
    const now = Date.now();
    return getLeaves(tree).map((leaf, i) => ({
      id: leaf.id,
      name: leaf.endsLines[0] ?? `Line ${i + 1}`,
      completed: done.has(leaf.id),
      dueState: dueState(records[leaf.id], now),
      dueLabel: dueLabel(records[leaf.id], now),
    }));
  }, [tree, leafIds, progress, openingId, srs]);

  // A summary of every opening for the sidebar navigation (name, side, and how
  // many of its lines have been completed).
  const openingSummaries = useMemo(() => {
    const now = Date.now();
    return allOpenings.map((o) => {
      const t = buildTree(o.lines);
      const leaves = new Set(getLeaves(t).map((l) => l.id));
      const completed = (progress[o.id]?.completed ?? []).filter((id) =>
        leaves.has(id),
      ).length;
      // "Due" counts only previously-learned lines whose review has arrived;
      // brand-new lines are conveyed by the completed/total figure instead.
      const due = countDue(leaves, srs[o.id] ?? {}, now, { includeNew: false });
      return {
        id: o.id,
        name: o.name,
        side: o.side,
        total: leaves.size,
        completed,
        due,
        custom: customIds.has(o.id),
      };
    });
  }, [progress, allOpenings, customIds, srs]);

  return {
    // configuration
    openings: allOpenings,
    openingSummaries,
    lineSummaries,
    opening,
    openingId,
    totalLines,
    targetLeafId: state.targetLeafId,

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
    dueCount: countDue(leafIds, srs[openingId] ?? {}, Date.now(), {
      includeNew: false,
    }),
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
    selectLine: doSelectLine,
    restart,
    resetProgress,
    selectOpening,
    setMode,
    setRandomize,
    importOpening,
    deleteOpening,
  };
}

export type Trainer = ReturnType<typeof useTrainer>;
