import type { Opening } from '../types';

/** An English Opening repertoire for White (1.c4). */
export const englishOpening: Opening = {
  id: 'english-opening',
  name: 'English Opening',
  side: 'white',
  description: 'Flank play with 1.c4 — flexible, positional, and hard to prepare against.',
  lines: [
    {
      name: 'Symmetrical Variation',
      eco: 'A36',
      moves: ['c4', 'c5', 'Nf3', 'Nf6', 'Nc3', 'Nc6', 'g3', 'g6', 'Bg2', 'Bg7', 'O-O'],
      comment:
        'A double fianchetto Maroczy-style battle; develop harmoniously and aim for a later d4 break.',
    },
    {
      name: 'Reversed Sicilian',
      eco: 'A29',
      moves: ['c4', 'e5', 'Nc3', 'Nf6', 'Nf3', 'Nc6', 'g3', 'd5', 'cxd5', 'Nxd5', 'Bg2', 'Nb6', 'O-O', 'Be7', 'd3', 'O-O', 'a3', 'Be6', 'b4'],
      comment:
        'A Dragon a tempo up: castle, then roll the queenside with a3 and b4 — the standard plan that plays itself for many moves.',
    },
    {
      name: 'Anglo-Indian',
      eco: 'A16',
      moves: ['c4', 'Nf6', 'Nc3', 'g6', 'g3', 'Bg7', 'Bg2', 'O-O', 'Nf3'],
      comment:
        'Against a King’s-Indian setup, mirror it with g3 and keep maximum flexibility about the central pawns.',
    },
  ],
};
