import type { Opening } from '../types';

/** A Vienna Game repertoire for White (1.e4 e5 2.Nc3). */
export const viennaGame: Opening = {
  id: 'vienna-game',
  name: 'Vienna Game',
  side: 'white',
  description: 'Develop the knight first, keeping an early f4 break in reserve.',
  lines: [
    {
      name: 'Vienna Gambit',
      eco: 'C29',
      moves: ['e4', 'e5', 'Nc3', 'Nf6', 'f4', 'd5', 'fxe5', 'Nxe4', 'Nf3'],
      comment:
        'The point of 2.Nc3: follow with f4. Against 3...d5 take on e5 and develop Nf3 with a lively game.',
    },
    {
      name: 'Mieses Variation',
      eco: 'C26',
      moves: ['e4', 'e5', 'Nc3', 'Nf6', 'g3', 'd5', 'exd5', 'Nxd5', 'Bg2'],
      comment:
        'A quieter setup: fianchetto the bishop and pressure the centre and the d5-square along the long diagonal.',
    },
    {
      name: 'Stanley Variation',
      eco: 'C26',
      moves: ['e4', 'e5', 'Nc3', 'Nf6', 'Bc4', 'Bc5', 'd3', 'd6', 'Nf3'],
      comment:
        'A Bishop’s-Opening flavour: Bc4, d3 and Nf3 for a solid, flexible position aiming at f7.',
    },
  ],
};
