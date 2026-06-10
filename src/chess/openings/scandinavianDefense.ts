import type { Opening } from '../types';

/** A Scandinavian Defense repertoire for Black (1.e4 d5). */
export const scandinavianDefense: Opening = {
  id: 'scandinavian-defense',
  name: 'Scandinavian Defense',
  side: 'black',
  description: 'Hit the centre immediately with 1...d5 for a clear, easy-to-play game.',
  lines: [
    {
      name: 'Main Line (3...Qa5)',
      eco: 'B01',
      moves: ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3', 'Qa5', 'd4', 'Nf6', 'Nf3', 'c6'],
      comment:
        'Recapture with the queen and retreat to a5, then build a Caro-like setup with ...c6, ...Nf6 and ...Bf5.',
    },
    {
      name: 'Modern (3...Qd6)',
      eco: 'B01',
      moves: ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3', 'Qd6', 'd4', 'Nf6', 'Nf3', 'a6'],
      comment:
        'The Qd6 retreat keeps the queen active but out of harm’s way; follow with ...Nf6, ...a6 and ...g6 or ...Bf5.',
    },
    {
      name: 'Modern Variation (2...Nf6)',
      eco: 'B01',
      moves: ['e4', 'd5', 'exd5', 'Nf6', 'd4', 'Nxd5', 'Nf3', 'g6'],
      comment:
        'Skip the queen sortie — regain the pawn with ...Nxd5 and fianchetto for quick, harmonious development.',
    },
  ],
};
