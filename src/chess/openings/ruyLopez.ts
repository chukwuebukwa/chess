import type { Opening } from '../types';

/** A Ruy Lopez (Spanish) repertoire for White — the classical 3.Bb5. */
export const ruyLopez: Opening = {
  id: 'ruy-lopez',
  name: 'Ruy Lopez',
  side: 'white',
  description: 'The Spanish: pressure the e5-pawn via the c6-knight with 3.Bb5.',
  lines: [
    {
      name: 'Closed Main Line',
      eco: 'C84',
      moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'd6', 'c3', 'O-O', 'h3', 'Na5', 'Bc2', 'c5', 'd4'],
      comment:
        'The classical Spanish through the Chigorin tabiya: h3 stops ...Bg4, the bishop drops back to c2, and d4 finally claims the full centre.',
    },
    {
      name: 'Berlin Defense',
      eco: 'C67',
      moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6', 'O-O', 'Nxe4', 'd4', 'Nd6', 'Bxc6', 'dxc6', 'dxe5', 'Nf5', 'Qxd8+', 'Kxd8', 'h3'],
      comment:
        'The famous Berlin Wall — trade into the endgame with Qxd8+. White has a structural plus; Black has the bishop pair.',
    },
    {
      name: 'Exchange Variation',
      eco: 'C68',
      moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Bxc6', 'dxc6', 'O-O'],
      comment:
        'Trade on c6 to damage Black’s pawns and steer toward an endgame where White’s healthy majority can tell.',
    },
    {
      name: 'Open Variation',
      eco: 'C80',
      moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Nxe4', 'd4', 'b5', 'Bb3', 'd5', 'dxe5', 'Be6', 'c3'],
      comment:
        'Black grabs e4 and holds with ...d5; c3 supports the centre and prepares to round up the e4-knight.',
    },
  ],
};
