import { describe, expect, it } from 'vitest';
import {
  buildImportedOpening,
  deriveLineNames,
  previewPgn,
  slugify,
  uniqueId,
} from './importOpening';
import { buildTree, getLeaves } from './tree';

describe('slugify / uniqueId', () => {
  it('slugifies names safely', () => {
    expect(slugify('My Caro-Kann!')).toBe('my-caro-kann');
    expect(slugify('   ')).toBe('opening');
  });

  it('de-duplicates ids against a taken set', () => {
    expect(uniqueId('caro', new Set())).toBe('caro');
    expect(uniqueId('caro', new Set(['caro']))).toBe('caro-2');
    expect(uniqueId('caro', new Set(['caro', 'caro-2']))).toBe('caro-3');
  });
});

describe('deriveLineNames', () => {
  it('names a single line "Main line"', () => {
    expect(deriveLineNames([['e4', 'e5', 'Nf3']])).toEqual(['Main line']);
  });

  it('names lines by their divergence move', () => {
    const paths = [
      ['e4', 'c6', 'd4', 'd5', 'e5', 'Bf5'],
      ['e4', 'c6', 'd4', 'd5', 'exd5', 'cxd5'],
      ['e4', 'c6', 'Nc3', 'd5'],
    ];
    expect(deriveLineNames(paths)).toEqual(['3.e5', '3.exd5', '2.Nc3']);
  });

  it('disambiguates colliding names with a suffix', () => {
    const names = deriveLineNames([
      ['e4', 'e5', 'Nf3'],
      ['e4', 'e5', 'Nf3'],
    ]);
    expect(names[0]).not.toBe(names[1]);
  });
});

describe('buildImportedOpening', () => {
  const pgn = '1. e4 e5 2. Nf3 (2. Bc4 Nf6) 2... Nc6';

  it('builds a drillable opening from a PGN with variations', () => {
    const opening = buildImportedOpening({ name: 'My Test', side: 'white', pgn }, new Set());
    expect(opening.id).toBe('my-test');
    expect(opening.side).toBe('white');
    expect(opening.lines).toHaveLength(2);
    // It assembles into a legal move tree with one leaf per line.
    expect(getLeaves(buildTree(opening.lines))).toHaveLength(2);
  });

  it('respects taken ids', () => {
    const opening = buildImportedOpening(
      { name: 'My Test', side: 'white', pgn },
      new Set(['my-test']),
    );
    expect(opening.id).toBe('my-test-2');
  });

  it('throws on an illegal move', () => {
    expect(() =>
      buildImportedOpening({ name: 'Bad', side: 'white', pgn: '1. e4 e4' }, new Set()),
    ).toThrow();
  });
});

describe('previewPgn', () => {
  it('flags an empty PGN', () => {
    expect(previewPgn('')).toEqual({ ok: false, error: 'Paste a PGN to import.' });
  });

  it('summarises a valid PGN', () => {
    const result = previewPgn('1. e4 e5 2. Nf3 Nc6');
    expect(result).toMatchObject({ ok: true, lines: 1, moves: 4, names: ['Main line'] });
  });

  it('surfaces a legality error', () => {
    const result = previewPgn('1. e4 e4');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/Illegal/);
  });
});
