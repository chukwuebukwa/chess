import type { Opening } from '../types';

/** A Catalan repertoire for White (1.d4 Nf6 2.c4 e6 3.g3). */
export const catalan: Opening = {
  id: 'catalan',
  name: 'Catalan',
  side: 'white',
  description: 'A Queen’s-Gambit / fianchetto hybrid: lasting pressure on the long diagonal.',
  lines: [
    {
      name: 'Open Catalan',
      eco: 'E04',
      moves: ['d4', 'Nf6', 'c4', 'e6', 'g3', 'd5', 'Bg2', 'dxc4', 'Nf3', 'a6', 'O-O', 'Nc6', 'e3', 'Bd7', 'Qe2'],
      comment:
        'When Black takes on c4 and digs in with ...a6/...Nc6, calmly castle and play e3/Qe2 — the pawn comes back with a lasting pull.',
    },
    {
      name: 'Closed Catalan',
      eco: 'E06',
      moves: ['d4', 'Nf6', 'c4', 'e6', 'g3', 'd5', 'Bg2', 'Be7', 'Nf3', 'O-O', 'O-O'],
      comment:
        'If Black holds the centre with ...Be7, castle and squeeze: the g2-bishop gives White a risk-free pull.',
    },
    {
      name: 'Bogo-Catalan',
      eco: 'E11',
      moves: ['d4', 'Nf6', 'c4', 'e6', 'g3', 'Bb4+', 'Bd2', 'Be7', 'Bg2'],
      comment:
        'The ...Bb4+ check is best met by Bd2; after the bishop retreats you reach a comfortable Catalan a tempo up.',
    },
  ],
};
