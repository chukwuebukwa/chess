import type { Opening } from '../types';

/** A Queen's Gambit repertoire for White (1.d4 d5 2.c4). */
export const queensGambit: Opening = {
  id: 'queens-gambit',
  name: "Queen's Gambit",
  side: 'white',
  description: 'Challenge the centre with 2.c4 and play for a lasting space edge.',
  lines: [
    {
      name: 'Queen’s Gambit Declined',
      eco: 'D37',
      moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O', 'Nf3'],
      comment:
        'The most solid reply for Black; White pins with Bg5 and develops harmoniously for a small, durable space edge.',
    },
    {
      name: 'Slav Defense',
      eco: 'D17',
      moves: ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'dxc4', 'a4', 'Bf5', 'e3'],
      comment:
        'When Black supports d5 with ...c6 and takes on c4, a4 stops ...b5 and e3 prepares to regain the pawn on c4.',
    },
    {
      name: 'Queen’s Gambit Accepted',
      eco: 'D27',
      moves: ['d4', 'd5', 'c4', 'dxc4', 'Nf3', 'Nf6', 'e3', 'e6', 'Bxc4', 'c5', 'O-O'],
      comment:
        'Don’t fight to keep the c4-pawn: recapture it naturally, castle, and use your central majority and lead in development.',
    },
    {
      name: 'Exchange Variation',
      eco: 'D35',
      moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'cxd5', 'exd5', 'Bg5', 'c6', 'e3'],
      comment:
        'The Carlsbad structure: White aims for the minority attack with b4–b5 to create a weakness on Black’s queenside.',
    },
  ],
};
