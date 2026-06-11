import type { Opening } from '../types';

/** A London System repertoire for White — the easy-to-learn d4/Bf4 setup. */
export const londonSystem: Opening = {
  id: 'london-system',
  name: 'London System',
  side: 'white',
  description: 'A solid, low-theory system: d4, Bf4, e3 against almost anything.',
  lines: [
    {
      name: 'Main Line',
      eco: 'D02',
      moves: ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'e6', 'Nf3', 'c5', 'c3', 'Nc6', 'Nbd2'],
      comment:
        'The London pyramid (d4/e3/Bf4). Meet ...c5 with c3 and Nbd2, keeping a rock-solid structure and the bishop on f4.',
    },
    {
      name: 'vs King’s Indian Setup',
      eco: 'A48',
      moves: ['d4', 'Nf6', 'Bf4', 'g6', 'Nf3', 'Bg7', 'e3', 'O-O', 'Be2', 'd6', 'h3'],
      comment:
        'Against a kingside fianchetto, tuck the king away with Be2 and play h3 so ...Nh5 never harasses the f4-bishop.',
    },
    {
      name: 'vs Early ...c5',
      eco: 'D02',
      moves: ['d4', 'd5', 'Bf4', 'c5', 'e3', 'Nc6', 'c3', 'Nf6', 'Nbd2'],
      comment:
        'Hold the centre with c3 and develop the knight to d2; the f4-bishop keeps an eye on the c7/b8 squares.',
    },
  ],
};
