import type { Opening } from '../types';

/** A Scotch Game repertoire for White (1.e4 e5 2.Nf3 Nc6 3.d4). */
export const scotchGame: Opening = {
  id: 'scotch-game',
  name: 'Scotch Game',
  side: 'white',
  description: 'Open the centre at once with 3.d4 for fast, free piece play.',
  lines: [
    {
      name: 'Classical Variation',
      eco: 'C45',
      moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Bc5', 'Be3', 'Qf6', 'c3'],
      comment:
        'Meet ...Bc5 with Be3 and c3, building a broad centre while keeping the d4-knight defended.',
    },
    {
      name: 'Mieses Variation',
      eco: 'C45',
      moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Nf6', 'Nxc6', 'bxc6', 'e5'],
      comment:
        'Against 4...Nf6, trade on c6 and gain space with e5, hitting the f6-knight — the modern main line.',
    },
    {
      name: 'Scotch Gambit',
      eco: 'C44',
      moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Bc4', 'Bc5', 'c3'],
      comment:
        'Sacrifice the d4-pawn temporarily: Bc4 and c3 aim for a big centre and a quick attack on f7.',
    },
  ],
};
