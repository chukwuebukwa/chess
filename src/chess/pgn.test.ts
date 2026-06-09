import { describe, expect, it } from 'vitest';
import { parsePgnLines, pgnToOpening } from './pgn';

describe('parsePgnLines', () => {
  it('parses a plain mainline', () => {
    expect(parsePgnLines('1. e4 c6 2. d4 d5')).toEqual([
      ['e4', 'c6', 'd4', 'd5'],
    ]);
  });

  it('handles glued move numbers and a result token', () => {
    expect(parsePgnLines('1.e4 e5 2.Nf3 Nc6 1-0')).toEqual([
      ['e4', 'e5', 'Nf3', 'Nc6'],
    ]);
  });

  it('splits a single variation into two leaves branching at the right move', () => {
    // A variation immediately follows the move it replaces: here 3.exd5 is an
    // alternative to 3.e5, branching from the position before White's 3rd move.
    const lines = parsePgnLines('1. e4 c6 2. d4 d5 3. e5 (3. exd5 cxd5) 3... Bf5');
    expect(lines).toEqual([
      ['e4', 'c6', 'd4', 'd5', 'e5', 'Bf5'],
      ['e4', 'c6', 'd4', 'd5', 'exd5', 'cxd5'],
    ]);
  });

  it('handles nested variations', () => {
    const lines = parsePgnLines('1. e4 e5 2. Nf3 (2. Bc4 Nf6 (2... Bc5)) Nc6');
    expect(lines).toEqual([
      ['e4', 'e5', 'Nf3', 'Nc6'],
      ['e4', 'e5', 'Bc4', 'Nf6'],
      ['e4', 'e5', 'Bc4', 'Bc5'],
    ]);
  });

  it('strips brace comments, NAGs, and header tags', () => {
    const pgn = `[Event "Test"]\n[White "A"]\n\n1. e4 {best by test} $1 c6 2. d4 $14 d5 *`;
    expect(parsePgnLines(pgn)).toEqual([['e4', 'c6', 'd4', 'd5']]);
  });

  it('throws on unbalanced parentheses', () => {
    expect(() => parsePgnLines('1. e4 e5 (2. Nf3')).toThrow(/Unbalanced/);
  });

  it('throws when there are no moves', () => {
    expect(() => parsePgnLines('[Event "Empty"]\n\n*')).toThrow(/No moves/);
  });
});

describe('pgnToOpening', () => {
  it('builds a validated opening with named lines', () => {
    const opening = pgnToOpening('1. e4 c6 2. d4 d5 3. e5 (3. exd5 cxd5)', {
      id: 'test-ck',
      name: 'Test Caro',
      side: 'black',
      lineNames: ['Advance', 'Exchange'],
    });
    expect(opening.lines.map((l) => l.name)).toEqual(['Advance', 'Exchange']);
    expect(opening.lines).toHaveLength(2);
  });

  it('falls back to "Line N" names and rejects illegal moves', () => {
    expect(() =>
      pgnToOpening('1. e4 e4', { id: 'x', name: 'x', side: 'white' }),
    ).toThrow(/Illegal move/);
  });
});
