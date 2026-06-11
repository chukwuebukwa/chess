import type { Opening } from '../types';

/** A King's Gambit repertoire for White (1.e4 e5 2.f4). */
export const kingsGambit: Opening = {
  id: 'kings-gambit',
  name: "King's Gambit",
  side: 'white',
  description: 'The romantic gambit: offer the f-pawn for a roaring initiative.',
  lines: [
    {
      name: 'Kieseritzky Gambit',
      eco: 'C39',
      moves: ['e4', 'e5', 'f4', 'exf4', 'Nf3', 'g5', 'h4', 'g4', 'Ne5'],
      comment:
        'When Black grabs and holds with ...g5, undermine it with h4 and leap into e5 — the classical main line.',
    },
    {
      name: 'King’s Gambit Declined',
      eco: 'C30',
      moves: ['e4', 'e5', 'f4', 'Bc5', 'Nf3', 'd6', 'Nc3', 'Nf6', 'Bc4'],
      comment:
        'Against the solid ...Bc5 (which stops O-O), develop naturally and keep the option of f4xe5 in hand.',
    },
    {
      name: 'Falkbeer Countergambit',
      eco: 'C31',
      moves: ['e4', 'e5', 'f4', 'd5', 'exd5', 'e4', 'd3', 'Nf6', 'dxe4', 'Nxe4', 'Nf3'],
      comment:
        'Meet the ...d5 counter-strike with exd5 and d3, returning the pawn to complete development with Nf3.',
    },
  ],
};
