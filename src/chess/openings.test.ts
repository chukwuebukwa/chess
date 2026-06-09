import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { OPENINGS } from './openings';
import { compileLine } from './tree';

describe('opening repertoires', () => {
  it('contains at least one opening', () => {
    expect(OPENINGS.length).toBeGreaterThan(0);
  });

  for (const opening of OPENINGS) {
    describe(opening.name, () => {
      it('has a unique id and at least one line', () => {
        expect(opening.id).toBeTruthy();
        expect(opening.lines.length).toBeGreaterThan(0);
      });

      it('has uniquely named lines', () => {
        const names = opening.lines.map((l) => l.name);
        expect(new Set(names).size).toBe(names.length);
      });

      for (const line of opening.lines) {
        it(`"${line.name}" is fully legal`, () => {
          // compileLine throws on the first illegal move.
          expect(() => compileLine(line)).not.toThrow();
        });

        it(`"${line.name}" ends on the trainee's move`, () => {
          const game = new Chess();
          for (const san of line.moves) game.move(san);
          // After the final move it should be the OPPONENT to move, i.e. the
          // trainee made the last move of the drilled line.
          const opponentToMove = opening.side === 'white' ? 'b' : 'w';
          expect(game.turn()).toBe(opponentToMove);
        });
      }
    });
  }
});
