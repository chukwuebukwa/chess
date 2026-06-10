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
      moves: ['c4', 'e5', 'Nc3', 'Nf6', 'Nf3', 'Nc6', 'g3', 'd5', 'cxd5', 'Nxd5', 'Bg2'],
      comment:
        'Treat 1...e5 as a Sicilian Dragon a tempo up: fianchetto and pressure the centre from g2.',
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
