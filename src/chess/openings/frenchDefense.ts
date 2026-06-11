import type { Opening } from '../types';

/** A French Defense repertoire for Black (1.e4 e6). */
export const frenchDefense: Opening = {
  id: 'french-defense',
  name: 'French Defense',
  side: 'black',
  description: 'A resilient, counter-attacking answer to 1.e4 built on ...e6 and ...d5.',
  lines: [
    {
      name: 'Winawer: Poisoned Pawn',
      eco: 'C18',
      moves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Bb4', 'e5', 'c5', 'a3', 'Bxc3+', 'bxc3', 'Ne7', 'Qg4', 'Qc7', 'Qxg7', 'Rg8', 'Qxh7', 'cxd4'],
      comment:
        'The critical main line: let White grab g7 and h7 — your play down the g-file and against the loose white king is full compensation.',
    },
    {
      name: 'Winawer: 7.Nf3',
      eco: 'C18',
      moves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Bb4', 'e5', 'c5', 'a3', 'Bxc3+', 'bxc3', 'Ne7', 'Nf3', 'Qa5'],
      comment:
        'Against the quieter 7.Nf3, hit the doubled c-pawns immediately with ...Qa5 before deciding on ...Nbc6 or ...Bd7-a4.',
    },
    {
      name: 'Classical Variation',
      eco: 'C11',
      moves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e5', 'Nfd7'],
      comment:
        'Develop naturally; after e5 retreat with ...Nfd7 and undermine the chain with ...c5 and ...f6.',
    },
    {
      name: 'Advance Variation',
      eco: 'C02',
      moves: ['e4', 'e6', 'd4', 'd5', 'e5', 'c5', 'c3', 'Nc6', 'Nf3', 'Qb6'],
      comment:
        'Strike the d4/e5 chain at its base with ...c5 and pile up on d4 with ...Nc6 and ...Qb6.',
    },
    {
      name: 'Tarrasch Variation',
      eco: 'C03',
      moves: ['e4', 'e6', 'd4', 'd5', 'Nd2', 'c5', 'exd5', 'exd5', 'Ngf3', 'Nc6'],
      comment:
        'Against the flexible Nd2, free your game immediately with ...c5 and accept an isolated d-pawn for active pieces.',
    },
    {
      name: 'Exchange Variation',
      eco: 'C01',
      moves: ['e4', 'e6', 'd4', 'd5', 'exd5', 'exd5', 'Nf3', 'Nf6', 'Bd3', 'Bd6'],
      comment:
        'The symmetric exchange is no draw offer: develop actively (...Bd6, ...O-O, ...Bg4) and play for the initiative on equal structure.',
    },
  ],
};
