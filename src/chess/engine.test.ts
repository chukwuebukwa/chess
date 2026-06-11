import { describe, expect, it } from 'vitest';
import { buildTree } from './tree';
import {
  accuracy,
  applyOpponentMove,
  attemptUserMove,
  bumpHint,
  breadcrumb,
  currentNode,
  initState,
  nextLine,
  resetLine,
  revealMove,
  userTargetMove,
  type EngineState,
} from './engine';
import { caroKann, italianGame } from './openings';
import type { MoveNode, Opening } from './types';

/**
 * Drive a session by always playing the engine-supplied correct move, auto-
 * playing the opponent, until the current line completes. Returns the final
 * state. Throws if it cannot make progress (guards against infinite loops).
 */
function playLineCorrectly(
  tree: MoveNode,
  start: EngineState,
  maxPlies = 60,
): EngineState {
  let state = start;
  for (let i = 0; i < maxPlies; i += 1) {
    if (state.phase === 'lineComplete' || state.phase === 'repertoireComplete') {
      return state;
    }
    if (state.phase === 'opponentThinking') {
      state = applyOpponentMove(tree, state);
      continue;
    }
    const move = userTargetMove(tree, state);
    if (!move) throw new Error('no target move while awaiting user');
    const res = attemptUserMove(tree, state, move.from, move.to);
    expect(res.result === 'correct' || res.result === 'complete').toBe(true);
    state = res.state;
  }
  throw new Error('line did not complete within ply budget');
}

describe('engine — Caro-Kann (training as Black)', () => {
  const tree = buildTree(caroKann.lines);

  it('starts with the opponent (White) to move', () => {
    const state = initState(tree, caroKann);
    expect(state.side).toBe('black');
    expect(state.phase).toBe('opponentThinking');
    expect(state.currentId).toBe(''); // root
  });

  it('auto-plays the book move for White', () => {
    let state = initState(tree, caroKann);
    state = applyOpponentMove(tree, state);
    expect(state.currentId).toBe('e4');
    expect(state.phase).toBe('awaitingUser');
    expect(currentNode(tree, state).turn).toBe('b');
  });

  it('accepts the correct reply and rejects off-book / illegal moves', () => {
    let state = initState(tree, caroKann);
    state = applyOpponentMove(tree, state); // 1.e4

    // Off-book but legal (1...e5) is rejected and does not move the board.
    const offBook = attemptUserMove(tree, state, 'e7', 'e5');
    expect(offBook.result).toBe('wrong');
    expect(offBook.state.currentId).toBe('e4');
    expect(offBook.state.attempts).toBe(1);
    expect(offBook.state.feedback).toBe('wrong');

    // Illegal (e2 is empty for Black) is also rejected.
    const illegal = attemptUserMove(tree, state, 'e2', 'e4');
    expect(illegal.result).toBe('wrong');

    // The book move 1...c6 is accepted.
    const good = attemptUserMove(tree, state, 'c7', 'c6');
    expect(good.result).toBe('correct');
    expect(good.state.currentId).toBe('e4 c6');
    expect(good.state.feedback).toBe('correct');
  });

  it('drills a full line to completion with perfect accuracy', () => {
    const state = playLineCorrectly(tree, initState(tree, caroKann));
    expect(state.phase).toBe('lineComplete');
    expect(state.completedLeaves).toHaveLength(1);
    // The first DFS line is the Advance Variation (12 plies).
    expect(breadcrumb(tree, state)).toHaveLength(12);
    expect(state.decisions).toBe(6); // Black makes six recalled moves
    expect(state.firstTryCorrect).toBe(6);
    expect(state.streak).toBe(6);
    expect(accuracy(state)).toBe(1);
  });

  it('counts a revealed move as a missed decision', () => {
    let state = initState(tree, caroKann);
    state = applyOpponentMove(tree, state); // 1.e4
    state = revealMove(tree, state); // reveal 1...c6
    expect(state.currentId).toBe('e4 c6');
    expect(state.decisions).toBe(1);
    expect(state.firstTryCorrect).toBe(0);
    expect(accuracy(state)).toBe(0);
    expect(state.streak).toBe(0);
  });

  it('a wrong guess then the right move still counts the decision as missed', () => {
    let state = initState(tree, caroKann);
    state = applyOpponentMove(tree, state);
    state = attemptUserMove(tree, state, 'e7', 'e5').state; // wrong
    expect(state.decisionTainted).toBe(true);
    state = attemptUserMove(tree, state, 'c7', 'c6').state; // correct, but tainted
    expect(state.decisions).toBe(1);
    expect(state.firstTryCorrect).toBe(0);
  });

  it('hints taint the decision and escalate', () => {
    let state = initState(tree, caroKann);
    state = applyOpponentMove(tree, state);
    state = bumpHint(state);
    expect(state.hintLevel).toBe(1);
    expect(state.decisionTainted).toBe(true);
    state = bumpHint(bumpHint(state));
    expect(state.hintLevel).toBe(2); // capped
  });

  it('advances through the whole repertoire line by line', () => {
    let state = initState(tree, caroKann);
    for (let i = 0; i < caroKann.lines.length; i += 1) {
      state = playLineCorrectly(tree, state);
      expect(state.phase).toBe('lineComplete');
      state = nextLine(tree, state);
    }
    expect(state.phase).toBe('repertoireComplete');
    expect(state.completedLeaves).toHaveLength(caroKann.lines.length);
  });

  it('resetLine returns to the start of the current line', () => {
    let state = initState(tree, caroKann);
    state = applyOpponentMove(tree, state);
    state = attemptUserMove(tree, state, 'c7', 'c6').state;
    state = resetLine(tree, state);
    expect(state.currentId).toBe('');
    expect(state.phase).toBe('opponentThinking');
  });
});

describe('engine — Italian Game (training as White)', () => {
  const tree = buildTree(italianGame.lines);

  it('starts with the trainee (White) to move at the root', () => {
    const state = initState(tree, italianGame);
    expect(state.side).toBe('white');
    expect(state.phase).toBe('awaitingUser');
    const move = userTargetMove(tree, state);
    expect(move).toEqual({ from: 'e2', to: 'e4' });
  });

  it('drills every Italian line from White’s side', () => {
    let state = initState(tree, italianGame);
    for (let i = 0; i < italianGame.lines.length; i += 1) {
      state = playLineCorrectly(tree, state);
      expect(state.phase).toBe('lineComplete');
      state = nextLine(tree, state);
    }
    expect(state.phase).toBe('repertoireComplete');
  });
});

describe('engine — randomised opponent', () => {
  it('still produces a legal, completable line', () => {
    const tree = buildTree(caroKann.lines);
    const opening: Opening = caroKann;
    let state = initState(tree, opening, { randomizeOpponent: true });
    // Should be able to complete *some* line regardless of White's random tries.
    state = playLineCorrectly(tree, state);
    expect(state.phase).toBe('lineComplete');
    expect(state.completedLeaves.length).toBeGreaterThanOrEqual(1);
  });
});

describe('engine — per-line mistakes (for spaced repetition)', () => {
  const tree = buildTree(caroKann.lines);

  it('a cleanly drilled line finishes with zero mistakes', () => {
    const state = playLineCorrectly(tree, initState(tree, caroKann));
    expect(state.phase).toBe('lineComplete');
    expect(state.lineMistakes).toBe(0);
  });

  it('wrong tries, hints, and reveals each mark the line as missed', () => {
    let state = initState(tree, caroKann);
    state = applyOpponentMove(tree, state); // 1.e4
    state = attemptUserMove(tree, state, 'e7', 'e5').state; // wrong
    state = attemptUserMove(tree, state, 'c7', 'c6').state; // then correct
    expect(state.lineMistakes).toBe(1);

    state = applyOpponentMove(tree, state); // 2.d4
    state = bumpHint(state);
    state = attemptUserMove(tree, state, 'd7', 'd5').state; // correct but hinted
    expect(state.lineMistakes).toBe(2);

    state = applyOpponentMove(tree, state); // White's 3rd
    state = revealMove(tree, state); // revealed
    expect(state.lineMistakes).toBe(3);
  });

  it('resets the counter when a new line starts', () => {
    let state = initState(tree, caroKann);
    state = applyOpponentMove(tree, state);
    state = attemptUserMove(tree, state, 'e7', 'e5').state; // wrong
    expect(state.lineMistakes).toBe(0); // unresolved decisions don't count yet
    state = attemptUserMove(tree, state, 'c7', 'c6').state;
    expect(state.lineMistakes).toBe(1);
    expect(resetLine(tree, state).lineMistakes).toBe(0);
    expect(nextLine(tree, state).lineMistakes).toBe(0);
  });
});

describe('engine — custom leaf order', () => {
  const tree = buildTree(caroKann.lines);
  const naturalQueue = initState(tree, caroKann).leafQueue;

  it('drills leaves in the supplied order', () => {
    const reversed = [...naturalQueue].reverse();
    const state = initState(tree, caroKann, { leafOrder: reversed });
    expect(state.leafQueue).toEqual(reversed);
    expect(state.targetLeafId).toBe(reversed[0]);
  });

  it('ignores unknown ids and appends missing leaves', () => {
    const state = initState(tree, caroKann, {
      leafOrder: ['not-a-leaf', naturalQueue[2]!],
    });
    expect(state.leafQueue[0]).toBe(naturalQueue[2]);
    expect(state.leafQueue).toHaveLength(naturalQueue.length);
    expect(new Set(state.leafQueue)).toEqual(new Set(naturalQueue));
  });
});
