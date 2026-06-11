/**
 * Spaced-repetition scheduling for opening lines — a deliberately simple
 * SM-2-style scheme. Each drillable line (tree leaf) has a review record;
 * completing a line cleanly pushes its next review further out, while any
 * mistake (wrong try, hint, or reveal) sends it back to the front.
 *
 * Pure module: time is always passed in, so every behaviour is testable.
 */

export interface ReviewRecord {
  /** Consecutive clean completions. */
  reps: number;
  /** Times the line was failed after previously being learned. */
  lapses: number;
  /** Current interval in days (0 until first clean completion). */
  intervalDays: number;
  /** Epoch ms when the line is next due. */
  due: number;
  /** Most recent grade. */
  lastResult: 'pass' | 'fail';
  /** Epoch ms of the last review. */
  reviewedAt: number;
}

/** Review records for one opening, keyed by leaf id. */
export type ReviewMap = Record<string, ReviewRecord>;

const DAY_MS = 24 * 60 * 60 * 1000;
/** A failed line comes back after a short cool-off rather than instantly. */
const RELEARN_MS = 10 * 60 * 1000;
/** Interval ladder for early reps; afterwards the interval multiplies. */
const EARLY_INTERVALS_DAYS = [1, 3, 7];
const GROWTH = 2.2;
const MAX_INTERVAL_DAYS = 60;

/** Grade a completed line and return its updated review record. */
export function gradeLine(
  record: ReviewRecord | undefined,
  pass: boolean,
  now: number,
): ReviewRecord {
  if (!pass) {
    return {
      reps: 0,
      lapses: (record?.lapses ?? 0) + (record && record.reps > 0 ? 1 : 0),
      intervalDays: 0,
      due: now + RELEARN_MS,
      lastResult: 'fail',
      reviewedAt: now,
    };
  }

  const reps = (record?.reps ?? 0) + 1;
  const intervalDays =
    reps <= EARLY_INTERVALS_DAYS.length
      ? EARLY_INTERVALS_DAYS[reps - 1]!
      : Math.min(
          MAX_INTERVAL_DAYS,
          Math.round((record?.intervalDays ?? 7) * GROWTH),
        );

  return {
    reps,
    lapses: record?.lapses ?? 0,
    intervalDays,
    due: now + intervalDays * DAY_MS,
    lastResult: 'pass',
    reviewedAt: now,
  };
}

export type DueState = 'new' | 'due' | 'scheduled';

/** A line is "due" when it has a record whose due time has arrived. */
export function dueState(record: ReviewRecord | undefined, now: number): DueState {
  if (!record) return 'new';
  return record.due <= now ? 'due' : 'scheduled';
}

/**
 * Order leaves for a drill session: overdue reviews first (most overdue first),
 * then never-seen lines (in given order), then future-scheduled lines (soonest
 * due first). This is what makes "Drill" train your weakest material first.
 */
export function orderLeavesForReview(
  leafIds: string[],
  records: ReviewMap,
  now: number,
): string[] {
  const rank = (id: string): number => {
    const state = dueState(records[id], now);
    return state === 'due' ? 0 : state === 'new' ? 1 : 2;
  };
  // Stable sort: ties keep natural (tree) order, so "new" lines stay systematic.
  return [...leafIds].sort((a, b) => {
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra - rb;
    const da = records[a]?.due ?? 0;
    const db = records[b]?.due ?? 0;
    if (ra === 0) return da - db; // most overdue first
    if (ra === 2) return da - db; // soonest upcoming first
    return 0;
  });
}

/** How many of the given leaves are due (or never seen) at `now`. */
export function countDue(
  leafIds: Iterable<string>,
  records: ReviewMap,
  now: number,
  { includeNew = true }: { includeNew?: boolean } = {},
): number {
  let n = 0;
  for (const id of leafIds) {
    const state = dueState(records[id], now);
    if (state === 'due' || (includeNew && state === 'new')) n += 1;
  }
  return n;
}

/** Short human label for when a line is next due ("now", "today", "3d"). */
export function dueLabel(record: ReviewRecord | undefined, now: number): string {
  if (!record) return 'new';
  const delta = record.due - now;
  if (delta <= 0) return 'due';
  if (delta < DAY_MS) return 'today';
  return `${Math.round(delta / DAY_MS)}d`;
}
