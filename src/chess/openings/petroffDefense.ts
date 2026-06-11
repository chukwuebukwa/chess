import type { Opening } from '../types';

/** A Petroff (Russian) Defense repertoire for Black (1.e4 e5 2.Nf3 Nf6). */
export const petroffDefense: Opening = {
  id: 'petroff-defense',
  name: 'Petroff Defense',
  side: 'black',
  description: 'Answer 2.Nf3 with the symmetrical 2...Nf6 — solid and hard to crack.',
  lines: [
    {
      name: 'Classical Variation',
      eco: 'C42',
      moves: ['e4', 'e5', 'Nf3', 'Nf6', 'Nxe5', 'd6', 'Nf3', 'Nxe4', 'd4', 'd5', 'Bd3', 'Nc6', 'O-O', 'Be7', 'c4', 'Nb4', 'Be2', 'O-O'],
      comment:
        'The full classical tabiya: when c4 hits d5, ...Nb4 harasses the d3-bishop before you castle into a famously resilient position.',
    },
    {
      name: 'Nimzowitsch Attack',
      eco: 'C42',
      moves: ['e4', 'e5', 'Nf3', 'Nf6', 'Nxe5', 'd6', 'Nf3', 'Nxe4', 'Nc3', 'Nxc3', 'dxc3', 'Be7'],
      comment:
        'If White trades knights on c3, simply complete development; the doubled c-pawns give Black an easy game.',
    },
    {
      name: 'Four Knights',
      eco: 'C42',
      moves: ['e4', 'e5', 'Nf3', 'Nf6', 'Nc3', 'Nc6', 'Bb5', 'Bb4'],
      comment:
        'When White avoids 3.Nxe5 with 3.Nc3, transpose to the Four Knights and mirror with ...Nc6 and ...Bb4.',
    },
  ],
};
