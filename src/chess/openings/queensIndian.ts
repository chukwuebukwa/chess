import type { Opening } from '../types';

/**
 * A Queen's Indian repertoire for Black — the essential companion to the
 * Nimzo-Indian for when White plays 3.Nf3 instead of 3.Nc3.
 */
export const queensIndian: Opening = {
  id: 'queens-indian',
  name: "Queen's Indian Defense",
  side: 'black',
  description: 'Versus 3.Nf3: control e4 from afar with ...b6 and the long diagonal.',
  lines: [
    {
      name: 'Modern Main Line (4...Ba6)',
      eco: 'E15',
      moves: ['d4', 'Nf6', 'c4', 'e6', 'Nf3', 'b6', 'g3', 'Ba6', 'b3', 'Bb4+', 'Bd2', 'Be7'],
      comment:
        'The modern point: ...Ba6 attacks c4 and forces a concession; the ...Bb4+ zwischenzug leaves White’s bishop passive on d2.',
    },
    {
      name: 'Classical Fianchetto',
      eco: 'E16',
      moves: ['d4', 'Nf6', 'c4', 'e6', 'Nf3', 'b6', 'g3', 'Bb7', 'Bg2', 'Be7', 'O-O', 'O-O'],
      comment:
        'The classical tabiya: both bishops eye e4; Black completes development and chooses between ...d5, ...c5 and ...Ne4 plans.',
    },
    {
      name: 'Petrosian Variation',
      eco: 'E12',
      moves: ['d4', 'Nf6', 'c4', 'e6', 'Nf3', 'b6', 'a3', 'Bb7', 'Nc3', 'd5'],
      comment:
        'White’s a3 stops ...Bb4 but spends a tempo — strike in the centre at once with ...d5 and develop naturally.',
    },
  ],
};
