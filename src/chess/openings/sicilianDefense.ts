import type { Opening } from '../types';

/**
 * A Sicilian Defense repertoire for Black. Covers the Open Sicilian main lines
 * (with the Najdorf split across White's three big 6th-move tries) plus the
 * anti-Sicilians every club player actually faces: Alapin, Closed, Grand Prix
 * and the Smith-Morra (declined into an Alapin-style centre).
 */
export const sicilianDefense: Opening = {
  id: 'sicilian-defense',
  name: 'Sicilian Defense',
  side: 'black',
  description: 'The fighting answer to 1.e4 — unbalance the game from move one.',
  lines: [
    {
      name: 'Najdorf: 6.Be2 Main Line',
      eco: 'B92',
      moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6', 'Be2', 'e5', 'Nb3', 'Be7'],
      comment:
        'Against the classical 6.Be2, stake the centre with ...e5: the d5-hole is well covered and ...Be7/...O-O follow naturally.',
    },
    {
      name: 'Najdorf: English Attack',
      eco: 'B90',
      moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6', 'Be3', 'e5', 'Nb3', 'Be6'],
      comment:
        'Versus 6.Be3 (heading for f3/Qd2/O-O-O), play ...e5 and ...Be6 and be ready to race with ...b5 on the queenside.',
    },
    {
      name: 'Najdorf: 6.Bg5',
      eco: 'B96',
      moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6', 'Bg5', 'e6', 'f4', 'Be7'],
      comment:
        'The sharpest try. Stay solid with ...e6 and ...Be7, sidestepping the wildest poisoned-pawn theory while keeping a sound game.',
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
    {
      name: 'Alapin (2.c3)',
      eco: 'B22',
      moves: ['e4', 'c5', 'c3', 'Nf6', 'e5', 'Nd5', 'd4', 'cxd4', 'Nf3', 'Nc6', 'cxd4', 'd6'],
      comment:
        'The main anti-Sicilian. ...Nf6 hits e4 immediately; after e5 Nd5 the knight is superbly placed and ...d6 dissolves White’s centre.',
    },
    {
      name: 'Smith-Morra Declined',
      eco: 'B22',
      moves: ['e4', 'c5', 'd4', 'cxd4', 'c3', 'Nf6', 'e5', 'Nd5', 'Nf3', 'Nc6', 'cxd4', 'd6'],
      comment:
        'Decline the gambit pawn with ...Nf6 and steer into the comfortable Alapin structure — no memorised gambit theory required.',
    },
    {
      name: 'Closed Sicilian',
      eco: 'B24',
      moves: ['e4', 'c5', 'Nc3', 'Nc6', 'g3', 'g6', 'Bg2', 'Bg7', 'd3', 'd6'],
      comment:
        'Mirror White’s fianchetto and expand on the queenside with ...Rb8/...b5 while White slowly builds with f4 on the other wing.',
    },
    {
      name: 'Grand Prix Attack',
      eco: 'B23',
      moves: ['e4', 'c5', 'Nc3', 'Nc6', 'f4', 'g6', 'Nf3', 'Bg7', 'Bb5', 'Nd4'],
      comment:
        'Against the f4 attack, fianchetto and meet Bb5 with ...Nd4 — trading off White’s attacking bishop defuses the assault.',
    },
  ],
};
