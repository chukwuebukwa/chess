import { describe, expect, it } from 'vitest';
import {
  countDue,
  dueLabel,
  dueState,
  gradeLine,
  orderLeavesForReview,
  type ReviewMap,
} from './srs';

const DAY = 24 * 60 * 60 * 1000;
const NOW = 1_750_000_000_000;

describe('gradeLine', () => {
  it('schedules a first clean pass one day out', () => {
    const rec = gradeLine(undefined, true, NOW);
    expect(rec.reps).toBe(1);
    expect(rec.intervalDays).toBe(1);
    expect(rec.due).toBe(NOW + DAY);
    expect(rec.lastResult).toBe('pass');
  });

  it('walks the early ladder then grows multiplicatively', () => {
    let rec = gradeLine(undefined, true, NOW); // 1d
    rec = gradeLine(rec, true, NOW); // 3d
    rec = gradeLine(rec, true, NOW); // 7d
    expect(rec.intervalDays).toBe(7);
    rec = gradeLine(rec, true, NOW);
    expect(rec.intervalDays).toBe(Math.round(7 * 2.2)); // 15
    expect(rec.reps).toBe(4);
  });

  it('caps the interval at 60 days', () => {
    let rec = gradeLine(undefined, true, NOW);
    for (let i = 0; i < 10; i += 1) rec = gradeLine(rec, true, NOW);
    expect(rec.intervalDays).toBeLessThanOrEqual(60);
  });

  it('a fail resets reps, counts a lapse, and comes back soon', () => {
    let rec = gradeLine(undefined, true, NOW);
    rec = gradeLine(rec, true, NOW);
    rec = gradeLine(rec, false, NOW);
    expect(rec.reps).toBe(0);
    expect(rec.lapses).toBe(1);
    expect(rec.intervalDays).toBe(0);
    expect(rec.due - NOW).toBe(10 * 60 * 1000);
    // Failing while still unlearned does not add another lapse.
    rec = gradeLine(rec, false, NOW);
    expect(rec.lapses).toBe(1);
  });
});

describe('dueState / countDue / dueLabel', () => {
  const pastDue = gradeLine(undefined, true, NOW - 2 * DAY); // due NOW-1d
  const future = gradeLine(undefined, true, NOW); // due NOW+1d

  it('classifies records', () => {
    expect(dueState(undefined, NOW)).toBe('new');
    expect(dueState(pastDue, NOW)).toBe('due');
    expect(dueState(future, NOW)).toBe('scheduled');
  });

  it('counts due and optionally new lines', () => {
    const records: ReviewMap = { a: pastDue, b: future };
    expect(countDue(['a', 'b', 'c'], records, NOW)).toBe(2); // a due + c new
    expect(countDue(['a', 'b', 'c'], records, NOW, { includeNew: false })).toBe(1);
  });

  it('labels next-due times', () => {
    expect(dueLabel(undefined, NOW)).toBe('new');
    expect(dueLabel(pastDue, NOW)).toBe('due');
    expect(dueLabel(future, NOW)).toBe('1d');
    expect(dueLabel(gradeLine(undefined, false, NOW), NOW)).toBe('today');
  });
});

describe('orderLeavesForReview', () => {
  it('puts overdue first (most overdue leading), then new, then scheduled', () => {
    const records: ReviewMap = {
      overdueOld: gradeLine(undefined, true, NOW - 10 * DAY),
      overdueRecent: gradeLine(undefined, true, NOW - 2 * DAY),
      soon: gradeLine(undefined, true, NOW - 0.5 * DAY), // due in 0.5d
      later: { ...gradeLine(undefined, true, NOW), due: NOW + 3 * DAY },
    };
    const order = orderLeavesForReview(
      ['later', 'fresh1', 'soon', 'overdueRecent', 'fresh2', 'overdueOld'],
      records,
      NOW,
    );
    expect(order).toEqual([
      'overdueOld',
      'overdueRecent',
      'fresh1',
      'fresh2',
      'soon',
      'later',
    ]);
  });

  it('keeps natural order among new lines', () => {
    expect(orderLeavesForReview(['x', 'y', 'z'], {}, NOW)).toEqual(['x', 'y', 'z']);
  });
});
