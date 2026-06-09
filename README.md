# ♞ Opening Trainer

Drill chess openings and their variations the way you would on chess.com's
opening trainer — but focused purely on **repertoire recall**. Pick an opening,
pick a side, and the app plays "the book" for the other side while you have to
remember the right move in every position. Get it right and you advance; get it
wrong and you get a red flash, a hint, or the answer.

Built with [chess.js](https://github.com/jhlywa/chess.js) for the rules and
[react-chessboard](https://github.com/Clariity/react-chessboard) (v5) for the
board.

---

## Features

- **Repertoire as a tree.** Author each variation as a simple list of moves;
  shared move orders automatically merge into one tree that branches exactly
  where the theory branches.
- **Drill either colour.** Ships with a **Caro-Kann** repertoire for Black and
  an **Italian Game** repertoire for White. The board auto-flips to your side.
- **Learn vs. Drill modes.** *Learn* shows the whole line and the move-to-play
  arrow as you go; *Drill* hides everything and tests your recall.
- **Smart feedback.** Correct moves flash green and the book replies; off-book
  or illegal moves snap back and flash red.
- **Hints & reveal.** Escalating hints (highlight the piece → draw the arrow)
  and a "show move" button when you're stuck.
- **Shuffle the opponent.** Optionally randomise which of the opponent's tries
  you face, so you can't just memorise one move order.
- **Drag or click to move**, exactly as in the react-chessboard examples.
- **Progress that sticks.** Completed lines, accuracy, and best streak are saved
  to `localStorage` per opening.

---

## Quick start

```bash
npm install
npm run dev        # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
npm run test       # run the test suite once
npm run test:watch # watch mode
npm run typecheck  # tsc --noEmit
```

Requires Node 20+ (developed on Node 22).

---

## How it works

The app is built in three clean layers — the first two are pure, framework-free
TypeScript and are covered by the test suite.

```
openings/*.ts   →   tree.ts        →   engine.ts        →   React UI
(SAN lines)         (move trie)        (drill state       (board + panel)
                                        machine)
```

1. **Opening data** (`src/chess/openings/`). Each opening is a list of named
   variations, and each variation is just a sequence of SAN moves from the start
   position — the exact format you'd copy out of a book or a Lichess study.

2. **The move tree** (`src/chess/tree.ts`). `buildTree()` replays every line
   through chess.js (validating that each move is legal) and merges them into a
   trie. Every node stores its FEN, the move that reached it, which variations
   pass through it, and where lines end.

3. **The trainer engine** (`src/chess/engine.ts`). A pure state machine over the
   tree: it auto-plays the book for the opponent, accepts only on-book moves from
   you, tracks accuracy/streaks, and walks a depth-first queue of the leaves so
   you systematically cover the whole repertoire. Because it's pure, the entire
   drill loop is unit-tested without a browser.

4. **The UI** (`src/components/`, `src/hooks/useTrainer.ts`). `useTrainer` wires
   the engine to React, schedules the opponent's reply, and derives the board's
   highlights/arrows. The board itself is a thin wrapper over react-chessboard's
   v5 `options` API. (As the docs recommend, the latest state is mirrored into a
   ref so timer/drop callbacks never read a stale closure.)

---

## Adding a new opening

1. Create a file in `src/chess/openings/`, e.g. `frenchDefense.ts`:

   ```ts
   import type { Opening } from '../types';

   export const frenchDefense: Opening = {
     id: 'french-defense',
     name: 'French Defense',
     side: 'black',            // the side YOU train; the app plays the other side
     description: 'A solid, closed answer to 1.e4.',
     lines: [
       {
         name: 'Advance Variation',
         eco: 'C02',
         moves: ['e4', 'e6', 'd4', 'd5', 'e5', 'c5', 'c3', 'Nc6', 'Nf3', 'Qb6'],
         comment: 'Strike the d4/e5 chain at its base with ...c5 and pile up on d4.',
       },
       // ...more variations
     ],
   };
   ```

2. Register it in `src/chess/openings/index.ts`:

   ```ts
   import { frenchDefense } from './frenchDefense';
   export const OPENINGS: Opening[] = [caroKann, italianGame, frenchDefense];
   ```

That's it — the picker, the trainer, and progress tracking pick it up
automatically. Run `npm test` and the suite will verify every move you added is
legal.

**Authoring tips**

- Write moves in standard algebraic notation (`Nf3`, `exd5`, `O-O`, `Qb6`).
- Lines that share an opening trunk are merged automatically — just list each
  full variation from move one.
- Curated lines end on *your* move, so finishing a drill lands the key idea.

---

## Notes & limitations

- **Promotions** auto-queen. Opening lines essentially never promote, so there's
  no promotion picker.
- **Transpositions** are keyed by move order, not by position, so two different
  move orders into the same position are treated as separate lines. This matches
  how repertoires are usually taught.
- The bundled repertoires are compact, correct, real lines meant to demonstrate
  the trainer — not exhaustive theory. Extend them freely.

---

## Tech stack

React 19 · TypeScript · Vite · Vitest · chess.js 1.x · react-chessboard 5.x
