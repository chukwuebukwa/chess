import type { Opening } from '../types';

/** A Dutch Defense repertoire for Black (1.d4 f5). */
export const dutchDefense: Opening = {
  id: 'dutch-defense',
  name: 'Dutch Defense',
  side: 'black',
  description: 'Grab kingside space with 1...f5 and play for a direct attack.',
  lines: [
    {
      name: 'Stonewall',
      eco: 'A90',
      moves: ['d4', 'f5', 'g3', 'Nf6', 'Bg2', 'e6', 'Nf3', 'd5', 'O-O', 'Bd6'],
      comment:
        'Build the d5/e6/f5 wall and post the bishop on d6, eyeing a kingside pawn storm and ...Ne4.',
    },
    {
      name: 'Leningrad',
      eco: 'A87',
      moves: ['d4', 'f5', 'g3', 'Nf6', 'Bg2', 'g6', 'Nf3', 'Bg7', 'O-O', 'O-O'],
      comment:
        'A King’s-Indian-style Dutch: fianchetto, castle, and break with ...e5 (or ...d6 and ...e5) for active play.',
    },
    {
      name: 'Classical',
      eco: 'A96',
      moves: ['d4', 'f5', 'g3', 'Nf6', 'Bg2', 'e6', 'Nf3', 'Be7', 'O-O', 'O-O'],
      comment:
        'The flexible classical setup: complete development with ...Be7 and ...O-O before committing the centre.',
    },
  ],
};
