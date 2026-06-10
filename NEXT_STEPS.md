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

- [x] **In-app PGN paste box** — `ImportDialog` + `useTrainer.importOpening`: paste
      a PGN, name it, pick a side, and it becomes a drillable opening.
- [x] **Persist imported openings** — `useCustomOpenings` stores them in
      `localStorage` (re-validated on load) and merges them into the sidebar list.
- [x] **Per-line naming on import** — `deriveLineNames` names each line by its
      divergence move (e.g. "3...Bf5") instead of `Line N`.
- [x] **Build-time converter script** — `scripts/pgn-to-opening.ts`
      (`npm run pgn:convert`) turns a `.pgn` file into a committed opening module.
- [x] **Import polish** — live parse preview (N lines, M moves + line-name chips)
      with the `compileLine` error surfaced inline.
- [ ] **Stable per-line ids** — line identity is still the SAN path, so editing a
      line's moves orphans its saved progress. Give each line a stable id (or
      content hash) so progress/SRS state survives edits.

## 2. More openings (authored content)

**Shipped: 20 built-in repertoires** across both colours, every line carrying an
ECO code and a teaching note, all validated by the test suite.

- White: Italian, Ruy Lopez, Scotch, Vienna, King's Gambit, Queen's Gambit,
  Catalan, London, English.
- Black: Caro-Kann, Sicilian, French, Scandinavian, Pirc, Petroff, Alekhine,
  King's Indian, Nimzo-Indian, Grünfeld, Dutch.

Still to add:

- [ ] More depth per opening (more variations, longer main lines).
- [ ] Remaining big systems: Slav & QGD from Black's side, Queen's Indian,
      Benoni/Benko, Modern, Philidor; anti-Sicilians (Alapin, Closed) for White.
- [ ] A shared-prefix authoring helper so the common trunk isn't retyped across
      every line in a file.

## 3. Sidebar at scale (UI for dozens of openings)

The flat list and bundle-everything approach break down around a few dozen items.

- [x] **Group openings** by side (White / Black) with collapsible sections.
- [x] **Search / filter** box at the top of the sidebar (empty groups hide;
      groups auto-expand while searching).
- [x] **Progress at the group level** — each colour shows its combined
      lines-completed count.
- [ ] **Lazy-load** each opening's lines (dynamic `import()`) so the initial
      bundle stays small as the library grows.
- [ ] Virtualize the list if it ever gets very long.
- [ ] Sub-group by ECO family / first move once a colour has many openings.

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
