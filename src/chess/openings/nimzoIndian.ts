import type { Opening } from '../types';

/** A Nimzo-Indian Defense repertoire for Black (1.d4 Nf6 2.c4 e6 3.Nc3 Bb4). */
export const nimzoIndian: Opening = {
  id: 'nimzo-indian',
  name: 'Nimzo-Indian Defense',
  side: 'black',
  description: 'Pin the c3-knight with 3...Bb4 to fight for the centre with pieces, not pawns.',
  lines: [
    {
      name: 'Rubinstein Variation',
      eco: 'E46',
      moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'e3', 'O-O', 'Bd3', 'd5', 'Nf3', 'c5', 'O-O', 'cxd4', 'exd4', 'dxc4', 'Bxc4', 'b6'],
      comment:
        'The Karpov plan: liquidate the centre, then blockade White’s isolated d-pawn with ...Bb7 and ...Nbd7-f6 — a model IQP defence.',
    },
    {
      name: 'Classical Variation',
      eco: 'E32',
      moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'Qc2', 'O-O', 'a3', 'Bxc3+', 'Qxc3', 'b6'],
      comment:
        'When White spends time on Qc2 to avoid doubled pawns, trade on c3 and fianchetto to blockade the dark squares.',
    },
    {
      name: 'Sämisch Variation',
      eco: 'E25',
      moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'a3', 'Bxc3+', 'bxc3', 'c5'],
      comment:
        'If White grabs the bishop pair with a3, give White doubled c-pawns and clamp them with ...c5.',
    },
  ],
};
