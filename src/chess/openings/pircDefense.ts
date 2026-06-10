import type { Opening } from '../types';

/** A Pirc Defense repertoire for Black (1.e4 d6 2.d4 Nf6 3.Nc3 g6). */
export const pircDefense: Opening = {
  id: 'pirc-defense',
  name: 'Pirc Defense',
  side: 'black',
  description: 'Hand White the centre, then chip away at it from a fianchetto.',
  lines: [
    {
      name: 'Classical Variation',
      eco: 'B08',
      moves: ['e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6', 'Nf3', 'Bg7', 'Be2', 'O-O'],
      comment:
        'The standard hypermodern setup: fianchetto, castle, and prepare ...e5 or ...c5 to hit the centre.',
    },
    {
      name: 'Austrian Attack',
      eco: 'B09',
      moves: ['e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6', 'f4', 'Bg7', 'Nf3', 'O-O'],
      comment:
        'Against White’s big f4 centre, castle first and counter later with ...c5 or ...e5 once you’re developed.',
    },
    {
      name: '150 Attack',
      eco: 'B07',
      moves: ['e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'Qd2', 'c6'],
      comment:
        'Meet the Be3/Qd2-and-castle-long plan with ...c6, preparing ...b5 to attack on the same wing White does.',
    },
  ],
};
