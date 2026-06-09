import { describe, expect, it } from 'vitest';
import {
  buildTree,
  compileLine,
  countLeaves,
  findNode,
  getLeaves,
  pathToNode,
} from './tree';
import { caroKann } from './openings';
import type { OpeningLine } from './types';

describe('compileLine', () => {
  it('captures per-ply metadata', () => {
    const moves = compileLine({ name: 't', moves: ['e4', 'c6', 'd4'] });
    expect(moves).toHaveLength(3);
    expect(moves[0]).toMatchObject({ san: 'e4', from: 'e2', to: 'e4', movedBy: 'w' });
    expect(moves[1]).toMatchObject({ san: 'c6', movedBy: 'b' });
  });

  it('throws a descriptive error on an illegal move', () => {
    const bad: OpeningLine = { name: 'bogus', moves: ['e4', 'e4'] };
    expect(() => compileLine(bad)).toThrowError(/Illegal move "e4" in line "bogus"/);
  });
});

describe('buildTree', () => {
  const tree = buildTree(caroKann.lines);

  it('collapses the shared opening trunk into single nodes', () => {
    // Every Caro-Kann line begins 1.e4 c6, so the root has exactly one child.
    expect(tree.children).toHaveLength(1);
    expect(tree.children[0]?.san).toBe('e4');

    const afterC6 = findNode(tree, 'e4 c6');
    expect(afterC6).not.toBeNull();
    // 2.d4 (five lines) and 2.Nc3 (the Two Knights) branch here.
    const secondMoves = afterC6!.children.map((c) => c.san).sort();
    expect(secondMoves).toEqual(['Nc3', 'd4']);
  });

  it('branches where White chooses a third move', () => {
    const afterD5 = findNode(tree, 'e4 c6 d4 d5');
    expect(afterD5).not.toBeNull();
    const thirdMoves = afterD5!.children.map((c) => c.san).sort();
    expect(thirdMoves).toEqual(['Nc3', 'e5', 'exd5', 'f3']);
  });

  it('produces one leaf per line', () => {
    expect(countLeaves(tree)).toBe(caroKann.lines.length);
    expect(getLeaves(tree)).toHaveLength(caroKann.lines.length);
  });

  it('tags every node with the variations passing through it', () => {
    const afterExd5 = findNode(tree, 'e4 c6 d4 d5 exd5 cxd5');
    expect(afterExd5!.variations.sort()).toEqual([
      'Exchange Variation',
      'Panov-Botvinnik Attack',
    ]);
  });

  it('records the FEN and side-to-move at each node', () => {
    const e4 = findNode(tree, 'e4');
    // After 1.e4 it is Black to move, and that is reflected in both the FEN
    // and the convenience `turn` field.
    expect(e4!.fen).toContain('b KQkq');
    expect(e4!.turn).toBe('b');
  });

  it('pathToNode returns the full root-to-leaf path', () => {
    const leaf = getLeaves(tree)[0]!;
    const path = pathToNode(tree, leaf.id);
    expect(path).not.toBeNull();
    expect(path![0]!.id).toBe(''); // root first
    expect(path![path!.length - 1]!.id).toBe(leaf.id);
  });
});
