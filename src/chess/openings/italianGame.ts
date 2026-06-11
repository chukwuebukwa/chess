import type { Opening } from '../types';

/**
 * An Italian Game repertoire for White — included to prove the trainer works
 * from either colour. Black's three main third-move replies (...Bc5, ...Nf6,
 * ...Be7) all branch from the shared 1.e4 e5 2.Nf3 Nc6 3.Bc4 trunk, so White
 * drills the correct response to each.
 */
export const italianGame: Opening = {
  id: 'italian-game',
  name: 'Italian Game',
  side: 'white',
  description: 'Classical 1.e4 e5 development with the bishop on c4.',
  lines: [
    {
      name: 'Giuoco Pianissimo',
      eco: 'C50',
      moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd3', 'd6', 'O-O', 'a6', 'Re1', 'Ba7', 'h3', 'O-O', 'Nbd2'],
      comment:
        'The modern main line: build slowly with c3 and d3, castle, then h3 and Nbd2-f1-g3 with a later d4 break — the plan that carries dozens of moves.',
    },
    {
      name: 'Two Knights Defense',
      eco: 'C57',
      moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Na5', 'Bb5+'],
      comment:
        'When Black allows it, 4.Ng5 hits f7. After ...d5 exd5 Na5, retreat the bishop with check via Bb5+ rather than grabbing the pawn.',
    },
    {
      name: 'Hungarian Defense',
      eco: 'C50',
      moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Be7', 'd4', 'exd4', 'Nxd4'],
      comment:
        'Against the passive ...Be7, seize the centre immediately with d4: after ...exd4 Nxd4 White has a free, comfortable game.',
    },
  ],
};
