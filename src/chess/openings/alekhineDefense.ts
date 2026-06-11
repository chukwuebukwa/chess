import type { Opening } from '../types';

/** An Alekhine Defense repertoire for Black (1.e4 Nf6). */
export const alekhineDefense: Opening = {
  id: 'alekhine-defense',
  name: 'Alekhine Defense',
  side: 'black',
  description: 'Provoke White’s pawns forward with 1...Nf6, then attack the over-extended centre.',
  lines: [
    {
      name: 'Four Pawns Attack',
      eco: 'B03',
      moves: ['e4', 'Nf6', 'e5', 'Nd5', 'd4', 'd6', 'c4', 'Nb6', 'f4', 'dxe5', 'fxe5', 'Nc6'],
      comment:
        'Let White build the maximum centre, then strike it: ...dxe5 and ...Nc6 pile pressure on d4 and e5.',
    },
    {
      name: 'Modern Variation',
      eco: 'B04',
      moves: ['e4', 'Nf6', 'e5', 'Nd5', 'd4', 'd6', 'Nf3', 'dxe5', 'Nxe5', 'g6'],
      comment:
        'Against the restrained 4.Nf3, trade on e5 and fianchetto; Black’s pieces find natural, active squares.',
    },
    {
      name: 'Exchange Variation',
      eco: 'B03',
      moves: ['e4', 'Nf6', 'e5', 'Nd5', 'd4', 'd6', 'c4', 'Nb6', 'exd6', 'cxd6'],
      comment:
        'After exd6, recapture with the c-pawn to open the c-file and keep a sound, flexible structure.',
    },
  ],
};
