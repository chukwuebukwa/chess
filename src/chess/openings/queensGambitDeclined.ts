import type { Opening } from '../types';

/** A Queen's Gambit Declined repertoire for Black (1.d4 d5 2.c4 e6). */
export const queensGambitDeclined: Opening = {
  id: 'qgd',
  name: "Queen's Gambit Declined",
  side: 'black',
  description: 'The classical answer to 1.d4: hold d5 with ...e6 and outlast the pressure.',
  lines: [
    {
      name: 'Tartakower Variation',
      eco: 'D58',
      moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O', 'Nf3', 'h6', 'Bh4', 'b6'],
      comment:
        'The great championship workhorse: ...h6 and ...b6 fianchetto the bishop to b7, solving Black’s one problem piece.',
    },
    {
      name: 'Exchange Variation',
      eco: 'D35',
      moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'cxd5', 'exd5', 'Bg5', 'c6', 'e3', 'Be7', 'Bd3', 'Nbd7'],
      comment:
        'In the Carlsbad structure, set up ...c6/...Be7/...Nbd7 and meet the minority attack with a timely ...b5-block or kingside play with ...Ne4.',
    },
    {
      name: 'vs Catalan',
      eco: 'E04',
      moves: ['d4', 'd5', 'c4', 'e6', 'Nf3', 'Nf6', 'g3', 'Be7', 'Bg2', 'O-O', 'O-O', 'dxc4', 'Qc2', 'a6', 'Qxc4', 'b5'],
      comment:
        'Against the Catalan squeeze, castle first, then grab c4 and expand with ...a6/...b5/...Bb7 — equalising with active queenside play.',
    },
  ],
};
