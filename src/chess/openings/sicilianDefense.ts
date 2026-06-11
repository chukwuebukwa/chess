import type { Opening } from '../types';

/** A Sicilian Defense repertoire for Black against the Open Sicilian. */
export const sicilianDefense: Opening = {
  id: 'sicilian-defense',
  name: 'Sicilian Defense',
  side: 'black',
  description: 'The fighting answer to 1.e4 — unbalance the game from move one.',
  lines: [
    {
      name: 'Najdorf Variation',
      eco: 'B90',
      moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'],
      comment:
        'The most flexible Sicilian: ...a6 controls b5 and waits to choose between ...e5 and ...e6 based on White’s plan.',
    },
    {
      name: 'Dragon Variation',
      eco: 'B70',
      moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6'],
      comment:
        'Fianchetto to g7 and castle fast; both sides attack on opposite wings in some of the sharpest chess there is.',
    },
    {
      name: 'Accelerated Dragon',
      eco: 'B35',
      moves: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'g6', 'Nc3', 'Bg7', 'Be3', 'Nf6'],
      comment:
        'Delay ...d6 to hit d4 quickly with ...Bg7. Be ready for the Maroczy Bind, but enjoy free, easy piece play.',
    },
    {
      name: 'Sveshnikov Variation',
      eco: 'B33',
      moves: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'e5'],
      comment:
        '...e5 kicks the d4-knight and accepts a backward d-pawn in return for active pieces and the bishop pair.',
    },
  ],
};
