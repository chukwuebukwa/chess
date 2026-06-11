import type { Opening } from '../types';

/** A French Defense repertoire for Black (1.e4 e6). */
export const frenchDefense: Opening = {
  id: 'french-defense',
  name: 'French Defense',
  side: 'black',
  description: 'A resilient, counter-attacking answer to 1.e4 built on ...e6 and ...d5.',
  lines: [
    {
      name: 'Winawer Variation',
      eco: 'C18',
      moves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Bb4', 'e5', 'c5', 'a3', 'Bxc3+', 'bxc3', 'Ne7'],
      comment:
        'Pin the c3-knight and trade it off, handing White doubled c-pawns to target while you play on the queenside.',
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
  ],
};
