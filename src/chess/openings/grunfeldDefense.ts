import type { Opening } from '../types';

/** A Grünfeld Defense repertoire for Black (1.d4 Nf6 2.c4 g6 3.Nc3 d5). */
export const grunfeldDefense: Opening = {
  id: 'grunfeld-defense',
  name: 'Grünfeld Defense',
  side: 'black',
  description: 'Strike the centre with ...d5, then dismantle White’s big pawns from g7.',
  lines: [
    {
      name: 'Exchange Variation',
      eco: 'D85',
      moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5', 'cxd5', 'Nxd5', 'e4', 'Nxc3', 'bxc3', 'Bg7'],
      comment:
        'The main battleground: let White build the e4/d4 centre, then target it with ...Bg7, ...c5 and ...Qa5.',
    },
    {
      name: 'Russian System',
      eco: 'D97',
      moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5', 'Nf3', 'Bg7', 'Qb3', 'dxc4', 'Qxc4', 'O-O'],
      comment:
        'Against Qb3, give up the centre pawn and castle; ...Nbd7/...c5 (or ...a6/...b5) gives quick counterplay.',
    },
    {
      name: 'Bf4 System',
      eco: 'D83',
      moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5', 'Bf4', 'Bg7', 'e3', 'O-O'],
      comment:
        'The solid Bf4 line: castle and prepare ...c5, hitting d4 before White completes development.',
    },
  ],
};
