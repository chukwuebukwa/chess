# Next Steps — Scaling the Opening Trainer

Roadmap for growing the trainer from a handful of hand-authored openings into a
large, scalable practice library. Grouped by the three axes we picked:
**PGN import**, **more openings**, and **sidebar at scale**.

## Where things stand

The content model already scales well:

- Each opening is one file exporting an `Opening` (`src/chess/openings/*.ts`),
  registered in `src/chess/openings/index.ts`.
- `buildTree` (`src/chess/tree.ts`) merges shared prefixes into one move tree;
  `compileLine` validates every SAN move at build time, so bad data fails loudly
  (the test suite asserts this).
- The engine targets a line by its leaf id, so jumping to any variation is cheap.

**Already shipped** (commit `87da966`):

- **Variation picker** — the sidebar lists every line under the active opening;
  click any to jump straight to it (`engine.selectLine` + `lineSummaries` in
  `useTrainer`).
- **PGN-with-variations import core** — `src/chess/pgn.ts` parses a PGN (including
  nested `( )` variations, which chess.js's `loadPgn` discards) into
  `OpeningLine[]`, validated through `compileLine`. Covered by `pgn.test.ts`.

---

## 1. PGN import (the multiplier)

The world publishes chess content as PGN; importing it is the cheapest way to add
a lot of practice material. Parser core is done — remaining work is exposing it.

- [ ] **In-app PGN paste box** — a panel where you paste a PGN, give it a name +
      side, and it becomes a drillable opening. Highest-leverage item: turns
      "add content" from a code change into a paste.
- [ ] **Persist imported openings** — store custom openings in `localStorage`
      (reuse the `useLocalStorage` hook) so they survive reloads, and merge them
      into the `OPENINGS` list the sidebar renders.
- [ ] **Per-line naming on import** — let the importer name lines (or derive names
      from the divergence move, e.g. "3...Bf5") instead of `Line N`.
- [ ] **Build-time converter script** — `scripts/pgn-to-opening.ts` to turn a
      `.pgn` file into a committed opening file, for curated/bundled content.
- [ ] **Import polish** — show a parse preview (N lines, M moves), surface the
      `compileLine` error inline when a PGN has an illegal/ambiguous move.

## 2. More openings (authored content)

Author real repertoires now that PGN paste makes it fast. Candidates:

- [ ] White: Ruy Lopez, Queen's Gambit, London System, Vienna.
- [ ] Black vs 1.e4: Sicilian (Najdorf/Accelerated), French, Scandinavian.
- [ ] Black vs 1.d4: King's Indian, Nimzo-Indian, QGD, Slav.
- [ ] Add an `eco` + `comment` to each line for teaching value (model exists in
      `caroKann.ts`).
- [ ] Consider a shared-prefix authoring helper so the common trunk isn't retyped
      across every line in a file.

## 3. Sidebar at scale (UI for dozens of openings)

The flat list and bundle-everything approach break down around a few dozen items.

- [ ] **Group openings** by side (White / Black), or by first move / ECO family,
      with collapsible sections.
- [ ] **Search / filter** box at the top of the sidebar.
- [ ] **Lazy-load** each opening's lines (dynamic `import()`) so the initial
      bundle stays small as the library grows.
- [ ] **Progress at the group level** — show "12 / 40 lines" per category.
- [ ] Virtualize the list if it ever gets very long.

---

## Backlog / not chosen (yet)

- **Tactics & endgame trainers** — a different drill loop than opening recall
  (e.g. "find the best move" from the Lichess puzzle DB). Bigger lift; a second
  content type + mode. Skipped for now.
- Spaced repetition: resurface lines you've gotten wrong, instead of a fixed queue.
- Shareable repertoire export (back out to PGN).

## Suggested order

1. In-app PGN paste box + persistence (unblocks everything else).
2. Sidebar grouping + search (needed before the list gets long).
3. Author a batch of openings via the paste box.
4. Build-time converter + lazy loading as the library grows.
