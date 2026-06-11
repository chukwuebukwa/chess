import type { Opening } from '../types';

/** A King's Indian Defense repertoire for Black against 1.d4. */
export const kingsIndianDefense: Opening = {
  id: 'kings-indian-defense',
  name: "King's Indian Defense",
  side: 'black',
  description: 'Concede the centre, then blow it up with ...e5 and a kingside attack.',
  lines: [
    {
      name: 'Classical Variation',
      eco: 'E97',
      moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'Nf3', 'O-O', 'Be2', 'e5'],
      comment:
        'Let White build the big centre, then hit it with ...e5: White plays on the queenside, Black storms the kingside.',
    },
    {
      name: 'Fianchetto Variation',
      eco: 'E62',
      moves: ['d4', 'Nf6', 'c4', 'g6', 'Nf3', 'Bg7', 'g3', 'O-O', 'Bg2', 'd6', 'O-O', 'Nbd7'],
      comment:
        'White’s g3 setup is the solidest anti-KID; stay flexible with ...Nbd7 and prepare ...e5 or ...c5.',
    },
    {
      name: 'Sämisch Variation',
      eco: 'E80',
      moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'f3', 'O-O', 'Be3', 'e5'],
      comment:
        'Against the f3 wall, challenge the centre with ...e5; White’s big pawns can become targets if it opens.',
    },
    {
      name: 'Four Pawns Attack',
      eco: 'E76',
      moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'f4', 'O-O', 'Nf3', 'c5'],
      comment:
        'Meet White’s huge pawn front with the classical ...c5 break, hitting d4 before White finishes developing.',
    },
  ],
};
