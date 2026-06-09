import type { Opening } from '../types';

/**
 * A compact but real Caro-Kann repertoire for Black. White's main third-move
 * tries (e5, exd5, c4 via the exchange, Nc3, f3) all branch from the shared
 * 1.e4 c6 2.d4 d5 trunk, plus the early 2.Nc3 sideline — so the trainer drills
 * a genuine cross-section of what you actually face after 1...c6.
 */
export const caroKann: Opening = {
  id: 'caro-kann',
  name: 'Caro-Kann Defense',
  side: 'black',
  description: 'A solid, structurally sound answer to 1.e4 for Black.',
  lines: [
    {
      name: 'Advance Variation',
      eco: 'B12',
      moves: ['e4', 'c6', 'd4', 'd5', 'e5', 'Bf5', 'Nf3', 'e6', 'Be2', 'c5', 'Be3', 'Qb6'],
      comment:
        'Get the light-squared bishop outside the pawn chain with ...Bf5 before playing ...e6, then strike the d4/e5 base with ...c5 and pressure it with ...Qb6.',
    },
    {
      name: 'Exchange Variation',
      eco: 'B13',
      moves: ['e4', 'c6', 'd4', 'd5', 'exd5', 'cxd5', 'Bd3', 'Nc6', 'c3', 'Nf6', 'Bf4', 'Bg4'],
      comment:
        'A Carlsbad structure where Black develops naturally: ...Nc6, ...Nf6, and ...Bg4 to pin and trade off White’s active pieces.',
    },
    {
      name: 'Panov-Botvinnik Attack',
      eco: 'B14',
      moves: ['e4', 'c6', 'd4', 'd5', 'exd5', 'cxd5', 'c4', 'Nf6', 'Nc3', 'e6', 'Nf3', 'Bb4'],
      comment:
        'Against the aggressive c4, treat it like a Nimzo/QGD: ...e6 and ...Bb4 pinning the c3-knight to fight for the centre.',
    },
    {
      name: 'Classical Main Line',
      eco: 'B19',
      moves: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Bf5', 'Ng3', 'Bg6', 'h4', 'h6', 'Nf3', 'Nd7'],
      comment:
        'The classical ...Bf5 setup: trade on e4, develop the bishop to its best diagonal, and meet h4-h5 with ...h6 to keep the bishop on g6.',
    },
    {
      name: 'Two Knights Attack',
      eco: 'B11',
      moves: ['e4', 'c6', 'Nc3', 'd5', 'Nf3', 'Bg4', 'h3', 'Bxf3', 'Qxf3', 'e6'],
      comment:
        'Against 2.Nc3 and 3.Nf3, pin with ...Bg4 and trade it for the knight after h3, leaving White with a slightly loose structure.',
    },
    {
      name: 'Fantasy Variation',
      eco: 'B12',
      moves: ['e4', 'c6', 'd4', 'd5', 'f3', 'dxe4', 'fxe4', 'e5'],
      comment:
        'The principled reply to 3.f3: take on e4 and hit the centre immediately with ...e5, exploiting White’s slightly weakened king.',
    },
  ],
};
