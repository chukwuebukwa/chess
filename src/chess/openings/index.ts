import type { Opening } from '../types';
import { caroKann } from './caroKann';
import { italianGame } from './italianGame';

/**
 * The registry of trainable openings. To add a new opening, author it as a list
 * of SAN lines in its own file and append it here — the trainer, picker, and
 * progress tracking pick it up automatically.
 */
export const OPENINGS: Opening[] = [caroKann, italianGame];

export function getOpening(id: string): Opening | undefined {
  return OPENINGS.find((o) => o.id === id);
}

export { caroKann, italianGame };
